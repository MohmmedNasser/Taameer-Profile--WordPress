/* ==========================================================================
   header.js — sticky header state + accessible mobile menu
   Markup hooks (data attributes, not IDs): [data-tp-header], [data-tp-menu-toggle], [data-tp-menu].
   - Adds .tp-header--scrolled once the page scrolls past a few pixels (transparent → solid).
   - Menu: toggles `hidden`, aria-expanded, body scroll lock; traps Tab focus inside header while open;
     Esc or a link click closes and returns focus to the toggle; closes if resized to desktop.
   WP: wp_enqueue_script('tp-header', …/header.js, [], ver, ['strategy' => 'defer']). Theme header.php
       must keep the three data attributes.
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('[data-tp-header]');
  if (!header) return;

  var toggle = header.querySelector('[data-tp-menu-toggle]');
  var menu = header.querySelector('[data-tp-menu]');
  var label = toggle && toggle.querySelector('.tp-menu-toggle__label');
  var desktop = window.matchMedia('(min-width: 64em)');
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---- Scrolled state ---- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('tp-header--scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!toggle || !menu) return;

  /* ---- Menu ---- */
  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close';
    header.classList.add('tp-header--scrolled', 'tp-header--menu-open');
    document.body.classList.add('tp-is-locked');
    // Next frame so the opacity transition runs after `hidden` is removed.
    requestAnimationFrame(function () {
      menu.classList.add('is-open');
      var first = menu.querySelector(FOCUSABLE);
      if (first) first.focus();
    });
    document.addEventListener('keydown', onKeydown);
  }

  function close(returnFocus) {
    menu.classList.remove('is-open');
    header.classList.remove('tp-header--menu-open');
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Menu';
    document.body.classList.remove('tp-is-locked');
    document.removeEventListener('keydown', onKeydown);
    onScroll();
    if (returnFocus) toggle.focus();
  }

  // Focus cycles through the toggle + menu items only (the rest of the header is hidden on mobile).
  function focusables() {
    return [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll(FOCUSABLE)));
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== 'Tab') return;
    var items = focusables();
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) close(true);
    else open();
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close(false);
  });

  desktop.addEventListener('change', function (e) {
    if (e.matches && isOpen()) close(false);
  });
})();
