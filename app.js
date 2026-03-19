/* Numu Consulting v3 — SPA Router & Interactions */
(function () {
  'use strict';

  /* ── Route map ── */
  const routes = {
    '/':                          'page-home',
    '/about':                     'page-about',
    '/ethics-gate':               'page-ethics-gate',
    '/audit':                     'page-audit',
    '/services':                  'page-services',
    '/digital-workforce':         'page-digital-workforce',
    '/case-studies':              'page-case-studies',
    '/blog':                      'page-blog',
    '/book-a-call':               'page-book-a-call',
    '/free-ethics-audit':         'page-free-ethics-audit',
    '/roi-calculator':            'page-roi-calculator',
    '/ethics-audit':              'page-ethics-audit',
    '/start-here':                'page-start-here',
    '/resources':                 'page-resources',
    '/newsletter':                'page-newsletter',
    '/solutions/marketing-agencies': 'page-solutions-marketing',
    '/solutions/accounting-firms':   'page-solutions-accounting',
    '/solutions/law-firms':          'page-solutions-law',
    '/solutions/charities':          'page-solutions-charities',
    '/contact':                   'page-contact',
    '/privacy-policy':            'page-privacy-policy',
  };

  /* ── Router ── */
  function navigate() {
    var hash = location.hash.replace('#', '') || '/';
    var pageId = routes[hash] || 'page-home';

    document.querySelectorAll('.page').forEach(function (p) {
      p.style.display = 'none';
    });

    var target = document.getElementById(pageId);
    if (target) {
      target.style.display = 'block';
    } else {
      var home = document.getElementById('page-home');
      if (home) home.style.display = 'block';
    }

    window.scrollTo(0, 0);
    updateActiveNav(hash);
    initPageFeatures();
  }

  function updateActiveNav(hash) {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href) {
        var linkHash = href.replace('#', '');
        if (linkHash === hash || (hash === '/' && linkHash === '/')) {
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('hashchange', navigate);
  window.addEventListener('DOMContentLoaded', navigate);

  /* ── Mobile menu ── */
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.querySelector('.nav-hamburger');
    var navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('open');
      });

      navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
        }
      });
    }

    /* ── Dropdown menus (desktop hover + mobile click) ── */
    document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            dd.classList.toggle('open');
          }
        });
      }
    });
  });

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (q) {
      if (q._bound) return;
      q._bound = true;
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        /* Close siblings */
        item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── ROI Calculator ── */
  function initROICalculator() {
    var sliders = document.querySelectorAll('.calc-slider');
    var hourlyBtns = document.querySelectorAll('.hourly-option');
    if (!sliders.length) return;

    var hourlyValue = 75;

    sliders.forEach(function (s) {
      if (s._bound) return;
      s._bound = true;
      var display = s.parentElement.querySelector('.calc-slider-value');
      s.addEventListener('input', function () {
        if (display) display.textContent = s.value + ' hrs';
        updateROI();
      });
    });

    hourlyBtns.forEach(function (btn) {
      if (btn._bound) return;
      btn._bound = true;
      btn.addEventListener('click', function () {
        hourlyBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        hourlyValue = parseInt(btn.dataset.value) || 75;
        updateROI();
      });
    });

    function updateROI() {
      var total = 0;
      sliders.forEach(function (s) {
        total += parseInt(s.value) || 0;
      });

      var saved = Math.round(total * 0.7);
      var annualHours = saved * 48;
      var annualSaving = annualHours * hourlyValue;

      var pkg, pkgCost;
      if (total <= 15) { pkg = 'Starter (£8,000)'; pkgCost = 8000; }
      else if (total <= 30) { pkg = 'Growth (£18,000)'; pkgCost = 18000; }
      else { pkg = 'Enterprise (£45,000)'; pkgCost = 45000; }

      var roi = pkgCost > 0 ? (annualSaving / pkgCost).toFixed(1) : 0;

      var el;
      el = document.getElementById('roi-hours');         if (el) el.textContent = saved + ' hrs/week';
      el = document.getElementById('roi-annual-hours');  if (el) el.textContent = annualHours.toLocaleString() + ' hrs/year';
      el = document.getElementById('roi-annual-saving'); if (el) el.textContent = '£' + annualSaving.toLocaleString();
      el = document.getElementById('roi-package');       if (el) el.textContent = pkg;
      el = document.getElementById('roi-ratio');         if (el) el.textContent = roi + ':1';
    }

    /* Run initial calculation */
    updateROI();
  }

  /* ── Scroll reveal ── */
  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      if (!el._observed) {
        el._observed = true;
        observer.observe(el);
      }
    });
  }

  /* ── Init page features ── */
  function initPageFeatures() {
    initFAQ();
    initROICalculator();
    requestAnimationFrame(function () {
      initScrollReveal();
    });
  }

  /* ── Nav scroll effect ── */
  window.addEventListener('scroll', function () {
    var nav = document.querySelector('.nav');
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });
})();
