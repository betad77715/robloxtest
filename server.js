#!/usr/bin/env node
/* SUBVERSE — serveur statique + API de démonstration (zéro dépendance) */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2'
};

/* ---------- État en mémoire (démo) ---------- */
const dayStr = () => new Date().toISOString().slice(0, 10);
const state = {
  references: new Map(),   // SUB-XXXXX -> parcours
  favorites: new Map(),    // clientId -> [serviceId]
  compares: 0,
  selections: [],
  contacts: [],
  startedAt: Date.now(),
  startedDay: dayStr(),
  conversionsToday: 0,
  events: []
};
let seq = 0;

const now = () => new Date().toISOString();
function makeRef() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let r = '';
  for (let i = 0; i < 5; i++) r += abc[Math.floor(Math.random() * abc.length)];
  return 'SUB-' + r;
}
function pushEvent(type, message, payload = {}) {
  const e = { id: ++seq, ts: now(), type, message, payload };
  state.events.push(e);
  if (state.events.length > 400) state.events.splice(0, state.events.length - 400);
  return e;
}
const maskPhone = p => !p ? null : String(p).replace(/\d(?=\d{2})/g, '•');
const maskEmail = e => {
  if (!e) return null;
  const [u, d] = String(e).split('@');
  return (u ? u[0] + '•••' : '•••') + '@' + (d || '•••');
};

/* Événements de démarrage — le « bot » annonce l'état du site */
pushEvent('deployment', 'Nouveau déploiement détecté — build OK', { version: '1.0.0' });
pushEvent('health', 'Site disponible — temps de réponse 42 ms', {});
pushEvent('campaign', 'Campagne populaire : Fortnite Crew en tête des parcours', { serviceId: 'fortnite' });

/* ---------- Statuts par type de validation ---------- */
const STATUS_BY_VALIDATION = {
  sms: 'code SMS envoyé', email: 'email de confirmation envoyé', qr: 'QR code généré',
  ticket: 'billet numérique émis', lien: "lien d'activation créé", code: 'code promotionnel généré',
  bibliotheque: 'ajouté à la bibliothèque', attente: 'en attente de provisionnement'
};

/* ---------- Catalogue (chargé depuis assets/data.js via vm) ---------- */
let CATALOG = { categories: [], services: [] };
try {
  const vm = require('vm');
  const src = fs.readFileSync(path.join(__dirname, 'assets', 'data.js'), 'utf8');
  const sandbox = Object.create(null);
  sandbox.window = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { timeout: 2000, filename: 'data.js' });
  CATALOG = vm.runInContext('SUBVERSE_DATA', sandbox);
  if (!CATALOG || !Array.isArray(CATALOG.services)) throw new Error('catalogue vide');
} catch (e) {
  console.error('Catalogue non chargé :', e.message);
}
const svc = id => CATALOG.services.find(s => s.id === id);
const publicService = s => ({
  id: s.id, name: s.name, cat: s.cat, glyph: s.glyph, colors: s.colors,
  tagline: s.tagline, validation: s.validation, platforms: s.platforms,
  from: Math.min(...s.plans.map(p => p.price)),
  plans: s.plans.map(p => ({ id: p.id, name: p.name, price: p.price, per: p.per }))
});

/* ---------- Helpers HTTP ---------- */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS });
  res.end(JSON.stringify(obj));
}
const sendErr = (res, code, msg) => sendJson(res, code, { error: msg });
function readBody(req) {
  return new Promise(resolve => {
    let b = '';
    req.on('data', c => { b += c; if (b.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(b || '{}')); } catch { resolve(null); } });
    req.on('error', () => resolve(null));
  });
}

/* ---------- API : renvoie true si la requête a été traitée ---------- */
async function handleApi(req, res, u) {
  if (!u.pathname.startsWith('/api/')) return false;
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Content-Length': '0', ...CORS }); res.end(); return true;
  }
  const parts = u.pathname.split('/').filter(Boolean); // ['api', segA, segB?]
  const segA = parts[1] || '', segB = parts[2] || '';

  try {
    /* ---- GET ---- */
    if (req.method === 'GET') {
      if (segA === 'services' && !segB) return sendJson(res, 200, CATALOG.services.map(publicService)), true;
      if (segA === 'services' && segB) {
        const s = svc(segB);
        if (!s) return sendErr(res, 404, 'service introuvable'), true;
        return sendJson(res, 200, s), true;
      }
      if (segA === 'categories') return sendJson(res, 200, CATALOG.categories), true;
      if (segA === 'plans' && segB) {
        const s = svc(segB);
        if (!s) return sendErr(res, 404, 'service introuvable'), true;
        return sendJson(res, 200, { service: s.id, plans: s.plans }), true;
      }
      if (segA === 'status' && segB) {
        const r = state.references.get(segB.toUpperCase());
        if (!r) return sendErr(res, 404, 'référence inconnue'), true;
        return sendJson(res, 200, r), true;
      }
      if (segA === 'events') {
        const since = parseInt(u.searchParams.get('since') || '0', 10) || 0;
        return sendJson(res, 200, state.events.filter(e => e.id > since)), true;
      }
      if (segA === 'stats') {
        return sendJson(res, 200, {
          services: CATALOG.services.length,
          packs: CATALOG.services.reduce((n, s) => n + s.plans.length, 0),
          categories: CATALOG.categories.length,
          parcours: state.selections.length,
          conversionsJour: state.conversionsToday,
          comparateurs: state.compares,
          favoris: [...state.favorites.values()].reduce((n, a) => n + a.length, 0),
          uptimeSec: Math.round((Date.now() - state.startedAt) / 1000)
        }), true;
      }
      if (segA === 'health') return sendJson(res, 200, { ok: true, ts: now() }), true;
      if (segA === 'contacts') {
        return sendJson(res, 200, state.contacts.map(c => ({ ...c, email: maskEmail(c.email), phone: maskPhone(c.phone) }))), true;
      }
      return sendErr(res, 404, 'endpoint inconnu'), true;
    }

    /* ---- POST ---- */
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (body === null) return sendErr(res, 400, 'JSON invalide'), true;

      if (segA === 'selection') {
        const s = svc(body.serviceId);
        const p = s && s.plans.find(x => x.id === body.planId);
        if (!s || !p) return sendErr(res, 400, 'service ou pack invalide'), true;
        const a = body.account || {};
        if (!a.pseudo || !a.email) return sendErr(res, 400, 'compte incomplet : pseudo et email requis'), true;
        const reference = makeRef();
        if (dayStr() !== state.startedDay) { state.startedDay = dayStr(); state.conversionsToday = 0; }
        const record = {
          reference, serviceId: s.id, service: s.name, planId: p.id, pack: p.name,
          price: p.price, per: p.per, platform: a.platform || null, country: a.country || null,
          status: STATUS_BY_VALIDATION[s.validation] || 'confirmé',
          validation: s.validation, createdAt: now()
        };
        state.references.set(reference, record);
        state.selections.push(record);
        state.conversionsToday++;
        pushEvent('journey_done', `Parcours terminé — ${s.name} · ${p.name}`, {
          reference, masked: { phone: maskPhone(a.phone), email: maskEmail(a.email) }
        });
        return sendJson(res, 201, record), true;
      }

      if (segA === 'favorites') {
        const ids = Array.isArray(body.serviceIds) ? body.serviceIds.filter(x => svc(x)) : null;
        if (!ids) return sendErr(res, 400, 'serviceIds[] requis'), true;
        state.favorites.set(body.clientId || 'anonyme', ids);
        pushEvent('favorite', `Mes prochains abonnements mis à jour (${ids.length})`, { clientId: body.clientId || 'anonyme' });
        return sendJson(res, 200, { ok: true, count: ids.length }), true;
      }

      if (segA === 'compare') {
        const ids = Array.isArray(body.serviceIds) ? body.serviceIds : [];
        if (!ids.length || ids.length > 4) return sendErr(res, 400, 'comparer entre 1 et 4 services'), true;
        state.compares++;
        pushEvent('compare', `Comparateur lancé — ${ids.join(', ')}`, {});
        return sendJson(res, 200, { ok: true, services: ids.map(svc).filter(Boolean).map(publicService) }), true;
      }

      if (segA === 'events') {
        const allowed = ['journey_start', 'service_pick', 'bundle', 'gift', 'surprise', 'quiz', 'error', 'page'];
        const type = allowed.includes(body.type) ? body.type : 'info';
        pushEvent(type, String(body.message || 'événement client').slice(0, 140), body.payload || {});
        return sendJson(res, 201, { ok: true, id: seq }), true;
      }

      if (segA === 'contact') {
        if (!body.email || !body.message) return sendErr(res, 400, 'email et message requis'), true;
        const reference = makeRef();
        state.contacts.push({ reference, email: body.email, phone: body.phone || null, message: String(body.message).slice(0, 500), ts: now() });
        pushEvent('contact', `Nouveau contact ${reference} — ${maskEmail(body.email)}`, { reference });
        return sendJson(res, 201, { ok: true, reference }), true;
      }

      return sendErr(res, 404, 'endpoint inconnu'), true;
    }
    return sendErr(res, 405, 'méthode non autorisée'), true;
  } catch (e) {
    pushEvent('error', `Erreur API : ${e.message}`, { path: u.pathname });
    return sendErr(res, 500, 'erreur interne'), true;
  }
}

/* ---------- Fichiers statiques ---------- */
function serveStatic(req, res, u) {
  let p;
  try { p = decodeURIComponent(u.pathname); } catch { return void sendErr(res, 400, 'URL invalide'); }
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || file.includes(`${path.sep}.git${path.sep}`)) return void sendErr(res, 403, 'interdit');
  fs.readFile(file, (err, data) => {
    if (err) {
      if (!path.extname(p)) {
        const idx = path.join(ROOT, 'index.html');
        if (fs.existsSync(idx)) {
          res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
          return void res.end(fs.readFileSync(idx));
        }
      }
      return void sendErr(res, 404, 'introuvable');
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-store' : 'public, max-age=86400'
    });
    res.end(data);
  });
}

/* ---------- Serveur ---------- */
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://internal');
  const p = handleApi(req, res, u);
  if (p && typeof p.then === 'function') {
    p.then(handled => { if (!handled) serveStatic(req, res, u); })
     .catch(e => { pushEvent('error', `Erreur API : ${e.message}`, {}); if (!res.headersSent) sendErr(res, 500, 'erreur interne'); });
  } else if (!p) {
    serveStatic(req, res, u);
  }
});
server.listen(PORT, '0.0.0.0', () => {
  console.log(`SUBVERSE → http://0.0.0.0:${PORT}  (${CATALOG.services.length} services, ${CATALOG.categories.length} univers)`);
});
