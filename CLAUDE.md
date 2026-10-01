# CLAUDE.md — Taameer Plus static prototype

> **What to build lives in [docs/PRD.md](docs/PRD.md) (source of truth). This file covers *how*.** Do not copy PRD content here; if this file and the PRD disagree, stop and ask.

## Project summary
A static HTML/CSS/JS prototype of the bilingual (EN default / AR RTL) corporate site for **Taameer Plus Contracting LLC** (Dubai contractor). Content comes from two client-approved sources: the PDF company profile (`source/pdf-text.md`) and the current site taameer.ae (`source/site-content.md`), which is newer and **wins on facts and wording**; the PDF supplies everything the site lacks. It will later be ported to a **Hello Elementor child theme** (Elementor Free + Polylang) on LocalWP. Every structural choice here exists so that port is mechanical.

## Working rules (every session)
1. **No sub-agents.** Never spawn Task/Agent tools or parallel agents. Work sequentially in the main session.
2. **Save tokens.** Never re-read the PDF or re-download the site. Content comes from `source/pdf-text.md` + `source/site-content.md`; image facts from `docs/image-map.md`. Read only the line ranges you need of large files.
3. **Document as you go.** After *each* task: append to `docs/progress-log.md` (newest on top), add non-obvious choices to `docs/decisions.md`, add new sections to `docs/wp-mapping.md`, and update **Current state** below.
4. **Use all content from both sources.** Every image and datum in the PDF and on taameer.ae is client-approved. Same image in both → keep the higher resolution. Never invent services, projects, clients, numbers or claims.
5. **Stock only for gaps** (Unsplash → Pexels → Pixabay), downloaded locally, logged in `docs/image-credits.md`. Never hotlink. Never replace a usable client image.
6. **Text corrections** fix spelling/grammar/formatting only, never facts. The full list lives in [docs/content-corrections.md](docs/content-corrections.md); apply it everywhere and log new ones there.

## Technical rules (non-negotiable)
1. **No frameworks, libraries or build step.** Vanilla HTML/CSS/JS. No Tailwind, jQuery, GSAP, Swiper, or npm runtime deps.
2. **Plain `defer` scripts, not ES modules.** Each JS file is a standalone IIFE, enqueueable with `wp_enqueue_script`. The only global is `window.TP`.
3. **CSS logical properties only** (`margin-inline-start`, `inset-inline-end`, `text-align: start`…). Never `left`/`right` for layout. Unavoidable direction rules go in a marked `[dir="rtl"]` block.
4. **BEM with `tp-` prefix**: `tp-hero`, `tp-hero__title`, `tp-card--featured`.
5. **Elementor structure**: `<section class="tp-section …"> → <div class="tp-container"> → blocks`. Layouts must be buildable with Flexbox Containers. CSS Grid is prototype-only: the WordPress build uses atomic elements, no custom widgets (see Elementor v4 build).
6. **Annotate every section** (no `ELEMENTOR:` comments any more): `<!-- ATOMIC: Flexbox > Heading(.tp-h2) + Paragraph(.tp-lead) + Button(.tp-btn) -->` (element tree + global classes), `<!-- THEME: header.php | footer.php | archive-project.php | single-project.php | 404.php -->`, `<!-- INTERACTION: tp-lightbox (interactions.js) -->` next to either, and `<!-- REPORT: … -->` for anything atomic elements cannot express that E1–E3 do not cover (collected for the owner). Every section maps to exactly one destination (Atomic / Theme / Interaction / Report) in `docs/wp-mapping.md`.
7. **All design values are tokens**, all in `assets/css/tokens.css` (primitive/semantic brand values, then shared scales, then the component layer). No hard-coded colors/fonts/spacing/radii/shadows/durations in component CSS. One brand only: the taameer.ae identity on a light layout (`docs/brand.md`). The earlier warm-bronze design is recoverable via git tag `v1-bronze`; there is no brand switcher and no `data-brand` attribute.
8. **Animation is class-driven** (below). No JS that targets elements by ID for animation.
9. **Accessibility**: landmarks, one `<h1>` per page, visible focus, alt on every image, keyboard-operable widgets, WCAG AA contrast, full `prefers-reduced-motion`.
10. **Performance**: `width`/`height` on every `<img>`, `loading="lazy"` below the fold, `srcset` with `-md` variant, `fetchpriority="high"` on the hero image.
11. **Relative paths only.**
12. JSON-rendered data needs a local server: `npx serve .` (see README).
13. Every CSS/JS file starts with a header comment: purpose, components using it, WP notes. Source styles (`tokens`, `base`, `layout`, `components`, `inner-pages`) begin with `/* ELEMENTOR SOURCE — recreated as global variables/classes, not shipped */`; JS that renders JSON on atomic pages or validates a form begins with `/* PROTOTYPE ONLY */`. JS-rendered components clone a `<template>` that holds the markup (so PHP can copy it).
13a. **Header** is solid and sticky on every page (not transparent, no overlay, no hero top-padding compensation). **Direction-neutral classes**: physical values live only in `[dir="rtl"]` rules paired with `-rtl` suffixed classes (list in `docs/wp-mapping.md`). Behaviours activate by class only (`tp-lightbox`, `tp-before-after`, `tp-scrollspy`, `tp-filter`).
14. **Partials.** Every page carries the sprite, header (with skip link), footer, WhatsApp button and CTA band literally, wrapped in `<!-- PARTIAL:name START/END -->` (they become `header.php`/`footer.php`). Run `python scripts/check-partials.py` after every page; only the active nav state (`aria-current="page"`, header nav + mobile menu + footer quick links) and the language-switcher target may differ. Copy the blocks from index.html.
15. **Per-page SEO head** (copy from about.html): unique `<title>` (page — brand) and meta description (>= 60 chars), Open Graph (`og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:image`) + `twitter:card`, and a *commented* canonical/hreflang block with the final URLs (filled in Phase 3 / WordPress; never a live link before then). Inner pages load `inner-pages.css`; pages with galleries/licenses/letters also `lightbox.css` + `lightbox.js` (triggers: `<a data-tp-lightbox="group" href="full.webp" data-caption="…">`).

## Design tokens (summary — see `assets/css/tokens.css`)
- Light, architectural, restrained. **No dark mode, no dark sections** (footer too). Ink = text, lines and button fills.
- Colors (monochrome ink/grey/white): `--tp-color-bg #FFF`, `-surface #FFF`, `-sand #F4F4F4`, `-stone #D9D9D9`, `-accent #0D0D0D` (ink: marks, hairlines, button fills), `-accent-text #262626`, `-secondary #595959`, `-text #0D0D0D`, `-text-muted #595959`. Contrast: `python scripts/contrast.py` (0 failing), `docs/decisions.md`.
- Fonts: EN display **Playfair Display** (400–600, weight token 500), EN body **Inter** (400–600); AR display **Noto Kufi Arabic**, AR body **IBM Plex Sans Arabic** (tokens only until Phase 3).
- Fluid type via `clamp()`; radii 2–10px; neutral soft shadows; "+" logo motif for markers, bullets, separators and hover cues.
- Signature: ink "+" setting-out marks on framed images (`.tp-frame`), drawing title-block facts (`.tp-spec`). Tokens have 3 layers (primitive → semantic → component); `validate-tokens.cjs` from the design-system skill must report 0 violations.

## Elementor v4 build (WordPress; supersedes PRD 8.2, decision D-030)
- Elementor v4 Atomic Editor (free). Atomic elements only: no v3 widgets, custom PHP widgets, HTML widget or shortcodes. Anything not expressible with atomic elements is reported to the owner, not improvised.
- Every `--tp-` CSS custom property becomes an Elementor global variable (same name); every repeated class becomes a global class. Set colour explicitly on heading classes.
- The theme ships exactly four front-end files (PRD 8.2.1, approved exceptions E1–E3): `animations.css` + `animations.js` (tp-reveal, tp-stagger, tp-parallax, tp-img-reveal, tp-split, tp-counter, reduced motion), `theme.css` (header, footer, WhatsApp, lightbox dialog, before/after handle, filter bar, project templates, 404, scroll-nav chips) and `interactions.js` (menu, lightbox, before/after, scrollspy, filter). PHP templates `archive-project.php` and `single-project.php` (E3). No Additional CSS. Nothing else may be added without the owner's approval.
- Responsive: Elementor per-device controls (tablet, mobile), not the prototype media queries. Test RTL manually on every Arabic page.
- Images: photographs WebP, longest edge <= 1600 px, < 400 KB, converted on the server before upload; logos and transparency stay PNG (SVG if a vector logo is supplied).
- Theme stays Hello Elementor child (not Astra); header, footer, language switcher and WhatsApp button live in the theme. Pages are content only: header not transparent, no overlay, no hero top-padding compensation.
- Page settings: Elementor Full Width template, hide title, no sidebar.
- Build order: English Home first, then stop for owner review; Arabic pages after.

## Animation classes (`animations.css` + `animations.js`)
| Class | Behavior |
|---|---|
| `tp-reveal` | Fade + translate on enter (default up) |
| `tp-reveal--up/--down/--start/--end/--scale` | Direction variants (start/end flip in RTL) |
| `tp-stagger` | Parent: children reveal in sequence |
| `tp-parallax` | Scroll parallax; `data-tp-speed` (default 0.15) |
| `tp-split` | Headline reveals line by line; `aria-label` keeps it accessible |
| `tp-img-reveal` | Clip-path wipe on enter |
| `tp-counter` | Counts to `data-tp-target`, optional `data-tp-from` (default 0), `data-tp-suffix`, `data-tp-prefix` |

`data-tp-delay="200"` (ms) works on any of them. Initial hidden states only apply under `html.tp-js`, so content is visible if JS fails. Reduced motion shows everything instantly.

## File structure and naming
```
CLAUDE.md  README.md  index.html  ar/ (Phase 3)
docs/     PRD, logs, maps (index below)
scripts/  extract_pdf.py → fetch_site.py → site_to_text.py → build_site_images.py → image_meta.py (re-runnable pipeline)
          contrast.py, check-partials.py, screenshot.mjs, interaction-test.mjs (QA; see README)
source/   PDF, pdf-text.md, extracted/, site/ (website mirror), site-content.md, screenshots/
assets/css  ELEMENTOR SOURCE: tokens · base · layout · components · inner-pages | SHIPPED: theme · animations
assets/js   SHIPPED: animations · interactions | PROTOTYPE ONLY: projects · project-page · contact-form
assets/docs company profile PDF (download link)
assets/img  <meaning>.webp + <meaning>-md.webp (900px) ; stock/ for stock images
data/     projects.json · team.json · testimonials.json · site.json
```
- Images: `project-<slug>-NN.webp`, `team-<name>.webp`, `chairman-<name>.webp`, `license-<name>.webp`, `letter-<company>.webp`, `stock-<subject>.webp`.
- Data strings are always `{ "en": "…", "ar": "" }`. Project `id` = slug = `project.html?id=<slug>`.
- A `-md` file exists only when the source is wider than 900px; otherwise use the single file.

## Docs index
| File | Contents |
|---|---|
| `docs/PRD.md` | Scope, pages, content model, phases, acceptance criteria (do not edit without asking) |
| `docs/progress-log.md` | One entry per completed task, newest first |
| `docs/decisions.md` | Non-obvious decisions: context, decision, reason, alternatives |
| `docs/image-map.md` | Every extracted image → PDF page → usage → pixel size, low-res flags |
| `docs/image-credits.md` | Every stock image → source, author, URL, license, usage |
| `docs/content-corrections.md` | Every text correction: original → corrected → where used |
| `docs/wp-mapping.md` | Every section of every page → destination (Atomic / Theme / Interaction / Report), atomic tree, global classes, responsive notes; master tables of global variables and global classes (regenerate with `python scripts/gen-wp-tables.py`); REPORT list |

## Roadmap
1. Design system + English homepage
2. Remaining English pages: about, services, projects (filtering), project (single template from JSON), testimonials, contact, 404
3. Arabic RTL versions in `ar/`, Arabic content in the JSON files
4. WordPress child theme of Hello Elementor on LocalWP: CPTs (project, team, testimonial), project-type taxonomy, native meta boxes (no ACF), PHP templates for header/footer/single/archive/404, Customizer contact settings, Polylang (no custom Elementor widgets; pages use Elementor v4 atomic elements, see below)
5. Content import + Elementor page builds exported as JSON templates

## Current state
- **Phase:** Phase 2A complete; next: Phase 2B (projects, project detail, testimonials, contact, 404).
- **Last completed task:** about.html and services.html on the locked-in Official brand, with shared partials, lightbox, page hero and SEO head (see docs/progress-log.md).
- **Next task:** Phase 2B — projects.html (filter; honour `?type=` used by the Turnkey link), project.html (JSON template, gallery in the lightbox, before/after), testimonials.html (letters in the lightbox), contact.html, 404.html; then Phase 2 acceptance (Lighthouse). Reuse `tp-page-hero`, `lightbox.js`, `tp-projects-grid`, the PARTIAL blocks (copy from index.html; run `scripts/check-partials.py`). Open client questions: PRD §14 + last progress-log entries.
