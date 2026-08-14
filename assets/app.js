/* ============================================================
   SUBVERSE — Application (SPA, zéro dépendance)
   Site de démonstration : aucun achat réel, aucune donnée réelle.
   ============================================================ */
(() => {
'use strict';
const D = window.SUBVERSE_DATA;

/* ---------------- Helpers ---------------- */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
const fmtD = d => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
const svcById = id => D.services.find(s => s.id === id);
const catById = id => D.categories.find(c => c.id === id);
const planById = (s, pid) => s && s.plans.find(p => p.id === pid);
const monthlyOf = p => p.per === 'an' ? p.price / 12 : p.per === 'trimestre' ? p.price / 3 : p.price;
const perLabel = p => p.per === 'pack' ? 'paiement unique' : p.per === 'cadeau' ? 'cadeau' : 'par ' + p.per;
const maskEmail = e => { const [u, d] = String(e || '').split('@'); return (u ? u[0] + '•••' : '•••') + '@' + (d || '•••'); };
const maskPhone = p => String(p || '').replace(/\d(?=\d{2})/g, '•');
const demoRef = () => 'SUB-' + Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'[Math.floor(Math.random() * 33)]).join('');
const vib = (ms = 8) => { if (navigator.vibrate) try { navigator.vibrate(ms); } catch { } };

/* ---------------- Icônes SVG ---------------- */
const IC = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/>',
  heart: '<path d="M12 20s-7-4.5-9-9a5.2 5.2 0 0 1 9-4 5.2 5.2 0 0 1 9 4c-2 4.5-9 9-9 9z"/>',
  cmp: '<path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-4 0-5-2.5-4-4.5S12 2 12 8zm0 0c4 0 5-2.5 4-4.5S12 2 12 8z"/>',
  pkg: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
  quiz: '<path d="M21 12a9 9 0 1 1-9-9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 .5c0 1.8-2.5 2-2.5 4M12 17h.01"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.4"/><circle cx="15.5" cy="15.5" r="1.4"/><circle cx="15.5" cy="8.5" r="1.4"/><circle cx="8.5" cy="15.5" r="1.4"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',
  arrow: '<path d="M5 12h14m-6-7 7 7-7 7"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  sms: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><path d="M9 11h6M9 14h3"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM21 14v3M17 21h4M14 18v3"/>',
  ticket: '<path d="M4 5h16a1 1 0 0 1 1 1v4a2 2 0 0 0 0 4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a2 2 0 0 0 0-4V6a1 1 0 0 1 1-1z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
  link: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7L12.5 19"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16"/>',
  lib: '<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h13"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  terminal: '<path d="m4 17 6-5-6-5M12 19h8"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M6 10v10h12V10"/>',
  cardI: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 3v4h-4"/>'
};
const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || IC.spark}</svg>`;

/* ---------------- État persistant ---------------- */
const LS = {
  get: (k, d) => { try { const v = JSON.parse(localStorage.getItem('sv-' + k)); return v ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('sv-' + k, JSON.stringify(v)); } catch { } }
};
if (!LS.get('cid')) LS.set('cid', Math.random().toString(36).slice(2, 10));
let favs = new Set(LS.get('favs', []));
let bundle = LS.get('bundle', []);
let cmpSet = new Set(LS.get('cmp', []));
let sel = LS.get('sel', null);          // {serviceId, planId, platform, account?}
let motionRM = LS.get('rm', matchMedia('(prefers-reduced-motion: reduce)').matches);
let searchForCmp = false;

const saveFavs = () => { LS.set('favs', [...favs]); api('/api/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: LS.get('cid'), serviceIds: [...favs] }) }); };
const saveBundle = () => LS.set('bundle', bundle);
const saveCmp = () => LS.set('cmp', [...cmpSet]);
const saveSel = () => LS.set('sel', sel);

function applyMotion() {
  document.documentElement.classList.toggle('rm', !!motionRM);
  document.documentElement.classList.toggle('motion-ok', !motionRM);
  $$('[data-rm]').forEach(t => { t.classList.toggle('on', !!motionRM); t.innerHTML = `${ic('spark')} ${motionRM ? 'Mouvement réduit : activé' : 'Mouvement réduit : désactivé'}`; });
}

/* ---------------- API (avec repli local) ---------------- */
async function api(path, opts) {
  try { const r = await fetch(path, opts); if (!r.ok) throw new Error(r.status); return await r.json(); }
  catch { return null; }
}
const track = (type, message, payload) => api('/api/events', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, message, payload })
});

/* ---------------- Toasts / divers ---------------- */
function toast(msg, ok = true) {
  const box = $('#toasts'); if (!box) return;
  const el = document.createElement('div');
  el.className = 'toast' + (ok ? ' ok' : '');
  el.innerHTML = `${ic(ok ? 'check' : 'x')}<span>${msg}</span>`;
  box.appendChild(el);
  setTimeout(() => { el.style.transition = 'all .35s'; el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; setTimeout(() => el.remove(), 380); }, 2600);
}
function copyTxt(t, msg = 'Copié dans le presse-papier') {
  (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast(msg)).catch(() => toast('Copie impossible', false));
}
const go = p => { location.hash = '#/' + p; };

/* ---------------- Ambiance & effets ---------------- */
let amb = null;
function initAmbience(mode, colors) {
  const cv = $('.fxcv'); if (!cv) return;
  if (amb) { amb.stop(); amb = null; }
  amb = FX.Ambience(cv); amb.set(mode, colors); amb.start();
}
document.addEventListener('visibilitychange', () => { if (amb) document.hidden ? amb.stop() : amb.start(); });

function initTilt() {
  if (FX.reduced()) return;
  $$('.tilt').forEach(el => {
    let raf = 0;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100) + '%'); el.style.setProperty('--my', (y * 100) + '%');
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-3px)`;
      });
    });
    el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
  });
}
let io, io2;
function initReveals() {
  if (io) io.disconnect();
  if (io2) { io2.disconnect(); io2 = null; }
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));
  $$('[data-count]').forEach(el => ioObs(el));
}
function ioObs(el) {
  if (!io2) io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { runCount(e.target); io2.unobserve(e.target); }
  }), { threshold: .3 });
  io2.observe(el);
}
function runCount(el) {
  const target = parseFloat(el.dataset.count) || 0, suf = el.dataset.suf || '', money = el.dataset.money === '1';
  const t0 = performance.now(), dur = FX.reduced() ? 10 : 1400;
  (function fr(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3), v = target * e;
    el.textContent = money ? fmt(v) : Math.round(v).toLocaleString('fr-FR') + suf;
    if (k < 1) requestAnimationFrame(fr);
  })(t0);
}
function initParallax() {
  const bg = $('.hero-bg img'); if (!bg || FX.reduced()) return;
  addEventListener('scroll', () => { bg.style.transform = `scale(1.08) translateY(${scrollY * .12}px)`; }, { passive: true });
}

/* ---------------- Composants ---------------- */
function svcCard(s, small) {
  const inFav = favs.has(s.id), inCmp = cmpSet.has(s.id);
  const from = Math.min(...s.plans.map(p => monthlyOf(p)));
  return `
  <article class="svc tilt reveal" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
    <a class="go" href="#/s/${s.id}" aria-label="Découvrir ${esc(s.name)}"></a>
    <div class="svc-vis"><span class="rings"></span><span class="holo"></span><span class="gl">${esc(s.glyph)}</span></div>
    <div class="svc-body">
      <h3>${esc(s.name)}</h3>
      <p class="tagl">${esc(s.tagline)}</p>
      <div class="svc-meta">
        <div class="pr"><b>${fmt(from)}</b><span>${small ? '' : 'dès / mois · '}${esc(catById(s.cat).name)}</span></div>
        <div class="svc-acts">
          <button class="icn ${inCmp ? 'on' : ''}" data-act="cmp" data-id="${s.id}" title="Comparer" aria-label="Comparer ${esc(s.name)}">${ic('cmp')}</button>
          <button class="icn ${inFav ? 'on' : ''}" data-act="fav" data-id="${s.id}" title="Mes prochains abonnements" aria-label="${inFav ? 'Retirer' : 'Ajouter'} ${esc(s.name)} ${inFav ? 'des' : 'aux'} favoris">${ic('heart')}</button>
          <a class="icn" href="#/s/${s.id}" title="Découvrir" aria-label="Découvrir ${esc(s.name)}">${ic('arrow')}</a>
        </div>
      </div>
    </div>
  </article>`;
}
const glyphChip = (s) => `<span class="g" style="background:linear-gradient(135deg,${s.colors[0]},${s.colors[1]})">${esc(s.glyph)}</span>`;

function stepper(cur, s) {
  const steps = ['Pack', 'Compte', 'Validation'];
  return `<div class="stepper" style="--c1:${s ? s.colors[0] : 'var(--a1)'};--c2:${s ? s.colors[1] : 'var(--a2)'}">
    ${steps.map((t, i) => {
    const st = i + 1 < cur ? 'done' : i + 1 === cur ? 'on' : '';
    return `${i ? `<span class="ln"></span>` : ''}<span class="st ${st}"><span class="n">${i + 1 < cur ? '✓' : i + 1}</span><span class="st-t">${t}</span></span>`;
  }).join('')}
  </div>`;
}
function recapCard(s, p, platform, extra = '') {
  return `<aside class="card recap" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
    <div class="rh"><span class="g" style="background:linear-gradient(135deg,${s.colors[0]},${s.colors[1]})">${esc(s.glyph)}</span>
      <div><b>${esc(s.name)}</b><div class="muted small">${esc(s.tagline)}</div></div></div>
    <div class="rl"><span>Pack</span><b>${esc(p.name)}</b></div>
    ${p.credits ? `<div class="rl"><span>Crédits</span><b>${esc(p.credits)}</b></div>` : ''}
    <div class="rl"><span>Facturation</span><b>${perLabel(p)}</b></div>
    ${platform ? `<div class="rl"><span>Plateforme</span><b>${esc(platform)}</b></div>` : ''}
    ${s.family ? `<div class="rl"><span>Formule famille</span><b>disponible</b></div>` : ''}
    ${extra}
    <div class="rtot"><span>Total</span><b>${fmt(p.price)}</b><span>${p.per === 'pack' ? 'unique' : '/' + p.per}</span></div>
  </aside>`;
}
const KICK = `<span class="kick" style="font-size:12px;font-weight:800;letter-spacing:.2em;background:linear-gradient(90deg,var(--a1),var(--a2));-webkit-background-clip:text;background-clip:text;color:transparent;text-transform:uppercase">`;
const vIco = t => t === 'sms' ? 'sms' : t === 'email' ? 'mail' : t === 'qr' ? 'qr' : t === 'ticket' ? 'ticket' : t === 'lien' ? 'link' : t === 'code' ? 'code' : t === 'bibliotheque' ? 'lib' : 'clock';

/* ============================ PAGES ============================ */

/* ---------- Accueil ---------- */
function home() {
  const trendIds = ['fortnite', 'xbox-game-pass', 'spotify-premium', 'netflix', 'discord-nitro', 'chatgpt-plus', 'roblox', 'nintendo-switch-online'];
  const trend = trendIds.map(svcById).filter(Boolean);
  const mq = D.services.map(s => `<span class="mq-item" style="--c1:${s.colors[0]};--c2:${s.colors[1]}"><i>${esc(s.glyph)}</i>${esc(s.name)}</span>`).join('');
  return `
  <section class="hero">
    <div class="hero-bg"><img src="assets/img/hero.jpg" alt="Galaxie numérique SUBVERSE"></div>
    <canvas class="fxcv hero-fx" aria-hidden="true"></canvas>
    <div class="hero-in wrap">
      <span class="hero-kicker"><span class="dot"></span>Abonnements · monnaies virtuelles · services en ligne</span>
      <h1 class="hero-title">
        <span class="mask-line"><span>Tout ce que tu</span></span>
        <span class="mask-line"><span>utilises en ligne.</span></span>
        <span class="mask-line"><span class="grad">Au même endroit.</span></span>
      </h1>
      <p class="hero-sub"><b>SUBVERSE</b> réunit tes univers — gaming, streaming, musique, IA, cloud.
        Tous tes abonnements. <b>Un seul univers.</b></p>
      <div class="hero-cta">
        <a class="btn prim big" href="#rooms">Explorer les univers ${ic('arrow').replace('<svg', '<svg class="arw"')}</a>
        <a class="btn big ghost" href="#/bundle">${ic('pkg')} Composer mon bundle</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><b data-count="${D.services.length}">0</b><span>services</span></div>
        <div class="stat"><b data-count="${D.services.reduce((n, s) => n + s.plans.length, 0)}">0</b><span>packs & formules</span></div>
        <div class="stat"><b data-count="${D.categories.length}">0</b><span>univers</span></div>
        <div class="stat"><b data-count="3">0</b><span>étapes, toujours</span></div>
      </div>
    </div>
    <div class="hero-scroll" aria-hidden="true">Scroll</div>
  </section>

  <div class="marquee" aria-hidden="true"><div class="mq-track">${mq}${mq}</div></div>

  <section class="sec wrap" id="rooms">
    <div class="sec-hd reveal">
      <span class="kick">Les salles</span>
      <h2>Sept univers, sept ambiances.</h2>
      <p>Chaque catégorie est une salle différente — cinéma rouge, galaxie bleue, stade, studio.
        Entrer dans un univers, c'est changer de salle.</p>
    </div>
    <div class="rooms">
      ${D.categories.map((c, i) => `
      <div class="room-card reveal" style="--c1:${c.colors[0]};--c2:${c.colors[1]}" data-room="${c.id}" role="link" tabindex="0" aria-label="Entrer dans la salle ${esc(c.name)}">
        <img src="${c.img}" alt="" loading="lazy">
        <span class="rc-num">SALLE ${String(i + 1).padStart(2, '0')}</span>
        <span class="rc-count">${D.services.filter(s => s.cat === c.id).length} services</span>
        <div class="rc-body"><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p></div>
        <span class="rc-go">${ic('arrow')}</span>
      </div>`).join('')}
    </div>
  </section>

  <section class="sec wrap">
    <div class="sec-hd reveal">
      <span class="kick">Tendances</span>
      <h2>Ça carbure en ce moment.</h2>
      <p>Les parcours les plus lancés par la communauté cette semaine.</p>
    </div>
    <div class="row-scroll">${trend.map(s => svcCard(s, true)).join('')}</div>
  </section>

  <section class="sec wrap">
    <div class="sec-hd reveal">
      <span class="kick">Système commun</span>
      <h2>Toujours le même parcours.</h2>
      <p>Peu importe l'univers, la mécanique ne change jamais : trois étapes, zéro friction.</p>
    </div>
    <div class="steps-strip">
      <div class="step-i reveal"><b class="n">1</b><span class="ic">${ic('pkg')}</span><h4>Pack</h4>
        <p>Montant, quantité de crédits, durée, plateforme, formule individuelle, duo ou famille.</p></div>
      <div class="step-i reveal"><b class="n">2</b><span class="ic">${ic('cardI')}</span><h4>Compte</h4>
        <p>Un formulaire qui s'adapte au service : pseudo, plateforme, pays, opérateur, téléphone, email.</p></div>
      <div class="step-i reveal"><b class="n">3</b><span class="ic">${ic('spark')}</span><h4>Validation</h4>
        <p>SMS, email, QR code, billet numérique, lien d'activation, code promo ou bibliothèque — chaque univers a son final.</p></div>
    </div>
  </section>

  <section class="sec wrap">
    <div class="sec-hd reveal">
      <span class="kick">Les plus SUBVERSE</span>
      <h2>Des outils pour dompter tes abonnements.</h2>
    </div>
    <div class="feat-grid">
      <div class="feat-card reveal" style="--fc1:#3f8cff;--fc2:#7b61ff" data-go="bundle" role="link" tabindex="0">
        <span class="ic">${ic('pkg')}</span><h4>Constructeur de bundle</h4>
        <p>Game Pass + Discord Nitro + Spotify + Snapchat+ : combine, le site calcule coût mensuel, annuel et économies.</p>
        <span class="lk">Construire ${ic('arrow')}</span></div>
      <div class="feat-card reveal" style="--fc1:#a55cff;--fc2:#ff5ca8" data-go="gift" role="link" tabindex="0">
        <span class="ic">${ic('gift')}</span><h4>Mode cadeau</h4>
        <p>Choisis un service, une durée, un message, un visuel — et génère une carte cadeau de démonstration.</p>
        <span class="lk">Offrir ${ic('arrow')}</span></div>
      <div class="feat-card reveal" style="--fc1:#22d3ee;--fc2:#3f8cff" data-go="compare" role="link" tabindex="0">
        <span class="ic">${ic('cmp')}</span><h4>Comparateur</h4>
        <p>Jusqu'à quatre services en colonnes : prix, durée, plateformes, avantages, famille, renouvellement.</p>
        <span class="lk">Comparer ${ic('arrow')}</span></div>
      <div class="feat-card reveal" style="--fc1:#1db954;--fc2:#a3ff78" data-go="budget" role="link" tabindex="0">
        <span class="ic">${ic('chart')}</span><h4>Budget intelligent</h4>
        <p>Une roue affiche gaming, streaming, musique, cloud, création — et tes totaux mensuel et annuel.</p>
        <span class="lk">Voir la roue ${ic('arrow')}</span></div>
      <div class="feat-card reveal" style="--fc1:#ffd400;--fc2:#ff8a00" data-go="quiz" role="link" tabindex="0">
        <span class="ic">${ic('quiz')}</span><h4>Recommandation</h4>
        <p>Cinq questions — ta console, tes écrans, tes heures d'écoute, ton budget — et le site propose un bundle.</p>
        <span class="lk">Répondre ${ic('arrow')}</span></div>
      <div class="feat-card reveal" style="--fc1:#ff4655;--fc2:#ffb454" data-go="surprise" role="link" tabindex="0">
        <span class="ic">${ic('dice')}</span><h4>Surprends-moi</h4>
        <p>Une roulette visuelle choisit une fiche à découvrir. Zéro achat automatique, que de la curiosité.</p>
        <span class="lk">Lancer la roulette ${ic('arrow')}</span></div>
    </div>
  </section>

  <section class="sec wrap">
    <div class="sec-hd reveal">
      <span class="kick">Sous le capot</span>
      <h2>API & bot intégrés.</h2>
      <p>Le site tourne sur une vraie API JSON — catalogue, packs, références, événements, stats —
        et une console ops rejoue les notifications façon bot Discord.</p>
    </div>
    <div class="badge-row reveal" style="margin-bottom:20px">
      ${['GET /api/services', 'GET /api/plans/:service', 'GET /api/status/:reference', 'POST /api/selection', 'POST /api/favorites', 'POST /api/compare', 'POST /api/events', 'POST /api/contact'].map(e => `<code class="cmd">${e}</code>`).join('')}
    </div>
    <div class="d-flex reveal" style="flex-wrap:wrap">
      <a class="btn prim" href="#/api">${ic('terminal')} Documentation API</a>
      <a class="btn ghost" href="#/ops">Console ops (bot)</a>
    </div>
  </section>`;
}

/* ---------- Catégorie (la « salle ») ---------- */
function category(id) {
  const c = catById(id); if (!c) return notFound();
  const list = D.services.filter(s => s.cat === id);
  return `
  <section class="cat-hero" style="--c1:${c.colors[0]};--c2:${c.colors[1]};--a1:${c.colors[0]};--a2:${c.colors[1]}">
    <div class="bgimg"><img src="${c.img}" alt=""></div>
    <canvas class="fxcv" aria-hidden="true"></canvas>
    <div class="wrap">
      <span class="cat-sign">Salle ${esc(c.name)}</span>
      <h1 class="cat-title">${esc(c.title)}</h1>
      <p class="cat-desc">${esc(c.desc)}</p>
    </div>
  </section>
  <section class="sec wrap">
    <div class="sgrid">${list.map(s => svcCard(s)).join('')}</div>
  </section>`;
}

/* ---------- Service (univers + étape 1) ---------- */
function service(id) {
  const s = svcById(id); if (!s) return notFound();
  const curPlan = sel && sel.serviceId === id ? planById(s, sel.planId) : null;
  track('page', `Fiche consultée — ${s.name}`, { serviceId: s.id });
  return `
  <section class="svc-hero" style="--c1:${s.colors[0]};--c2:${s.colors[1]};--a1:${s.colors[0]};--a2:${s.colors[1]}">
    <canvas class="fxcv fxbg" aria-hidden="true"></canvas><div class="glow" aria-hidden="true"></div>
    <div class="wrap">
      <div>
        <div class="badge-row" style="margin-bottom:14px">
          <a class="tag" href="#/c/${s.cat}" style="text-transform:uppercase;letter-spacing:.14em">${esc(catById(s.cat).name)}</a>
          <span class="tag">${ic(vIco(s.validation))} ${esc(D.validationLabels[s.validation])}</span>
          ${s.family ? '<span class="tag">Formule famille</span>' : ''}
        </div>
        <div class="svc-id">
          <span class="big-glyph">${esc(s.glyph)}</span>
          <div>
            <h1>${esc(s.name)}</h1>
            <p class="tagl">${esc(s.tagline)}</p>
            ${s.room ? `<p class="svc-room">Univers — ${esc(s.room)}</p>` : ''}
          </div>
        </div>
      </div>
      <div class="svc-side">
        <button class="btn sm ${favs.has(s.id) ? 'prim' : ''}" data-act="fav" data-id="${s.id}" style="--a1:${s.colors[0]};--a2:${s.colors[1]}">${ic('heart')} ${favs.has(s.id) ? 'Dans mes favoris' : 'Ajouter aux favoris'}</button>
        <button class="btn sm ghost" data-act="cmp" data-id="${s.id}">${ic('cmp')} Comparer</button>
      </div>
    </div>
  </section>

  <section class="sec wrap" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
    ${stepper(1, s)}
    <div class="sec-hd"><span class="kick">Étape 1 — Pack</span>
      <h2>Choisis ton pack${s.platforms.length > 1 ? ' et ta plateforme' : ''}.</h2></div>
    ${s.platforms.length > 1 ? `
      <p class="muted small" style="margin-bottom:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Plateforme</p>
      <div class="chip-row" id="platRow" style="margin-bottom:26px">
        ${s.platforms.map((pl, i) => `<button class="chip ${(sel && sel.serviceId === id && sel.platform === pl) || (!(sel && sel.serviceId === id) && i === 0) ? 'on' : ''}" data-plat="${esc(pl)}">${esc(pl)}</button>`).join('')}
      </div>` : ''}
    <div class="plan-grid" id="planGrid">
      ${s.plans.map(p => `
      <button class="plan ${curPlan && curPlan.id === p.id ? 'on' : ''}" data-plan="${p.id}">
        ${p.best ? `<span class="pbadge">${p.best === 'best' ? 'Populaire' : esc(p.best)}</span>` : ''}
        <span class="chk">${ic('check')}</span>
        <span class="credits">${p.credits ? esc(p.credits) : perLabel(p)}</span>
        <h4>${esc(p.name)}</h4>
        <div class="pr">${fmt(p.price)} <span>${p.per === 'pack' ? 'unique' : '/ ' + p.per}</span></div>
        <ul>${p.features.slice(0, 4).map(f => `<li>${ic('check')}${esc(f)}</li>`).join('')}</ul>
      </button>`).join('')}
    </div>

    <div class="d-flex reveal" style="margin-top:26px;flex-wrap:wrap">
      ${s.perk ? `<span class="tag">${ic('spark')} ${esc(s.perk)}</span>` : ''}
      <span class="tag">Appareils : ${esc(s.devices)}</span><span class="tag">${esc(s.renewal)}</span>
    </div>

    <div class="selbar ${curPlan ? '' : 'hidden'}" id="selbar" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
      <span class="g" style="background:linear-gradient(135deg,${s.colors[0]},${s.colors[1]})">${esc(s.glyph)}</span>
      <div class="sl"><span>Ton choix</span><b id="selTxt">${curPlan ? `${esc(s.name)} · ${esc(curPlan.name)}` : ''}</b></div>
      <b id="selPr" style="white-space:nowrap">${curPlan ? fmt(curPlan.price) : ''}</b>
      <a class="btn prim" id="selGo" href="${curPlan ? '#/flow/' + s.id + '/' + curPlan.id : '#'}" style="--a1:${s.colors[0]};--a2:${s.colors[1]}">Continuer ${ic('arrow').replace('<svg', '<svg class="arw"')}</a>
    </div>
  </section>`;
}

/* ---------- Étape 2 ---------- */
const COUNTRIES = ['France', 'Belgique', 'Suisse', 'Canada', 'Luxembourg', 'Autre'];
const OPERATORS = ['Orange', 'SFR', 'Bouygues Telecom', 'Free Mobile', 'Autre'];

function flow(id, planId) {
  const s = svcById(id); if (!s) return notFound();
  const p = planById(s, planId) || s.plans[0];
  sel = { serviceId: id, planId: p.id, platform: sel && sel.serviceId === id ? sel.platform : (s.platforms[0] || null) };
  saveSel();
  track('journey_start', `Nouveau parcours démarré — ${s.name} · ${p.name}`, { serviceId: s.id, planId: p.id });
  return `
  <section class="pg-head" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
    <canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${stepper(2, s)}
      <h1 style="font-size:clamp(28px,4vw,44px);font-weight:850;letter-spacing:-.02em">Étape 2 — Ton compte.</h1>
      <p>Le formulaire s'adapte à l'univers <b>${esc(s.name)}</b>. Démo : rien n'est transmis à un tiers.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:26px;--c1:${s.colors[0]};--c2:${s.colors[1]}">
    <div class="flow-grid">
      <form class="card" id="accForm" novalidate>
        <h3>Informations du compte</h3>
        <p class="sub">Remplis les champs : ils changent selon le service choisi.</p>
        <div class="field">
          <label for="fPseudo">${esc(s.pseudo)} <em>*</em></label>
          <input id="fPseudo" name="pseudo" required minlength="2" placeholder="ex : Nova_King" autocomplete="off">
        </div>
        <div class="f2">
          <div class="field">
            <label for="fCountry">Pays</label>
            <select id="fCountry" name="country">${COUNTRIES.map(c => `<option>${c}</option>`).join('')}</select>
          </div>
          ${s.platforms.length > 1 ? `
          <div class="field">
            <label for="fPlat">Plateforme</label>
            <select id="fPlat" name="platform">${s.platforms.map(c => `<option ${sel.platform === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
          </div>` : `<input type="hidden" name="platform" value="${esc(s.platforms[0] || 'Web')}">`}
        </div>
        ${s.operator ? `
        <div class="field">
          <label for="fOp">Opérateur mobile <em>*</em></label>
          <select id="fOp" name="operator">${OPERATORS.map(c => `<option>${c}</option>`).join('')}</select>
          <div class="hint">Requis pour la validation SMS de cet univers.</div>
        </div>` : ''}
        <div class="f2">
          <div class="field">
            <label for="fPhone">Téléphone <em>*</em></label>
            <input id="fPhone" name="phone" type="tel" inputmode="tel" placeholder="06 12 34 56 78" ${s.phone ? 'required' : ''}>
          </div>
          <div class="field">
            <label for="fMail">Email <em>*</em></label>
            <input id="fMail" name="email" type="email" placeholder="toi@mail.fr" required>
          </div>
        </div>
        <div class="field">
          <label class="d-flex" style="gap:8px;cursor:pointer;font-weight:600;color:var(--dim)">
            <input type="checkbox" id="fAge" required style="width:auto;accent-color:${s.colors[0]}">
            J'accepte les conditions de démonstration SUBVERSE
          </label>
        </div>
        <button class="btn prim big" style="width:100%;justify-content:center;--a1:${s.colors[0]};--a2:${s.colors[1]}" type="submit">
          Valider mon pack ${ic('arrow').replace('<svg', '<svg class="arw"')}
        </button>
      </form>
      ${recapCard(s, p, sel.platform || (s.platforms[0] || null), `<div class="rl"><span>Validation</span><b>${esc(D.validationLabels[s.validation])}</b></div>`)}
    </div>
  </section>`;
}

async function submitAccount(e) {
  e.preventDefault();
  const f = e.target;
  const s = svcById(sel.serviceId), p = planById(s, sel.planId);
  const data = Object.fromEntries(new FormData(f).entries());
  if (!f.checkValidity()) { f.reportValidity(); return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) { toast('Email invalide', false); $('#fMail').focus(); return; }
  if (s.phone && String(data.phone || '').replace(/\D/g, '').length < 8) { toast('Numéro de téléphone invalide', false); $('#fPhone').focus(); return; }

  const btn = f.querySelector('[type=submit]'); btn.disabled = true;
  btn.innerHTML = `${ic('refresh')} Génération de ta référence…`;
  vib(14);
  let rec = await api('/api/selection', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceId: s.id, planId: p.id, account: data })
  });
  if (!rec) rec = { reference: demoRef(), service: s.name, pack: p.name, status: 'confirmation locale', validation: s.validation };
  sel.account = { pseudo: data.pseudo, email: data.email, phone: data.phone, country: data.country, platform: data.platform || sel.platform, operator: data.operator };
  saveSel();
  renderValidation(s, p, rec);
}

/* ---------- Étape 3 : validation ---------- */
function renderValidation(s, p, rec) {
  const app = $('#app');
  const style = `--c1:${s.colors[0]};--c2:${s.colors[1]}`;
  app.innerHTML = `
  <section class="pg-head" style="${style}">
    <canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">${stepper(3, s)}
      <h1 style="font-size:clamp(28px,4vw,44px);font-weight:850;letter-spacing:-.02em">Étape 3 — Validation.</h1>
      <p>Univers <b>${esc(s.name)}</b> — final : <b>${esc(D.validationLabels[s.validation])}</b>.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:30px;${style}" id="vzone"></section>`;
  scrollTo(0, 0);
  initAmbience(s.fx || catById(s.cat).fx, s.colors);
  const z = $('#vzone');
  const refChip = `<div class="ref-chip">${ic('shield')} ${esc(rec.reference)}<button data-copy="${esc(rec.reference)}" title="Copier la référence" aria-label="Copier la référence">${ic('copy')}</button></div>`;
  const acct = sel.account || {};
  const foot = `
    <div class="v-actions">
      <a class="btn" href="#/">${ic('home')} Retour aux univers</a>
      <a class="btn ghost" href="#/ops">${ic('terminal')} Suivre ma référence</a>
      <button class="btn ghost" data-act="fav" data-id="${s.id}">${ic('heart')} Ajouter aux favoris</button>
    </div>
    <p class="muted small center" style="margin-top:26px">Démonstration SUBVERSE — aucun achat réel, aucune donnée transmise à un tiers.</p>`;
  const T = s.validation;

  if (T === 'sms') {
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('sms')}</span>
      <h2>Un code arrive par SMS</h2>
      <p class="lead">Envoyé au <b>${esc(maskPhone(acct.phone))}</b>${acct.operator ? ` via ${esc(acct.operator)}` : ''}.
        Pour la démo, le code est <b>4 · 2 · 0 · 7</b>.</p>
      ${refChip}
      <div class="sms-cells" id="smsCells">${'<input maxlength="1" inputmode="numeric">'.repeat(4)}</div>
      <button class="btn prim mt1" id="smsOk" style="--a1:${s.colors[0]};--a2:${s.colors[1]}">${ic('check')} Confirmer le code</button>
      <div class="v-status hidden mt2" id="smsStatus"><span class="pulse"></span><span id="smsStatusTxt"></span></div>
      ${foot}</div>`;
    const cells = $$('#smsCells input', z);
    cells[0].focus();
    cells.forEach((c, i) => {
      c.addEventListener('input', () => { c.value = c.value.replace(/\D/g, ''); if (c.value && cells[i + 1]) cells[i + 1].focus(); });
      c.addEventListener('keydown', ev => { if (ev.key === 'Backspace' && !c.value && cells[i - 1]) cells[i - 1].focus(); });
    });
    $('#smsOk', z).onclick = () => {
      const v = cells.map(c => c.value).join('');
      const st = $('#smsStatus', z); st.classList.remove('hidden');
      if (v === '4207') {
        st.classList.add('ok'); $('#smsStatusTxt', z).innerHTML = `<span class="v-ok">${ic('check')} Code confirmé</span> — ${esc(p.name)} activé sur ${esc(s.name)}.`;
        FX.confetti({ colors: s.colors }); vib([10, 40, 10]);
      } else { $('#smsStatusTxt', z).innerHTML = `Code incorrect — pour la démo, entre <b>4207</b>.`; vib([20, 30, 20]); }
    };
  }
  else if (T === 'email') {
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('mail')}</span>
      <h2>Vérifie ta boîte mail</h2>
      <p class="lead">Un email de confirmation vient de partir vers :</p>
      <div class="big-mail">${ic('mail')} ${esc(maskEmail(acct.email))}</div>
      <div style="margin-top:22px">${refChip}</div>
      <div class="v-status mt2" id="mailW"><span class="pulse"></span><span>En attente de confirmation… <span class="muted">(simulation)</span></span></div>
      ${foot}</div>`;
    setTimeout(() => {
      const w = $('#mailW'); if (!w) return;
      w.classList.add('ok');
      w.innerHTML = `<span class="pulse"></span><span><span class="v-ok">${ic('check')} Email confirmé</span> — ${esc(p.name)} est actif sur ton compte ${esc(s.name)}.</span>`;
      FX.confetti({ colors: s.colors }); vib([10, 40, 10]);
    }, FX.reduced() ? 700 : 4200);
  }
  else if (T === 'qr') {
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('qr')}</span>
      <h2>Scanne ton QR d'activation</h2>
      <p class="lead">Présente ce code dans l'app ${esc(s.name)} : ton pack <b>${esc(p.name)}</b> s'active instantanément.</p>
      <div class="qr-box"><canvas id="qrCv"></canvas></div>
      ${refChip}
      ${foot}</div>`;
    FX.drawQR($('#qrCv'), rec.reference + '|' + s.id);
    FX.confetti({ colors: s.colors, y: innerHeight * .4 });
  }
  else if (T === 'ticket') {
    z.innerHTML = `<div class="valid-wrap">
      <span class="vbadge">${ic('ticket')}</span>
      <h2>Ton billet numérique est prêt</h2>
      <p class="lead">Accès ${esc(s.name)} délivré — conserve ce billet, c'est ta clé d'entrée au stade.</p>
      <div class="ticket" style="--c1:${s.colors[0]}">
        <div class="tt"><div><div class="small muted">BILLET SUBVERSE</div><b>${esc(s.name)} · ${esc(p.name)}</b></div><span class="tag hot">LIVE</span></div>
        <div class="tb"><div><div class="small muted">Titulaire</div><b>${esc(acct.pseudo || 'Invité')}</b><div class="small muted mt1">Réf ${esc(rec.reference)}</div></div>
        <div class="bars" aria-hidden="true">${'<i></i>'.repeat(34)}</div></div>
      </div>
      <div style="margin-top:22px">${refChip}</div>
      ${foot}</div>`;
    FX.confetti({ colors: s.colors, y: innerHeight * .4 });
  }
  else if (T === 'lien') {
    const linkUrl = `https://subverse.demo/activate/${rec.reference.toLowerCase()}`;
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('link')}</span>
      <h2>Ton lien d'activation est généré</h2>
      <p class="lead">Un clic et <b>${esc(p.name)}</b> rejoint ton compte ${esc(s.name)}.</p>
      ${refChip}
      <div class="mt2"><button class="link-btn" id="actLink" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">${ic('bolt')} Activer ${esc(s.name)} maintenant</button></div>
      <button class="btn ghost sm mt1" data-copy="${esc(linkUrl)}">${ic('copy')} Copier le lien</button>
      <div class="v-status hidden mt2" id="linkSt"><span class="pulse"></span><span></span></div>
      ${foot}</div>`;
    $('#actLink', z).onclick = () => {
      const st = $('#linkSt', z); st.classList.remove('hidden'); st.classList.add('ok');
      st.innerHTML = `<span class="pulse"></span><span><span class="v-ok">${ic('check')} Activation réussie</span> — bienvenue dans l'univers ${esc(s.name)}.</span>`;
      FX.confetti({ colors: s.colors }); vib([10, 40, 10]);
    };
  }
  else if (T === 'code') {
    const code = `SUBVERSE-${rec.reference.slice(4)}-${s.glyph}`;
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('code')}</span>
      <h2>Voici ton code promotionnel</h2>
      <p class="lead">Saisis-le dans ${esc(s.name)} : <b>${esc(p.name)}</b> se débloque immédiatement.</p>
      ${refChip}
      <div class="promo-code mt2">${esc(code)}</div>
      <div class="mt2"><button class="btn prim" data-copy="${esc(code)}" style="--a1:${s.colors[0]};--a2:${s.colors[1]}">${ic('copy')} Copier le code</button></div>
      ${foot}</div>`;
    FX.confetti({ colors: s.colors, y: innerHeight * .4 });
  }
  else if (T === 'bibliotheque') {
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('lib')}</span>
      <h2>Ajouté à ta bibliothèque</h2>
      <p class="lead"><b>${esc(p.name)}</b> prend place dans ta collection ${esc(s.name)}.</p>
      ${refChip}
      <div class="lib-shelf" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
        ${Array.from({ length: 8 }, (_, i) => `<span class="tile" style="animation-delay:${i * 90}ms">${i === 0 ? esc(s.glyph) : ''}</span>`).join('')}
      </div>
      ${foot}</div>`;
    setTimeout(() => { FX.confetti({ colors: s.colors }); vib([10, 40, 10]); }, FX.reduced() ? 60 : 900);
  }
  else { /* attente */
    z.innerHTML = `<div class="valid-wrap card">
      <span class="vbadge">${ic('clock')}</span>
      <h2>Provisionnement en cours</h2>
      <p class="lead">L'univers ${esc(s.name)} prépare ton accès <b>${esc(p.name)}</b>. Statut : <b>en attente</b>.</p>
      ${refChip}
      <div class="wait-rows" style="--c1:${s.colors[0]}">
        <div class="wr" data-w><i></i>Demande transmise au fournisseur</div>
        <div class="wr" data-w><i></i>Allocation des ressources</div>
        <div class="wr" data-w><i></i>Activation du pack</div>
      </div>
      <div class="v-status mt2" id="waitSt"><span class="pulse"></span><span>Statut : <b>en attente</b> — tu recevras une notification.</span></div>
      ${foot}</div>`;
    $$('[data-w]', z).forEach((r, i) => setTimeout(() => { r.classList.add('done'); vib(6); }, 900 + i * 1100));
    setTimeout(() => {
      const st = $('#waitSt'); if (!st) return;
      st.classList.add('ok');
      st.innerHTML = `<span class="pulse"></span><span><span class="v-ok">${ic('check')} Pack provisionné</span> — ${esc(s.name)} est prêt.</span>`;
      FX.confetti({ colors: s.colors });
    }, FX.reduced() ? 400 : 4600);
  }
}

/* ---------- Bundle ---------- */
function bundlePg() {
  const rows = bundle.map(b => {
    const s = svcById(b.serviceId); if (!s) return '';
    const p = planById(s, b.planId) || s.plans[0];
    return `<div class="b-row" style="--c1:${s.colors[0]};--c2:${s.colors[1]}">
      ${glyphChip(s)}
      <div><b>${esc(s.name)}</b><div class="muted small">${esc(catById(s.cat).name)} · ${perLabel(p)}</div></div>
      <select data-bplan="${s.id}" aria-label="Choisir la formule ${esc(s.name)}">
        ${s.plans.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(x.name)} — ${fmt(x.price)}${x.per === 'pack' ? ' unique' : '/' + x.per}</option>`).join('')}
      </select>
      <span class="d-flex"><span class="pr">${fmt(monthlyOf(p))}</span><button class="x" data-bdel="${s.id}" title="Retirer" aria-label="Retirer ${esc(s.name)} du bundle">${ic('trash')}</button></span>
    </div>`;
  }).join('');
  const items = bundle.map(b => { const s = svcById(b.serviceId); return s && (planById(s, b.planId) || s.plans[0]); }).filter(Boolean);
  const monthlySubs = items.filter(p => p.per === 'mois').reduce((n, p) => n + p.price, 0);
  const triSubs = items.filter(p => p.per === 'trimestre').reduce((n, p) => n + p.price, 0);
  const yearlySubs = items.filter(p => p.per === 'an').reduce((n, p) => n + p.price, 0);
  const oneShot = items.filter(p => p.per !== 'mois' && p.per !== 'trimestre' && p.per !== 'an').reduce((n, p) => n + p.price, 0);
  const annual = monthlySubs * 12 + triSubs * 4 + yearlySubs + oneShot;
  const monthly = annual / 12;
  const eco = annual * .12;
  const renewal = fmtD(new Date(Date.now() + 30 * 864e5));
  const rest = D.services.filter(s => !bundle.some(b => b.serviceId === s.id));
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Constructeur</span>
      <h1>Compose ton bundle.</h1>
      <p>Empile tes univers : le site calcule automatiquement coût mensuel, coût annuel, économie potentielle et prochaine date de renouvellement.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px">
    <div class="presets">
      ${D.presets.map((p, i) => `<button class="chip" data-preset="${i}">${ic('bolt')} ${esc(p.name)}</button>`).join('')}
    </div>
    <div id="brows">${rows || `
      <div class="empty"><span class="ic">${ic('pkg')}</span><h4>Ton bundle est vide</h4>
        <p>Ajoute des services un par un, ou pars d'un pack suggéré comme « Game Pass + Discord Nitro + Spotify + Snapchat+ ».</p></div>`}
    </div>
    <div class="d-flex mt2">
      <select id="bAdd" class="grow" style="padding:12px 14px;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid var(--line);outline:none" aria-label="Ajouter un service">
        <option value="">＋ Ajouter un service au bundle…</option>
        ${D.categories.map(c => `<optgroup label="${esc(c.name)}">${rest.filter(s => s.cat === c.id).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}</optgroup>`).join('')}
      </select>
    </div>
    ${bundle.length ? `
    <div class="totals">
      <div class="tot"><span>Coût mensuel</span><b data-count="${monthly}" data-money="1">0 €</b></div>
      <div class="tot"><span>Coût annuel</span><b data-count="${annual}" data-money="1">0 €</b></div>
      <div class="tot eco"><span>Économie potentielle (−12%)</span><b data-count="${eco}" data-money="1">0 €</b></div>
      <div class="tot"><span>Prochain renouvellement</span><b style="font-size:17px;padding-top:6px">${renewal}</b></div>
    </div>
    <p class="muted small mt2">Prix de démonstration — l'économie potentielle simule une remise groupée SUBVERSE. Les packs crédits comptent comme achat unique.</p>` : ''}
  </section>`;
}

/* ---------- Comparateur ---------- */
function comparePg() {
  const ids = [...cmpSet].map(svcById).filter(Boolean);
  const rows = [
    ['Prix d’entrée', s => { const p = s.plans.reduce((a, b) => monthlyOf(a) < monthlyOf(b) ? a : b); return `<b>${fmt(monthlyOf(p))}</b>${p.per === 'pack' ? ' <span class="muted small">unique</span>' : '/mois'} <div class="muted small">${esc(p.name)}${p.credits ? ' · ' + esc(p.credits) : ''}</div>`; }],
    ['Durée', s => s.plans.some(p => p.per === 'an') ? 'mensuel → annuel' : s.plans.some(p => p.per === 'mois') ? 'mensuel' : 'à l’achat'],
    ['Plateforme', s => esc(s.platforms.join(' · ') || 'Web')],
    ['Avantages', s => esc(s.perk || s.plans[0].features.join(' · '))],
    ['Appareils', s => esc(s.devices)],
    ['Formule famille', s => s.family ? '<b style="color:var(--ok)">Oui</b>' : '<span class="muted">—</span>'],
    ['Renouvellement', s => esc(s.renewal)],
    ['Validation', s => `${ic(vIco(s.validation))} ${esc(D.validationLabels[s.validation])}`]
  ];
  if (ids.length >= 2) api('/api/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serviceIds: ids.map(s => s.id) }) });
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Comparateur</span>
      <h1>Quatre services, face à face.</h1>
      <p>Ajoute jusqu'à quatre cartes avec le bouton colonnes des fiches — prix, durée, plateforme, avantages, appareils, famille, renouvellement.</p>
      <div class="d-flex mt2" style="flex-wrap:wrap;gap:8px">
        ${ids.map(s => `<span class="tag" style="padding:7px 8px 7px 12px;gap:8px">${glyphChip(s)} <b>${esc(s.name)}</b><button class="x" data-act="cmp" data-id="${s.id}" style="color:var(--dim)" aria-label="Retirer ${esc(s.name)} du comparateur">${ic('x')}</button></span>`).join('')}
        ${ids.length < 4 ? `<button class="btn sm" data-open-search data-cmp="1">${ic('plus')} Ajouter (${ids.length}/4)</button>` : ''}
      </div>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:14px">
    ${ids.length ? `
    <div class="cmp-wrap"><div class="cmp-t" style="--ncol:${ids.length}">
      <div class="hd2 lbl"></div>
      ${ids.map(s => `<div class="hd2" style="--c1:${s.colors[0]};--c2:${s.colors[1]};text-align:left">
        <button class="x" data-act="cmp" data-id="${s.id}" aria-label="Retirer ${esc(s.name)}">${ic('x')}</button>
        <span class="g">${esc(s.glyph)}</span><h4>${esc(s.name)}</h4><div class="muted small">${esc(catById(s.cat).name)}</div></div>`).join('')}
      ${rows.map(([lbl, f]) => `<div class="lbl">${lbl}</div>${ids.map(s => `<div class="val">${f(s)}</div>`).join('')}`).join('')}
    </div></div>
    <div class="d-flex mt3" style="flex-wrap:wrap">${ids.map(s => `<a class="btn sm" href="#/s/${s.id}">${esc(s.name)} ${ic('arrow')}</a>`).join('')}</div>
    ` : `<div class="empty"><span class="ic">${ic('cmp')}</span><h4>Aucun service à comparer</h4>
      <p>Utilise le bouton « Comparer » (icône colonnes) sur n'importe quelle carte, jusqu'à quatre services.</p>
      <button class="btn prim" data-open-search data-cmp="1">${ic('search')} Chercher un service</button></div>`}
  </section>`;
}

/* ---------- Mode cadeau ---------- */
const GIFT_V = [{ id: 'v1', name: 'Nébuleuse' }, { id: 'v2', name: 'Salle rouge' }, { id: 'v3', name: 'Studio vert' }, { id: 'v4', name: 'Portail violet' }];
function giftPg(prefill) {
  const sid = svcById(prefill) ? prefill : 'discord-nitro';
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Mode cadeau</span>
      <h1>Offre un univers.</h1>
      <p>Choisis un service, une durée, écris un message, choisis un visuel — la carte cadeau de démonstration se génère en direct.</p>
    </div>
  </section>
  <section class="sec wrap gift-grid" style="padding-top:10px">
    <form class="card" id="giftForm">
      <h3>Compose la carte</h3><p class="sub">Rien n'est acheté : c'est un aperçu de démonstration.</p>
      <div class="field"><label for="gSvc">Service</label>
        <select id="gSvc">${D.categories.map(c => `<optgroup label="${esc(c.name)}">${D.services.filter(x => x.cat === c.id).map(x => `<option value="${x.id}" ${x.id === sid ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</optgroup>`).join('')}</select></div>
      <div class="field"><label for="gPlan">Durée / pack</label><select id="gPlan"></select></div>
      <div class="field"><label for="gMsg">Message</label>
        <textarea id="gMsg" maxlength="90" placeholder="Joyeux anniversaire !">Profite bien de ton univers préféré — offert avec SUBVERSE.</textarea></div>
      <div class="field"><label>Visuel</label>
        <div class="chip-row">${GIFT_V.map((v, i) => `<button type="button" class="chip ${i === 0 ? 'on' : ''}" data-gv="${v.id}">${v.name}</button>`).join('')}</div></div>
      <button class="btn prim" type="submit">${ic('gift')} Générer la carte cadeau</button>
    </form>
    <div>
      <div id="giftPreview" class="d-flex" style="flex-direction:column;align-items:stretch;gap:16px"></div>
      <p class="muted small center" id="giftNote" style="display:none"></p>
    </div>
  </section>`;
}
function giftRender(form, refCode) {
  const sv = svcById($('#gSvc').value); if (!sv) return;
  const plan = planById(sv, $('#gPlan').value) || sv.plans[0];
  const msg = $('#gMsg').value.trim() || 'Un univers à découvrir.';
  const v = form.querySelector('[data-gv].on')?.dataset.gv || 'v1';
  $('#giftPreview').innerHTML = `
    <div class="gift-card ${v} in">
      <span class="ribbon"></span>
      <div class="gc-top"><span class="gc-logo">SUBVERSE · CARTE CADEAU</span><span class="tag hot">Démo</span></div>
      <div class="gc-svc"><span class="g">${esc(sv.glyph)}</span><div><b style="font-size:19px">${esc(sv.name)}</b><div class="small" style="opacity:.85">${esc(plan.name)}</div></div></div>
      <p class="gc-msg">« ${esc(msg)} »</p>
      <div class="d-flex" style="justify-content:space-between"><span class="gc-ref">${refCode || 'SUB-•••••'}</span><b>${fmt(plan.price)}</b></div>
    </div>`;
}

/* ---------- Budget ---------- */
const WHEEL = { gaming: '#3f8cff', streaming: '#e50914', musique: '#1db954', cloud: '#4f9cf9', creation: '#ff5ca8', ia: '#b388ff', social: '#ffd400' };
function budgetEntries() {
  const entries = [];
  bundle.forEach(b => { const s = svcById(b.serviceId); if (s) entries.push({ s, p: planById(s, b.planId) || s.plans[0], src: 'bundle' }); });
  favs.forEach(id => { const s = svcById(id); if (s && !entries.some(e => e.s.id === id)) entries.push({ s, p: s.plans[0], src: 'favori' }); });
  return entries;
}
function budgetPg() {
  const entries = budgetEntries();
  const byCat = {};
  entries.forEach(e => { byCat[e.s.cat] = (byCat[e.s.cat] || 0) + monthlyOf(e.p); });
  const mtot = entries.reduce((n, e) => n + monthlyOf(e.p), 0);
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Budget intelligent</span>
      <h1>Ta roue des dépenses.</h1>
      <p>Gaming, streaming, musique, cloud, création… La roue agrège ton bundle et tes favoris, et projette tes totaux mensuel et annuel.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px">
    ${entries.length ? `
    <div class="budget-grid">
      <div class="donut-wrap"><canvas id="donut" width="640" height="640" aria-label="Roue du budget" role="img"></canvas>
        <div class="donut-c"><div><span>Total / mois</span><br><b data-count="${mtot}" data-money="1">0 €</b></div></div></div>
      <div class="legend">
        ${Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cid, v]) => {
    const c = catById(cid);
    return `<div class="lg"><i style="background:${WHEEL[cid]}"></i>${esc(c.name)}<span class="muted small">${entries.filter(e => e.s.cat === cid).length} service(s)</span><b>${fmt(v)}/mois</b></div>`;
  }).join('')}
        <div class="lg" style="border-style:solid"><i style="background:linear-gradient(135deg,var(--a1),var(--a2))"></i><b style="margin:0">Total annuel projeté</b><b>${fmt(mtot * 12)}</b></div>
      </div>
    </div>
    <p class="muted small mt2">Source : bundle (${bundle.length}) + favoris (${favs.size}). Prix de démonstration.</p>`
      : `<div class="empty"><span class="ic">${ic('chart')}</span><h4>Rien à mesurer pour l'instant</h4>
         <p>Compose un bundle ou ajoute des favoris : la roue du budget se dessinera ici avec le total mensuel et annuel.</p>
         <a class="btn prim" href="#/bundle">${ic('pkg')} Ouvrir le bundle</a> <a class="btn" href="#/surprise">${ic('dice')} Me surprendre</a></div>`}
  </section>`;
}
function drawDonut(byCat) {
  const cv = $('#donut'); if (!cv) return;
  const ctx = cv.getContext('2d'); ctx.setTransform(2, 0, 0, 2, 0, 0);
  const cx = 160, cy = 160, R = 128, r = 84;
  const tot = Object.values(byCat).reduce((a, b) => a + b, 0) || 1;
  const t0 = performance.now(), dur = FX.reduced() ? 1 : 900;
  (function fr(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    ctx.clearRect(0, 0, 320, 320); let a = -Math.PI / 2;
    for (const [cid, v] of Object.entries(byCat)) {
      const a1 = a + (v / tot) * Math.PI * 2 * e;
      ctx.beginPath(); ctx.arc(cx, cy, R, a + .02, Math.max(a + .03, a1 - .02)); ctx.arc(cx, cy, r, Math.max(a + .03, a1 - .02), a + .02, true);
      ctx.closePath(); ctx.fillStyle = WHEEL[cid] || '#888'; ctx.globalAlpha = .92; ctx.fill(); a = a1;
    }
    ctx.globalAlpha = 1;
    if (k < 1) requestAnimationFrame(fr);
  })(t0);
}

/* ---------- Favoris ---------- */
function favoritesPg() {
  const list = [...favs].map(svcById).filter(Boolean);
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Favoris</span>
      <h1>Mes prochains abonnements.</h1>
      <p>Un clic sur le cœur d'une carte l'épingle ici, prête pour le prochain parcours.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px">
    ${list.length ? `<div class="sgrid">${list.map(s => svcCard(s)).join('')}</div>`
      : `<div class="empty"><span class="ic">${ic('heart')}</span><h4>Encore aucun favori</h4>
      <p>Les services que tu marques d'un cœur atterrissent ici, dans « Mes prochains abonnements ».</p>
      <button class="btn prim" id="favGo">${ic('bolt')} Explorer les univers</button></div>`}
  </section>`;
}

/* ---------- Quiz ---------- */
let quizState = { i: 0, picks: [], max: 50 };
function quizPg() {
  const q = D.quiz[quizState.i];
  if (!q) return quizResult();
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap"><div class="quiz-box">
      <div class="qbar"><i style="width:${(quizState.i / D.quiz.length) * 100}%"></i></div>
      <div class="qa">
        <span class="qstep">Question ${quizState.i + 1} / ${D.quiz.length}</span>
        <h3>${esc(q.q)}</h3>
        <div class="q-opts">${q.opts.map((o, i) => `<button class="qo" data-qo="${i}">${esc(o.t)}</button>`).join('')}</div>
      </div>
    </div></div>
  </section><section class="wrap" style="min-height:30vh"></section>`;
}
function quizShortlist() {
  const seen = new Map();
  quizState.picks.flat().forEach(([sid, pid]) => { if (svcById(sid) && !seen.has(sid)) seen.set(sid, [sid, pid]); });
  let list = [...seen.values()].map(([sid, pid]) => { const s = svcById(sid); return { s, p: planById(s, pid) || s.plans[0] }; });
  list.sort((a, b) => monthlyOf(a.p) - monthlyOf(b.p));
  const kept = []; let acc = 0;
  for (const it of list) { const m = monthlyOf(it.p); if (acc + m <= quizState.max || !kept.length) { kept.push(it); acc += m; } }
  return kept.slice(0, 4);
}
function quizResult() {
  const top = quizShortlist();
  const total = top.reduce((n, x) => n + monthlyOf(x.p), 0);
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Recommandation</span>
      <h1>Ton bundle sur mesure.</h1>
      <p>D'après tes réponses, SUBVERSE te propose cette combinaison — environ <b>${fmt(total)}/mois</b>.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px">
    <div class="sgrid">${top.map(x => svcCard(x.s)).join('') || `<div class="empty"><span class="ic">${ic('dice')}</span><h4>Aucune recommandation</h4><p>Essaie le mode Surprends-moi !</p></div>`}</div>
    <div class="d-flex mt3" style="justify-content:center;flex-wrap:wrap">
      <button class="btn prim big" id="quizBundle">${ic('pkg')} Tout ajouter au bundle</button>
      <button class="btn big ghost" id="quizRestart">${ic('refresh')} Refaire le quiz</button>
    </div>
  </section>`;
}

/* ---------- Surprends-moi ---------- */
function surprisePg() {
  const pool = [...D.services].sort(() => Math.random() - .5).slice(0, 21);
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap roul-box">
      ${KICK}Surprends-moi</span>
      <h1>La roulette des univers.</h1>
      <p style="margin:0 auto">Une fiche au hasard, à découvrir — la roulette ne déclenche jamais d'achat.</p>
      <div class="rl-grid" id="rlGrid">
        ${pool.map(s => `<span class="rl-cell" data-rl="${s.id}" style="--c1:${s.colors[0]};--c2:${s.colors[1]}"><i>${esc(s.glyph)}</i></span>`).join('')}
      </div>
      <button class="btn prim big" id="rlGo">${ic('dice')} Lancer la roulette</button>
      <div id="rlRes" class="mt3"></div>
    </div>
  </section><section class="wrap" style="min-height:20vh"></section>`;
}
function surpriseRun() {
  const cells = $$('.rl-cell'); if (!cells.length) return;
  const target = cells[Math.floor(Math.random() * cells.length)];
  const btn = $('#rlGo'); btn.disabled = true;
  $('#rlRes').innerHTML = '';
  let delay = 60, i = 0; const total = 26 + Math.floor(Math.random() * 8);
  (function spin() {
    cells.forEach(c => c.classList.remove('hot'));
    const cur = i < total ? cells[i % cells.length] : target;
    cur.classList.add('hot');
    vib(4);
    if (i >= total) {
      const s = svcById(target.dataset.rl);
      track('surprise', `Roulette — découverte de ${s.name}`, { serviceId: s.id });
      $('#rlRes').innerHTML = `<div class="rl-result card" style="--c1:${s.colors[0]};--c2:${s.colors[1]};max-width:420px;margin:0 auto">
        <div class="rh" style="display:flex;gap:14px;align-items:center">${glyphChip(s)}<div style="text-align:left">
        <b style="font-size:19px">${esc(s.name)}</b><div class="muted small">${esc(s.tagline)}</div></div></div>
        <div class="d-flex" style="justify-content:center;margin-top:18px;flex-wrap:wrap">
        <a class="btn prim" style="--a1:${s.colors[0]};--a2:${s.colors[1]}" href="#/s/${s.id}">${ic('bolt')} Découvrir la fiche</a>
        <button class="btn ghost" data-act="fav" data-id="${s.id}">${ic('heart')}</button></div></div>`;
      FX.confetti({ colors: s.colors, x: innerWidth / 2, y: innerHeight / 2 });
      btn.disabled = false;
      $('#rlRes').scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    i++; delay = 60 + Math.pow(i / total, 2.6) * 320;
    setTimeout(spin, FX.reduced() ? 24 : delay);
  })();
}

/* ---------- Ops (console façon bot Discord) ---------- */
const EV_LABEL = {
  deployment: 'Déploiement', health: 'Health', journey_start: 'Parcours', service_pick: 'Sélection', page: 'Fiche',
  journey_done: 'Conversion', error: 'Erreur', campaign: 'Campagne', favorite: 'Favoris',
  compare: 'Comparateur', bundle: 'Bundle', gift: 'Cadeau', contact: 'Contact', info: 'Info', quiz: 'Quiz', surprise: 'Roulette'
};
function evLine(e) {
  const ts = new Date(e.ts).toLocaleTimeString('fr-FR');
  let extra = '';
  if (e.payload && e.payload.masked) extra = `<div class="dim">Téléphone : ${esc(e.payload.masked.phone || '—')} · Email : ${esc(e.payload.masked.email || '—')} · Statut : validation terminée</div>`;
  if (e.payload && e.payload.reference) extra += `<div class="dim">Référence : ${esc(e.payload.reference)}</div>`;
  return `<div class="ev ${esc(e.type)}"><span class="ts">${ts}</span><span class="tg">${EV_LABEL[e.type] || esc(e.type)}</span><span class="ms">${esc(e.message)}${extra}</span></div>`;
}
function opsPg() {
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Console ops</span>
      <h1>Le bot veille sur l'univers.</h1>
      <p>Flux en direct des événements SUBVERSE : parcours démarrés, conversions, favoris, erreurs, déploiements. Les données personnelles y sont toujours masquées.</p>
      <div class="stats-chips" id="opsStats"></div>
      <div class="d-flex" style="flex-wrap:wrap">
        <input id="opsRef" placeholder="Suivre une référence : SUB-XXXXX" aria-label="Référence à suivre" style="padding:12px 16px;border-radius:12px;background:rgba(0,0,0,.3);border:1px solid var(--line);outline:none;font-family:var(--mono);letter-spacing:.08em;min-width:min(280px,100%)">
        <button class="btn" id="opsRefBtn">${ic('search')} Suivre</button>
      </div>
      <div id="opsRefOut" class="mt2"></div>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:16px">
    <div class="console">
      <div class="ctop"><i style="background:#ff5f6b"></i><i style="background:#ffb454"></i><i style="background:#3ddc84"></i>
        <span class="muted small" style="margin-left:8px">subverse-bot — notifications en direct</span>
        <span class="tag small" style="margin-left:auto"><span class="dot" style="display:inline-block;width:7px;height:7px;border-radius:99px;background:var(--ok);box-shadow:0 0 10px var(--ok);margin-right:6px"></span>live</span></div>
      <div class="log" id="opsLog"><div class="ev info"><span class="ts">--:--:--</span><span class="tg">Info</span><span class="ms">Connexion au flux…</span></div></div>
    </div>
    <div class="card mt3">
      <h3>Commandes du bot</h3><p class="sub">Telles qu'imaginées pour le serveur Discord de la communauté.</p>
      <div>${['/status', '/services', '/gaming', '/social', '/streaming', '/search', '/popular', '/stats', '/deployments', '/health', '/help'].map(c => `<code class="cmd">${c}</code>`).join('')}</div>
      <div class="hrz"></div>
      <p class="muted small">Notifications couvertes : nouveau parcours démarré · service sélectionné · parcours terminé · erreur API ·
        site indisponible · nouveau déploiement · campagne populaire · conversions du jour.</p>
    </div>
  </section>`;
}
let opsTimer = 0, opsSince = 0;
async function opsPoll() {
  clearInterval(opsTimer);
  const log = $('#opsLog'); if (!log) return;
  const st = await api('/api/stats');
  if (st && $('#opsStats')) $('#opsStats').innerHTML = `
    <span class="chip-s"><b>${st.services}</b>services</span>
    <span class="chip-s"><b>${st.packs}</b>packs</span>
    <span class="chip-s"><b>${st.parcours}</b>parcours</span>
    <span class="chip-s"><b>${st.conversionsJour}</b>conversions du jour</span>
    <span class="chip-s"><b>${st.favoris}</b>favoris</span>
    <span class="chip-s"><b>${Math.floor(st.uptimeSec / 60)} min</b>disponibilité</span>`;
  const evs = await api('/api/events');
  if (evs) {
    log.innerHTML = evs.slice(-60).map(evLine).join('');
    opsSince = evs.length ? evs[evs.length - 1].id : 0;
    log.scrollTop = log.scrollHeight;
  } else if (!log.dataset.seeded) {
    log.dataset.seeded = 1;
    log.innerHTML = `<div class="ev error"><span class="ts">${new Date().toLocaleTimeString('fr-FR')}</span><span class="tg">Erreur</span><span class="ms">API inaccessible — le site tourne en mode dégradé local (statique).</span></div>`;
  }
  opsTimer = setInterval(async () => {
    const l = $('#opsLog'); if (!l) return clearInterval(opsTimer);
    const fresh = await api('/api/events?since=' + opsSince);
    if (fresh && fresh.length) {
      opsSince = fresh[fresh.length - 1].id;
      fresh.forEach(e => { l.insertAdjacentHTML('beforeend', evLine(e)); l.lastElementChild && l.lastElementChild.classList.add('new'); });
      l.scrollTop = l.scrollHeight;
      while (l.children.length > 120) l.firstElementChild.remove();
    }
  }, 2500);
}
async function lookupRef() {
  const inp = $('#opsRef'); if (!inp) return;
  const v = inp.value.trim().toUpperCase(); if (!v) return;
  const out = $('#opsRefOut'); out.innerHTML = `<span class="muted small">Recherche…</span>`;
  const r = await api('/api/status/' + encodeURIComponent(v));
  if (!r) { out.innerHTML = `<div class="v-status"><span class="pulse" style="background:var(--err);box-shadow:0 0 12px var(--err)"></span><span>Référence inconnue ou API hors-ligne.</span></div>`; return; }
  out.innerHTML = `<div class="v-status ok"><span class="pulse"></span><span style="flex:1">
    <b>${esc(r.reference)}</b> — ${esc(r.service)} · ${esc(r.pack)} · ${fmt(r.price)}${r.per === 'pack' ? '' : '/' + r.per}<br>
    <span class="muted">Plateforme : ${esc(r.platform || '—')} · Pays : ${esc(r.country || '—')} · Statut : <b>${esc(r.status)}</b></span></span></div>`;
}

/* ---------- Doc API ---------- */
function apiPg() {
  const GETS = [['GET /api/services', 'catalogue complet (résumé)'], ['GET /api/services/:id', 'détail d’un service'],
  ['GET /api/categories', 'les 7 univers'], ['GET /api/plans/:service', 'packs d’un service'],
  ['GET /api/status/:reference', 'suivi d’un parcours'], ['GET /api/events', 'flux du bot'], ['GET /api/stats', 'statistiques'], ['GET /api/health', 'état du site']];
  const POSTS = [['POST /api/selection', 'terminer un parcours (génère une référence)'], ['POST /api/favorites', 'synchroniser « Mes prochains abonnements »'],
  ['POST /api/compare', 'enregistrer une comparaison (max 4)'], ['POST /api/events', 'pousser un événement client'], ['POST /api/contact', 'contacter l’équipe']];
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Développeurs</span>
      <h1>L'API SUBVERSE.</h1>
      <p>Le site que tu utilises consomme ces mêmes endpoints : catalogue, packs, disponibilité, références, étapes, statistiques, favoris, suivi, erreurs et campagnes.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px;max-width:860px;margin-left:auto;margin-right:auto">
    <div class="card"><h3>Lecture</h3><p class="sub">Tout est public en lecture, JSON pur.</p>
      ${GETS.map(([c, d]) => `<div class="ep"><code class="get">${c}</code><span>${d}</span></div>`).join('')}
    </div>
    <div class="card mt2"><h3>Écriture</h3><p class="sub">Les écritures alimentent le flux du bot.</p>
      ${POSTS.map(([c, d]) => `<div class="ep"><code>${c}</code><span>${d}</span></div>`).join('')}
    </div>
    <div class="card mt2"><h3>Exemple — contact masqué côté bot</h3><p class="sub">Ce que le bot affiche quand un parcours se termine :</p>
      <div class="console"><div class="log" style="max-height:none">
        <div class="ev journey_done"><span class="ts">14:32:07</span><span class="tg">Conversion</span>
          <span class="ms">Parcours terminé — Fortnite Crew · 1 mois
          <div class="dim">Référence : SUB-A81K2</div><div class="dim">Téléphone : 06••••••78 · Email : a•••@mail.fr · Statut : validation terminée</div></span></div>
      </div></div>
      <div class="d-flex mt2" style="flex-wrap:wrap"><a class="btn prim sm" href="/api/services" target="_blank" rel="noopener">${ic('terminal')} Essayer GET /api/services</a>
      <a class="btn sm ghost" href="#/ops">Voir la console en direct</a></div>
    </div>
  </section>`;
}

/* ---------- Contact ---------- */
function contactPg() {
  return `
  <section class="pg-head"><canvas class="fxcv fxbg" aria-hidden="true"></canvas>
    <div class="wrap">
      ${KICK}Contact</span>
      <h1>Un message pour l'équipe ?</h1>
      <p>Le bot relaie les demandes avec tes coordonnées masquées. Référence de suivi incluse.</p>
    </div>
  </section>
  <section class="sec wrap" style="padding-top:10px;max-width:640px;margin-left:auto;margin-right:auto">
    <form class="card" id="contactForm">
      <div class="field"><label for="cMail">Email <em>*</em></label><input id="cMail" type="email" required placeholder="toi@mail.fr"></div>
      <div class="field"><label for="cPhone">Téléphone (optionnel)</label><input id="cPhone" type="tel" placeholder="06 12 34 56 78"></div>
      <div class="field"><label for="cMsg">Message <em>*</em></label><textarea id="cMsg" required maxlength="500" placeholder="Dis-nous tout…"></textarea></div>
      <button class="btn prim" type="submit">${ic('mail')} Envoyer</button>
      <div id="cOut" class="mt2"></div>
    </form>
  </section>`;
}

/* ---------- 404 ---------- */
function notFound() {
  return `<section class="sec wrap" style="padding-top:170px">
    <div class="empty"><span class="ic">${ic('qr')}</span><h4>Salle introuvable</h4>
    <p>Cet univers n'existe pas (ou pas encore). Retourne vers le portail principal.</p>
    <a class="btn prim" href="#/">${ic('home')} Retour à l'accueil</a></div></section>`;
}

/* ============================ ROUTEUR ============================ */
const ROUTES = [
  [/^$/, home], [/^c\/([\w-]+)$/, m => category(m[1])], [/^s\/([\w-]+)$/, m => service(m[1])],
  [/^flow\/([\w-]+)\/([\w-]+)$/, m => flow(m[1], m[2])],
  [/^bundle$/, bundlePg], [/^compare$/, comparePg], [/^gift(?:\/([\w-]+))?$/, m => giftPg(m[1])],
  [/^budget$/, budgetPg], [/^quiz$/, quizPg], [/^favorites$/, favoritesPg], [/^surprise$/, surprisePg],
  [/^ops$/, opsPg], [/^api$/, apiPg], [/^contact$/, contactPg]
];
let currentKey = null;
let roomXBusy = false;

function ambFor(h) {
  const mSvc = h.match(/^s\/([\w-]+)$/), mFlow = h.match(/^flow\/([\w-]+)/);
  if (h === '') return ['galaxy', ['#3f8cff', '#7b61ff', '#22d3ee']];
  if (h.startsWith('c/')) { const c = catById(h.slice(2)); return [c ? c.fx : 'float', c ? c.colors : null]; }
  if (mSvc || mFlow) {
    const s = svcById((mSvc || mFlow)[1]);
    if (s) return [s.fx || catById(s.cat).fx, s.colors];
  }
  if (h.startsWith('budget')) return ['cloud', ['#4f9cf9', '#9bd1ff']];
  if (h.startsWith('gift')) return ['vortex', ['#a55cff', '#ff5ca8']];
  return ['float', null];
}

function render() {
  const h = location.hash.replace(/^#\/?/, '');
  if (h === currentKey) return;
  currentKey = h;
  if (opsTimer) { clearInterval(opsTimer); opsTimer = 0; }

  let view = null, params = null;
  for (const [re, fn] of ROUTES) { const m = h.match(re); if (m) { view = fn; params = m; break; } }
  const html = view ? view(params) : notFound();

  const paint = () => {
    $('#app').innerHTML = html;
    document.body.dataset.page = h.split('/')[0] || 'home';
    updateHeader(h);
    initReveals(); initTilt(); initParallax();
    const [mode, colors] = ambFor(h);
    initAmbience(mode, colors);
    updateDock();
    bindPage(h);
  };

  /* Transition « changement de salle » entre univers */
  const isCat = /^c\/[\w-]+$/.test(h);
  if (isCat && !FX.reduced() && render.lastCat !== params[1]) roomX(params[1], paint);
  else paint();
  render.lastCat = isCat ? params[1] : null;
}
render.lastCat = null;

function roomX(catId, paint) {
  const c = catById(catId); if (!c || roomXBusy) return paint();
  roomXBusy = true;
  const rx = $('.roomx');
  rx.style.setProperty('--a1', c.colors[0]); rx.style.setProperty('--a2', c.colors[1]);
  rx.querySelector('.rl b').textContent = c.name;
  rx.querySelector('.rl .hall').textContent = 'Changement de salle';
  rx.classList.remove('out'); rx.classList.add('in');
  setTimeout(() => { paint(); scrollTo(0, 0); }, 470);
  setTimeout(() => { rx.classList.remove('in'); rx.classList.add('out'); }, 720);
  setTimeout(() => { rx.classList.remove('out'); roomXBusy = false; }, 1280);
}

/* ---------------- Interactions par page ---------------- */
function bindPage(h) {
  const app = $('#app');

  /* Page service : plateforme + pack */
  if (h.startsWith('s/')) {
    const s = svcById(h.slice(2)); if (!s) return;
    $('#platRow')?.addEventListener('click', e => {
      const b = e.target.closest('[data-plat]'); if (!b) return;
      $$('#platRow .chip').forEach(c => c.classList.remove('on')); b.classList.add('on');
      sel = { serviceId: s.id, planId: sel && sel.serviceId === s.id ? sel.planId : null, platform: b.dataset.plat };
      if (!sel.planId) sel.planId = s.plans[0].id;
      saveSel(); updateSelbar(s);
    });
    $('#planGrid')?.addEventListener('click', e => {
      const b = e.target.closest('[data-plan]'); if (!b) return;
      const p = planById(s, b.dataset.plan);
      $$('#planGrid .plan').forEach(c => c.classList.remove('on')); b.classList.add('on');
      const platform = $('#platRow .chip.on')?.dataset.plat || (sel && sel.platform) || s.platforms[0] || null;
      sel = { serviceId: s.id, planId: p.id, platform }; saveSel();
      track('service_pick', `Service sélectionné — ${s.name} · ${p.name}`, { serviceId: s.id, planId: p.id });
      updateSelbar(s);
      const r = b.getBoundingClientRect();
      FX.burst(r.left + r.width / 2, Math.max(60, Math.min(r.top + r.height / 2, innerHeight - 60)), s.colors);
      vib(12);
    });
  }

  /* Étape 2 */
  $('#accForm')?.addEventListener('submit', submitAccount);

  /* Bundle : ajout */
  $('#bAdd')?.addEventListener('change', e => {
    const sid = e.target.value; if (!sid) return;
    const s = svcById(sid);
    bundle.push({ serviceId: sid, planId: s.plans[0].id }); saveBundle();
    track('bundle', `Bundle — ajout de ${s.name}`, { serviceId: sid });
    currentKey = null; render(); toast(`${s.name} ajouté au bundle`); vib(10);
  });

  /* Cadeau */
  if (h.startsWith('gift')) {
    const form = $('#giftForm');
    const fillPlans = () => {
      const sv = svcById($('#gSvc').value);
      $('#gPlan').innerHTML = sv.plans.map(p => `<option value="${p.id}">${esc(p.name)} — ${fmt(p.price)}${p.per === 'pack' ? ' unique' : '/' + p.per}</option>`).join('');
    };
    fillPlans(); giftRender(form);
    form.addEventListener('input', () => giftRender(form));
    form.addEventListener('click', e => {
      const gv = e.target.closest('[data-gv]'); if (!gv) return;
      $$('#giftForm [data-gv]').forEach(c => c.classList.remove('on')); gv.classList.add('on'); giftRender(form);
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const r = demoRef(); giftRender(form, r);
      const note = $('#giftNote'); note.style.display = 'block';
      note.innerHTML = `${ic('shield')} Aperçu de démonstration — référence <b>${r}</b>. Aucun achat réel n'est effectué.`;
      track('gift', `Carte cadeau de démonstration générée — ${svcById($('#gSvc').value).name}`, { reference: r });
      FX.confetti({ x: innerWidth / 2, y: innerHeight / 2 }); vib([10, 40, 10]);
    });
  }

  /* Budget : dessin de la roue */
  if (h.startsWith('budget')) {
    const entries = budgetEntries();
    if (entries.length) {
      const byCat = {};
      entries.forEach(e => { byCat[e.s.cat] = (byCat[e.s.cat] || 0) + monthlyOf(e.p); });
      drawDonut(byCat);
    }
  }

  /* Quiz */
  $$('.qo', app).forEach(b => b.addEventListener('click', () => {
    const q = D.quiz[quizState.i]; const o = q.opts[+b.dataset.qo];
    if (q.key === 'budget') quizState.max = o.max ?? 999; else quizState.picks.push(o.pick);
    quizState.i++; vib(8);
    if (quizState.i >= D.quiz.length) track('quiz', 'Quiz de recommandation terminé', { picks: quizState.picks.flat().length });
    currentKey = null; render();
  }));
  $('#quizRestart')?.addEventListener('click', () => { quizState = { i: 0, picks: [], max: 50 }; currentKey = null; render(); });
  $('#quizBundle')?.addEventListener('click', () => {
    let added = 0;
    quizShortlist().forEach(({ s, p }) => {
      if (!bundle.some(b => b.serviceId === s.id)) { bundle.push({ serviceId: s.id, planId: p.id }); added++; }
    });
    saveBundle(); toast(`${added} service(s) ajoutés au bundle`);
    quizState = { i: 0, picks: [], max: 50 };
    go('bundle');
  });

  /* Surprise */
  $('#rlGo')?.addEventListener('click', surpriseRun);

  /* Favoris : état vide */
  $('#favGo')?.addEventListener('click', () => go(''));

  /* Ops */
  if (h.startsWith('ops')) {
    opsPoll();
    $('#opsRefBtn')?.addEventListener('click', lookupRef);
    $('#opsRef')?.addEventListener('keydown', e => { if (e.key === 'Enter') lookupRef(); });
  }

  /* Contact */
  $('#contactForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const res = await api('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: $('#cMail').value, phone: $('#cPhone').value, message: $('#cMsg').value })
    });
    const r = (res && res.reference) || demoRef();
    $('#cOut').innerHTML = `<div class="v-status ok"><span class="pulse"></span><span>Message envoyé — <span class="v-ok">${ic('check')} référence ${esc(r)}</span>. Le bot relaie ta demande (coordonnées masquées).</span></div>`;
  });

  /* Rooms & features */
  $$('.room-card', app).forEach(rc => {
    const open = () => go('c/' + rc.dataset.room);
    rc.addEventListener('click', open);
    rc.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  $$('[data-go]', app).forEach(fc => fc.addEventListener('click', () => go(fc.dataset.go)));
}

function updateSelbar(s) {
  const bar = $('#selbar'); if (!bar) return;
  const p = sel && sel.serviceId === s.id ? planById(s, sel.planId) : null;
  if (!p) { bar.classList.add('hidden'); updateDock(); return; }
  bar.classList.remove('hidden');
  $('#selTxt').textContent = `${s.name} · ${p.name}${sel.platform ? ' · ' + sel.platform : ''}`;
  $('#selPr').textContent = fmt(p.price);
  $('#selGo').setAttribute('href', '#/flow/' + s.id + '/' + p.id);
  updateDock();
}

/* ---------------- Dock mobile ---------------- */
function updateDock() {
  const dock = $('#dock'); if (!dock) return;
  const onFlow = location.hash.includes('/flow/');
  if (!sel || !(sel.serviceId && sel.planId) || onFlow) { dock.classList.add('hidden'); document.body.classList.remove('has-dock'); return; }
  const s = svcById(sel.serviceId), p = s && planById(s, sel.planId); if (!s || !p) { dock.classList.add('hidden'); return; }
  dock.style.setProperty('--c1', s.colors[0]); dock.style.setProperty('--c2', s.colors[1]);
  dock.innerHTML = `${glyphChip(s)}
    <div class="dl"><span>Ton choix</span><b>${esc(s.name)} · ${esc(p.name)}${p.per === 'pack' ? '' : ' · ' + p.per}</b></div>
    <a class="btn prim sm" href="#/flow/${s.id}/${p.id}">Continuer</a>`;
  dock.classList.remove('hidden');
  document.body.classList.add('has-dock');
}

/* ---------------- Header ---------------- */
function updateHeader(h) {
  $$('.hd-nav a, .drawer a').forEach(a => a.classList.toggle('on', h === (a.dataset.route || '')));
  $('#navDrawer')?.classList.remove('open');
  updateCounts();
}
function updateCounts() {
  const b = $('#hdBundle .n'), f = $('#hdFav .n'), c = $('#hdCmp .n');
  if (b) { b.textContent = bundle.length; b.style.display = bundle.length ? 'grid' : 'none'; $('#hdBundle').classList.toggle('hot', bundle.length > 0); }
  if (f) { f.textContent = favs.size; f.style.display = favs.size ? 'grid' : 'none'; }
  if (c) { c.textContent = cmpSet.size; c.style.display = cmpSet.size ? 'grid' : 'none'; $('#hdCmp').classList.toggle('hot', cmpSet.size > 0); }
}

/* ---------------- Recherche plein écran ---------------- */
function openSearch(forCmp) {
  searchForCmp = !!forCmp;
  $('#search').classList.add('open');
  document.body.classList.add('has-search');
  const inp = $('#searchInput'); inp.value = '';
  searchRender('', $('#search .chip.on')?.dataset.sc || 'all');
  setTimeout(() => inp.focus(), 80);
}
function closeSearch() { $('#search').classList.remove('open'); document.body.classList.remove('has-search'); }
function searchRender(q, cat) {
  q = (q || '').toLowerCase().trim();
  const res = D.services.filter(s =>
    (cat === 'all' || s.cat === cat) &&
    (!q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q) || catById(s.cat).name.toLowerCase().includes(q))
  ).slice(0, 24);
  $('#searchRes').innerHTML = res.length ? res.map(s => `
    <button class="sr" style="--c1:${s.colors[0]};--c2:${s.colors[1]}" data-res="${s.id}">
      <span class="g">${esc(s.glyph)}</span>
      <span style="text-align:left"><b>${esc(s.name)}</b><span>${esc(catById(s.cat).name)} · dès ${fmt(Math.min(...s.plans.map(p => monthlyOf(p))))}${s.plans.every(p => p.per === 'pack') ? '' : '/mois'}</span></span>
    </button>`).join('')
    : `<div class="empty" style="grid-column:1/-1;border:0"><h4>Aucun résultat</h4><p>Essaie « Fortnite », « Spotify », « cloud »…</p></div>`;
}

/* ---------------- Actions globales ---------------- */
function globalClick(e) {
  /* Ancre interne #rooms (ne doit pas passer par le routeur) */
  const anchor = e.target.closest('a[href="#rooms"]');
  if (anchor) {
    e.preventDefault();
    const t = $('#rooms');
    if (t) t.scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth' }); else go('');
    return;
  }

  const cp = e.target.closest('[data-copy]');
  if (cp) { copyTxt(cp.dataset.copy); return; }

  /* Bundle : retrait + presets (délégué ici, #app persiste entre les rendus) */
  const del = e.target.closest('[data-bdel]');
  if (del) {
    const s = svcById(del.dataset.bdel);
    bundle = bundle.filter(b => b.serviceId !== del.dataset.bdel); saveBundle();
    currentKey = null; render(); toast(`${s ? s.name : 'Service'} retiré du bundle`);
    return;
  }
  const pr = e.target.closest('[data-preset]');
  if (pr) {
    const preset = D.presets[+pr.dataset.preset];
    preset.items.forEach(([sid, pid]) => { if (!bundle.some(b => b.serviceId === sid)) bundle.push({ serviceId: sid, planId: pid }); });
    saveBundle(); track('bundle', `Bundle — preset « ${preset.name} » chargé`, {});
    currentKey = null; render(); toast(`Pack « ${preset.name} » chargé`);
    FX.confetti({ x: innerWidth / 2, y: innerHeight / 2 });
    return;
  }

  const act = e.target.closest('[data-act]');
  if (act) {
    const id = act.dataset.id, s = svcById(id); if (!s) return;
    if (act.dataset.act === 'fav') {
      e.preventDefault();
      if (favs.has(id)) { favs.delete(id); toast(`${s.name} retiré de « Mes prochains abonnements »`); }
      else { favs.add(id); toast(`${s.name} épinglé dans « Mes prochains abonnements »`); vib(10); }
      saveFavs(); updateCounts();
      if ((location.hash.replace(/^#\/?/, '')).startsWith('favorites')) { currentKey = null; render(); return; }
      const isBtn = act.classList.contains('btn');
      act.classList.toggle('on', favs.has(id));
      if (isBtn) { act.innerHTML = `${ic('heart')} ${favs.has(id) ? 'Dans mes favoris' : 'Ajouter aux favoris'}`; act.classList.toggle('prim', favs.has(id)); }
      else act.innerHTML = ic('heart');
      return;
    }
    if (act.dataset.act === 'cmp') {
      e.preventDefault();
      if (cmpSet.has(id)) { cmpSet.delete(id); toast(`${s.name} retiré du comparateur`); }
      else {
        if (cmpSet.size >= 4) { toast('Le comparateur accepte quatre services maximum', false); return; }
        cmpSet.add(id); toast(`${s.name} ajouté au comparateur (${cmpSet.size}/4)`); vib(8);
      }
      saveCmp(); updateCounts();
      if ((location.hash.replace(/^#\/?/, '')).startsWith('compare')) { currentKey = null; render(); return; }
      act.classList.toggle('on', cmpSet.has(id));
      return;
    }
  }

  const os = e.target.closest('[data-open-search]');
  if (os) { openSearch(os.dataset.cmp === '1'); return; }
  const rm = e.target.closest('[data-rm]');
  if (rm) { motionRM = !motionRM; LS.set('rm', motionRM); applyMotion(); toast(motionRM ? 'Mouvement réduit activé' : 'Animations réactivées'); return; }
  if (e.target.closest('.burger')) { $('#navDrawer')?.classList.toggle('open'); return; }
}

function globalChange(e) {
  const selEl = e.target.closest('[data-bplan]');
  if (selEl) {
    const it = bundle.find(b => b.serviceId === selEl.dataset.bplan);
    if (it) { it.planId = selEl.value; saveBundle(); currentKey = null; render(); }
  }
}

/* ---------------- Boot ---------------- */
function boot() {
  applyMotion();
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
  document.addEventListener('click', globalClick);
  document.addEventListener('change', globalChange);
  addEventListener('scroll', () => $('.hd').classList.toggle('scrolled', scrollY > 24), { passive: true });

  /* Recherche */
  $('#searchClose').addEventListener('click', closeSearch);
  $('#search .scrim').addEventListener('click', closeSearch);
  $('#searchInput').addEventListener('input', e => searchRender(e.target.value, $('#search .chip.on')?.dataset.sc || 'all'));
  $$('#search [data-sc]').forEach(ch => ch.addEventListener('click', () => {
    $$('#search [data-sc]').forEach(c => c.classList.remove('on')); ch.classList.add('on');
    searchRender($('#searchInput').value, ch.dataset.sc);
  }));
  $('#searchRes').addEventListener('click', e => {
    const r = e.target.closest('[data-res]'); if (!r) return;
    closeSearch();
    if (searchForCmp) {
      const id = r.dataset.res, s = svcById(id);
      if (!cmpSet.has(id) && cmpSet.size < 4) { cmpSet.add(id); saveCmp(); toast(`${s.name} ajouté au comparateur (${cmpSet.size}/4)`); }
      else if (!cmpSet.has(id)) { toast('Quatre services maximum — retire-en un', false); }
      updateCounts(); go('compare');
    } else go('s/' + r.dataset.res);
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
    else if (e.key === 'Escape') { closeSearch(); $('#navDrawer')?.classList.remove('open'); }
  });

  addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/';
  render();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
