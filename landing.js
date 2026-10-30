const entry = new URLSearchParams(window.location.search);
const legacyAuthKeys = ['invite', 'mode', 'oobCode', 'action', 'code', 'share'];
if (legacyAuthKeys.some((key) => entry.has(key))) {
  window.location.replace('/app.html' + window.location.search + window.location.hash);
}

// Content stays visible when scripts or motion are unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('will-reveal');
    observer.observe(element);
  });
}

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    detail.querySelector('summary span').textContent = detail.open ? '\u2212' : '+';
  });
});
