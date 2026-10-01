# Product Requirements Document
## Taameer Plus Contracting — Corporate Website

| | |
|---|---|
| **Version** | 1.6 — Phase 2 review decisions |
| **Date** | 30 September 2026 |
| **Prepared by** | Mohammed (Frontend Developer) |
| **Client** | Taameer Plus Contracting LLC, Dubai, UAE |
| **Domain** | www.taameer.ae |

---

## 1. Overview

Taameer Plus Contracting LLC is a Dubai-based general contractor established in 2015, offering construction, decoration, fit-out, maintenance and renovation services, delivered as Turnkey or Design & Build contracts. Its current marketing material is a 37-page PDF company profile and a single-page website at taameer.ae.

This project turns both into a multi-page, bilingual (English / Arabic) corporate website built on WordPress, where the client's team can update page content with Elementor (free version) and manage projects, team members and testimonials from the WordPress dashboard without developer help.

**Content sources:** the website is newer and wins where the two disagree (dates, status, stats, wording); the PDF supplies projects, galleries and material the website lacks. All content from both is approved for use.

The build happens in two stages: a static HTML/CSS/JavaScript prototype for design approval, followed by conversion into a custom WordPress theme.

---

## 2. Goals

1. **Build credibility** with private villa owners, developers, consultants and commercial tenants by showcasing completed work, the leadership team and client appreciation letters.
2. **Generate enquiries** through clear calls to action, a contact form, and one-tap phone and email links on mobile.
3. **Serve both audiences** in the UAE market with a full English site and a native-quality Arabic (RTL) site.
4. **Give the client independence**: routine content changes (text, images, new projects, new testimonials) must not require a developer.

### Success criteria

| Criterion | Target |
|---|---|
| All PDF and website content and images represented | 100% |
| Lighthouse Performance, mobile (static prototype) | Measured for reference only, not a gate |
| Lighthouse Performance, mobile (WordPress, Phase 5 gate) | ≥ 80 |
| Lighthouse Accessibility | ≥ 95 |
| WCAG conformance | 2.1 AA |
| Client can add a new project without help | Yes, verified in handover session |
| Client can edit homepage text and images in Elementor | Yes, verified in handover session |

---

## 3. Target audience

| Audience | What they look for |
|---|---|
| Private villa owners | Villa construction and renovation quality, photos, reassurance |
| Commercial tenants (retail, F&B, beauty, offices) | Fit-out experience in similar spaces, delivery speed |
| Developers and engineering consultants | Company capability, team experience, references |
| Corporate clients | Professionalism, references from known companies (e.g. Atlas Copco) |

---

## 4. Scope

### 4.1 In scope

- Static prototype: 8 English pages + 8 Arabic pages (project detail is one template)
- Custom WordPress child theme of Hello Elementor
- Custom Post Types: Projects, Team Members, Testimonials; taxonomy: Project Type
- Pages built with Elementor v4 Atomic Elements, global variables and global classes (see 8.2)
- Bilingual setup with Polylang (free), English default, Arabic RTL
- Contact form built with Elementor v4 Atomic Forms (availability in the free version confirmed in the Phase 4 spike)
- Basic on-page SEO: titles, meta descriptions, Open Graph, `hreflang`, XML sitemap, LocalBusiness / GeneralContractor schema
- Image extraction from the PDF and collection from the current website, optimization and WebP conversion
- Free-license stock images (Unsplash, Pexels, Pixabay) only where the PDF has no suitable image, with every source logged
- Full project documentation for developers and AI-assisted development
- Arabic translation of all content (for client review)
- Content import into WordPress and Elementor page builds
- One handover session and a short editing guide

### 4.2 Out of scope (quoted separately if required)

- Hosting, domain, email setup, production deployment and SMTP configuration
- Blog / news section
- Online quotation calculator or multi-step quote forms
- Careers / job applications
- Original photography, paid stock images, logo redesign or new brand identity
- Copywriting beyond editing and translating the existing profile
- Advanced SEO, ongoing content updates, maintenance retainer
- CRM integration or any form integration beyond email delivery
- Elementor Pro features (Theme Builder, Pro Form, Popups, Motion Effects)
- Third languages

---

## 5. Sitemap and page requirements

| # | Page | URL (EN / AR) |
|---|---|---|
| 1 | Home | `/` · `/ar/` |
| 2 | About | `/about/` · `/ar/about/` |
| 3 | Services | `/services/` · `/ar/services/` |
| 4 | Projects | `/projects/` · `/ar/projects/` |
| 5 | Project detail | `/projects/{slug}/` · `/ar/projects/{slug}/` |
| 6 | Testimonials | `/testimonials/` · `/ar/testimonials/` |
| 7 | Contact | `/contact/` · `/ar/contact/` |
| 8 | 404 | — |

### 5.1 Global: header and footer

- **Header:** logo, main navigation, language switcher, "Get a Quote" button. Sticky and solid on all pages: **not transparent**, no overlay over the hero, and no top-padding compensation in the hero. Header, footer, language switcher and WhatsApp button live in the theme. Accessible mobile menu.
- **Footer:** logo, tagline, quick links, services list, contact details (office, mobile, email, WhatsApp, Instagram), company profile PDF download, language switcher, copyright.
- **Floating WhatsApp button** on all pages.
- Contact details (address, phone, email, social links) are managed in one place (WordPress Customizer) and reused across the site.

### 5.2 Home

Sections in order: Hero with tagline "Construct A Better Tomorrow" · Partners logo marquee · About intro with statistics · Chairman statement · Services · Why Choose Us · 6 featured projects · Before/After comparison (Abu Dhabi private gym) · Testimonials · Call to action · Footer.

Statistics: Established 2015 · Approved G+4 Contractor · 100+ delivered projects. All editable.

### 5.3 About

Chairman's message (full, with photo) · About Us · Our Aim (4 aims) · Why Choose Us · Leadership team (3 members with photo, title, bio) · Team philosophy text · Partners (14 logos) · Trade licenses (Taameer Plus Contracting LLC and Taameer Plus Carpentry LLC) viewable in a lightbox · Team experience: 4 large-scale buildings delivered by team members before or outside the company, clearly labelled as such.

### 5.4 Services

Intro · 6 services: Construction, Design & Build, Decoration & Fitout (including wall cladding and joinery through the carpentry division), Renovation, Maintenance, Turnkey Projects, each with description, service image and related projects · Wall Cladding showcase · Call to action.

### 5.5 Projects

Grid of all projects with filtering by type (All, Construction, Renovation & Decoration, Fit-out, Landscaping) and animated transitions. Each card: cover image, title, type, location, completion year or "Ongoing" badge. Rendered images marked "3D Visualization".

### 5.6 Project detail

Title, type, location, duration, completion date or status, consultant (when available), full image gallery with lightbox, before/after slider when a before image exists, previous/next project navigation, related projects of the same type, call to action.

### 5.7 Testimonials

Appreciation letters from Atlas Copco Services Middle East, Bella Cure Beauty Lounge, TODAY Engineering Consultants and Jan's Noodles Restaurant: excerpt (where the letter has text), author, title, company, related project link, and the original letter image viewable in a lightbox.

### 5.8 Contact

Address, office phone, mobile, WhatsApp, email, Instagram, a location block with an "Open in Google Maps" link to the Festival City office (no embedded map, since iframes require the forbidden HTML widget), contact form (name, email, phone, project type, message), office hours if provided by client.

### 5.9 404

On-brand message, links to Home and Projects, language-aware.

---

## 6. Content model

### 6.1 Project (Custom Post Type)

| Field | Type | Notes |
|---|---|---|
| Title | Text | Translatable |
| Project Type | Taxonomy | construction · renovation-decoration · fit-out · landscaping · showcase |
| Location | Text | Translatable |
| Duration | Text | e.g. "120 Days", "8 Months" |
| Completion date | Month/Year | Empty if ongoing |
| Status | Select | Completed · Ongoing |
| Consultant | Text | Optional |
| Is 3D render | Checkbox | Shows "3D Visualization" label |
| Featured | Checkbox | Shown on homepage |
| Cover image | Image | |
| Gallery | Multiple images | Native meta box (no ACF Pro dependency) |
| Before image | Image | Optional, enables before/after slider |
| Description | Rich text | Optional, for future projects |

Initial content: 22 projects (21 from the PDF, 1 from the website) + Wall Cladding showcase. Where a project appears in both sources, the website's facts are used.

### 6.2 Team Member (Custom Post Type)

Name · Title · Photo · Bio · Years of experience · Display order. Initial content: 3 members, using the website bios.

### 6.3 Testimonial (Custom Post Type)

Excerpt · Author name · Author title · Company · Date · Related project (link) · Original letter image. Initial content: 4 testimonials.

### 6.4 Team Experience

The 4 buildings on PDF pages 32–33 (hotel in Al Barsha, residential tower in Nadd Al Hamar, Dubai Investments HQ, mixed-use building in Souq Al Kabeer) are stored separately from company projects and labelled as prior experience of team members.

---

## 7. Bilingual requirements

- English is the default language with no URL prefix; Arabic uses `/ar/`.
- Arabic pages render right-to-left with mirrored layouts, animations, sliders and marquee direction.
- Arabic typography uses dedicated Arabic fonts: IBM Plex Sans Arabic for body; the Arabic heading font will be chosen in Phase 3 to pair with Playfair Display.
- Every page, project, team member and testimonial has an Arabic version linked through Polylang.
- Theme strings (buttons, labels, form fields, 404 text) are translatable through Polylang string translation.
- The language switcher links to the equivalent page in the other language, not to the homepage.
- `hreflang` tags are output for every translated page.
- Arabic copy is a marketing adaptation for the UAE market, not a literal translation. **The client must review and approve it**, especially the Chairman's message.

---

## 8. Editability

### 8.1 Where each part is edited

| Content | Edited in | By |
|---|---|---|
| Page sections (Home, About, Services, Contact) | Elementor Free | Client |
| Projects, Team, Testimonials | WordPress dashboard | Client |
| Contact details, social links | Customizer | Client |
| Menus | Appearance → Menus | Client |
| Header and footer layout | Theme code | Developer |
| Project detail and archive layout | Theme code | Developer |
| Colors, fonts and repeated styles | Elementor v4 global variables and global classes | Client, with care |

### 8.2 Elementor v4 build rules (supersedes the former 8 custom widgets)

- Pages are built with **Elementor v4 Atomic Elements only** (Atomic Editor, free version). No v3 widgets, no custom PHP widgets, no HTML widget, no shortcodes.
- Semantic elements that atomic elements do not offer (lists, blockquotes, figures, time) are built with Div Blocks and Paragraphs. If the installed version offers an HTML tag control, it is used.
- Interactions must not depend on custom data attributes: they read only standard markup (link `href`, image `alt`) and classes.
- Anything that cannot be expressed with Atomic Elements is **reported to the owner, not improvised**.
- Every CSS custom property becomes an Elementor **global variable**, keeping the `--tp-` names. Every repeated class becomes a **global class**. Heading classes set their colour explicitly.
- Responsive behaviour uses Elementor's per-device controls (tablet, mobile), not the prototype's media queries.
- Page settings: Elementor Full Width template, title hidden, no sidebar. Pages contain content only.
- Theme: Hello Elementor child theme (not Astra). Header, footer, language switcher and WhatsApp button live in the theme.
- Build order: English Home first, then stop for owner review. Arabic pages come after. RTL is tested manually on every Arabic page.

### 8.2.1 Approved exceptions (closed list)

The atomic-only rule applies to everything the client edits in Elementor. Three exceptions are approved, only for parts the client does not edit, and no others may be added without the owner's approval:

| # | Exception | Covers |
|---|---|---|
| E1 | `theme.css` in the child theme | Header, footer, language switcher, WhatsApp button, 404 page, the project archive and single templates (E3), and the UI generated by `interactions.js` (lightbox overlay, before/after handle, filter bar) |
| E2 | `interactions.js` in the child theme | Class-driven interactive behaviour on atomic markup: header mobile menu, lightbox (`tp-lightbox`), before/after slider (`tp-before-after`), services scroll navigation (`tp-scrollspy`), project filtering on the archive (`tp-filter`) |
| E3 | PHP templates `archive-project.php` and `single-project.php` | Project listing with filtering and project detail pages, rendered from the Project CPT and styled by E1 |

With E1–E3, the theme ships exactly four front-end files: `animations.css`, `animations.js`, `theme.css`, `interactions.js`.

### 8.2.2 RTL and global classes

Global classes are shared by both languages. Classes must use direction-neutral values (symmetric padding and margins, `start`/`end` alignment where Elementor offers it). Where a direction-specific value is unavoidable, a separate class with the suffix `-rtl` is created and applied on Arabic pages only. RTL is still tested manually on every Arabic page.

### 8.3 Animation classes

Animations live in `animations.css` and `animations.js` (the other two theme files are the exceptions in 8.2.1); no Additional CSS. Animations are applied through classes: `tp-reveal`, `tp-stagger`, `tp-parallax`, `tp-img-reveal`, `tp-counter`, `tp-marquee` (partner logos strip), with full reduced-motion support. Documented in the editing guide.

---

## 9. Design requirements

- **Approved identity: "Official"**, derived from the company's current website: a monochrome palette of ink `#0D0D0D`, charcoal `#262626`, slate `#595959`, line `#D9D9D9`, fog `#F4F4F4` and white. No chromatic accent color. The neutral frame lets the project photography carry the color.
- Typography: Playfair Display (headings) and Inter (body, UI). Uppercase buttons with small radius.
- **No dark mode and no dark sections.** Ink is used for text, the "+" motif, hairlines, solid buttons and small elements only; section backgrounds are white and fog.
- The alternative "bronze" design is archived in git (tag `v1-bronze`) and is not part of the build.
- The "+" from the logo is used as a recurring design motif.
- Motion is subtle and purposeful; all motion is disabled when the user's system requests reduced motion.
- Full design tokens (colors, type scale, spacing) are defined in the static prototype and become Elementor v4 global variables (same `--tp-` names) and global classes.

---

## 10. Non-functional requirements

| Area | Requirement |
|---|---|
| Browsers | Latest 2 versions of Chrome, Safari (macOS/iOS), Firefox, Edge; Samsung Internet |
| Responsive | 360px to 2560px, tested at 375, 768, 1280, 1920 |
| Performance | WebP images with responsive sizes, lazy loading, no layout shift, no render-blocking third-party scripts |
| Images | Photographs: WebP, longest edge at most 1600 px, under 400 KB, converted on the server before upload. Logos and images with transparency: PNG (SVG if a vector logo is supplied) |
| Dependencies | No front-end frameworks or JS libraries. Plugins limited to: Elementor, Polylang, one SEO plugin |
| Accessibility | WCAG 2.1 AA: semantic HTML, keyboard navigation, focus states, alt text, contrast, ARIA on custom components |
| Content source | All images and data from the client's company profile are approved for publication. Stock images fill gaps only and are logged with source and license |
| Maintainability | Theme code documented; no hard-coded content in templates |

---

## 11. Technical stack

| Layer | Choice |
|---|---|
| Prototype | HTML5, CSS3 (custom properties, logical properties), vanilla JavaScript |
| CMS | WordPress (latest) |
| Theme | Custom child theme of Hello Elementor |
| Page builder | Elementor (free), v4 Atomic Editor, Atomic Elements only |
| Multilingual | Polylang (free) |
| Forms | Elementor v4 Atomic Forms (to be confirmed in the Phase 4 spike) |
| SEO | Yoast SEO (free) or Rank Math (free), to be confirmed |
| Local development | LocalWP (Mailpit for form email testing) |
| AI tooling | Claude Code, guided by `CLAUDE.md` and this PRD. Single-agent only (no sub-agents). Every task logged in `docs/` |

---

## 12. Phases and acceptance criteria

### Phase 1 — Design system + English homepage
- Images extracted, optimized, mapped in `docs/image-map.md`; stock images logged in `docs/image-credits.md`
- Documentation system in place (`CLAUDE.md` + `docs/`) with every task logged
- Data files created with all projects, team and testimonials (English)
- Tokens, animation system, header, footer and homepage complete
- No console errors, no horizontal scroll at any tested width
- Layout mirrors correctly when `dir="rtl"` is applied
- **Gate: client approves the homepage design before Phase 2** — ✅ Approved: Official identity

### Phase 2 — Remaining English pages
- About, Services, Projects (with filtering), Project detail, Testimonials, Contact, 404
- All 21 projects reachable with working galleries and lightbox
- Lighthouse Accessibility ≥ 95 on mobile; Performance measured for reference only (the real gate is in Phase 5)

### Phase 3 — Arabic version
- All 8 pages in Arabic with RTL layout and Arabic fonts
- Arabic content added to data files
- **Gate: client approves Arabic copy**

### Phase 4 — WordPress theme
- **Spike first** on a clean LocalWP site with Elementor v4 and Hello Elementor child theme, building one homepage section with Atomic Elements. It must confirm: (1) global class names appear unchanged in the front-end HTML, so `animations.js` and `interactions.js` can target them; (2) Atomic Forms are available in the free version and send email; (3) whether Atomic Loop is available in the free version (if yes, homepage featured projects read from the CPT; if no, they are static atomic cards); (4) whether Div Blocks offer an HTML tag control; (5) whether a CSS filter control exists (for the partner-logo grayscale hover; if not, the effect is dropped). Results are reported to the owner before the theme build continues.
- Child theme installs and activates on a clean LocalWP site
- CPTs, taxonomy, meta boxes, project templates, Customizer settings working; theme ships exactly `animations.css`, `animations.js`, `theme.css`, `interactions.js`
- Polylang integration: translated CPTs, string translations, language switcher, `hreflang`
- Header, footer, project templates visually match the approved prototype

### Phase 5 — Content and handover
- All content imported in both languages
- English Home built first with Atomic Elements, then stop for owner review; remaining pages follow, Arabic after English
- All pages built in Elementor and exported as JSON templates
- Contact form delivers email (verified in Mailpit locally)
- Lighthouse mobile Performance ≥ 80 and Accessibility ≥ 95 on every page, with Elementor's performance features enabled
- Editing guide delivered; handover session completed

---

## 13. Content corrections

The source PDF contains spelling and grammar errors that are corrected on the website (e.g. "Construct ABetter Tomorrow" → "Construct A Better Tomorrow", "late of the art" → "state-of-the-art", "Drees shop" → "Dress Shop"). The full list is maintained in `CLAUDE.md`. The client will review all edited copy before launch.

---

## 14. Open questions for the client

| # | Question | Blocks |
|---|---|---|
| 1 | Can you provide the logo in vector format (SVG, AI or PDF)? The website logo is a JPG. | Launch |
| 2 | Are original high-resolution photos available? 108 of 191 images are under 1200px, including the Palm Jumeirah villa and all PDF-only projects, plus unwatermarked Jumeirah Golf Estates photos. | Phase 2 |
| 3 | Do originals exist for the services banner and hero background that return errors on the current website? | Phase 2 |
| 4 | Please confirm letter-to-project links: Atlas Copco → Atlas Copco HQ; Bella Cure → Mirdif beauty lounge. Which project was Jan's Noodles, and does that letter have a text version? | Phase 2 |
| 5 | What is the company behind the "R" monogram partner logo? Should partner logos link to their websites? | Phase 2 |
| 6 | Office working hours? | Phase 2 |
| 7 | Please review edited copy, including the spellings "Al-Ali" and "Al-Otaibi". | Phase 2 |
| 8 | Where should contact form submissions be sent? | Phase 5 |
| 9 | Who will review and approve the Arabic copy? | Phase 3 |
| 10 | The new site replaces the current taameer.ae. Are there existing URLs or Google rankings to preserve with redirects? | Phase 5 |
| 11 | Please approve the contact form success message (current wording is a placeholder). | Phase 5 |

---

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Low-resolution images from the PDF | Weak visual quality on large screens | Request originals; design layouts that avoid oversized crops for weak images |
| Stock images look generic next to real project photos | Reduced authenticity | Use stock only for gaps, never for project content; replace with client photos when available |
| Arabic copy delayed in review | Phase 3 slips | Deliver Arabic early; review page by page |
| Client expects Elementor Pro features | Scope dispute | Section 4.2 and 8.1 define what is editable; confirmed at sign-off |
| Scope creep during review rounds | Timeline and budget | Two revision rounds per phase; further changes quoted |
| Elementor v4 is still evolving; atomic features may change or move to Pro | Rework or blocked features | Phase 4 spike verifies features on the installed version; record the tested Elementor version; theme exceptions kept to the closed list in 8.2.1 |

---

## 16. Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 30 Sep 2026 | Initial draft |
| 1.6 | Phase 2 review | Prototype performance is reference only; Lighthouse gate (≥ 80) moved to Phase 5; header mobile menu added to E2; `tp-marquee` added to animations; services hover image swap replaced by static rows; Div Blocks accepted for missing semantic elements; interactions use only href/alt (no data attributes); spike extended with tag and filter checks; CRM integration out of scope; form success message added to open questions |
| 1.5 | — | Option B approved: closed list of three theme exceptions (theme.css, interactions.js, PHP project templates); RTL rule for global classes; Contact Form 7 replaced by Atomic Forms pending spike; embedded map replaced by a Google Maps link; Phase 4 starts with a verification spike |
| 1.4 | — | Page building moves to Elementor v4 Atomic Editor: Atomic Elements only, global variables and classes, no custom widgets/HTML widget/shortcodes (supersedes former 8.2); theme CSS limited to animations; per-device responsive controls; image rules; solid (non-transparent) header; Full Width page settings; English Home first then owner review |
| 1.3 | Phase 1 review | Homepage approved with the Official identity (monochrome, Playfair Display + Inter); bronze archived; renewed contracting license (expires 06/09/2027) confirmed from website; open questions updated from Phase 1 findings |
| 1.2 | 30 Sep 2026 | Current website taameer.ae added as a second, higher-priority source: updated stats, 6 services, Why Choose Us, partners, contact channels, 1 new project, project fact corrections; open questions reduced |
| 1.1 | 30 Sep 2026 | All PDF images and data approved for use, including licenses and all letters; stock images allowed for gaps; documentation and single-agent rules added |
