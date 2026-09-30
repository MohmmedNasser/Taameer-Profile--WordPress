# Decisions

Non-obvious decisions. Format: **Context / Decision / Reason / Alternatives rejected.** Newest on top.

### D-024 — Official brand locked in; switcher removed (Phase 2A)
- Context: the client approved the Official brand after comparing both.
- Decision: brand values merged into `tokens.css` (same token names, so components did not change); deleted brand-bronze/official/overrides CSS, the switcher (JS, CSS, first-paint script), `data-brand`, Cormorant/Manrope, and the two comparison scripts (`brand-compare.mjs` was tied to `?brand=` and the switcher; `brand-style-diff.mjs` was a one-off; `screenshot.mjs` covers general visual QA). `contrast.py` now reads `tokens.css`. The `v1-bronze` tag did not exist in the repo (it was only mentioned in docs), so it was created at the last bronze commit before deleting.
- Reason: one design, one stylesheet set; bronze stays recoverable from git.
- Alternatives: keep the brand layer for future rebrands (rejected: dead code in the WP port).

### D-023 — Brands as token sets; shared HTML/JS/component CSS
- Context: the client must choose between the bronze design and the taameer.ae identity.
- Decision: `tokens.css` keeps shared values (spacing, layout, motion, z-index, scale base). `brands/brand-<name>.css` holds colours, font families, display sizes (h1–h4, display, quote), display weight, button tracking, radii, shadows and button hover under `:root[data-brand="…"]`, with identical token names. `data-brand="bronze"` is the default on `<html>`. `brand-official-overrides.css` exists but is empty: no component needed a structural override.
- Two component fixes made the split clean (bronze values unchanged): `.tp-fab` used `--tp-color-text` on the accent fill (invisible icon when accent = ink) → `--tp-color-on-accent`; its hover now uses `--tp-btn-bg-hover/fg-hover`.
- Verified: bronze vs tag `v1-bronze` = 0 computed-style differences over 506 elements.
- Alternatives rejected: duplicating pages; CSS filters; a JS theme engine.

### D-022 — Fonts for both brands load from one Google Fonts request
- Decision: one link carries Cormorant Garamond + Manrope + Playfair Display + Inter. Trade-off: extra font data and requests for whichever brand is unused. After the client decides, delete the other families from the link and its brand file.
- Alternative: inject the font link per brand with JS — rejected (flash of fallback font, more moving parts for a temporary review tool).

### D-021 — Contrast: no official colour failed; one role remapped
- All official text colours pass AA on white and fog (ink 19.4/17.7, slate 7.0/6.4, charcoal 15.1/13.8). `--mist #8C8C8C` (3.3:1) fails as text, so it is **not used**; secondary and muted both map to `--slate`.
- `accent-text` = charcoal `#262626` rather than ink so eyebrows and links stay a shade apart from headings. No darkened variants were needed (`python scripts/contrast.py official`, 0 failing pairs).

### D-020 — Display type scaled down and eased in weight for Playfair
- Playfair Display sets ~20% larger than Cormorant Garamond at the same size and has no 300 weight. `--tp-fs-h1…h4/display/quote` are reduced in the official file (h1 max 4.75rem vs 6rem) and `--tp-fw-light` (the display-weight token) is 500; the site uses 600, which read heavy at hero size against the light, premium brief.
- Button tracking 0.03em and radii 2/6/10px are copied from the site.

### D-019 — Dark areas of the official site become ink text, buttons and lines on light layouts
- Official uses ink `#0D0D0D` for hero, testimonials and footer backgrounds. The client wants no dark sections, so in the official brand ink is used only for text, "+" marks, hairlines, solid buttons and the FAB. Section backgrounds are white and fog `#F4F4F4`; the footer is fog (as bronze uses sand).
- The official light-on-dark button variants are not used. Button hover goes ink → charcoal (the official outline-invert would drop the fill on white).
- Logo: the black wordmark is identical in both brands, so no `<picture>` swap.

### D-018 — Mobile menu is a disclosure, not a modal dialog
- Context: the toggle button lives outside the menu panel; `aria-modal` would hide it from screen readers.
- Decision: `aria-expanded` + `aria-controls` disclosure; header.js traps Tab between toggle and panel, Esc closes and restores focus. While open, the header drops `backdrop-filter` (it creates a containing block that trapped the fixed panel inside the 68px bar — found in QA).

### D-017 — Services list preview without JS
- Context: the hover-image list needs each image in its own row (Elementor repeater) but one shared preview cell on desktop.
- Decision: rows are `display: contents` ≥1024px, so links and images become grid items; images share a sticky cell and cross-fade via `:hover` / `:focus-within`; first image shows by default (`:has()`). `role="listitem"` restores list semantics. Mobile: plain rows with inline images.
- Alternatives: JS hover swapping (more code, not needed); duplicated image column (breaks the repeater model).

### D-016 — Copy stays client-sourced
- Context: design drafts introduced marketing lines (e.g. "Licensed, integrated, exacting").
- Decision: headings/body use PDF or website wording only; structural labels ("Our expertise", "Track record", "Before & after", "Drag the divider…") are UI copy, not claims. The About/services/why-us/CTA text is the website's.

### D-015 — Two extra custom widgets: `tp-services-list`, `tp-spec`
- Context: PRD 8.2 lists 7 widgets. The services hover list and the drawing-style facts block have no native Elementor equivalent in Free.
- Decision: add both; `tp-spec` is reused on the Project detail page (Phase 2).

### D-014 — Visual signature: setting-out marks
- Context: the brief fixes palette and fonts (warm light + serif), a look that easily turns generic.
- Decision: one memorable device — bronze "+" registration crosses at two opposite corners of framed images (hero, chairman, why-us), like setting-out marks on architectural drawings and the "+" in the logo. Supporting details: superscript bronze "+" after the hero headline (aria-hidden), project facts as a drawing title block (`tp-spec`), "+" as eyebrow marker, list bullet, service hover icon and menu icon (rotates to ×). No numbered markers (services are not a sequence). Hero: text on a sand panel with the framed image overlapping its end edge.
- Tools consulted: frontend-design, ui-ux-pro-max (Swiss-modernist asymmetric 12-col grid, trust signals up front, 150–300ms hovers), design-system (primitive → semantic → component token layers; `validate-tokens.cjs` passes with 0 violations).

### D-013 — Contrast adjustments
- Context: `python scripts/contrast.py` on the brief palette: accent-text on sand 4.14, secondary on bg 4.32 and on sand 3.80 (all < 4.5).
- Decision: `--tp-color-accent-text` #8A6A3B → **#826437** (sand 4.55, bg 5.18); `--tp-color-secondary` #5E7A82 → **#546D74** (sand 4.56, bg 5.19). Bronze `--tp-color-accent` (#B08D57, 2.56–3.09) is used only for non-text decoration and as a fill with **charcoal** labels (4.60). All 13 text pairs pass AA.
- Alternatives: white text on bronze buttons (3.1, fails).

### D-012 — Image dimensions live in `imageMeta`
- Context: JS-rendered cards need width/height (no CLS) and must only reference `-md` files that exist.
- Decision: `projects.json.imageMeta` = { path: [w, h, hasMd] }, regenerated by `scripts/image_meta.py`. Project fields stay plain paths as specified.
- Reason: keeps the CPT-shaped fields flat; mirrors WP attachment metadata.

### D-011 — Hero image: Palm Jumeirah #2 (pool + facade)
- Context: brief asks for a Palm Jumeirah hero; all 5 photos are PDF-only at ~576px.
- Decision: photo 02 (bright pool/facade), framed at ≤ ~46% of the viewport beside a sand text panel, never full-bleed. Also the project cover.
- Reason: lightest, most "calm luxury" shot; framing limits the upscale. Flagged for client (originals wanted).

### D-010 — Profile PDF download uses the site's copy
- Context: both profile PDFs have identical text; ours is 12.2 MB, the site's 5.0 MB.
- Decision: "Download Company Profile" links `assets/docs/taameer-plus-company-profile.pdf` copied from the site version.
- Reason: 60% smaller for mobile users, same content.

### D-009 — License images from the site's vector PDFs
- Context: PDF p8 licenses are 300-DPI crops of a page; the Contracting license there expired 06/09/2026. The site serves renewed vector PDFs.
- Decision: render the site PDFs at 200 DPI → `license-contracting/carpentry.webp` (1920px + md).
- Reason: current, sharper. Alternatives: PDF crops (expired, softer).

### D-008 — Duplicate project photos across sources
- Context: 12 projects exist in both sources; the PDF re-crops the same photos, so filenames/hashes differ.
- Decision: site photos first (site order), then PDF photos that do not match any site photo. Matching = dHash over aspect-matched crops at 5 scales × 9 anchors, plus `MANUAL_DUPES` for heavy re-crops (verified visually).
- Reason: "keep the higher resolution" without losing PDF-only angles. Note: the site's Jumeirah Golf photos carry a faint watermark; the clean PDF copies are half the size, so the site copies were kept.

### D-007 — Partner logos on a light section
- Context: 7 of 14 partner logos are white-on-black JPGs; `mix-blend-mode: multiply` cannot hide a black box.
- Decision: knock out black-box logos to transparent WebP at build time (neutral pixels → charcoal `#2E2A26`, saturated brand colours kept); white-box logos stay JPG-derived and use `multiply` in CSS.
- Reason: consistent strip, no dark tiles. Alternatives: framing logos in tiles (dark tiles break "no dark sections"); inverting (distorts brand colours).

### D-006 — Service imagery = project photography
- Context: the site's 6 "service images" are black line icons (145–612px) and the services banner 404s. The brief asks to avoid centred-icon service cards.
- Decision: each service shows a client project photo that illustrates it (Construction → Dubai G villa; Design & Build → Al Awir villas; Decoration & Fitout → KF INC HQ; Renovation → Dubai Marina triplex; Maintenance → Atlas Copco HQ; Turnkey → Al Warqa 1st G+2 villa). "Why Choose Us" uses a site project photo instead of the missing banner. No stock needed.
- Reason: real work beats icons and stock; all client-approved.

### D-005 — Logo = PDF raster with transparency
- Context: site logos are white-on-black JPGs (863×277); the PDF logo is black on transparent (809×263).
- Decision: use `logo-taameer-plus.webp` from the PDF (displayed ≤ 200 CSS px wide, so 4× density). No CSS text logo needed. Vector logo still requested from client.

### D-004 — Corrections list lives in docs/content-corrections.md
- Context: PRD §13 says the corrections list is maintained in CLAUDE.md.
- Decision: keep the full list in `docs/content-corrections.md`; CLAUDE.md links to it.
- Reason: CLAUDE.md must stay short (<200 lines); the list grows with each source conflict.
- Alternatives: inline in CLAUDE.md (bloats the entry point).

### D-003 — Chairman name "Fahim Al-Ali"
- Context: PDF "Al_Ali", Phase-1 brief correction table "Al Ali", website "Al-Ali".
- Decision: display **Mr. Fahim Al-Ali**. File name `chairman-fahim-al-ali.webp`.
- Reason: source precedence — the website wins on text; the brief's homepage spec also uses "Al-Ali".

### D-002 — Slug `al-awir-villas` (was `al-amir-villas`)
- Context: PDF says "Al Amir 1"; website says "Al Awir 1" (newer, wins).
- Decision: project slug and image names use `al-awir-villas`.
- Reason: the slug becomes the public URL and must name the real location.

### D-001 — Resume the interrupted extraction rather than rewrite it
- Context: an earlier session wrote a complete `extract_pdf.py` but stopped during WebP export.
- Decision: reuse it; add an `--export` flag that skips the raw dump when natives already exist.
- Reason: raw natives are deterministic; re-dumping wastes time.
