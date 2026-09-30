/* ==========================================================================
   lightbox.js — accessible image lightbox for galleries, licenses, appreciation letters, wall cladding
   Trigger: any <a data-tp-lightbox="group-name" href="full-image.webp"> (delegated, so triggers added later
   by JSON-rendered widgets work too). Triggers with the same group name form one gallery, in DOM order.
     data-caption   caption (falls back to the thumbnail's alt, then aria-label)
     href="x.pdf" + data-image="x.webp"   PDF documents (licenses): the dialog shows the image rendition and a
                                          "View PDF" link; without JS the link simply opens the PDF.
     data-pdf       PDF link for an image href
   Behaviour: role="dialog" aria-modal="true" labelled by the caption; Esc closes; ← → navigate (mirrored when
   <html dir="rtl">); Tab is trapped; focus returns to the trigger; swipe on touch (direction mirrored in RTL);
   counter "3 / 8"; only the next and previous images are preloaded; body scroll locked while open and the
   scroll position restored on close. Transitions are CSS-only and disabled under prefers-reduced-motion.
   Uses the icon sprite symbols #tp-i-plus and #tp-i-arrow. Styles: lightbox.css.
   WP: wp_enqueue_script('tp-lightbox', …/lightbox.js, [], ver, ['strategy' => 'defer']) + style 'tp-lightbox'
       on pages that contain triggers (project single, About licenses, Services, Testimonials).
   ========================================================================== */
(function () {
  'use strict';

  var TP = (window.TP = window.TP || {});
  var LABELS = { close: 'Close', prev: 'Previous image', next: 'Next image', pdf: 'View PDF', viewer: 'Image viewer', of: ' / ' };
  var FOCUSABLE = 'a[href], button:not([disabled])';
  var SWIPE_MIN = 48;

  var root, imgEl, capEl, countEl, pdfEl, prevBtn, nextBtn, closeBtn;
  var items = [];
  var index = 0;
  var opener = null;
  var savedScroll = 0;
  var touchX = null;

  function isRtl() {
    return document.documentElement.dir === 'rtl' || getComputedStyle(document.documentElement).direction === 'rtl';
  }

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'tp-lightbox';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'tp-lightbox-caption');
    root.innerHTML =
      '<div class="tp-lightbox__backdrop" data-tp-lb-close></div>' +
      '<figure class="tp-lightbox__fig">' +
        '<img class="tp-lightbox__img" alt="">' +
        '<figcaption class="tp-lightbox__bar">' +
          '<span class="tp-lightbox__caption" id="tp-lightbox-caption"></span>' +
          '<span class="tp-lightbox__meta">' +
            '<a class="tp-lightbox__pdf tp-link" href="#" target="_blank" rel="noopener" hidden>' + LABELS.pdf +
              '<span class="tp-visually-hidden"> (opens in a new tab)</span></a>' +
            '<span class="tp-lightbox__count" aria-live="polite"></span>' +
          '</span>' +
        '</figcaption>' +
      '</figure>' +
      '<button class="tp-lightbox__btn tp-lightbox__close" type="button" aria-label="' + LABELS.close + '">' +
        '<svg aria-hidden="true" width="20" height="20"><use href="#tp-i-plus"/></svg></button>' +
      '<button class="tp-lightbox__btn tp-lightbox__prev" type="button" aria-label="' + LABELS.prev + '">' +
        '<svg aria-hidden="true" width="24" height="24"><use href="#tp-i-arrow"/></svg></button>' +
      '<button class="tp-lightbox__btn tp-lightbox__next" type="button" aria-label="' + LABELS.next + '">' +
        '<svg aria-hidden="true" width="24" height="24"><use href="#tp-i-arrow"/></svg></button>';
    document.body.appendChild(root);

    imgEl = root.querySelector('.tp-lightbox__img');
    capEl = root.querySelector('.tp-lightbox__caption');
    countEl = root.querySelector('.tp-lightbox__count');
    pdfEl = root.querySelector('.tp-lightbox__pdf');
    closeBtn = root.querySelector('.tp-lightbox__close');
    prevBtn = root.querySelector('.tp-lightbox__prev');
    nextBtn = root.querySelector('.tp-lightbox__next');

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-tp-lb-close]') || e.target.closest('.tp-lightbox__close')) close();
      else if (e.target.closest('.tp-lightbox__prev')) go(-1);
      else if (e.target.closest('.tp-lightbox__next')) go(1);
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
    var href = a.getAttribute('href') || '';
    var isPdf = /\.pdf(\?|#|$)/i.test(href);
    var thumb = a.querySelector('img');
    return {
      src: isPdf ? a.getAttribute('data-image') || '' : href,
      pdf: isPdf ? href : a.getAttribute('data-pdf') || '',
      caption: a.getAttribute('data-caption') || (thumb && thumb.getAttribute('alt')) || a.getAttribute('aria-label') || '',
      alt: (thumb && thumb.getAttribute('alt')) || a.getAttribute('data-caption') || ''
    };
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
    countEl.textContent = items.length > 1 ? index + 1 + LABELS.of + items.length : '';
    if (it.pdf) { pdfEl.href = it.pdf; pdfEl.hidden = false; } else { pdfEl.hidden = true; }
    var many = items.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
    if (many) { preload(index + 1); preload(index - 1); }
  }

  function go(step) {
    if (items.length > 1) show(index + step);
  }

  function open(trigger) {
    var group = trigger.getAttribute('data-tp-lightbox');
    var seen = {};
    var triggers = [];
    var start = -1;
    // One entry per distinct image: a thumbnail and a "View" button for the same license count once.
    Array.prototype.forEach.call(document.querySelectorAll('[data-tp-lightbox]'), function (a) {
      if (a.getAttribute('data-tp-lightbox') !== group) return;
      var src = describe(a).src;
      if (!src) return;
      if (seen[src] === undefined) { seen[src] = triggers.length; triggers.push(a); }
      if (a === trigger) start = seen[src];
    });
    if (start < 0) return;
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
      var forward = e.key === 'ArrowRight';
      go(forward !== isRtl() ? 1 : -1);
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

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var trigger = e.target.closest && e.target.closest('[data-tp-lightbox]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });

  TP.lightbox = { open: open, close: close };
})();
