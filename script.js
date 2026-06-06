/* ═══════════════════════════════════════════════════════════════
   template-legale-003 — De Luca Advocacia Criminal — script.js
   law-dark scroll · single-page · pt-BR
   ═══════════════════════════════════════════════════════════════ */

// ── §4.2 Scroll animation — frame config ─────────────────────
var FRAME_COUNT  = 211;                // law-dark — HARD: 211, non 151
var FRAME_PATH   = 'https://8ispuxmgjxgu2r5q.public.blob.vercel-storage.com/templates/legale-003/frames/'; // URL Blob, NON path locale
var FRAME_PREFIX = 'frame_';
var FRAME_PAD    = 4;
var FRAME_EXT    = '.webp';

// ── Phosphor Light icons (stroke-width ~10 su viewBox 256) ──
var PHOSPHOR_ICONS = {

  'Phone': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M164,164 L184,184 a16,16,0,0,1,0,22.6 C152,240 16,104 49.4,72 a16,16,0,0,1,22.6,0 L92,92 a16,16,0,0,1,0,22.6 L80,126.4 C98,158 98,158 130,176 Z"/></svg>',

  'MapPin': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="104" r="40"/><path d="M128,224 C128,224 40,152 40,104 a88,88,0,0,1,176,0 C216,152,128,224,128,224 Z"/></svg>',

  'Clock': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="128" cy="128" r="96"/><polyline points="128,72 128,128 168,168"/></svg>',

  'WhatsappLogo': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M128,32 C76,32 32,72 32,120 C32,142 40,163 54,179 L40,216 L79,203 C95,211 111,216 128,216 C180,216 224,176 224,128 C224,80 180,32 128,32 Z"/><path d="M104,88 C104,88 96,108 112,124 C128,140 148,132 148,132"/></svg>'
};

(function () {
  'use strict';

  // ── Inject Phosphor icons ──────────────────────────────────
  document.querySelectorAll('[data-icon]').forEach(function (el) {
    var name = el.getAttribute('data-icon');
    var svg  = PHOSPHOR_ICONS[name];
    if (svg) el.innerHTML = svg;
  });

  // ── Footer year ────────────────────────────────────────────
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll class ────────────────────────────────────
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Mobile nav toggle ──────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      document.body.classList.toggle('nav-mobile-open', !expanded);
    });
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-mobile-open');
      });
    });
  }

  // ── IntersectionObserver — fade-up & stagger-cards ─────────
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .stagger-card').forEach(function (el) {
      animObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.fade-up, .stagger-card').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── §4.2 Scroll animation — canvas COVER mode ─────────────
  var section = document.getElementById('scroll-anim');
  var canvas  = document.getElementById('scroll-canvas');
  if (!section || !canvas) return;

  var ctx    = canvas.getContext('2d');
  var images = [];
  var loaded = 0;
  var currentFrame = 0;
  var currentImg   = null;
  var pin    = section.querySelector('.scroll-anim-pin');
  var DPR    = Math.min(window.devicePixelRatio || 1, 2);

  // setupCanvas — dimensioni canvas = dimensioni del pin container
  function setupCanvas() {
    var w = pin.clientWidth;
    var h = pin.clientHeight;
    canvas.width  = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // renderFrame — modalità COVER: Math.max(cw/iw, ch/ih), MAI Math.min
  function renderFrame(img) {
    var cw = pin.clientWidth;
    var ch = pin.clientHeight;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    if (!iw || !ih) return;
    var scale = Math.max(cw / iw, ch / ih);
    var sw = iw * scale;
    var sh = ih * scale;
    var sx = (cw - sw) / 2;
    var sy = (ch - sh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  function drawFrame(index) {
    var img = images[index];
    if (img && img.complete && img.naturalWidth) {
      renderFrame(img);
      currentFrame = index;
      currentImg   = img;
    }
  }

  function onScroll() {
    var rect     = section.getBoundingClientRect();
    var total    = section.offsetHeight - window.innerHeight;
    var scrolled = Math.max(0, -rect.top);
    var progress = Math.min(1, scrolled / total);
    var frameIdx = Math.round(progress * (FRAME_COUNT - 1));
    if (frameIdx !== currentFrame) drawFrame(frameIdx);
  }

  // Frame loader — padding 4 cifre (frame_0001.webp … frame_0211.webp)
  for (var i = 0; i < FRAME_COUNT; i++) {
    (function (idx) {
      var img = new Image();
      img.onload = function () {
        loaded++;
        if (idx === 0 || loaded === 1) {
          setupCanvas();
          renderFrame(img);
          currentFrame = 0;
          currentImg   = img;
        }
      };
      var padded = String(idx + 1).padStart(FRAME_PAD, '0');
      img.src = FRAME_PATH + FRAME_PREFIX + padded + FRAME_EXT;
      images[idx] = img;
    })(i);
  }

  // Resize listener — ricalcola canvas e rirenderizza frame corrente
  window.addEventListener('resize', function () {
    setupCanvas();
    if (currentImg) renderFrame(currentImg);
  }, { passive: true });

  window.addEventListener('scroll', onScroll, { passive: true });
  setupCanvas();

})();
