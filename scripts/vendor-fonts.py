#!/usr/bin/env python3
"""Vendor reproducible Inter/Orbitron Latin WOFF2, pinned to Google Fonts.

Run manually with: python -m pip install 'fonttools[woff]' brotli
                   python scripts/vendor-fonts.py
The production build never downloads fonts and does not require Python.
"""
from __future__ import annotations

import hashlib
from pathlib import Path
from urllib.request import urlopen
import io

from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib.instancer import instantiateVariableFont

GOOGLE_FONTS_REV = "c30b221beb0c1da59d563feb91ec8656a1fa972a"
ROOT = Path(__file__).resolve().parents[1] / "public" / "assets" / "fonts"
BASE = "https://raw.githubusercontent.com/google/fonts/" + GOOGLE_FONTS_REV + "/ofl"
FONTS = [
    ("inter", "Inter[opsz,wght].ttf", "047c92f6e2212473dc436020afed689527076d44",
     "inter-latin-400-700.woff2"),
    ("orbitron", "Orbitron[wght].ttf", "1fc54ce7116a6ec549f37358466bcc92f9a72c33",
     "orbitron-latin-400-700.woff2"),
]

# Latin + Latin Extended A/B, punctuation, maths, symbols, currency, arrows.
# Language-specific extras outside these ranges use the system fallback.
KEEP = set(range(0x0000, 0x0250))
for start, end in [
    (0x02B0, 0x02FF), (0x0300, 0x036F), (0x1E00, 0x1EFF),
    (0x2000, 0x206F), (0x20A0, 0x20CF), (0x2100, 0x214F),
    (0x2190, 0x21FF), (0x2200, 0x22FF), (0x25A0, 0x25FF),
]:
    KEEP.update(range(start, end + 1))
KEEP.update([0xFEFF, 0xFFFD])

def get(uri: str) -> bytes:
    with urlopen(uri, timeout=30) as response:
        return response.read()

def git_blob_sha(payload: bytes) -> str:
    return hashlib.sha1(
        ("blob " + str(len(payload)) + "\0").encode() + payload
    ).hexdigest()

ROOT.mkdir(parents=True, exist_ok=True)
for family, filename, source_sha, target in FONTS:
    encoded = filename.replace("[", "%5B").replace("]", "%5D").replace(",", "%2C")
    payload = get(f"{BASE}/{family}/{encoded}")
    if git_blob_sha(payload) != source_sha:
        raise RuntimeError(f"Source changed or checksum mismatch: {filename}")

    font = TTFont(io.BytesIO(payload))
    axes = {axis.axisTag: axis for axis in font["fvar"].axes}
    if "wght" not in axes or axes["wght"].minValue > 400 or axes["wght"].maxValue < 700:
        raise RuntimeError(f"{family} does not cover required 400-700 range")

    limits = {"wght": (400, 400, 700)}
    if "opsz" in axes:
        limits["opsz"] = axes["opsz"].defaultValue
    # Subset the original variable font before instancing: recent Inter GVAR
    # uses a glyph variation map that can become inconsistent when instanced first.
    options = subset.Options()
    options.flavor = "woff2"
    options.recalc_average_width = True
    options.recalc_max_context = True
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    options.notdef_glyph = True
    options.recommended_glyphs = True
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=KEEP)
    subsetter.subset(font)
    font = instantiateVariableFont(font, limits, inplace=False)
    font.flavor = "woff2"
    file = ROOT / target
    font.save(file)

    check = TTFont(file)
    assert "wght" in {axis.axisTag for axis in check["fvar"].axes}
    wght = next(axis for axis in check["fvar"].axes if axis.axisTag == "wght")
    assert wght.minValue == 400 and wght.maxValue == 700
    assert len(check.getBestCmap()) >= 50
    print(f"{family}: {target} ({file.stat().st_size:,} bytes, wght 400-700)")

    license_text = get(f"{BASE}/{family}/OFL.txt").decode("utf-8")
    (ROOT / f"LICENSE-{family}.txt").write_text(license_text, encoding="utf-8")
