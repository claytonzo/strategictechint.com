// ===== MathSpeakGlobal — interactions =====

const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Nav background + scroll progress bar =====
const nav = document.getElementById('nav');
const progress = document.getElementById('progress');
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 16);
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
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  observer.observe(el);
});

// ===== Gallery lightbox with prev/next navigation =====
(function lightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  const items = Array.from(document.querySelectorAll('.g-item')).map((a) => ({
    src: a.getAttribute('href'),
    alt: a.querySelector('img')?.alt || '',
  }));
  let idx = 0;

  function render() {
    const it = items[idx];
    img.src = it.src;
    img.alt = it.alt;
    if (count) count.textContent = `${idx + 1} / ${items.length}`;
  }
  function open(i) {
    idx = i;
    render();
    box.classList.add('on');
    box.setAttribute('aria-hidden', 'false');
  }
  function close() {
    box.classList.remove('on');
    box.setAttribute('aria-hidden', 'true');
    img.src = '';
  }
  const step = (d) => { idx = (idx + d + items.length) % items.length; render(); };

  document.querySelectorAll('.g-item').forEach((a, i) => {
    a.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  box.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  box.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  box.querySelector('.lb-close').addEventListener('click', (e) => { e.stopPropagation(); close(); });
  img.addEventListener('click', (e) => e.stopPropagation()); // clicking the photo shouldn't close
  box.addEventListener('click', close);                       // clicking the backdrop closes

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();

// ===== Console easter egg =====
console.log('%cMathSpeakGlobal, L.L.C.', 'color:#5a55e0;font:700 22px Fraunces,Georgia,serif');
console.log('%cBring your math program to the peak.', 'color:#ff6a4d;font:14px Inter,sans-serif');
console.log('%cLet\'s build something great together — megan.holmstrom@gmail.com', 'color:#908ca8;font:12px monospace');
