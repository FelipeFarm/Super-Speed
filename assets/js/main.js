/* =============================================================================
   Super Speed Remodeling - shared behaviour
   Vanilla JS, no dependencies. Loaded with `defer` on all four pages.

   NOTE: form handling here is a FRONT-END DEMO ONLY. Nothing is submitted
   anywhere. Wire each form to a real endpoint (form provider, CRM webhook or
   serverless function) and add server-side validation and spam protection
   before launch.
   ========================================================================== */
(function () {
  'use strict';

  /* --- Mobile navigation ------------------------------------------------ */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    // Close when a nav link is tapped
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Reset state when resizing back to desktop
    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (window.innerWidth > 860) closeNav();
      }, 150);
    });
  }

  /* --- Header shadow on scroll ------------------------------------------ */
  var header = document.getElementById('siteHeader');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-stuck', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- FAQ: one panel open at a time within each group ------------------ */
  document.querySelectorAll('.faq').forEach(function (group) {
    var items = group.querySelectorAll('details');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  /* --- Forms: demo-only validation and feedback ------------------------- */
  function wireForm(formId, statusId, message) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous inline error styling
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
        el.style.borderColor = '';
      });

      var firstInvalid = null;
      form.querySelectorAll('[required]').forEach(function (field) {
        var value = (field.value || '').trim();
        var invalid = !value;

        if (!invalid && field.type === 'email') {
          invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        }
        if (!invalid && field.type === 'tel') {
          invalid = (value.replace(/\D/g, '').length < 10);
        }

        if (invalid) {
          field.setAttribute('aria-invalid', 'true');
          field.style.borderColor = '#B3382F';
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        status.textContent = 'Please check the highlighted fields and try again.';
        status.classList.add('is-visible');
        firstInvalid.focus();
        return;
      }

      status.textContent = message;
      status.classList.add('is-visible');
      form.reset();
    });
  }

  /* --- Scroll reveal ---------------------------------------------------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal]');

  if (targets.length && !reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    targets.forEach(function (el) { io.observe(el); });
  }

  wireForm(
    'quickForm',
    'quickStatus',
    'Demo only: no data was sent. In production this would submit to your CRM and confirm the callback.'
  );
  wireForm(
    'homeForm',
    'homeStatus',
    'Demo only: no data was sent. In production this would submit and show a thank-you state.'
  );
  wireForm(
    'contactForm',
    'contactStatus',
    'Demo only: no data was sent. In production this would submit and redirect to a thank-you page for conversion tracking.'
  );
})();
