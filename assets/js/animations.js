/* ==========================================================================
   animations.js — class-driven motion system (see animations.css header for the class list)
   One IntersectionObserver for every entrance effect, one rAF loop for parallax (only while any
   parallax element is on screen). Animates once. Transforms/opacity/clip-path only.
   Never targets elements by ID: everything is found by class, so Elementor users can apply effects
   through Advanced → CSS Classes.
   Also contains tp-counter (formerly counters.js), the first IIFE below.
   WP: wp_enqueue_script('tp-animations', …/animations.js, [], ver, ['strategy' => 'defer']) with animations.css.
       Add `document.documentElement.classList.add('tp-js')` inline in <head> (wp_add_inline_script
       on an early handle) so hidden states never flash.
   ========================================================================== */
(function () {
  /* ---- tp-counter: count-up numbers. Attributes (all optional; the number is read from the text): data-tp-target, data-tp-from (default 0), data-tp-prefix,
     data-tp-suffix. The element's server-rendered text is the final value, so no-JS / reduced-motion users see it as is.
     Exposes TP.counter(el); the entrance observer below calls it when the element enters the viewport. ---- */
  'use strict';

  var TP = (window.TP = window.TP || {});
  var DURATION = 1800;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  TP.counter = function (el) {
    if (el.dataset.tpCounted) return;
    el.dataset.tpCounted = 'true';

    // Plain markup works without attributes: "100+" counts to 100 with the suffix "+" (attributes override).
    var m = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/.exec(el.textContent.trim()) || [];
    var target = parseFloat(el.dataset.tpTarget !== undefined ? el.dataset.tpTarget : m[2]);
    if (isNaN(target)) return;
    var from = parseFloat(el.dataset.tpFrom) || 0;
    var prefix = el.dataset.tpPrefix !== undefined ? el.dataset.tpPrefix : m[1] || '';
    var suffix = el.dataset.tpSuffix !== undefined ? el.dataset.tpSuffix : m[3] || '';
    var finalText = prefix + target + suffix;

    if (TP.reducedMotion) {
      el.textContent = finalText;
      return;
    }

    // Screen readers get the final value immediately; only the visual text animates.
    el.setAttribute('aria-label', finalText);
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / DURATION, 1);
      el.textContent = prefix + Math.round(from + (target - from) * easeOutCubic(t)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
      else el.removeAttribute('aria-label');
    }
    requestAnimationFrame(frame);
  };
})();

(function () {
  'use strict';

  var TP = (window.TP = window.TP || {});
  document.documentElement.classList.add('tp-js');
  TP.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ENTER = '.tp-reveal, .tp-stagger, .tp-img-reveal, .tp-split, .tp-counter';

  /* ---- data-tp-delay → CSS custom property ---- */
  function applyDelays(scope) {
    scope.querySelectorAll('[data-tp-delay]').forEach(function (el) {
      el.style.setProperty('--tp-delay', (parseInt(el.dataset.tpDelay, 10) || 0) + 'ms');
    });
  }

  /* ---- tp-stagger: index each child ---- */
  function indexStagger(scope) {
    scope.querySelectorAll('.tp-stagger').forEach(function (parent) {
      Array.prototype.forEach.call(parent.children, function (child, i) {
        child.style.setProperty('--tp-i', i);
      });
    });
  }

  /* ---- tp-split: wrap each rendered line; aria-label keeps the heading readable as one string ---- */
  function accessibleText(el) {
    var clone = el.cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach(function (n) { n.remove(); });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  function split(el) {
    if (!el.dataset.tpSource) {
      el.dataset.tpSource = el.innerHTML;
      el.setAttribute('aria-label', accessibleText(el));
    }
    el.innerHTML = el.dataset.tpSource;

    // 1. Wrap every word; element children (e.g. the aria-hidden logo "+") stay as they are.
    var parts = [];
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) { parts.push(node); return; }
      node.textContent.split(/(\s+)/).forEach(function (piece) {
        if (!piece) return;
        if (/^\s+$/.test(piece)) { parts.push(document.createTextNode(' ')); return; }
        var w = document.createElement('span');
        w.className = 'tp-split__word';
        w.textContent = piece;
        parts.push(w);
      });
    });
    el.textContent = '';
    parts.forEach(function (p) { el.appendChild(p); });

    // 2. Group by rendered line (offsetTop of each word).
    var lines = [];
    var lastTop = null;
    parts.forEach(function (node) {
      // Spaces and decorations (e.g. the superscript "+") stay on the current line: their offsetTop
      // is shifted by vertical-align and would otherwise start a line of their own.
      var isWord = node.nodeType === 1 && node.classList.contains('tp-split__word');
      if (!isWord) {
        if (lines.length) lines[lines.length - 1].push(node);
        else lines.push([node]);
        return;
      }
      var top = node.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(node);
    });

    // 3. Rebuild as masked lines.
    el.textContent = '';
    lines.forEach(function (nodes, i) {
      var line = document.createElement('span');
      line.className = 'tp-split__line';
      line.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.className = 'tp-split__inner';
      inner.style.setProperty('--tp-i', i);
      nodes.forEach(function (n) { inner.appendChild(n); });
      line.appendChild(inner);
      el.appendChild(line);
    });
  }

  function initSplits() {
    var els = document.querySelectorAll('.tp-split');
    if (!els.length) return;
    els.forEach(split);
    // Line breaks change with width: re-split (the reveal state is kept on the element) after resize.
    var lastWidth = window.innerWidth;
    var timer;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(function () { els.forEach(split); }, 200);
    });
    // Web fonts change line breaks too.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { els.forEach(split); });
    }
  }

  /* ---- Marquee: clone the track once so the CSS loop is seamless ---- */
  function initMarquees() {
    document.querySelectorAll('.tp-marquee').forEach(function (marquee) {
      var tracks = marquee.querySelectorAll('.tp-marquee__track');
      if (tracks.length !== 1) return;
      var clone = tracks[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
      marquee.appendChild(clone);
    });
  }

  /* ---- Entrance observer ---- */
  function reveal(el) {
    el.classList.add('is-visible');
    if (el.classList.contains('tp-counter') && TP.counter) TP.counter(el);
  }

  var io = null;
  var proxies = new Map(); // observed element → element to reveal

  // A fully clipped element (tp-img-reveal starts at clip-path: inset(0 100% 0 0)) never reports as
  // intersecting in Chrome, so its parent is observed instead.
  function observe(el) {
    var watched = el.classList.contains('tp-img-reveal') && el.parentElement ? el.parentElement : el;
    var list = proxies.get(watched) || [];
    list.push(el);
    proxies.set(watched, list);
    io.observe(watched);
  }

  function initObserver() {
    var targets = document.querySelectorAll(ENTER);
    if (TP.reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        (proxies.get(entry.target) || [entry.target]).forEach(reveal);
        proxies.delete(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(observe);
  }

  /* ---- Parallax ---- */
  function initParallax() {
    var items = document.querySelectorAll('.tp-parallax');
    if (!items.length || TP.reducedMotion || !('IntersectionObserver' in window)) return;
    var visible = new Set();
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      visible.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.dataset.tpSpeed) || 0.15;
        // 0 when the element is centred in the viewport; grows as it moves away.
        var offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.setProperty('--tp-py', offset.toFixed(1) + 'px');
      });
    }

    function request() {
      if (!ticking && visible.size) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      request();
    });
    items.forEach(function (el) { pio.observe(el); });
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  }

  /* Public hook for content injected after load (projects.js). */
  TP.refreshAnimations = function (scope) {
    applyDelays(scope);
    indexStagger(scope);
    scope.querySelectorAll(ENTER).forEach(function (el) {
      if (io) observe(el);
      else reveal(el);
    });
  };

  function init() {
    applyDelays(document);
    indexStagger(document);
    initMarquees();
    initSplits();
    initObserver();
    initParallax();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
