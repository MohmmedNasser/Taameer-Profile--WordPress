# WordPress mapping (Elementor v4 build sheet)

Replaces `docs/elementor-mapping.md` (v3-era custom widgets). Source of truth: PRD v1.5 sections 8.2–8.3 and CLAUDE.md. Every section of every page has exactly one destination:

| Destination | Meaning | Annotation in the HTML |
|---|---|---|
| **Atomic** | Built in Elementor v4 with atomic elements only (Flexbox, Div Block, Heading, Paragraph, Image, Button, Link, SVG, Divider, Form). Styles = global variables + global classes. | `<!-- ATOMIC: Flexbox > Heading(.tp-h2) + … -->` |
| **Theme** | `theme.css` (E1) + PHP templates (E3): header, footer, language switcher, WhatsApp, 404, project archive and single | `<!-- THEME: header.php / footer.php / archive-project.php / single-project.php / 404.php -->` |
| **Interaction** | Class-driven behaviour in `interactions.js` (E2) on atomic markup | `<!-- INTERACTION: tp-lightbox (interactions.js) -->` |
| **Animation** | `animations.css` + `animations.js` classes | applied through class names |
| **Report** | Cannot be expressed atomically and is not covered by E1–E3: reported to the owner, never improvised | `<!-- REPORT: … -->` (all collected in the last section) |
| **Prototype only** | JS that renders JSON into pages; never shipped | `/* PROTOTYPE ONLY */` in the file header |

## Front-end files

| File | Ships? | Role |
|---|---|---|
| `tokens.css`, `base.css`, `layout.css`, `components.css`, `inner-pages.css` | No — `/* ELEMENTOR SOURCE */` | Recreated as global variables / global classes (tables at the end) |
| `animations.css` + `animations.js` | Yes | `tp-reveal`, `tp-stagger`, `tp-parallax`, `tp-img-reveal`, `tp-split`, `tp-counter`, reduced motion. (`tp-counter` code was merged in from counters.js.) |
| `theme.css` | Yes (E1) | header, mobile menu, footer, WhatsApp, lightbox dialog, before/after slider, services scroll-nav chips, filter bar, project archive + single templates, 404 |
| `interactions.js` | Yes (E2) | menu · lightbox (`tp-lightbox`) · before/after (`tp-before-after`) · scrollspy (`tp-scrollspy`) · project filter (`tp-filter`) |
| `projects.js`, `project-page.js`, `contact-form.js` | No — `/* PROTOTYPE ONLY */` | JSON rendering and form validation stand-ins for PHP / Atomic Form |

Page settings for every Elementor page: Full Width template, title hidden, no sidebar. The page starts below the solid sticky header (no overlay, no padding compensation).

## Interaction contracts (class-driven, atomic-friendly markup)

| Class | Markup | Behaviour |
|---|---|---|
| `tp-lightbox` | A Flexbox/Div container; every link inside that points to an image (`.webp/.jpg/.png`) or a PDF with `data-image` opens in the dialog; the container is one gallery | Dialog UI classes `tp-lbox*` are generated, styled in theme.css. Caption: `data-caption` → image alt → aria-label |
| `tp-before-after` | Container with `Image(.tp-before-after__after)` + `Image(.tp-before-after__before)` | Adds clip layer, labels and `role="slider"` handle (`tp-ba*` classes, theme.css). Without JS the images stack |
| `tp-scrollspy` | Container of links to `#id` anchors | Marks the link of the section in view with `aria-current="true"` |
| `tp-filter` | Archive template only (E3): `.tp-filter__btn[data-tp-filter]`, `.tp-filter__items > [data-tp-type]`, `.tp-filter__status` | FLIP animation, `?type=` URL state, live region |

## Direction-neutral classes and `-rtl` classes (PRD 8.2.2)

Audit result: every global class uses logical properties. The only physical values are in the classes below; each keeps its neutral rule and gets a sibling `-rtl` class that is added by hand to the same element on Arabic pages only.

| Neutral class | Physical value | Arabic-only class |
|---|---|---|
| `tp-link` | arrow icon `translateX` on hover | `tp-link-rtl` (flips the arrow, reverses the nudge) |
| `tp-card__more` | arrow icon direction | `tp-card__more-rtl` |
| `tp-marquee` | edge-fade gradient `to right`, scroll distance | `tp-marquee-rtl` |
| `tp-service__link` | title nudge on hover `translateX` | `tp-service__link-rtl` |
| `tp-img-reveal` and the `tp-reveal--start/--end` variants | clip-path / translate direction | handled inside `animations.css` through `--tp-dir-x` (not a class the client sets) |

Theme parts (header underline, before/after, lightbox arrows) follow `<html dir>` in `theme.css`.

---

## Page sections

Responsive rule used everywhere: desktop rows (`Flexbox direction: row`) become `column` on tablet; gaps/padding step down one token (`--tp-space-8` → `-7` → `-6`); card rows use `wrap` with a basis of 3 / 2 / 1 columns (desktop / tablet / mobile).

### Home (`index.html`)

| Section | Dest | Atomic tree and global classes | Tablet / mobile |
|---|---|---|---|
| Header, mobile menu, footer, WhatsApp, sprite | Theme | `header.php`, `footer.php` | menu button < 64em |
| Hero | Atomic + Animation | `Flexbox.tp-hero > Flexbox.tp-hero__panel > Paragraph.tp-eyebrow + Heading H1.tp-h1.tp-hero__title(.tp-split) + Paragraph.tp-hero__lead + Flexbox.tp-hero__actions > Button.tp-btn--primary + Button.tp-btn--ghost`; `Flexbox.tp-hero__media > Flexbox.tp-frame > Image.tp-frame__img(.tp-parallax) + Paragraph.tp-caption`. Image `fetchpriority=high` | stack media under panel; remove media overlap |
| Partners marquee | Atomic + **Report** | `Flexbox.tp-marquee > Flexbox.tp-marquee__track > Image.tp-marquee__logo ×14` | same; reduced motion = wrapped static row |
| About + stats | Atomic | `Flexbox row > [Flexbox.tp-about__text > Paragraph.tp-eyebrow + Heading.tp-h2 + Paragraph.tp-lead + Paragraph + Link.tp-link] + [Flexbox.tp-stats > 3 × Flexbox.tp-stats__item > Paragraph.tp-stats__label + Heading.tp-stats__value(.tp-counter)]` | stats stack |
| Chairman quote | Atomic | `Flexbox.tp-section--sand > Flexbox row > Flexbox.tp-frame > Image + Flexbox.tp-quote > Paragraph.tp-eyebrow + Paragraph.tp-quote__text + Heading.tp-quote__name + Paragraph.tp-quote__role` | portrait above quote |
| Services list | Atomic + **Report** | rows `Flexbox.tp-service > Link > Heading.tp-service__title + Paragraph.tp-service__text + SVG.tp-service__plus`; one `Image.tp-service__img` each | no hover swap (see Report) |
| Why choose us | Atomic | `Flexbox.tp-section--sand > Image(.tp-parallax) + Flexbox.tp-why__text > … 3 × Flexbox.tp-why__item` | stack |
| Featured projects (6) | Atomic + **Report** | `Flexbox wrap.tp-projects-grid > 6 × Flexbox.tp-project > Link.tp-card > Image.tp-card__img + Paragraph.tp-card__meta + Heading.tp-card__title + Paragraph.tp-card__location` (Atomic Loop if the Phase 4 spike confirms it) | 3 → 2 → 1 columns |
| Before / after | Atomic + Interaction | `Flexbox.tp-compare > [text + Flexbox.tp-spec] + Flexbox.tp-before-after > Image.tp-before-after__after + Image.tp-before-after__before` | stack, slider full width |
| Letters of appreciation | Atomic | `Flexbox wrap > 3 × Flexbox.tp-letter > Paragraph.tp-letter__text + author + company` | 3 → 1 |
| CTA band | Atomic | `Flexbox.tp-cta > Flexbox.tp-cta__box > Paragraph.tp-eyebrow + Heading.tp-h2 + Paragraph + Button + links` | stack buttons |

### About (`about.html`)

| Section | Dest | Atomic tree and global classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs | Atomic | `Flexbox.tp-page-hero > Flexbox(.tp-breadcrumb__list: Link + Paragraph) + Paragraph.tp-eyebrow + Heading H1.tp-h1.tp-page-hero__title + Paragraph.tp-page-hero__lead` | — |
| Chairman's message | Atomic | `Flexbox row > Flexbox.tp-chair-page__media(sticky) > Flexbox.tp-frame > Image + Flexbox.tp-chair-page__msg > …` | portrait not sticky, above text |
| About + 2015 fact | Atomic + Animation | `Flexbox.tp-section--sand > text + Flexbox.tp-fact.tp-frame > Heading.tp-fact__value(.tp-counter)` | stack |
| Aims | Atomic | `Flexbox wrap > 4 × Flexbox.tp-aim` | 4 → 2 → 1 |
| Why choose us | Atomic | same as Home | |
| Leadership + philosophy | Atomic + **Report** | `Flexbox wrap.tp-team > 3 × Flexbox.tp-team__card`; `Flexbox.tp-philosophy` | 3 → 1 |
| Team experience | Atomic | `Flexbox wrap.tp-exp > 4 × Flexbox.tp-exp__card` (no links) | 4 → 2 → 1 |
| Partners (14) | Atomic | `Flexbox wrap.tp-partners-grid > Image.tp-partner__logo ×14` | 7 → 4 → 3 |
| Licenses | Atomic + Interaction + **Report** | `Flexbox.tp-licenses.tp-lightbox > 2 × Flexbox.tp-license > Link > Image.tp-license__preview + Flexbox.tp-spec + Button` | stack |
| CTA band | Atomic | as Home | |

### Services (`services.html`)

| Section | Dest | Atomic tree and global classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs | Atomic | as About | |
| Chip navigation | Atomic + Interaction | `Flexbox.tp-service-nav.tp-scrollspy(sticky) > Flexbox.tp-chips > Link.tp-chip ×6` | horizontal scroll |
| 6 service blocks | Atomic | `Flexbox.tp-service-block(--flip) > [Paragraph.tp-eyebrow + Heading.tp-h2 + Paragraph.tp-lead + Paragraph + Button.tp-link] + Flexbox.tp-frame > Image`; anchor id = service id | stack, image first |
| Related projects (3 of 6 blocks) | Atomic + **Report** | `Flexbox wrap.tp-projects-grid--related > 3 × project card` (static) | 3 → 1 |
| Wall cladding showcase | Atomic + Interaction | `Flexbox wrap.tp-gallery.tp-lightbox > Link > Image.tp-gallery__item ×6` | 3 → 2 |
| CTA band | Atomic | as Home | |

<!-- PAGES-2B:START -->

### Projects (`projects.html`) â€” theme template `archive-project.php` (E3)

| Section | Dest | Tree / classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs | Theme (printed by the archive template; same markup as the atomic page hero) | `.tp-page-hero`, breadcrumbs, `.tp-h1`, `.tp-page-hero__lead` | â€” |
| Filter bar | Theme + Interaction | `.tp-filter > .tp-filter__bar > button.tp-filter__btn[data-tp-filter][aria-pressed] > .tp-filter__count`; `.tp-filter__status` (aria-live) | buttons wrap |
| Grid (22 projects) | Theme + Interaction | `.tp-filter__items.tp-projects-grid.tp-projects-grid--even > article.tp-project[data-tp-type] > a.tp-card`. Order: ongoing first, then completion date newest first (the PHP query must reproduce this: `meta_key` status then date). Wall Cladding (showcase) excluded. FLIP animation + `?type=` state in `interactions.js` | 3 â†’ 2 â†’ 1 columns |
| Team experience (4) | Atomic-equivalent markup inside the template (same classes as About) | `.tp-exp` cards, "by the Taameer Plus team" framing | 4 â†’ 2 â†’ 1 |
| CTA band | Atomic-equivalent | as Home | |

Card markup lives in `<template id="tp-project-card">` (copy into PHP). Taxonomy archive URLs `/projects/?type=fit-out` â†” `project-type` term links.


### Project detail (`project.html?id=<slug>`) â€” theme template `single-project.php` (E3)

| Section | Dest | Tree / classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs (Home â€؛ Projects â€؛ name), H1 = title | Theme | `.tp-page-hero`, `.tp-h1`; also hosts the "Project not found" state (+ `noindex`) = WordPress 404 for an unknown slug | â€” |
| Spec block | Theme | `dl.tp-spec.tp-spec--stack` rows: Type, Location, Duration, Completion (date or "Ongoing"), Consultant when present | column above cover |
| Cover | Theme | `.tp-project-cover` (plain â‰¥ 1200px landscape, `.tp-frame` otherwise; never upscaled, max 80vh) | full width |
| 3D Visualization notice | Theme | `.tp-render-note` when `isRender` | â€” |
| Gallery | Theme + Interaction | `.tp-masonry.tp-lightbox > a.tp-masonry__item > img` (CSS columns, one lightbox group) | 3 â†’ 2 â†’ 1 columns |
| Before / after | Theme + Interaction | `.tp-before-after` only when a before image exists | full width |
| Related testimonial | Theme | `.tp-project-letter` (excerpt, author, link to `testimonials.html#<id>`) | â€” |
| Previous / next | Theme | `.tp-project-nav` â€” Projects-grid order, wraps at the ends | stacks |
| Related projects | Theme | `.tp-projects-grid--related`: up to 3 of the same type, excluding current | 3 â†’ 1 |
| CTA band | Atomic-equivalent | as Home | |

Meta: `<title>` = "name â€” Taameer Plus Contracting LLC"; description = project description or a generated sentence; OG image = cover. `project-page.js` is PROTOTYPE ONLY.


### Testimonials (`testimonials.html`) â€” Atomic

| Section | Dest | Tree / classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs | Atomic | as About | |
| 4 letters | Atomic + Interaction + **Report** | `Flexbox.tp-lightbox > 4 أ— Flexbox.tp-letter-page(--flip) > [Flexbox.tp-letter-page__sheet > Link.tp-letter-page__thumb > Image + Paragraph(zoom label)] + [Flexbox.tp-letter-page__text > Paragraph.tp-eyebrow + Heading H2 + Paragraph(date) + Paragraph.tp-letter-page__excerpt + Paragraph(author) + Paragraph(role) + Link.tp-link(project)]`. Jan's Noodles: company name + letter only | rows stack, sheet above text; `--flip` only reverses the desktop row |
| CTA band | Atomic | as Home | |


### Contact (`contact.html`) â€” Atomic (+ prototype-only validation)

| Section | Dest | Tree / classes | Tablet / mobile |
|---|---|---|---|
| Page hero + breadcrumbs | Atomic | as About | |
| Contact details | Atomic | `Flexbox.tp-contact__info > Heading H2 + Flexbox.tp-spec.tp-spec--stack > 6 أ— Flexbox.tp-spec__row > Paragraph(label) + Link(value)`: address, office (`tel:`), mobile (`tel:`), email (`mailto:`), WhatsApp (`https://wa.me/971503029281`), Instagram. Values from the Customizer. Office hours deliberately omitted (unknown) | stacks above the form |
| Form | Atomic + **Report** | `Form.tp-form > Field name* + Field email* + Field phone + Select project type (6 services + Other) + Textarea message* + hidden honeypot Field + Button.tp-btn--primary`. Classes: `tp-form`, `tp-form__field`, `tp-form__error`, `tp-form__status`, `tp-form__success`, `tp-form__hp`. `contact-form.js` is PROTOTYPE ONLY | full width |
| Location block (no iframe) | Atomic | `Flexbox.tp-location > SVG.tp-location__mark + Flexbox.tp-location__text > Paragraph.tp-eyebrow + Heading H2 + Paragraph + Button.tp-btn--primary "Open in Google Maps"` (new tab) | button wraps below |
| CTA band | Atomic | as Home | |

JSON-LD `GeneralContractor` (also on Home) is printed by the theme or the SEO plugin, not Elementor: name, url, logo, image, description, telephone, email, foundingDate, PostalAddress, sameAs Instagram.


### 404 (`404.html`) â€” theme template `404.php` (E1)

| Section | Dest | Tree / classes | Tablet / mobile |
|---|---|---|---|
| Message + "+" motif + links | Theme | `.tp-404__hero > .tp-404__code (404 + SVG +) + .tp-404__text > eyebrow + H1 + lead + 2 buttons (Home, Projects)`; `<meta name="robots" content="noindex">` | stacks |
| 3 featured projects | Theme | `.tp-404__projects > .tp-projects-grid--related` (PHP loop; cards from `<template id="tp-project-card">`) | 3 â†’ 1 |

Asset URLs are relative in the prototype; `404.php` uses `get_stylesheet_directory_uri()` so the page works from any path. No CTA band (the page ends on the projects).

<!-- PAGES-2B:END -->

## REPORT items for the owner (not atomic, not covered by E1–E3)

| # | Where | Problem | Suggested solution |
|---|---|---|---|
| R1 | Header (all pages) | The mobile menu toggle (focus trap, Esc, scroll lock) needs JS, but E2 lists only lightbox, before/after, scroll nav and filtering | Add "header menu" to E2 (code is already a section of `interactions.js`), or accept a CSS-only disclosure without focus trap |
| R2 | Home partners marquee | Continuous logo scroll is an animation outside the PRD 8.3 class list | Approve `tp-marquee` in `animations.css/js` (code exists), or use the static partners grid |
| R3 | Home services list | Desktop hover/focus image swap needs sibling-state CSS and a sticky Grid image | Static rows with one image each; or approve the swap as a theme exception |
| R4 | Home featured projects, Services related projects, About team | Atomic elements cannot read the Project / Team CPTs; cards are static and need manual updates | Phase 4 spike: Atomic Loop in the free version; else static cards |
| R5 | All lists, stats, quotes, dates | Atomic elements have no `ul/li`, `dl`, `blockquote`, `time`, `figure`: Div Blocks + Paragraphs are used (small semantic/accessibility loss) | Accept, or approve a tag control if the installed version offers one |
| R6 | About licenses, wall cladding, project gallery | The lightbox reads `data-image` / `data-caption` on links; custom attributes may not exist in the free atomic editor. Animations also use `data-tp-delay/-speed` (defaults apply without them) | Phase 4 spike. Fallbacks: caption from image alt (already), PDFs open directly |
| R7 | Contact form | Atomic Forms availability in the free version is unverified; honeypot, inline errors (`aria-describedby`) and success state may differ | Phase 4 spike; otherwise a form plugin (owner decision: shortcodes are excluded) |
| R8 | CSS filters on images | Grayscale-to-colour hover on partner logos needs a filter control | Drop the hover effect if not offered |
| R9 | Prototype grids | Projects, related, 404 and gallery grids use CSS Grid/columns in `theme.css` (allowed: E1/E3); atomic pages use Flexbox wrap | None needed |


<!-- GENERATED:START -->
<!-- GENERATED:END -->
