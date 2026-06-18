(function () {
  'use strict';

  /* ── Cursor glow ─────────────────────────────────── */
  var glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* ── Mobile menu ─────────────────────────────────── */
  var toggle = document.getElementById('navToggle');
  var menu   = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Nav active link on scroll ───────────────────── */
  var sections  = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.nav-links a[data-nav]');

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.dataset.nav === e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Scroll reveal ───────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Back to top ─────────────────────────────────── */
  var btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', function () {
      btt.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth scroll for anchor links ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Nav shadow on scroll ────────────────────────── */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 4px 32px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  /* ── Certificate / achievement lightbox ──────────── */
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lbImg');
  var lbCap   = document.getElementById('lbCaption');
  var focused = null;

  function openLb(src, title) {
    if (!lb) return;
    focused = document.activeElement;
    lbImg.src = 'assets/certificates/' + src;
    lbImg.alt = title;
    lbCap.textContent = title;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }

  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (focused) focused.focus();
  }

  document.querySelectorAll('[data-cert]').forEach(function (el) {
    el.addEventListener('click', function () {
      openLb(this.dataset.cert, this.dataset.title || 'Certificate');
    });
  });

  if (lb) {
    lb.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeLb);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) closeLb();
    });
  }

  /* ── Card tilt effect ────────────────────────────── */
  document.querySelectorAll('.proj-card, .cert-card, .achiev-card, .edu-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── Hero pill stagger on load ───────────────────── */
  document.querySelectorAll('.hero-pill').forEach(function (p, i) {
    p.style.opacity = '0';
    p.style.transform = 'translateY(10px)';
    setTimeout(function () {
      p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
    }, 800 + i * 80);
  });

  /* ── Social button ripple ────────────────────────── */
  document.querySelectorAll('.social-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var r = document.createElement('span');
      r.style.cssText = [
        'position:absolute','border-radius:50%',
        'background:rgba(0,212,255,0.3)',
        'width:40px','height:40px',
        'transform:translate(-50%,-50%) scale(0)',
        'animation:ripple 0.5s linear',
        'pointer-events:none',
        'left:' + (e.offsetX) + 'px',
        'top:' + (e.offsetY) + 'px'
      ].join(';');
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(function () { r.remove(); }, 600);
    });
  });

  /* inject ripple keyframe */
  var style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:translate(-50%,-50%) scale(3);opacity:0}}';
  document.head.appendChild(style);

})();
