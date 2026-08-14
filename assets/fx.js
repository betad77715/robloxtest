/* ============================================================
   SUBVERSE FX — moteur de particules & ambiances canvas
   (zéro dépendance, respecte prefers-reduced-motion)
   ============================================================ */
window.FX = (() => {
  const reduced = () => document.documentElement.classList.contains('rm');
  const rand = (a, b) => a + Math.random() * (b - a);
  const TAU = Math.PI * 2;

  /* -------------------- Ambiance générique -------------------- */
  function Ambience(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf = 0, parts = [], t = 0, mode = 'float', colors = ['#3f8cff', '#7b61ff'];
    let running = false, mouse = { x: .5, y: .5 };

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* Fabrique une particule selon le comportement du mode */
    const SPAWN = {
      rise: () => ({ bh: 'rise', x: rand(0, W), y: rand(H, H * 1.3), s: rand(2, 6), v: rand(.25, .9), o: rand(.2, .8), r: rand(0, TAU), vr: rand(-.02, .02) }),
      fall: () => ({ bh: 'fall', x: rand(0, W), y: rand(-H * .3, 0), s: rand(3, 9), v: rand(.6, 1.8), o: rand(.25, .9), r: rand(0, TAU), vr: rand(-.03, .03) }),
      drift: () => ({ bh: 'drift', x: rand(0, W), y: rand(0, H), s: rand(.8, 2.4), v: rand(.05, .25), o: rand(.15, .65), ph: rand(0, TAU) }),
      orbit: i => ({ bh: 'orbit', a: rand(0, TAU), rad: rand(Math.min(W, H) * .12, Math.min(W, H) * .46), v: rand(.0015, .005) * (i % 2 ? 1 : -1), s: rand(1.2, 3), o: rand(.3, .9) }),
      tunnel: () => ({ bh: 'tunnel', a: rand(0, TAU), z: rand(.05, 1), v: rand(.0025, .007), s: rand(1, 3), o: rand(.3, .95) }),
      streak: () => ({ bh: 'streak', x: rand(-W * .2, W), y: rand(0, H), len: rand(40, 140), v: rand(4, 11), s: rand(1, 2.2), o: rand(.15, .55) }),
      orbitfile: i => ({ bh: 'orbitfile', a: rand(0, TAU), rad: rand(46, Math.min(W, H) * .4), v: rand(.002, .006), s: rand(9, 15), o: rand(.35, .85), wob: rand(0, TAU) })
    };

    const MODES = {
      galaxy:   { spawn: 'drift', n: 150, shape: 'mix', vortex: true },
      crystals: { spawn: 'rise', n: 90, shape: 'shard' },
      rain:     { spawn: 'fall', n: 110, shape: 'cube' },           // Roblox : pluie de cubes
      vortex:   { spawn: 'orbit', n: 130, shape: 'dot', ring: true },
      voxel:    { spawn: 'fall', n: 70, shape: 'voxel', grid: true },
      tactic:   { spawn: 'streak', n: 60, shape: 'tick', reticle: true },
      magic:    { spawn: 'orbit', n: 110, shape: 'dot', ring: true, ringGold: true },
      radar:    { spawn: 'drift', n: 40, shape: 'dot', radar: true },
      pitch:    { spawn: 'drift', n: 26, shape: 'dot', pitch: true },
      speed:    { spawn: 'streak', n: 80, shape: 'streak' },
      sky:      { spawn: 'drift', n: 90, shape: 'star' },
      glass:    { spawn: 'drift', n: 26, shape: 'bokeh' },
      tunnel:   { spawn: 'tunnel', n: 130, shape: 'rect' },
      play:     { spawn: 'rise', n: 60, shape: 'bub' },
      bubbles:  { spawn: 'rise', n: 70, shape: 'bub' },
      stage:    { spawn: 'drift', n: 60, shape: 'dust', beams: true },
      cinema:   { spawn: 'drift', n: 55, shape: 'dust', beams: true },
      vinyl:    { spawn: 'drift', n: 45, shape: 'dust', vinyl: true },
      layers:   { spawn: 'drift', n: 30, shape: 'layer' },
      spectral: { spawn: 'orbit', n: 140, shape: 'dot', ring: true, gridBg: true },
      cloud:    { spawn: 'orbitfile', n: 42, shape: 'file', gauge: true },
      plane:    { spawn: 'rise', n: 46, shape: 'bub', plane: true },
      float:    { spawn: 'drift', n: 70, shape: 'dot' }
    };

    function build() {
      const cfg = MODES[mode] || MODES.float;
      const n = reduced() ? Math.min(24, cfg.n) : cfg.n;
      parts = [];
      for (let i = 0; i < n; i++) {
        const p = (SPAWN[cfg.spawn] || SPAWN.drift)(i);
        p.c = colors[i % colors.length];
        p.i = i;
        parts.push(p);
      }
    }

    /* --- dessins --- */
    function drawShape(p) {
      const cfg = MODES[mode] || MODES.float;
      const sh = cfg.shape;
      ctx.globalAlpha = p.o;
      if (sh === 'cube' || sh === 'voxel') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.2;
        ctx.strokeRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx.globalAlpha = p.o * .35; ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
      } else if (sh === 'shard') { // cristaux pixelisés
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.lineTo(p.s * .6, 0); ctx.lineTo(0, p.s); ctx.lineTo(-p.s * .6, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
      } else if (sh === 'bub') {
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2.4, 0, TAU); ctx.stroke();
        ctx.globalAlpha = p.o * .5;
        ctx.beginPath(); ctx.arc(p.x - p.s * .8, p.y - p.s * .8, p.s * .7, 0, TAU); ctx.stroke();
      } else if (sh === 'bokeh') {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 14);
        g.addColorStop(0, p.c + '55'); g.addColorStop(1, p.c + '00');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 14, 0, TAU); ctx.fill();
      } else if (sh === 'streak' || sh === 'tick') {
        ctx.strokeStyle = p.c; ctx.lineWidth = p.s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (sh === 'streak' ? -p.len : p.len), p.y - (sh === 'streak' ? p.len * .24 : 0)); ctx.stroke();
      } else if (sh === 'star') {
        ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y);
        ctx.beginPath(); for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); ctx.moveTo(0, 0); ctx.lineTo(0, -p.s * 2.6); }
        ctx.lineWidth = 1; ctx.strokeStyle = p.c; ctx.stroke(); ctx.restore();
      } else if (sh === 'layer') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(t * .01 + p.ph) * .12);
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.2;
        ctx.globalAlpha = p.o * .8;
        ctx.strokeRect(-p.s * 3, -p.s * 2, p.s * 6, p.s * 4);
        ctx.globalAlpha = p.o * .25; ctx.fillStyle = p.c; ctx.fillRect(-p.s * 3, -p.s * 2, p.s * 6, p.s * 4);
        ctx.restore();
      } else if (sh === 'rect') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a + t * .004);
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.4;
        const L = p.s * (2 + (1 - p.z) * 8);
        ctx.strokeRect(-L, -L, L * 2, L * 2); ctx.restore();
      } else if (sh === 'file') {
        ctx.save(); ctx.translate(p.x, p.y + Math.sin(t * .02 + p.wob) * 4);
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.1;
        ctx.strokeRect(-p.s / 2, -p.s / 1.6, p.s, p.s * 1.25);
        ctx.globalAlpha = p.o * .5; ctx.beginPath();
        ctx.moveTo(-p.s / 4, -p.s / 4); ctx.lineTo(p.s / 4, -p.s / 4);
        ctx.moveTo(-p.s / 4, 0); ctx.lineTo(p.s / 4, 0); ctx.stroke(); ctx.restore();
      } else if (sh === 'mix') {
        const k = p.i % 4;
        if (k === 0) { ctx.strokeStyle = p.c; ctx.strokeRect(p.x - p.s * 2, p.y - p.s * 1.3, p.s * 4, p.s * 2.6); } // carte
        else if (k === 1) { ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2, 0, TAU); ctx.strokeStyle = p.c; ctx.stroke(); } // portail
        else if (k === 2) { ctx.strokeStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ph + t * .005); ctx.strokeRect(-p.s, -p.s, p.s * 2, p.s * 2); ctx.restore(); } // cube
        else { ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, TAU); ctx.fill(); } // particule
      } else { // dot / dust
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * .8, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function extras() {
      const cfg = MODES[mode]; if (!cfg) return;
      const cx = W * (0.5 + (mouse.x - .5) * .05), cy = H * .52;
      ctx.save();
      if (cfg.vortex) { // galaxie : spirale centrale
        ctx.translate(W * .5, H * .46);
        for (let i = 0; i < 60; i++) {
          const a = t * .006 + i * .42, r = 14 + i * 4.4;
          ctx.globalAlpha = .5 * (1 - i / 60);
          ctx.fillStyle = colors[i % colors.length];
          ctx.beginPath(); ctx.arc(Math.cos(a) * r * 1.6, Math.sin(a) * r * .62, 1.6, 0, TAU); ctx.fill();
        }
      }
      if (cfg.ring) { // cercle énergétique
        ctx.translate(cx, cy);
        const R = Math.min(W, H) * .3;
        const pulse = 1 + Math.sin(t * .03) * .03;
        ctx.globalAlpha = .5; ctx.strokeStyle = colors[0]; ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 9]); ctx.lineDashOffset = -t * (cfg.ringGold ? 1.4 : 1);
        ctx.beginPath(); ctx.arc(0, 0, R * pulse, 0, TAU); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = .16; ctx.lineWidth = 26;
        ctx.beginPath(); ctx.arc(0, 0, R * pulse, 0, TAU); ctx.stroke();
      }
      if (cfg.radar) { // radar discret (CoD)
        ctx.translate(W * .82, H * .24);
        const R = Math.min(W, H) * .17;
        ctx.globalAlpha = .8;
        ctx.strokeStyle = colors[0]; ctx.lineWidth = 1;
        for (let k = 1; k <= 3; k++) { ctx.globalAlpha = .25; ctx.beginPath(); ctx.arc(0, 0, R * k / 3, 0, TAU); ctx.stroke(); }
        const a = t * .05;
        const g = ctx.createConicGradient ? ctx.createConicGradient(a, 0, 0) : null;
        if (g) { g.addColorStop(0, colors[0] + '66'); g.addColorStop(.12, colors[0] + '00'); g.addColorStop(1, colors[0] + '00');
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = .9; ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R); ctx.stroke();
      }
      if (cfg.reticle) { // réticules tactiques (Valorant)
        ctx.translate(W * .18, H * .3);
        ctx.strokeStyle = colors[0]; ctx.globalAlpha = .5; ctx.lineWidth = 1.2;
        const L = 14, g = 8, Rr = 26 + Math.sin(t * .04) * 3;
        for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          ctx.beginPath(); ctx.moveTo(dx * (Rr + g), dy * Rr); ctx.lineTo(dx * (Rr + g + L), dy * Rr);
          ctx.moveTo(dx * Rr, dy * (Rr + g)); ctx.lineTo(dx * Rr, dy * (Rr + g + L)); ctx.stroke();
        }
        ctx.globalAlpha = .3; ctx.beginPath(); ctx.arc(0, 0, Rr * .55, 0, TAU); ctx.stroke();
      }
      if (cfg.grid || cfg.gridBg) { // grille voxel / techno
        const step = cfg.grid ? 46 : 54;
        ctx.strokeStyle = colors[0]; ctx.globalAlpha = cfg.grid ? .08 : .05; ctx.lineWidth = 1;
        const off = cfg.grid ? (t * .3) % step : 0;
        ctx.beginPath();
        for (let x = -step; x < W + step; x += step) { ctx.moveTo(x + off, 0); ctx.lineTo(x + off, H); }
        for (let y = 0; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
      }
      if (cfg.pitch) { // lignes tactiques (EA FC)
        ctx.strokeStyle = colors[0]; ctx.lineWidth = 1.2;
        for (let i = 0; i < 8; i++) {
          const y = H * (i + 1) / 9;
          ctx.globalAlpha = .1 + .06 * Math.sin(t * .02 + i);
          ctx.beginPath(); ctx.moveTo(0, y);
          ctx.bezierCurveTo(W * .3, y - 26, W * .7, y + 26, W, y); ctx.stroke();
        }
        ctx.globalAlpha = .14; ctx.beginPath(); ctx.arc(W * .5, H * .5, Math.min(W, H) * .2, 0, TAU); ctx.stroke();
      }
      if (cfg.vinyl) { // vinyle qui tourne (musique)
        ctx.translate(W * .8, H * .55);
        const R = Math.min(W, H) * .26;
        ctx.rotate(t * .008);
        ctx.globalAlpha = .5;
        ctx.fillStyle = '#0a0d18'; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
        for (let k = 1; k < 7; k++) {
          ctx.globalAlpha = .12; ctx.strokeStyle = colors[0];
          ctx.beginPath(); ctx.arc(0, 0, R * k / 7, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = .7; const g2 = ctx.createLinearGradient(-R, -R, R, R);
        g2.addColorStop(0, colors[0]); g2.addColorStop(1, colors[1] || colors[0]);
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(0, 0, R * .2, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#06080f'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
      }
      if (cfg.gauge) { // jauge de stockage (cloud)
        ctx.translate(W * .5, H * .52);
        const R = Math.min(W, H) * .34, lvl = (Math.sin(t * .01) + 1) / 2;
        ctx.globalAlpha = .25; ctx.strokeStyle = colors[0]; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(0, 0, R, Math.PI * .75, Math.PI * 2.25); ctx.stroke();
        ctx.globalAlpha = .85; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, 0, R, Math.PI * .75, Math.PI * (.75 + 1.5 * lvl)); ctx.stroke();
      }
      if (cfg.plane) { // avion en papier (Telegram)
        const px = tt => W * .5 + Math.sin(tt * .012) * W * .3;
        const py = tt => H * .5 + Math.sin(tt * .021) * H * .18 - Math.cos(tt * .012) * 22;
        ctx.strokeStyle = colors[0]; ctx.setLineDash([4, 8]); ctx.globalAlpha = .42; ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let k = 46; k >= 0; k--) { const t2 = t - k * 2.2; k === 46 ? ctx.moveTo(px(t2), py(t2)) : ctx.lineTo(px(t2), py(t2)); }
        ctx.stroke(); ctx.setLineDash([]);
        const ang = Math.atan2((py(t + 1) - py(t)), (px(t + 1) - px(t)));
        ctx.translate(px(t), py(t)); ctx.rotate(ang);
        ctx.globalAlpha = .95; ctx.fillStyle = '#e8f6ff';
        ctx.beginPath(); ctx.moveTo(17, 0); ctx.lineTo(-13, -9); ctx.lineTo(-6, 0); ctx.lineTo(-13, 9); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = .6; ctx.strokeStyle = colors[0];
        ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(17, 0); ctx.stroke();
      }
      if (cfg.beams) { // faisceaux de projecteur (streaming / scène)
        for (let i = 0; i < 2; i++) {
          const bx = W * (i ? .78 : .22), sway = Math.sin(t * .008 + i * 2) * .3;
          const g = ctx.createLinearGradient(bx, 0, bx + sway * 200, H);
          g.addColorStop(0, colors[i % colors.length] + '30'); g.addColorStop(1, colors[i % colors.length] + '00');
          ctx.fillStyle = g; ctx.globalAlpha = .6;
          ctx.beginPath(); ctx.moveTo(bx - 14, 0); ctx.lineTo(bx + 14, 0);
          ctx.lineTo(bx + sway * 200 + W * .14, H); ctx.lineTo(bx + sway * 200 - W * .14, H); ctx.closePath(); ctx.fill();
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
    }

    function step() {
      for (const p of parts) {
        if (p.bh === 'rise') { p.y -= p.v; p.r += p.vr || 0; if (p.y < -30) Object.assign(p, SPAWN.rise(), { c: p.c }); }
        else if (p.bh === 'fall') { p.y += p.v; p.r += p.vr || 0; if (p.y > H + 30) Object.assign(p, SPAWN.fall(), { c: p.c }); }
        else if (p.bh === 'drift') { p.x += Math.cos(p.ph + t * .004) * p.v * 2; p.y += Math.sin(p.ph * 2 + t * .003) * p.v * 2; }
        else if (p.bh === 'orbit') { p.a += p.v; p.x = W / 2 + Math.cos(p.a) * p.rad; p.y = H * .52 + Math.sin(p.a) * p.rad * .55; }
        else if (p.bh === 'tunnel') { p.z -= p.v; if (p.z <= .04) Object.assign(p, SPAWN.tunnel(), { c: p.c, z: 1 }); }
        else if (p.bh === 'streak') { p.x += p.v; p.y -= p.v * .24; if (p.x > W + 200 || p.y < -60) Object.assign(p, SPAWN.streak(), { c: p.c, x: rand(-W * .3, 0) }); }
        else if (p.bh === 'orbitfile') { p.a += p.v; p.x = W / 2 + Math.cos(p.a) * p.rad; p.y = H * .52 + Math.sin(p.a) * p.rad * .5; }
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      extras();
      for (const p of parts) if (p.x !== undefined) drawShape(p);
    }
    function frame() {
      if (!running) return;
      t++;
      if (!reduced()) step();
      render();
      raf = requestAnimationFrame(frame);
    }

    const api2 = {
      set(mode2, colors2) {
        mode = MODES[mode2] ? mode2 : 'float';
        colors = colors2 && colors2.length ? colors2 : colors;
        resize(); build(); render();
      },
      start() { if (running) return; running = true; cancelAnimationFrame(raf); frame(); },
      stop() { running = false; cancelAnimationFrame(raf); },
      burst(x, y, n = 26) { // burst à la sélection
        if (reduced()) return;
        for (let i = 0; i < n; i++) {
          const a = rand(0, TAU), sp = rand(1.5, 5);
          parts.push({ bh: 'burst', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.5, s: rand(2, 5), o: .95, c: colors[i % colors.length], life: rand(28, 50), t0: t });
        }
      },
      resize, canvas
    };

    // Surcharge : les particules "burst" ont leur propre physique
    const origStep = step;
    step = function () {
      origStep();
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        if (p.bh === 'burst') {
          p.x += p.vx; p.y += p.vy; p.vy += .14; p.o *= .95; p.r = (p.r || 0) + .1;
          if (t - p.t0 > p.life) parts.splice(i, 1);
        }
      }
    };

    addEventListener('resize', () => { if (!canvas.isConnected) return; resize(); build(); render(); });
    addEventListener('pointermove', e => { // pointer-events:none sur le canvas → écoute globale
      if (!running) return;
      const r = canvas.getBoundingClientRect();
      if (r.width < 10) return;
      mouse.x = (e.clientX - r.left) / r.width; mouse.y = (e.clientY - r.top) / r.height;
    }, { passive: true });
    resize(); build(); render();
    return api2;
  }

  /* -------------------- Confettis sobres -------------------- */
  function confetti(opts = {}) {
    if (reduced()) return;
    let cv = document.getElementById('confetti');
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv); }
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = opts.colors || ['#3f8cff', '#7b61ff', '#22d3ee', '#ffd479', '#ffffff'];
    const xs = opts.x != null ? [opts.x] : [innerWidth * .3, innerWidth * .7];
    const ps = [];
    for (const x0 of xs) for (let i = 0; i < 60; i++) {
      const a = rand(-Math.PI * .8, -Math.PI * .2), sp = rand(5, 13);
      ps.push({ x: x0, y: opts.y ?? innerHeight * .72, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, s: rand(4, 8), c: colors[i % colors.length], r: rand(0, TAU), vr: rand(-.25, .25), o: 1 });
    }
    let t = 0;
    (function fr() {
      t++; ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = false;
      for (const p of ps) {
        if (p.o <= 0) continue; alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += .32; p.vx *= .985; p.r += p.vr; p.o -= .008;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.o); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .62); ctx.restore();
      }
      if (alive && t < 400) requestAnimationFrame(fr); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
  }

  /* Burst positionné (sélection d'un pack) */
  function burst(x, y, colors) {
    if (reduced()) return;
    let cv = document.getElementById('confetti');
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv); }
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = colors || ['#3f8cff', '#7b61ff'];
    const ps = [];
    for (let i = 0; i < 34; i++) {
      const a = rand(0, TAU), sp = rand(2, 7.5);
      ps.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, s: rand(3, 7), c: cs[i % cs.length], r: rand(0, TAU), vr: rand(-.3, .3), o: 1 });
    }
    (function fr() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = false;
      for (const p of ps) {
        if (p.o <= 0) continue; alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += .2; p.r += p.vr; p.o -= .03;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.o); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.4; ctx.strokeRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
      }
      if (alive) requestAnimationFrame(fr);
    })();
  }

  /* QR de démonstration : motif déterministe dérivé de la référence */
  function drawQR(canvas, seedStr) {
    const N = 21; let seed = 0;
    for (const ch of String(seedStr)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const ctx = canvas.getContext('2d');
    canvas.width = N; canvas.height = N;
    const px = 8; canvas.width = N * px; canvas.height = N * px;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, N * px, N * px);
    ctx.fillStyle = '#0a0e1a';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (rnd() > .52) ctx.fillRect(x * px, y * px, px, px);
    const eye = (ex, ey) => {
      ctx.fillStyle = '#0a0e1a'; ctx.fillRect(ex * px, ey * px, 7 * px, 7 * px);
      ctx.fillStyle = '#fff'; ctx.fillRect((ex + 1) * px, (ey + 1) * px, 5 * px, 5 * px);
      ctx.fillStyle = '#0a0e1a'; ctx.fillRect((ex + 2) * px, (ey + 2) * px, 3 * px, 3 * px);
    };
    eye(0, 0); eye(N - 7, 0); eye(0, N - 7);
  }

  return { Ambience, confetti, burst, drawQR, reduced };
})();
