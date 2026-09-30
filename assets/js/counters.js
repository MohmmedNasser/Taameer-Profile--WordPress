/* ==========================================================================
   counters.js — count-up numbers for .tp-counter
   Attributes: data-tp-target (required), data-tp-from (default 0), data-tp-prefix, data-tp-suffix.
   The element's server-rendered text is the final value, so no-JS / reduced-motion users see it as is.
   Exposes window.TP.counter(el); animations.js calls it when the element enters the viewport.
   WP: wp_enqueue_script('tp-counters', …/counters.js, [], ver, ['strategy' => 'defer']) — before tp-animations.
   ========================================================================== */
(function () {
  'use strict';

  var TP = (window.TP = window.TP || {});
  var DURATION = 1800;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  TP.counter = function (el) {
    if (el.dataset.tpCounted) return;
    el.dataset.tpCounted = 'true';

    var target = parseFloat(el.dataset.tpTarget);
    if (isNaN(target)) return;
    var from = parseFloat(el.dataset.tpFrom) || 0;
    var prefix = el.dataset.tpPrefix || '';
    var suffix = el.dataset.tpSuffix || '';
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
