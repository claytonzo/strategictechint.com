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

// ===== Gallery lightbox =====
(function lightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('img');
  document.querySelectorAll('.g-item').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img')?.alt || '';
      box.classList.add('on');
      box.setAttribute('aria-hidden', 'false');
    });
  });
  function close() { box.classList.remove('on'); box.setAttribute('aria-hidden', 'true'); img.src = ''; }
  box.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ===== Console easter egg =====
console.log('%cMathSpeakGlobal, L.L.C.', 'color:#5a55e0;font:700 22px Fraunces,Georgia,serif');
console.log('%cBring your math program to the peak.', 'color:#ff6a4d;font:14px Inter,sans-serif');
console.log('%cLet\'s build something great together — megan.holmstrom@gmail.com', 'color:#908ca8;font:12px monospace');
