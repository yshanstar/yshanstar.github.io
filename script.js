document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const gamesMenu = document.querySelector('.games-menu');
  const gamesToggle = document.querySelector('.games-toggle');
  const links = [...document.querySelectorAll('.site-nav a')];
  const revealItems = document.querySelectorAll('.reveal');

  if (header && toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));

      if (!isOpen) {
        gamesMenu?.classList.remove('games-open');
        gamesToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const setGamesExpanded = (isExpanded) => {
    if (!gamesMenu || !gamesToggle) return;
    gamesMenu.classList.toggle('games-open', isExpanded);
    gamesToggle.setAttribute('aria-expanded', String(isExpanded));
  };

  if (gamesMenu && gamesToggle) {
    gamesToggle.addEventListener('click', () => {
      const isMobileMenu = window.matchMedia('(max-width: 760px)').matches;
      setGamesExpanded(isMobileMenu ? !gamesMenu.classList.contains('games-open') : true);
    });

    gamesMenu.addEventListener('pointerenter', () => setGamesExpanded(true));
    gamesMenu.addEventListener('pointerleave', () => setGamesExpanded(false));
    gamesMenu.addEventListener('focusin', () => setGamesExpanded(true));
    gamesMenu.addEventListener('focusout', (event) => {
      if (!gamesMenu.contains(event.relatedTarget)) setGamesExpanded(false);
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      header?.classList.remove('nav-open');
      toggle?.setAttribute('aria-expanded', 'false');
      setGamesExpanded(false);
    });
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.45 });

  document.querySelectorAll('.section[id]').forEach((section) => sectionObserver.observe(section));
});
