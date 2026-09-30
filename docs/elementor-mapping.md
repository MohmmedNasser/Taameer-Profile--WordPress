# Elementor mapping (Phase 4–5 build sheet)

Every built section → how it is rebuilt in WordPress. Anchor = the `<!-- ELEMENTOR: … -->` / `HEADER` / `FOOTER` comment above each section in the HTML file (search for the section class).
Global Colors = `--tp-color-*` tokens; Global Fonts = Playfair Display (display) / Inter (body); Arabic fonts added in Phase 3.
Animations: paste the class names into **Advanced → CSS Classes** (`tp-reveal`, `tp-stagger`, `tp-img-reveal`, `tp-parallax`, `tp-split`, `tp-counter`); Custom HTML attributes are an Elementor **Pro** feature, so on native widgets `data-tp-delay` / `data-tp-speed` are unavailable and the defaults apply; custom widgets expose delay, speed and counter values as controls.

| Page | Section | HTML anchor | Build method | Editable controls |
|---|---|---|---|---|
| Global | Header | `index.html` → `<header class="tp-header">` | **Theme** `header.php` (not Elementor) | Menu (Appearance → Menus, location `primary`), logo (Customizer → Site Identity), quote button URL (Customizer), Polylang switcher |
| Global | Mobile menu | `.tp-menu` inside header | Theme `header.php` + `header.js` | Same menu as desktop; phone/email from Customizer |
| Home | Hero | `.tp-hero` | Custom widget **`tp-hero`** | Eyebrow, title, subtitle, primary button text/URL, secondary button text/URL, image, caption, parallax on/off |
| Home | Partners marquee | `.tp-partners` | Custom widget **`tp-marquee`** | Heading; repeater: logo, name (alt), "blend white background" toggle; speed (s); direction auto from language |
| Home | About intro + stats | `.tp-about` | Native Container (row): Heading ×2 + Text Editor + Button (link style) · Custom widget **`tp-stats`** | Stats repeater: value, from, prefix, suffix, label, animate on/off |
| Home | Chairman statement | `.tp-chairman` | Native: Container (sand bg) > Image (CSS class `tp-frame`) + Heading + Text Editor (blockquote) + Text | Photo, quote, name, title |
| Home | Services | `.tp-services` | Section head: native Heading/Text/Button · list: custom widget **`tp-services-list`** (CSS Grid inside) | Repeater: title, text, image, link; link text/URL |
| Home | Why choose us | `.tp-why` | Native: Container (sand) > Image (classes `tp-frame tp-parallax`) + Heading ×2 + Icon List ("+" icon) | Image, heading, 3 items (title + text) |
| Home | Featured projects | `.tp-featured` | Section head native · grid: custom widget **`tp-projects-grid`** (queries Project CPT) | Count, featured only, type filter, order, show filter bar |
| Home | Before / after | `.tp-compare` | Native Heading/Text/Button + custom widget **`tp-spec`** (label/value repeater) + custom widget **`tp-before-after`** | Before image, after image, labels, start %, caption; spec rows |
| Home | Testimonials | `.tp-testimonials` | Custom widget **`tp-testimonials`** (queries Testimonial CPT) | Count, layout, order |
| Home | CTA band | `.tp-cta` | Native: Container (class `tp-cta__box`) > Heading + Text Editor + Button + Icon List | Heading, text, button, phone, email |
| Global | Footer | `<footer class="tp-footer">` | **Theme** `footer.php` | Menus `footer-quick`, `footer-services`; contact from Customizer; profile PDF (Customizer file); Polylang switcher |
| Global | WhatsApp button | `.tp-fab` | Theme `footer.php` | WhatsApp number (Customizer) |
| Global | Partials markers | `<!-- PARTIAL:sprite/header/footer/whatsapp/cta START/END -->` in every page | Header + skip link + sprite → `header.php`; footer + WhatsApp → `footer.php`; CTA band → reusable template / shortcode | `scripts/check-partials.py` keeps the blocks byte-identical (only active nav state + language-switcher target may differ) |
| Global | Active nav state | `aria-current="page"` on the header nav, mobile menu and footer quick-link items | Theme: `wp_nav_menu` already outputs `current-menu-item`; walker/filter maps it to `aria-current="page"` | Styling: `.tp-nav__link[aria-current]`, `.tp-menu__link[aria-current]`, `.tp-footer__list a[aria-current]` |
| Inner | Page hero + breadcrumbs | `.tp-page-hero`, `.tp-breadcrumb` (inner-pages.css) | Native: Container (sand) > breadcrumb (theme shortcode `[tp_breadcrumbs]` in a Shortcode widget; static list until then) + Heading (eyebrow) + Heading H1 + Text Editor; optional Image (class `tp-frame`) | Eyebrow, H1, intro, optional image. Last breadcrumb carries `aria-current="page"` |
| Inner | Lightbox | `assets/js/lightbox.js` + `lightbox.css`; triggers `<a data-tp-lightbox="group">` | Behaviour only, no widget: gallery/license/letter widgets output the trigger links. Native Image widgets: link to "Media file" and add CSS class + (Pro only) custom attribute — so use the custom widgets | `data-tp-lightbox` group, `data-caption`, PDF: `href` = PDF + `data-image` = image rendition |
| Inner | CTA band (shared) | `.tp-cta` between `PARTIAL:cta` markers | Same as Home CTA; save as an Elementor Saved Template and insert at the bottom of each page (or theme `do_action`) | Heading, text, button, phone, email |
| Inner | Per-page SEO | `<head>` block: title, meta description, Open Graph, canonical/hreflang placeholders | SEO plugin (Yoast/Rank Math) per page + Polylang hreflang | Title, description, OG image per page |
| About | Chairman's message (full) | `about.html` → `.tp-chair-page` | Native: Container (row) > Image (class `tp-frame`) + Heading (eyebrow) + Text Editor ×2 (classes `tp-chair-page__lead`, `tp-chair-page__body`) + Text | Photo, both paragraphs, name, title |
| About | About Us + highlighted fact | `.tp-about-page` | Native Container (row, sand): Heading ×2 + Text Editor ×2 · fact: Container (class `tp-fact`, wrapped in `tp-frame`) with Heading/Text + counter (class `tp-counter`) | Text, fact label/value/note |
| About | Our Aim (4) | `.tp-aims-section`, `.tp-aims` | Native head + Container (row, wrap) of 4 Containers [Heading H3 + Text Editor], class `tp-aim` gives the "+" and hairline | 4 × title + text |
| About | Why choose us | `.tp-why` (same component as Home) | Same as Home | Image, 3 items |
| About | Leadership | `.tp-leadership`, `.tp-team` | Head native · cards: custom widget **`tp-team-cards`** (Team Member CPT; CSS Grid inside) · philosophy: Text Editor (class `tp-philosophy__text`) | Number, order; CPT fields photo, name, title, bio, years, order; intro + philosophy text |
| About | Team experience | `.tp-exp-section`, `.tp-exp` | Head native · custom widget **`tp-exp-cards`** (Team Experience data; not links) | Repeater: image, title, location, consultant, note |
| About | Partners grid | `.tp-partners-section`, `.tp-partner-grid` | Head native · custom widget **`tp-partners-grid`** (same repeater as `tp-marquee`, static, grayscale to colour on hover) | Logo, name, blend toggle |
| About | Licenses | `.tp-licenses-section`, `.tp-license` | Head native · custom widget **`tp-license-card`** ×2 | Company, fields (licence no., legal type, register no., DCCI no., issue/expiry, activities, status), image, PDF; lightbox group `licenses` |
| Services | Service navigation | `.tp-service-nav`, `service-nav.js` | Custom widget **`tp-service-nav`** (sticky chips, IntersectionObserver highlight) | Repeater: label, anchor id |
| Services | 6 service blocks | `.tp-service-block` (ids `construction`, `design-build`, `decoration-fitout`, `renovation`, `maintenance`, `turnkey`) | Native Container (row; sand + reversed on even blocks via `tp-service-block--flip`) > Heading ×2 + Text Editor ×2 + Button/link + Image (class `tp-frame`) | Title, lead, extra paragraph, link, image. Anchor id in Advanced → CSS ID |
| Services | Related projects | `.tp-service-block__related` | Custom widget **`tp-projects-grid`** with type filter = the service's mapped types (D-027), count 3; hidden when empty | Type(s), count |
| Services | Wall cladding showcase | `.tp-cladding`, `.tp-gallery` | Head native · custom widget **`tp-gallery`** (repeater image + caption; lightbox group) | Images, captions |

## Custom widgets needed so far
`tp-hero`, `tp-marquee`, `tp-stats`, `tp-services-list`, `tp-projects-grid`, `tp-spec`, `tp-before-after`, `tp-testimonials`, `tp-team-cards`, `tp-exp-cards`, `tp-partners-grid`, `tp-license-card`, `tp-service-nav`, `tp-gallery` (+ the lightbox behaviour script) (PRD 8.2 lists Hero, Projects Grid, Before/After, Stats Counter, Team Cards, Testimonials, Marquee; `tp-services-list` and `tp-spec` are additions — see D-015).


## Global Colors & Fonts
Site Settings → Global Colors / Global Fonts. Values come from `assets/css/tokens.css`. In the child theme they live in one `:root { … }` block (`brand.css` or the theme's `tokens.css`).

| Elementor Global Color | Token | Value |
|---|---|---|
| Background | `--tp-color-bg` | `#FFFFFF` |
| Surface | `--tp-color-surface` | `#FFFFFF` |
| Section alt (Fog) | `--tp-color-sand` | `#F4F4F4` |
| Border (Line) | `--tp-color-stone` | `#D9D9D9` |
| Primary / Accent (Ink) | `--tp-color-accent` | `#0D0D0D` |
| Accent text (Charcoal) | `--tp-color-accent-text` | `#262626` |
| Secondary (Slate) | `--tp-color-secondary` | `#595959` |
| Text | `--tp-color-text` | `#0D0D0D` |
| Text muted | `--tp-color-text-muted` | `#595959` |
| On accent | `--tp-color-on-accent` | `#FFFFFF` |

| Elementor Global Font | Token | Value |
|---|---|---|
| Primary (headings) | `--tp-font-display` | Playfair Display, weight 500 (italic 400/500 for quotes) |
| Secondary (body) | `--tp-font-body` | Inter 400–600 |
| Arabic headings / body | `--tp-font-display-ar` / `--tp-font-body-ar` | Noto Kufi Arabic / IBM Plex Sans Arabic (Phase 3) |

Elementor Free note: Global Colors take a hex only, so shadows, radii, the display scale (h1–h4 sizes, `--tp-fw-light`), button tracking and button hover colours stay in the theme's token stylesheet; they are not Elementor settings.
