# Progress log

One entry per completed task, newest on top. Format: Did / Files / Issues / Next.

### 2026-10-01 — Phase 2B · Part D: contact.html
- Did: page hero with the website's contact intro; contact details from `data/site.json` (address, office and mobile `tel:`, `mailto:`, WhatsApp, Instagram; no office hours); location block with the "+" motif and an "Open in Google Maps" button (no iframe); form (name, email, phone, project type = 6 services + Other, message, honeypot) with native constraints, inline errors linked by `aria-describedby`, `role="alert"` summary, focus to the first invalid field, success state, nothing sent (`contact-form.js`, PROTOTYPE ONLY). `GeneralContractor` JSON-LD on contact.html and index.html (parsed with `json.loads`).
- Verified: projects-test contact block 7/7; check-partials OK.
- Questions: success-message wording and whether the form should also reach a CRM; office hours.
- Next: Part E 404.html.

### 2026-10-01 — Phase 2B · Part C: testimonials.html
- Did: page hero; 4 editorial letter rows written in plain HTML (company, author, title, date, excerpt, link to the related project where set, original letter as a prominent framed sheet with "View original letter" opening the lightbox as one group of 4); rows alternate sides on desktop; Jan's Noodles shows only the company name and its letter (no excerpt, nothing invented); shared CTA. Each letter has an id (`#atlas-copco`…) used by the project page's testimonial link.
- Verified: projects-test testimonials block 4/4; check-partials OK.
- Next: Part D contact.html.

### 2026-10-01 — Phase 2B · Part B: project.html
- Did: single template for `?id=<slug>` filled by `project-page.js` (PROTOTYPE ONLY): not-found state in the hero (message, links to Projects and Home, `noindex`, no redirect; also for missing id and the showcase), title/description/OG from the data, spec block, cover (framed below 1200px or portrait, capped at 80vh, never upscaled), 3D Visualization notice, CSS-columns masonry gallery in one lightbox group, before/after only with a before image, related testimonial, previous/next in Projects-grid order with wrapping, up to 3 related projects. Templates for spec rows and gallery items. `projects.js` `render` accepts options instead of mutating data attributes. All card links already use `project.html?id=<slug>` (verified in Home, Services, Projects).
- Verified: `projects-test.mjs` ids/detail/notfound blocks all PASS: all 22 ids render one H1, title, full gallery and no console errors.
- Next: Part C testimonials.html.

### 2026-10-01 — Phase 2B · Part A: projects.html
- Did: page hero ("Our Projects", intro from the website's portfolio text); filter bar (All / Construction / Renovation & Decoration / Fit-out / Landscaping with counts, `aria-pressed`, visually hidden `aria-live` "Showing N projects"); `?type=` read on load and written with `history.replaceState`; 22 project cards (showcase excluded) ordered ongoing first then newest completion; FLIP filter animation with the Web Animations API (instant under reduced motion; grid keeps its height during the move); cards cloned from `<template id="tp-project-card">`; "Team experience" section (About component and framing) below the grid; shared CTA. Even-column grid `tp-projects-grid--even` so hiding items never leaves gaps in the 7/5 rhythm.
- Verified: `scripts/projects-test.mjs` filter block 20/20 (counts, ARIA, live region, URL state, invalid type, keyboard, no scroll jump, reduced motion, RTL); check-partials OK.
- Files: projects.html, assets/css/theme.css, assets/css/inner-pages.css, assets/js/interactions.js (filter), scripts/projects-test.mjs, docs/wp-mapping.md.
- Next: Part B project.html.

### 2026-10-01 — Phase 2B · Part 0: align with Elementor v4 (PRD v1.5)
- Did: header is now solid, sticky and in flow (transparent state, scrolled class, backdrop-filter and all hero top-padding compensation removed). Front end reorganised to the four theme files: new `theme.css` (header, menu, footer, WhatsApp, lightbox dialog, before/after handle, scroll-nav chips; filter bar added in Part A), new `interactions.js` (menu, lightbox, before/after, scrollspy, filter in one IIFE, each activated by class), `counters.js` merged into `animations.js`; header/lightbox/before-after/service-nav/counters scripts and lightbox.css deleted. tokens/base/layout/components/inner-pages marked `ELEMENTOR SOURCE`; `projects.js` marked `PROTOTYPE ONLY` and now clones `<template id="tp-project-card">` (added to Home and Services). Behaviours run from plain markup: `.tp-lightbox` container, `.tp-before-after` two images (JS builds the handle), `.tp-scrollspy`, counters read the number from the text. Dialog classes renamed `tp-lbox*`. Direction audit: `-rtl` classes for the 4 classes with physical values. Heading classes `tp-h1`–`tp-h4` (explicit colour). Every `ELEMENTOR:` comment on Home/About/Services replaced by ATOMIC / THEME / INTERACTION / REPORT. `docs/elementor-mapping.md` replaced by `docs/wp-mapping.md` (destinations, atomic trees, responsive notes, generated master tables: 135 variables, 269 global-class rules). CLAUDE.md rules and D-031 updated.
- Verified: check-partials OK; contrast 0 failing; interaction-test all PASS (menu, slider LTR/RTL, lightbox LTR/RTL, licenses, scroll-nav, related projects); screenshots of Home/About/Services (375/768/1280/1920 LTR+RTL+reduced) with 0 console issues and no overflow.
- Issues: the header menu toggle needs JS but is not in E2; list/dl semantics, the marquee and the services hover image swap are not atomic (REPORT items in docs/wp-mapping.md).
- Next: Part A projects.html.

### 2026-09-30 — Decision: Elementor v4 (Atomic) page building
- Did: recorded the move to Elementor v4 atomic elements in CLAUDE.md, docs/decisions.md (D-030) and docs/PRD.md (v1.3: scope 4.1, 8.1, 8.2 rewritten, 8.3, 9, 11, Phase 4, risks, change log). No other content changed.
- Note: the PRD was already at 1.3 (Homepage approved), so the change extends the 1.3 row instead of adding a second 1.3.

### 2026-09-30 — Phase 2A · Part D: services.html
- Did: page hero; sticky scrollable chip navigation (service-nav.js, IntersectionObserver, aria-current="true"); 6 alternating service blocks with anchor ids matching the homepage/footer links (no homepage change needed); website text + PDF paragraphs (Construction, Design & Build, Turnkey); related projects (projects.js `data-tp-service`, mapping in site.json, D-027); wall cladding showcase (6 images, lightbox); shared CTA.
- Verified: interaction tests (chip keyboard activation, sticky offsets, highlight on scroll, related 3/3/3 and none for Design & Build / Maintenance / Turnkey); screenshots 375/768/1280/1920 LTR + RTL → source/screenshots/phase-2/; 0 console issues, no overflow.
- Issues: all 6 wall-cladding photos are small (383–768px): shown as 4:3 thumbnails and never upscaled in the lightbox.

### 2026-09-30 — Phase 2A · Part C: about.html
- Did: page hero; full chairman's message (editorial, sticky portrait); About Us with highlighted 2015 fact; 4 aims; Why choose us; leadership (`tp-team`) + philosophy; team experience (`tp-exp`, labelled prior experience); 14-logo partner grid; two license cards with fields as text and lightbox/PDF; shared CTA.
- License fields were read from the license scans (D-029).
- Files: about.html, assets/css/inner-pages.css, data/site.json (licenses), assets/docs/license-*.pdf.

### 2026-09-30 — Phase 2A · Part B: shared inner-page components
- Did: PARTIAL markers (sprite/header/footer/whatsapp/cta) + `scripts/check-partials.py` (D-026); `aria-current` in header, mobile menu and footer; `tp-page-hero` + breadcrumbs; `lightbox.js/.css` (dialog, Esc, arrows mirrored in RTL, focus trap + return, swipe, counter, next/prev preload only, scroll lock, reduced motion, PDF rendition + View PDF); shared CTA marked as a partial; per-page SEO head pattern (D-025), index.html's live hreflang converted to comments; CLAUDE.md rules 14–15; interaction-test.mjs extended.

### 2026-09-30 — Phase 2A · Part A: Official brand locked in
- Did: created git tag `v1-bronze` (it did not exist), merged brand-official.css into tokens.css, deleted bronze/official/overrides CSS, switcher JS/CSS, first-paint script, `data-brand`, Cormorant + Manrope, brand-compare.mjs, brand-style-diff.mjs. Renamed docs/brand-official.md → docs/brand.md; updated CLAUDE.md, elementor-mapping.md, contrast.py (reads tokens.css).
- Verified: contrast 0 failing; validate-tokens 0 violations; interaction-test all PASS; homepage screenshots (375/768/1280/1920 LTR+RTL+reduced) in source/screenshots/phase-2/, 0 console issues, no overflow; pixel diff vs brand-compare/official-* differs only where scroll/animation state differs (accordion image mid-crossfade).
- Housekeeping: `git worktree prune` + `git worktree list` → only the main worktree; no stale worktree registered.
- Issues: playwright 1.63 copy in npm-cache `_npx/e41f203b7505f1fb` matches installed browsers (1.61 copy does not).

### 2026-09-30 — Official brand variant + review switcher
- Did: git init, commit `Phase 1: bronze design (v1)`, tag `v1-bronze`. Extracted the taameer.ae identity (docs/brand-official.md). Audit: the CSS had no hard-coded colours, font names, shadows, radii or durations (grep of base/layout/components/animations found only `transparent`, `currentColor` and the `--tp-mask-solid` token); the only findings were two token-usage bugs in `.tp-fab` (foreground `--tp-color-text` on the accent fill; hover swapping text/bg instead of the button-hover tokens), fixed with unchanged bronze values. Split tokens into `tokens.css` (shared) + `brands/brand-bronze.css` (moved unchanged) + `brands/brand-official.css` + empty `brand-official-overrides.css`. Review switcher: `brand-switcher.js/.css` (REVIEW ONLY); a head script applies `?brand=` / the saved choice before first paint. `contrast.py` takes a brand argument. New `scripts/brand-compare.mjs`.
- Verified: bronze vs `v1-bronze` tag = 0 computed-style differences on 506 elements (full-page pixel diffs differ only through marquee/animation timing); 12 screenshots (both brands × 375/768/1280/1920, plus RTL at 375/1280) in source/screenshots/brand-compare/ with no console errors, no horizontal overflow, `data-brand` set before DOMContentLoaded; official contrast 0 failing pairs; RTL mirrors in both brands.
- Files: assets/css/tokens.css, assets/css/brands/*, assets/css/brand-switcher.css, assets/js/brand-switcher.js, index.html, components.css (2 lines), scripts/contrast.py, scripts/brand-compare.mjs, docs/*
- Issues: Phase 2 pages must copy the `data-brand` attribute, the head script and the brand `<link>`s from index.html. Both font families load until the client chooses (D-022).
- Next: client chooses bronze or official; then delete the other brand file, the switcher (js, css, head script, link/script tags) and unused font families. Phase 2 not started.

### 2026-09-30 — QA pass (Phase 1 verification)
- Did: scripts/screenshot.mjs (Playwright: 375/768/1280/1920 LTR + RTL injected at runtime + reduced motion; console, network and overflow checks) → source/screenshots/phase-1/. scripts/interaction-test.mjs (17 checks: skip link, menu open/cover/focus/trap/Esc, before-after keys + pointer in LTR and RTL). Token validator (design-system skill) 0 violations; contrast 0 failing pairs.
- Bugs found and fixed: icon sprite `<svg hidden>` displayed (base `svg{display:block}` beat `hidden`) → global `[hidden]` rule; `tp-img-reveal` never revealed (Chrome IO ignores fully clipped targets) → observe the parent; `tp-split` put the superscript "+" on its own line → decorations join the current line; frame images not filling aspect-ratio boxes → absolute fill; mobile menu trapped in header by `backdrop-filter` → removed while open (D-018); wrong alt text on gym photos; invented heading replaced (D-016).
- Files: scripts/screenshot.mjs, scripts/interaction-test.mjs, assets/css/*, assets/js/*, index.html
- Issues: English copy under dir="rtl" shows expected bidi punctuation shifts (".since 2015", "+100") — disappears with Arabic copy (Phase 3). Full-page screenshots show fixed elements (header, skip link) where the capture was stitched — artifact only.
- Questions for client (Phase 1): (1) vector logo (SVG/AI/PDF); (2) original high-res photos — Palm Jumeirah hero is only 576px, 108 of 191 images < 1200px; unwatermarked Jumeirah Golf photos; (3) confirm relatedProject links for Atlas Copco and Bella Cure letters; which project was Jan's Noodles (Thai restaurant, Deira?); any text version of that letter; (4) the "R" monogram partner logo — company name for alt text; (5) review of edited copy (content-corrections.md), incl. "Al-Ali"/"Al-Otaibi" spelling; (6) the site's services banner and hero background return 404 — do originals exist?; (7) office hours; (8) partner logos linked or not.
- Next: Phase 2 (after client approval of the homepage)

### 2026-09-30 — English homepage (index.html)
- Did: 13 sections per brief §9 with ELEMENTOR annotations; header (transparent → solid, mobile overlay menu), hero, partners marquee, about + stats, chairman quote, services list, why us, featured projects (JSON), before/after, letters, CTA, footer, WhatsApp FAB.
- Files: index.html, docs/elementor-mapping.md
- Next: QA

### 2026-09-30 — JS: animations, counters, header, projects, before-after
- Did: 5 standalone IIFE `defer` scripts, only global `window.TP`; class-driven animation system (one IntersectionObserver, rAF parallax, line split, marquee clone); `data-tp-from` added to counters (2015 counts up from 1990 rather than 0).
- Files: assets/js/*.js
- Next: homepage markup

### 2026-09-30 — CSS design system
- Did: tokens.css (primitive → semantic → component layers), base, layout (Elementor container mirror), components (all homepage blocks, one marked [dir="rtl"] block), animations (reduced-motion safe). Contrast script + adjustments (D-013). Design direction (D-014) after loading frontend-design, ui-ux-pro-max and design-system skills.
- Files: assets/css/*.css, scripts/contrast.py
- Next: JS

### 2026-09-30 — Data files
- Did: data/projects.json (22 projects + Wall Cladding showcase + 4 teamExperience, website facts applied, 6 featured), team.json (3, website bios), testimonials.json (4; Jan's Noodles image-only), site.json (contact, nav, stats, whyUs, 6 services with photos, 14 partners). scripts/image_meta.py fills `imageMeta` ([w, h, hasMd]) for JS-rendered images.
- Files: data/*.json, scripts/image_meta.py
- Issues: added `description` field (PRD 6.1) and `types` label map beyond the brief's field list. Testimonial→project links inferred from dates (Atlas Copco Aug 2023; Bella Cure Nov 2022) — client to confirm.
- Next: design tokens + base CSS

### 2026-09-30 — Merge website images with PDF exports
- Did: scripts/build_site_images.py — site project photos (1200px) replace PDF copies (~450–600px); PDF-only photos appended after crop-tolerant hash matching + a manual duplicate list (verified visually); team portraits from site; licenses rendered from the site's renewed vector PDFs; 14 partner logos (7 black-box logos knocked out to transparency); Perfume Shop gallery added. Regenerates docs/image-map.md.
- Files: scripts/build_site_images.py, assets/img/*, source/site/export-manifest.json, docs/image-map.md
- Issues: 191 final images, 108 below 1200px (all PDF-only projects, chairman, team, logos). Site Jumeirah Golf photos carry a faint "TAAMEER" watermark (kept: 2x resolution). Palm Jumeirah (hero) exists only in the PDF at ~576px.
- Next: data files

### 2026-09-30 — Mirror taameer.ae
- Did: scripts/fetch_site.py (polite sequential crawl, retries, custom UA — host returns 406 to urllib default); 111 files into source/site/ incl. 13 project galleries (from the inline `projectGalleries` JS map + probing), team, chairman, landmarks, 14 partners, logos, service icons, 2 license PDFs, profile PDF. scripts/site_to_text.py → source/site-content.md.
- Files: scripts/fetch_site.py, scripts/site_to_text.py, source/site/*, source/site-content.md
- Issues: images/hero/background.jpg and images/services/banner.jpg are referenced but 404. The site has no letter images (section empty). Site profile PDF = same text on all 37 pages as ours, recompressed (5.0 MB vs 12.2 MB). Licenses: Contracting 741846 renewed to 06/09/2027 (PDF copy: 06/09/2026, expired); Carpentry 1314264 unchanged, expires 18/02/2027.
- Next: merge images

### 2026-09-30 — Finish PDF WebP export
- Did: added `--export` flag to extract_pdf.py (skips text/raw dump); renamed slug al-amir-villas → al-awir-villas (D-002); exported all 130 PDF images to assets/img/ (+ -md where > 900px); wrote source/extracted/manifest.json.
- Files: scripts/extract_pdf.py, assets/img/*, source/extracted/manifest.json
- Issues: 122 of 130 images are below 1200px wide (PDF embeds downsampled photos). Rasterized: p8 licenses, p35–36 letters (300 DPI crops); p22–24 collages split by gutter boxes.
- Next: fetch website assets (scripts/fetch_site.py)

### 2026-09-30 — Docs skeleton
- Did: created the docs system (this file, decisions, image-map, image-credits, content-corrections, elementor-mapping) and README; updated CLAUDE.md summary to reflect PRD v1.2 (two sources).
- Files: docs/*.md, README.md, CLAUDE.md
- Issues: none
- Next: finish PDF image export

### 2026-09-30 — PDF text + raw image extraction (earlier session)
- Did: wrote scripts/extract_pdf.py; extracted text to source/pdf-text.md; dumped 146 native images + 5 300-DPI renders (licenses p8, letters p35–36) to source/extracted/. WebP export stopped midway (92 files, up to Wadi Alshabak).
- Files: scripts/extract_pdf.py, source/pdf-text.md, source/extracted/*
- Issues: session interrupted before export finished and before any docs were written
- Next: finish export

### 2026-09-30 — Scaffold + CLAUDE.md (earlier session)
- Did: folder structure, CLAUDE.md
- Files: CLAUDE.md, folders
