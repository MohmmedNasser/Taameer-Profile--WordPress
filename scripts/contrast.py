"""contrast.py — WCAG 2.1 contrast of every text/background token pair used by the design (re-runnable).

    python scripts/contrast.py [bronze|official]      (default: bronze)

Reads the hex values from assets/css/brands/brand-<name>.css (falls back to the bronze palette).
AA: normal text >= 4.5, large text (>= 24px, or >= 18.66px bold) >= 3.0, UI components/graphics >= 3.0.
"""
import re
from pathlib import Path

import sys
BRAND = sys.argv[1] if len(sys.argv) > 1 else "bronze"
TOKENS = Path(__file__).resolve().parent.parent / "assets" / "css" / "brands" / f"brand-{BRAND}.css"
DEFAULT = {"bg": "#FAF8F5", "surface": "#FFFFFF", "sand": "#EFE9E1", "stone": "#DDD4C7", "accent": "#B08D57",
           "accent-text": "#8A6A3B", "secondary": "#5E7A82", "text": "#2E2A26", "text-muted": "#6B645C",
           "white": "#FFFFFF", "on-accent": "#2E2A26"}


def load():
    c = dict(DEFAULT)
    if TOKENS.exists():
        for name, hexv in re.findall(r"--tp-color-([a-z-]+):\s*(#[0-9A-Fa-f]{6})", TOKENS.read_text(encoding="utf-8")):
            c[name] = hexv
    return c


def lum(h):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# (foreground, background, minimum, usage)
PAIRS = [(fg, bg, 4.5, "body/small text") for fg in ("text", "text-muted", "accent-text", "secondary")
         for bg in ("bg", "surface", "sand")]
# Bronze accent is decorative only ("+" marks, hairlines, FAB fill) and never used for text: informational.
INFO = [("accent", bg, "decorative only (no text) — informational") for bg in ("bg", "surface", "sand")]
PAIRS += [("on-accent", "accent", 4.5, "button label / FAB icon on accent fill"),
          ("white", "accent-text", 4.5, "official button hover: white label on charcoal (informational for bronze)"),
          ("stone", "bg", 1.0, "hairline (decorative, exempt)")]

if __name__ == "__main__":
    c = load()
    fails = 0
    print(f"brand: {BRAND}")
    print(f"{'foreground':<14}{'background':<15}{'ratio':>7}  {'min':>4}  result  usage")
    for fg, bg, need, use in PAIRS:
        if fg not in c or bg not in c:
            continue
        r = ratio(c[fg], c[bg])
        ok = r >= need
        fails += not ok
        print(f"{fg:<14}{bg:<15}{r:>7.2f}  {need:>4}  {'PASS' if ok else 'FAIL'}    {use}")
    for fg, bg, use in INFO:
        print(f"{fg:<14}{bg:<15}{ratio(c[fg], c[bg]):>7.2f}     -  INFO    {use}")
    print(f"\n{fails} failing pair(s)")
