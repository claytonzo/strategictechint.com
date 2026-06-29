// ===== Fandre Technologies — interactions =====

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Nav background + scroll progress bar =====
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Reveal-on-scroll =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  observer.observe(el);
});

// ===== Hero spotlight (mouse-follow) =====
const hero = document.querySelector('.hero');
if (hero && !REDUCE) {
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
    hero.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

// ===== 3D tilt + cursor glow on cards =====
if (!REDUCE) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--cx', `${px * 100}%`);
      card.style.setProperty('--cy', `${py * 100}%`);
      const rx = (0.5 - py) * 7;
      const ry = (px - 0.5) * 7;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// ===== Scramble-morphing headline =====
(function morphHeadline() {
  const el = document.getElementById('morph');
  if (!el) return;
  const phrases = [
    'made with confidence.',
    'shipped to production.',
    'built to outlast trends.',
    'measured, not guessed.',
  ];
  const CHARS = '!<>-_\\/[]{}—=+*^?#01';
  if (REDUCE) { el.textContent = phrases[0]; return; }

  let frame = 0, idx = 0, queue = [], raf;
  function setText(newText) {
    const old = el.textContent;
    const len = Math.max(old.length, newText.length);
    queue = [];
    for (let i = 0; i < len; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30) + 12;
      queue.push({ from, to, start, end, char: '' });
    }
    cancelAnimationFrame(raf);
    frame = 0;
    update();
  }
  function update() {
    let out = '', done = 0;
    for (const q of queue) {
      if (frame >= q.end) { done++; out += q.to; }
      else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.28) q.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        out += `<span style="opacity:.55">${q.char}</span>`;
      } else { out += q.from; }
    }
    el.innerHTML = out;
    if (done === queue.length) {
      setTimeout(() => { idx = (idx + 1) % phrases.length; setText(phrases[idx]); }, 2600);
    } else {
      frame++;
      raf = requestAnimationFrame(update);
    }
  }
  setTimeout(() => setText(phrases[(idx = 1)]), 2600);
})();

// ===== Animated terminal =====
(function terminal() {
  const el = document.getElementById('term');
  if (!el) return;
  const CURSOR = '<span class="term-cursor"></span>';
  const LINES = [
    { p: 'whoami' },
    { dim: 'principal · Fandre Technologies' },
    { gap: 1 },
    { p: 'fandre assess --stack' },
    { ok: 'Inventory: 47 services across 3 clouds' },
    { ok: 'Risk surface mapped' },
    { arr: '12 quick wins identified' },
    { gap: 1 },
    { p: 'fandre architect --target' },
    { ok: 'Topology drafted' },
    { ok: 'Run-rate modeled: −38%' },
    { gap: 1 },
    { p: 'fandre ship --to prod' },
    { dim: 'deploying ▓▓▓▓▓▓▓▓▓▓ 100%' },
    { ok: 'Zero downtime' },
    { ok: 'All checks green' },
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function staticRender() {
    let h = '';
    for (const l of LINES) {
      if (l.gap) { h += '\n'; continue; }
      if (l.p) h += `<span class="pr">❯</span> <span class="cmd">${esc(l.p)}</span>\n`;
      else { const c = l.ok ? 'ok' : l.arr ? 'arr' : 'dim'; h += `<span class="${c}">${esc(l.ok || l.arr || l.dim)}</span>\n`; }
    }
    el.innerHTML = h;
  }
  if (REDUCE) { staticRender(); return; }

  async function run() {
    while (true) {
      let html = '';
      for (const l of LINES) {
        if (l.gap) { html += '\n'; el.innerHTML = html + CURSOR; continue; }
        if (l.p) {
          const base = html + '<span class="pr">❯</span> ';
          for (let i = 1; i <= l.p.length; i++) {
            el.innerHTML = base + `<span class="cmd">${esc(l.p.slice(0, i))}</span>` + CURSOR;
            await wait(26 + Math.random() * 46);
          }
          html = base + `<span class="cmd">${esc(l.p)}</span>\n`;
          await wait(280);
        } else {
          const c = l.ok ? 'ok' : l.arr ? 'arr' : 'dim';
          html += `<span class="${c}">${esc(l.ok || l.arr || l.dim)}</span>\n`;
          el.innerHTML = html + CURSOR;
          await wait(170);
        }
      }
      await wait(3200);
      el.innerHTML = CURSOR;
      await wait(550);
    }
  }
  run();
})();

// ===== Console easter egg =====
console.log('%cFandre Technologies', 'color:#38e0c8;font:700 22px Space Grotesk,sans-serif');
console.log('%cPoking around the source? Good instinct.\nTry: ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#7fb0ff;font:13px monospace');
console.log('%cBuilt as a static site on GitHub Pages. clay@fandretech.com', 'color:#647189;font:12px monospace');

// ===== Konami code → Matrix rain =====
(function konami() {
  const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let pos = 0;
  const cv = document.getElementById('matrix');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let running = false, raf, drops;

  function start() {
    if (running) return;
    running = true;
    cv.classList.add('on');
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = Math.floor(cv.width / 16);
    drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const glyphs = 'アァカサタナハマ0123456789≡∑∂λ{}[]<>/=$#';
    function draw() {
      ctx.fillStyle = 'rgba(7,11,18,0.10)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * 16, y = drops[i] * 16;
        ctx.fillStyle = Math.random() < 0.04 ? '#eafff8' : '#38e0c8';
        ctx.fillText(ch, x, y);
        if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    setTimeout(stop, 7000);
  }
  function stop() {
    cv.classList.remove('on');
    setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, cv.width, cv.height); running = false; }, 650);
  }
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
    if (k === seq[pos]) { pos++; if (pos === seq.length) { pos = 0; start(); } }
    else { pos = (k === seq[0]) ? 1 : 0; }
  });
})();

// ===== Animated network graphic in the hero =====
(function networkCanvas() {
  const canvas = document.getElementById('net');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr, nodes;
  const mouse = { x: -9999, y: -9999 };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(Math.round((w * h) / 16000), 90);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
      r: Math.random() * 1.6 + 0.8,
    }));
  }

  const LINK = 132;
  let raf;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const md = Math.hypot(dx, dy);
      if (md < 170) { n.x += (dx / md) * 0.35; n.y += (dy / md) * 0.35; }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < LINK) {
          const t = 1 - dist / LINK;
          ctx.strokeStyle = `rgba(96, 150, 240, ${t * 0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < 150;
      ctx.fillStyle = near ? 'rgba(56, 224, 200, 0.95)' : 'rgba(120, 170, 255, 0.7)';
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', size);
  window.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  if (REDUCE) { for (const n of nodes) { n.vx = n.vy = 0; } frame(); cancelAnimationFrame(raf); }
  else { frame(); }
})();
