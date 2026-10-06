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

const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

if (themeToggle) {
  const updateThemeToggle = () => {
    const isDark = (document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light')) === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    themeToggle.querySelector('.theme-icon').textContent = isDark ? '☼' : '☾';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    themeToggle.title = `Switch to ${nextTheme} mode`;
  };

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch {}

    updateThemeToggle();
  });

  systemTheme.addEventListener('change', () => {
    if (!document.documentElement.dataset.theme) updateThemeToggle();
  });

  updateThemeToggle();
}

const navToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

if (navToggle && primaryNavigation) {
  const setNavigationOpen = isOpen => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    navToggle.closest('nav').classList.toggle('menu-open', isOpen);
  };

  navToggle.addEventListener('click', () => {
    setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  primaryNavigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setNavigationOpen(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setNavigationOpen(false);
  });
}

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

contactForm.addEventListener('submit', async event => {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  contactStatus.textContent = 'Sending your message...';
  contactStatus.classList.remove('is-error', 'is-success');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm)
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send your message. Please try again.');
    }

    contactStatus.textContent = 'Thanks for reaching out. Your message has been sent.';
    contactStatus.classList.add('is-success');
    contactForm.reset();
  } catch (error) {
    contactStatus.textContent = error.message || 'Something went wrong. Please try again.';
    contactStatus.classList.add('is-error');
  } finally {
    submitButton.disabled = false;
  }
});
