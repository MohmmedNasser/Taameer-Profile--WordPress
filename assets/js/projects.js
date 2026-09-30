/* ==========================================================================
   projects.js — renders project cards into [data-tp-projects] from data/projects.json
   Prototype of the custom Elementor widget "tp-projects-grid" (in WP the cards are rendered by PHP
   from the Project CPT; this file then only handles the Projects page filter in Phase 2).
   Container attributes (map 1:1 to widget controls):
     data-tp-src="data/projects.json"  data-tp-featured="true|false"  data-tp-count="6"
     data-tp-type="construction|renovation-decoration|fit-out|landscaping" (optional)
   Card link: project.html?id=<slug>. Order: completion date, newest first; ongoing first.
   Uses imageMeta for width/height (no layout shift) and the -md srcset when that file exists.
   Language: <html lang> picks the "en"/"ar" string, falling back to "en".
   WP: wp_enqueue_script('tp-projects', …/projects.js, ['tp-animations'], ver, ['strategy' => 'defer']).
   ========================================================================== */
(function () {
  'use strict';

  var TP = (window.TP = window.TP || {});
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var LABELS = {
    en: { ongoing: 'Ongoing', render: '3D Visualization', view: 'View project' }
  };

  function t(field) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field.en || '';
  }

  function label(key) {
    return (LABELS[lang] || LABELS.en)[key];
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function img(path, meta, alt, sizes) {
    var m = meta[path] || [];
    var attrs = 'src="' + path + '" alt="' + escapeHtml(alt) + '" loading="lazy" decoding="async"';
    if (m[0]) attrs += ' width="' + m[0] + '" height="' + m[1] + '"';
    if (m[2]) {
      var md = path.replace(/\.webp$/, '-md.webp');
      attrs += ' srcset="' + md + ' 900w, ' + path + ' ' + m[0] + 'w" sizes="' + sizes + '"';
    }
    return '<img class="tp-card__img" ' + attrs + '>';
  }

  function card(p, data) {
    var year = p.completion ? p.completion.slice(0, 4) : '';
    var typeLabel = t((data.types || {})[p.type]);
    var badges = '';
    if (p.status === 'ongoing') badges += '<span class="tp-badge">' + label('ongoing') + '</span>';
    if (p.isRender) badges += '<span class="tp-badge">' + label('render') + '</span>';
    var when = p.status === 'ongoing' ? label('ongoing') : year;
    var alt = t(p.title) + ', ' + t(p.location);

    return (
      '<article class="tp-project">' +
        '<a class="tp-card" href="project.html?id=' + encodeURIComponent(p.id) + '">' +
          '<div class="tp-card__media">' +
            img(p.cover, data.imageMeta || {}, alt, '(min-width: 64em) 55vw, (min-width: 40em) 50vw, 100vw') +
            (badges ? '<div class="tp-card__badges">' + badges + '</div>' : '') +
          '</div>' +
          '<p class="tp-card__meta"><span>' + escapeHtml(typeLabel) + '</span><span>' + escapeHtml(when) + '</span></p>' +
          '<h3 class="tp-card__title">' + escapeHtml(t(p.title)) + '</h3>' +
          '<p class="tp-card__location">' + escapeHtml(t(p.location)) + '</p>' +
          '<span class="tp-card__more">' + label('view') +
            ' <svg aria-hidden="true" width="20" height="20"><use href="#tp-i-arrow"/></svg></span>' +
        '</a>' +
      '</article>'
    );
  }

  function sortKey(p) {
    return p.status === 'ongoing' ? '9999-99' : p.completion || '0000-00';
  }

  function render(container, data) {
    var featured = container.dataset.tpFeatured === 'true';
    var type = container.dataset.tpType;
    var count = parseInt(container.dataset.tpCount, 10) || Infinity;

    var list = (data.projects || []).filter(function (p) {
      if (p.type === 'showcase') return false;
      if (featured && !p.featured) return false;
      if (type && p.type !== type) return false;
      return true;
    });
    list.sort(function (a, b) { return sortKey(b).localeCompare(sortKey(a)); });
    list = list.slice(0, count);

    container.innerHTML = list.map(function (p) { return card(p, data); }).join('');
    container.classList.add('tp-stagger');
    if (TP.refreshAnimations) TP.refreshAnimations(container.parentNode);
  }

  // Cache the JSON between widgets on the same page.
  var cache = {};
  function load(src) {
    if (!cache[src]) {
      cache[src] = fetch(src).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + src);
        return r.json();
      });
    }
    return cache[src];
  }

  function init() {
    document.querySelectorAll('[data-tp-projects]').forEach(function (container) {
      var src = container.dataset.tpSrc || 'data/projects.json';
      load(src)
        .then(function (data) { render(container, data); })
        .catch(function (err) {
          // Keep the server-rendered fallback link (file:// or network failure).
          if (window.console) console.warn('[tp-projects] ' + err.message + ' — serve the site with `npx serve .`');
        });
    });
  }

  TP.projects = { load: load, render: render };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
