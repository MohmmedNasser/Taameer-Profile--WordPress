# Product Requirements Document
## Taameer Plus Contracting — Corporate Website

| | |
|---|---|
| **Version** | 1.2 — Draft for client review |
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
| Lighthouse Performance, mobile (static prototype) | ≥ 90 |
| Lighthouse Performance, mobile (WordPress) | ≥ 80 |
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
- Custom Elementor widgets for the design's unique sections (see 8.2)
- Bilingual setup with Polylang (free), English default, Arabic RTL
- Contact form (Contact Form 7)
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

- **Header:** logo, main navigation, language switcher, "Get a Quote" button. Sticky; transparent over the homepage hero, solid on scroll. Accessible mobile menu.
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

Address, office phone, mobile, WhatsApp, email, Instagram, Google Map embed of the Festival City office, contact form (name, email, phone, project type, message), office hours if provided by client.

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
- Arabic typography uses dedicated Arabic fonts (Noto Kufi Arabic for headings, IBM Plex Sans Arabic for body).
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
| Colors and fonts | Elementor Site Settings (Global Colors / Fonts) | Client, with care |

### 8.2 Custom Elementor widgets

Built with the Elementor widget API (works with the free version), each with editable controls:

| Widget | Controls |
|---|---|
| Hero | Title, subtitle, buttons, image, parallax on/off |
| Projects Grid | Number of items, type filter, featured only, order, show filter bar |
| Before / After | Before image, after image, labels, caption, start position |
| Stats Counter | Repeater: number, suffix, label |
| Team Cards | Number, order |
| Testimonials | Number, layout |
| Marquee | Repeater of items, speed, direction |

### 8.3 Animation classes

Entrance and scroll animations are applied by adding CSS classes in Elementor's **Advanced → CSS Classes** field (free feature): `tp-reveal`, `tp-reveal--up/down/start/end/scale`, `tp-stagger`, `tp-parallax`, `tp-split`, `tp-img-reveal`, `tp-counter`. Documented in the editing guide.

---

## 9. Design requirements

- Light, modern, architectural aesthetic inspired by the materials in the project photography: warm stone, travertine, oak, bronze.
- **No dark mode and no dark sections.** Dark tones are used for text only.
- Serif display typography echoing the thin-serif logo; clean sans-serif body text.
- The "+" from the logo is used as a recurring design motif.
- Motion is subtle and purposeful; all motion is disabled when the user's system requests reduced motion.
- Full design tokens (colors, type scale, spacing) are defined in the static prototype and mapped to Elementor Global Colors and Fonts.

---

## 10. Non-functional requirements

| Area | Requirement |
|---|---|
| Browsers | Latest 2 versions of Chrome, Safari (macOS/iOS), Firefox, Edge; Samsung Internet |
| Responsive | 360px to 2560px, tested at 375, 768, 1280, 1920 |
| Performance | WebP images with responsive sizes, lazy loading, no layout shift, no render-blocking third-party scripts |
| Dependencies | No front-end frameworks or JS libraries. Plugins limited to: Elementor, Polylang, Contact Form 7, one SEO plugin |
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
| Page builder | Elementor (free) |
| Multilingual | Polylang (free) |
| Forms | Contact Form 7 |
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
- **Gate: client approves the homepage design before Phase 2**

### Phase 2 — Remaining English pages
- About, Services, Projects (with filtering), Project detail, Testimonials, Contact, 404
- All 21 projects reachable with working galleries and lightbox
- Lighthouse Performance ≥ 90 and Accessibility ≥ 95 on mobile

### Phase 3 — Arabic version
- All 8 pages in Arabic with RTL layout and Arabic fonts
- Arabic content added to data files
- **Gate: client approves Arabic copy**

### Phase 4 — WordPress theme
- Child theme installs and activates on a clean LocalWP site
- CPTs, taxonomy, meta boxes, templates, Customizer settings, custom widgets working
- Polylang integration: translated CPTs, string translations, language switcher, `hreflang`
- Header, footer, project templates visually match the approved prototype

### Phase 5 — Content and handover
- All content imported in both languages
- All pages built in Elementor and exported as JSON templates
- Contact form delivers email (verified in Mailpit locally)
- Editing guide delivered; handover session completed

---

## 13. Content corrections

The source PDF contains spelling and grammar errors that are corrected on the website (e.g. "Construct ABetter Tomorrow" → "Construct A Better Tomorrow", "late of the art" → "state-of-the-art", "Drees shop" → "Dress Shop"). The full list is maintained in `CLAUDE.md`. The client will review all edited copy before launch.

---

## 14. Open questions for the client

| # | Question | Blocks |
|---|---|---|
| 1 | Can you provide the logo in vector format (SVG, AI or PDF)? The website logo is a JPG. | Phase 1 final |
| 2 | Do you have original high-resolution photos for projects not on the current website? | Phase 2 |
| 3 | If the license files on the current website are not the renewed versions, can you send them? (The PDF copy of license 741846 shows expiry 6 September 2026.) | Phase 2 |
| 4 | Office working hours? | Phase 2 |
| 5 | Where should contact form submissions be sent? | Phase 5 |
| 6 | Does the Jan's Noodles appreciation letter have a text version we can quote? | Phase 2 |
| 7 | Who will review and approve the Arabic copy? | Phase 3 |
| 8 | Should the partner logos be linked to the partners' websites? | Phase 2 |
| 9 | The new site replaces the current taameer.ae. Are there existing URLs or Google rankings to preserve with redirects? | Phase 5 |

---

## 15. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Low-resolution images from the PDF | Weak visual quality on large screens | Request originals; design layouts that avoid oversized crops for weak images |
| Stock images look generic next to real project photos | Reduced authenticity | Use stock only for gaps, never for project content; replace with client photos when available |
| Arabic copy delayed in review | Phase 3 slips | Deliver Arabic early; review page by page |
| Client expects Elementor Pro features | Scope dispute | Section 4.2 and 8.1 define what is editable; confirmed at sign-off |
| Scope creep during review rounds | Timeline and budget | Two revision rounds per phase; further changes quoted |
| Future plugin updates break custom widgets | Maintenance cost | Use only the public Elementor widget API; document version tested |

---

## 16. Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 30 Sep 2026 | Initial draft |
| 1.2 | 30 Sep 2026 | Current website taameer.ae added as a second, higher-priority source: updated stats, 6 services, Why Choose Us, partners, contact channels, 1 new project, project fact corrections; open questions reduced |
| 1.1 | 30 Sep 2026 | All PDF images and data approved for use, including licenses and all letters; stock images allowed for gaps; documentation and single-agent rules added |
