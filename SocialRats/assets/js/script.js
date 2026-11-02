/* ═══════════════════════════════════════════════════════════════
   GymRats Clone — JavaScript
   Navigation, Language Selector, Scroll Reveal
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────────────────
  // 1. Mobile Menu Toggle
  // ────────────────────────────────────────────────────────────
  const menuButton = document.getElementById('menu-button') || document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links') || document.getElementById('mobile-menu');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      if (navLinks.id === 'mobile-menu') {
        navLinks.classList.toggle('hidden');
      } else {
        navLinks.classList.toggle('is-open');
      }
    });

    // Close when clicking any menu link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.id === 'mobile-menu') {
          navLinks.classList.add('hidden');
        } else {
          navLinks.classList.remove('is-open');
        }
      });
    });
  }

  // ────────────────────────────────────────────────────────────
  // 2. Language Selector
  // ────────────────────────────────────────────────────────────
  const langButton = document.getElementById('language-button');
  const langMenu = document.getElementById('lang-menu');
  const langBackdrop = document.getElementById('lang-backdrop');
  const langClose = document.getElementById('lang-close');

  function openLangMenu() {
    langButton.setAttribute('aria-expanded', 'true');
    langMenu.classList.add('is-open');
    langBackdrop.classList.add('is-open');
  }

  function closeLangMenu() {
    langButton.setAttribute('aria-expanded', 'false');
    langMenu.classList.remove('is-open');
    langBackdrop.classList.remove('is-open');
  }

  if (langButton) {
    langButton.addEventListener('click', () => {
      const isOpen = langButton.getAttribute('aria-expanded') === 'true';
      isOpen ? closeLangMenu() : openLangMenu();
    });
  }

  if (langBackdrop) {
    langBackdrop.addEventListener('click', closeLangMenu);
  }

  if (langClose) {
    langClose.addEventListener('click', closeLangMenu);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLangMenu();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const langSelector = document.getElementById('lang-selector');
    if (langSelector && !langSelector.contains(e.target)) {
      closeLangMenu();
    }
  });

  // ────────────────────────────────────────────────────────────
  // 3. Scroll Reveal (Intersection Observer)
  // ────────────────────────────────────────────────────────────
  const features = document.querySelectorAll('.feature');

  if (features.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    features.forEach((feature) => observer.observe(feature));
  } else {
    // Fallback: make all visible immediately
    features.forEach((f) => f.classList.add('is-visible'));
  }

  // ────────────────────────────────────────────────────────────
  // 4. Platform-specific Download Button (like original)
  // ────────────────────────────────────────────────────────────
  const ua = navigator.userAgent || '';

  if (/iPad/.test(ua)) {
    showDownload('ipados-download');
  } else if (/iPhone|iPod/.test(ua)) {
    showDownload('ios-download');
  } else if (/Android/.test(ua)) {
    showDownload('android-download');
  }

  function showDownload(id) {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'inline-block';
    }
  }

  // ────────────────────────────────────────────────────────────
  // 5. Smooth Scroll for Anchor Links
  // ────────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove('is-open');
      }
    });
  });

  // ────────────────────────────────────────────────────────────
  // 6. Header scroll behavior (add shadow on scroll)
  // ────────────────────────────────────────────────────────────
  const header = document.getElementById('header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }
});
