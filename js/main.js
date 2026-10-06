// Fade-in on scroll
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Highlight section heading when it scrolls into view
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    e.target.classList.toggle('in-view', e.isIntersecting);
    const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
    if (link) link.classList.toggle('active', e.isIntersecting);
  });
}, { threshold: 0.3 });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
