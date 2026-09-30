/* ==========================================================================
   service-nav.js — highlights the current service in the sticky chip navigation while scrolling
   Markup: [data-tp-service-nav] contains links <a href="#id">; each target is a section carrying
   [data-tp-service-section]. Prototype of the custom Elementor widget "tp-service-nav".
   - IntersectionObserver marks the section crossing a band just below the sticky bars as current
     (aria-current="true" on its chip) and keeps that chip visible inside the scrolling list.
   - Clicking a chip marks it immediately; the browser performs the scroll (smooth via
     `scroll-behavior` in base.css, instant under prefers-reduced-motion; sections keep the
     sticky bars clear through scroll-margin). The URL hash is updated by the native anchor jump.
   - Without JS the chips are plain in-page links.
   WP: wp_enqueue_script('tp-service-nav', …/service-nav.js, [], ver, ['strategy' => 'defer']).
   ========================================================================== */
(function () {
  'use strict';

  var nav = document.querySelector('[data-tp-service-nav]');
  if (!nav || !('IntersectionObserver' in window)) return;

  var list = nav.querySelector('ul');
  var chips = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = chips
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  if (!sections.length) return;

  var byId = {};
  chips.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  var visible = {};
  var observer = null;
  var currentId = null;

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Keep the active chip inside the scrolling list without scrolling the page itself.
  function revealChip(chip) {
    if (!list) return;
    var box = list.getBoundingClientRect();
    var rect = chip.getBoundingClientRect();
    var overflowStart = rect.left < box.left;
    var overflowEnd = rect.right > box.right;
    if (!overflowStart && !overflowEnd) return;
    var delta = overflowStart ? rect.left - box.left : rect.right - box.right;
    list.scrollBy({ left: delta, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function setCurrent(id) {
    if (id === currentId) return;
    currentId = id;
    chips.forEach(function (a) {
      if (a === byId[id]) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (byId[id]) revealChip(byId[id]);
  }

  // Sections overlapping the band: the one furthest down has crossed the reading line, so it is current.
  function pickCurrent() {
    for (var i = sections.length - 1; i >= 0; i--) {
      if (visible[sections[i].id]) { setCurrent(sections[i].id); return; }
    }
  }

  // Band (reading line): from just under the sticky header + chip bar to ~45% down the viewport.
  function observe() {
    if (observer) observer.disconnect();
    visible = {};
    // Sticky offset (header height) + bar height: the nav may not be stuck yet when this runs.
    var top = (parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight;
    var bottom = Math.round(window.innerHeight * 0.55);
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      pickCurrent();
    }, { rootMargin: '-' + Math.round(top) + 'px 0px -' + bottom + 'px 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a) setCurrent(a.getAttribute('href').slice(1));
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observe, 150);
  });

  observe();
})();
