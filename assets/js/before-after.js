/* ==========================================================================
   before-after.js — comparison slider for [data-tp-ba] (custom widget "tp-before-after")
   The position lives in one CSS custom property (--tp-ba-pos, % from the inline-start edge);
   CSS clips the "before" layer and places the handle, so RTL needs no JS branch except for
   converting pointer X and arrow keys into inline-start distance.
   Input: pointer (mouse/pen/touch; vertical page scroll still works via touch-action: pan-y),
          keyboard on the role="slider" handle: ←/→ (visual direction), ↑/↓, PageUp/PageDown, Home/End.
   WP: wp_enqueue_script('tp-before-after', …/before-after.js, [], ver, ['strategy' => 'defer']).
   ========================================================================== */
(function () {
  'use strict';

  var STEP = 2;
  var BIG_STEP = 10;

  function isRtl(el) {
    return getComputedStyle(el).direction === 'rtl';
  }

  function init(root) {
    var handle = root.querySelector('.tp-ba__handle');
    if (!handle) return;
    var start = parseFloat(root.dataset.tpStart);
    var pos = isNaN(start) ? parseFloat(getComputedStyle(root).getPropertyValue('--tp-ba-pos')) || 50 : start;
    var dragging = false;

    function set(value) {
      pos = Math.max(0, Math.min(100, value));
      root.style.setProperty('--tp-ba-pos', pos + '%');
      var rounded = Math.round(pos);
      handle.setAttribute('aria-valuenow', rounded);
      handle.setAttribute('aria-valuetext', rounded + '% before image shown');
    }

    // Pointer X → percentage from the inline-start edge (the right edge in RTL).
    function fromPointer(clientX) {
      var rect = root.getBoundingClientRect();
      var fromStart = isRtl(root) ? rect.right - clientX : clientX - rect.left;
      set((fromStart / rect.width) * 100);
    }

    root.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      root.setPointerCapture(e.pointerId);
      fromPointer(e.clientX);
      handle.focus({ preventScroll: true });
    });

    root.addEventListener('pointermove', function (e) {
      if (dragging) fromPointer(e.clientX);
    });

    function stop(e) {
      dragging = false;
      if (root.hasPointerCapture && root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
    }
    root.addEventListener('pointerup', stop);
    root.addEventListener('pointercancel', stop);

    handle.addEventListener('keydown', function (e) {
      // ArrowRight moves the divider visually right: toward the end edge in LTR, the start edge in RTL.
      var rightward = isRtl(root) ? -1 : 1;
      var delta = {
        ArrowRight: STEP * rightward,
        ArrowLeft: -STEP * rightward,
        ArrowUp: STEP,
        ArrowDown: -STEP,
        PageUp: BIG_STEP,
        PageDown: -BIG_STEP
      }[e.key];

      if (e.key === 'Home') set(0);
      else if (e.key === 'End') set(100);
      else if (delta !== undefined) set(pos + delta);
      else return;
      e.preventDefault();
    });

    set(pos);
  }

  function boot() {
    document.querySelectorAll('[data-tp-ba]').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
