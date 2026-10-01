/* ==========================================================================
   interactions.js — SPIKE VERSION: lightbox section only (check 1b, docs/prompts/taameer-phase-4-spike-prompt.md)
   Copied unchanged from the prototype assets/js/interactions.js (section 2) with a trimmed helper block.
   Remove/replace with the full interactions.js in the real theme build. Lightbox dialog CSS is NOT included in the spike.
   ========================================================================== */
(function () {
  'use strict';

  var TP = (window.TP = window.TP || {});
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var STRINGS = {
    en: { close: 'Close', prev: 'Previous image', next: 'Next image', of: ' / ' },
    ar: { close: 'إغلاق', prev: 'الصورة السابقة', next: 'الصورة التالية', of: ' / ' }
  };
  function s(key) {
    return (STRINGS[lang] || STRINGS.en)[key] || STRINGS.en[key];
  }
  function isRtl(el) {
    return getComputedStyle(el || document.documentElement).direction === 'rtl';
  }

  /* ======================================================================
     2. Lightbox — .tp-lightbox
     Every <a href="x.webp"> inside a .tp-lightbox container belongs to that container's gallery, in DOM order;
     one entry per distinct image. Standard markup only (PRD v1.6 R6): the full-size image is the link's href, the
     caption is the thumbnail's alt (falls back to the link's aria-label). PDF links are not lightbox entries: they
     open normally.
     Dialog: role="dialog" aria-modal, labelled by the caption; Esc closes; ← → navigate (mirrored in RTL); Tab is
     trapped; focus returns to the trigger; swipe on touch; counter "3 / 8"; next/previous preloaded only; scroll lock.
     Public: TP.lightbox.open(link) / close().
     ====================================================================== */
  (function lightbox() {
    var IMAGE = /\.(webp|jpe?g|png|avif|gif)(\?|#|$)/i;
    var FOCUSABLE = 'a[href], button:not([disabled])';
    var SWIPE_MIN = 48;
    var root, imgEl, capEl, countEl, prevBtn, nextBtn, closeBtn;
    var items = [];
    var index = 0;
    var opener = null;
    var savedScroll = 0;
    var touchX = null;

    function build() {
      if (root) return;
      root = document.createElement('div');
      root.className = 'tp-lbox';
      root.hidden = true;
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-labelledby', 'tp-lbox-caption');
      root.innerHTML =
        '<div class="tp-lbox__backdrop" data-tp-lb-close></div>' +
        '<figure class="tp-lbox__fig">' +
          '<img class="tp-lbox__img" alt="">' +
          '<figcaption class="tp-lbox__bar">' +
            '<span class="tp-lbox__caption" id="tp-lbox-caption"></span>' +
            '<span class="tp-lbox__meta">' +
              '<span class="tp-lbox__count" aria-live="polite"></span>' +
            '</span>' +
          '</figcaption>' +
        '</figure>' +
        '<button class="tp-lbox__btn tp-lbox__close" type="button" aria-label="' + s('close') + '">' +
          '<svg aria-hidden="true" width="20" height="20"><use href="#tp-i-plus"/></svg></button>' +
        '<button class="tp-lbox__btn tp-lbox__prev" type="button" aria-label="' + s('prev') + '">' +
          '<svg aria-hidden="true" width="24" height="24"><use href="#tp-i-arrow"/></svg></button>' +
        '<button class="tp-lbox__btn tp-lbox__next" type="button" aria-label="' + s('next') + '">' +
          '<svg aria-hidden="true" width="24" height="24"><use href="#tp-i-arrow"/></svg></button>';
      document.body.appendChild(root);

      imgEl = root.querySelector('.tp-lbox__img');
      capEl = root.querySelector('.tp-lbox__caption');
      countEl = root.querySelector('.tp-lbox__count');
      closeBtn = root.querySelector('.tp-lbox__close');
      prevBtn = root.querySelector('.tp-lbox__prev');
      nextBtn = root.querySelector('.tp-lbox__next');

      root.addEventListener('click', function (e) {
        if (e.target.closest('[data-tp-lb-close]') || e.target.closest('.tp-lbox__close')) close();
        else if (e.target.closest('.tp-lbox__prev')) go(-1);
        else if (e.target.closest('.tp-lbox__next')) go(1);
      });
      root.addEventListener('touchstart', function (e) {
        touchX = e.touches.length === 1 ? e.touches[0].clientX : null;
      }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) < SWIPE_MIN) return;
        // Swiping toward the inline-start edge reveals the next image (left in LTR, right in RTL).
        go((dx < 0) !== isRtl() ? 1 : -1);
      }, { passive: true });
      imgEl.addEventListener('load', function () { root.classList.remove('is-loading'); });
      imgEl.addEventListener('error', function () { root.classList.remove('is-loading'); });
    }

    function describe(a) {
      var thumb = a.querySelector('img');
      var alt = (thumb && thumb.getAttribute('alt')) || '';
      return { src: a.getAttribute('href') || '', caption: alt || a.getAttribute('aria-label') || '', alt: alt };
    }

    function preload(i) {
      if (i < 0 || i >= items.length || items[i].loaded || !items[i].src) return;
      items[i].loaded = true;
      new Image().src = items[i].src;
    }

    function show(i) {
      index = (i + items.length) % items.length;
      var it = items[index];
      root.classList.add('is-loading');
      imgEl.src = it.src;
      imgEl.alt = it.alt;
      it.loaded = true;
      capEl.textContent = it.caption;
      countEl.textContent = items.length > 1 ? index + 1 + s('of') + items.length : '';
      var many = items.length > 1;
      prevBtn.hidden = !many;
      nextBtn.hidden = !many;
      if (many) { preload(index + 1); preload(index - 1); }
    }

    function go(step) {
      if (items.length > 1) show(index + step);
    }

    function isTrigger(a) {
      var href = a.getAttribute('href') || '';
      return IMAGE.test(href);
    }

    // Returns false when the link is not a lightbox entry, so the browser follows it normally.
    function open(trigger) {
      var group = trigger.closest('.tp-lightbox');
      if (!group || !isTrigger(trigger)) return false;
      var seen = {};
      var triggers = [];
      var start = -1;
      // One entry per distinct image: a thumbnail and a "View" button for the same license count once.
      Array.prototype.forEach.call(group.querySelectorAll('a[href]'), function (a) {
        if (!isTrigger(a)) return;
        var src = describe(a).src;
        if (seen[src] === undefined) { seen[src] = triggers.length; triggers.push(a); }
        if (a === trigger) start = seen[src];
      });
      if (start < 0) return false;
      items = triggers.map(describe);

      build();
      opener = trigger;
      savedScroll = window.scrollY;
      root.hidden = false;
      root.setAttribute('dir', document.documentElement.dir || 'ltr');
      document.body.classList.add('tp-is-locked');
      show(start);
      requestAnimationFrame(function () {
        root.classList.add('is-open');
        closeBtn.focus();
      });
      document.addEventListener('keydown', onKeydown);
      return true;
    }

    function close() {
      if (!root || root.hidden) return;
      document.removeEventListener('keydown', onKeydown);
      root.classList.remove('is-open', 'is-loading');
      root.hidden = true;
      imgEl.removeAttribute('src');
      document.body.classList.remove('tp-is-locked');
      // The lock uses overflow:hidden, which keeps the position; restore only if a browser dropped it.
      if (Math.abs(window.scrollY - savedScroll) > 1) window.scrollTo({ top: savedScroll, behavior: 'instant' });
      if (opener) opener.focus({ preventScroll: true });
      opener = null;
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        go((e.key === 'ArrowRight') !== isRtl() ? 1 : -1);
      } else if (e.key === 'Home' && items.length > 1) {
        e.preventDefault();
        show(0);
      } else if (e.key === 'End' && items.length > 1) {
        e.preventDefault();
        show(items.length - 1);
      } else if (e.key === 'Tab') {
        var nodes = Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (n) { return !n.hidden && n.offsetParent !== null; });
        if (!nodes.length) return;
        var first = nodes[0];
        var last = nodes[nodes.length - 1];
        if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    // Delegated: triggers added later (JSON-rendered galleries) work without re-initialising.
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var trigger = e.target.closest && e.target.closest('.tp-lightbox a[href]');
      if (!trigger) return;
      if (open(trigger)) e.preventDefault();
    });

    TP.lightbox = { open: open, close: close };
  })();
})();
