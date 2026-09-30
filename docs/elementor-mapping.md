# Elementor mapping (Phase 4–5 build sheet)

Every built section → how it is rebuilt in WordPress. Anchor = the `<!-- ELEMENTOR: … -->` / `HEADER` / `FOOTER` comment above each section in the HTML file (search for the section class).
Global Colors = `--tp-color-*` tokens; Global Fonts = Cormorant Garamond (display) / Manrope (body); Arabic fonts added in Phase 3.
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

## Custom widgets needed so far
`tp-hero`, `tp-marquee`, `tp-stats`, `tp-services-list`, `tp-projects-grid`, `tp-spec`, `tp-before-after`, `tp-testimonials` (PRD 8.2 lists Hero, Projects Grid, Before/After, Stats Counter, Team Cards, Testimonials, Marquee; `tp-services-list` and `tp-spec` are additions — see D-015).


## Global Colors & Fonts (per brand — set up whichever brand the client chooses)
Site Settings → Global Colors / Global Fonts. Values come from `assets/css/brands/brand-*.css`. In the child theme they live in one `brand.css` (`:root { … }`, no `data-brand` attribute once the choice is made).

| Elementor Global Color | Token | Bronze | Official |
|---|---|---|---|
| Background | `--tp-color-bg` | `#FAF8F5` | `#FFFFFF` |
| Surface | `--tp-color-surface` | `#FFFFFF` | `#FFFFFF` |
| Section alt (Sand / Fog) | `--tp-color-sand` | `#EFE9E1` | `#F4F4F4` |
| Border (Stone / Line) | `--tp-color-stone` | `#DDD4C7` | `#D9D9D9` |
| Primary / Accent | `--tp-color-accent` | `#B08D57` | `#0D0D0D` |
| Accent text | `--tp-color-accent-text` | `#826437` | `#262626` |
| Secondary | `--tp-color-secondary` | `#546D74` | `#595959` |
| Text | `--tp-color-text` | `#2E2A26` | `#0D0D0D` |
| Text muted | `--tp-color-text-muted` | `#6B645C` | `#595959` |
| On accent | `--tp-color-on-accent` | `#2E2A26` | `#FFFFFF` |

| Elementor Global Font | Token | Bronze | Official |
|---|---|---|---|
| Primary (headings) | `--tp-font-display` | Cormorant Garamond, weight 300 | Playfair Display, weight 500 |
| Secondary (body) | `--tp-font-body` | Manrope 400–600 | Inter 400–600 |
| Arabic headings / body | `--tp-font-display-ar` / `--tp-font-body-ar` | Noto Kufi Arabic / IBM Plex Sans Arabic | same |

Elementor Free note: Global Colors take a hex only, so shadows, radii, the display scale (h1–h4 sizes, `--tp-fw-light`), button tracking and button hover colours stay in the theme's `brand.css`; they are not Elementor settings.
