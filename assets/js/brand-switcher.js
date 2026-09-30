/* REVIEW ONLY — remove before WordPress conversion */
/* ==========================================================================
   brand-switcher.js — "Bronze | Official" review pill. Sets data-brand on <html>, remembers it in
   localStorage (try/catch) and mirrors it in ?brand= so direct links can be shared.
   The first-paint application lives in the inline <head> script in index.html.
   Standalone IIFE, no globals. Not part of the theme: delete with brand-switcher.css and the head script.
   ========================================================================== */
(function () {
  'use strict';

  var BRANDS = [['bronze', 'Bronze'], ['official', 'Official']];
  var THEME = { bronze: '#FAF8F5', official: '#FFFFFF' };
  var root = document.documentElement;

  function current() {
    return root.getAttribute('data-brand') || 'bronze';
  }

  function apply(brand, buttons) {
    root.setAttribute('data-brand', brand);
    try { localStorage.setItem('tp-brand', brand); } catch (e) { /* storage blocked: choice lasts for this page view */ }
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('brand', brand);
      window.history.replaceState(null, '', url);
    } catch (e) { /* file:// or sandboxed: URL sync is optional */ }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME[brand]);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.brand === brand)); });
  }

  var wrap = document.createElement('div');
  wrap.className = 'tp-brandswitch';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Design version (review only)');

  var buttons = BRANDS.map(function (pair) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-brandswitch__btn';
    btn.dataset.brand = pair[0];
    btn.textContent = pair[1];
    btn.setAttribute('aria-pressed', String(pair[0] === current()));
    btn.addEventListener('click', function () { apply(pair[0], buttons); });
    wrap.appendChild(btn);
    return btn;
  });

  document.body.appendChild(wrap);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME[current()]);
})();
