"""check-partials.py — verifies the shared blocks are byte-identical on every page (re-runnable QA).

    python scripts/check-partials.py

Every page carries the header, footer, icon sprite, WhatsApp button and CTA band literally, wrapped in
<!-- PARTIAL:name START --> / <!-- PARTIAL:name END --> (they become header.php / footer.php / a
shared template in the WordPress theme). The blocks must match index.html except for the two
per-page facts that are allowed to differ:
  1. the active nav state (aria-current="page" on the current page's link)
  2. the language-switcher target (ar/<this page>.html; the Polylang switcher in WordPress)
Also checks: exactly one active nav link per nav, pointing at the right page; the per-page SEO head
(title, description, Open Graph, canonical/hreflang placeholder); one <h1>; the shared stylesheet set.
Scans *.html in the project root and ar/*.html (Phase 3). Exit code 1 on any failure.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REFERENCE = "index.html"
PARTS = ("sprite", "header", "footer", "whatsapp", "cta")
OPTIONAL = {"cta"}  # pages such as 404 may omit the CTA band
# Pages whose nav highlight is a different page (None = no active link).
NAV_FOR = {"project.html": "projects.html", "404.html": None}
SHARED_CSS = ("tokens.css", "base.css", "layout.css", "components.css", "theme.css", "animations.css")
SHARED_JS = ("animations.js", "interactions.js")

failures = []


def fail(page, msg):
    failures.append(f"{page}: {msg}")


def block(html, name):
    m = re.search(rf"<!-- PARTIAL:{name} START -->(.*?)<!-- PARTIAL:{name} END -->", html, re.S)
    return m.group(1) if m else None


def normalize(text):
    text = text.replace('\r\n', '\n')
    text = re.sub(r' aria-current="page"', "", text)
    text = re.sub(r'href="(?:\.\./)?ar/[\w-]+\.html"', 'href="ar/PAGE.html"', text)
    return text


def pages():
    files = sorted(ROOT.glob("*.html")) + sorted((ROOT / "ar").glob("*.html"))
    return files


def main():
    ref_path = ROOT / REFERENCE
    ref_html = ref_path.read_text(encoding="utf-8")
    ref = {n: normalize(block(ref_html, n) or "") for n in PARTS}
    for n in PARTS:
        if not ref[n].strip():
            fail(REFERENCE, f"reference has no PARTIAL:{n} block")

    checked = 0
    for path in pages():
        rel = path.relative_to(ROOT).as_posix()
        html = path.read_text(encoding="utf-8")
        checked += 1

        for n in PARTS:
            b = block(html, n)
            if b is None:
                if n not in OPTIONAL:
                    fail(rel, f"missing PARTIAL:{n}")
                continue
            if normalize(b) != ref[n]:
                # show the first differing line to make the drift easy to find
                a, c = normalize(b).splitlines(), ref[n].splitlines()
                first = next((i for i, (x, y) in enumerate(zip(a, c)) if x != y), min(len(a), len(c)))
                got = a[first].strip()[:90] if first < len(a) else "(end)"
                want = c[first].strip()[:90] if first < len(c) else "(end)"
                fail(rel, f"PARTIAL:{n} differs from {REFERENCE} at line {first + 1}: «{got}» vs «{want}»")

        # Active nav state: exactly one per nav, on the right page.
        name = path.name
        expected = NAV_FOR.get(name, name)
        hdr = block(html, "header") or ""
        ftr = block(html, "footer") or ""
        for label, region, css in (("desktop nav", hdr, "tp-nav__link"), ("mobile menu", hdr, "tp-menu__link"),
                                   ("footer quick links", ftr, None)):
            if css:
                links = re.findall(rf'<a class="{css}"[^>]*>', region)
            else:
                m = re.search(r'id="tp-footer-links".*?</nav>', region, re.S)
                links = re.findall(r"<a [^>]*>", m.group(0)) if m else []
            current = [l for l in links if 'aria-current="page"' in l]
            if expected is None:
                if current:
                    fail(rel, f"{label}: no link should be active on this page")
            elif len(current) != 1:
                fail(rel, f"{label}: {len(current)} links marked aria-current (want 1)")
            elif f'href="{expected}"' not in current[0]:
                fail(rel, f"{label}: active link is {current[0]}, expected {expected}")

        # Per-page SEO head.
        head = html.split("</head>")[0]
        title = re.search(r"<title>(.*?)</title>", head, re.S)
        if not title or len(title.group(1).strip()) < 15:
            fail(rel, "missing/short <title>")
        if not re.search(r'<meta name="description" content="[^"]{60,}"', head):
            fail(rel, "missing meta description (>= 60 chars)")
        for prop in ("og:type", "og:site_name", "og:title", "og:description", "og:image"):
            if f'property="{prop}"' not in head:
                fail(rel, f"missing {prop}")
        if "canonical" not in head or "hreflang" not in head:
            fail(rel, "missing canonical/hreflang placeholder comment")
        if re.search(r'<link rel="(canonical|alternate)"', re.sub(r"<!--.*?-->", "", head, flags=re.S)):
            fail(rel, "live canonical/hreflang link found — they stay comments until Phase 3")
        for f in SHARED_CSS:
            if f"assets/css/{f}" not in head:
                fail(rel, f"missing stylesheet {f}")
        for f in SHARED_JS:
            if f"assets/js/{f}" not in head:
                fail(rel, f"missing script {f}")
        if 'data-brand' in html or 'brand-switcher' in html:
            fail(rel, "brand switcher remnants")
        h1_count = len(re.findall(r"<h1[\s>]", html))
        if h1_count != 1:
            fail(rel, f"{h1_count} <h1> elements (want 1)")
        if "<main id=\"main\"" not in html:
            fail(rel, "missing <main id=\"main\">")

    print(f"checked {checked} page(s): {', '.join(p.relative_to(ROOT).as_posix() for p in pages())}")
    if failures:
        print(f"\n{len(failures)} FAILURE(S):")
        for f in failures:
            print("  FAIL", f)
        sys.exit(1)
    print("check-partials: all pages OK")


if __name__ == "__main__":
    main()
