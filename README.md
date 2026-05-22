# Essays in Bloom

Website and brand assets for **Essays in Bloom**.

This repo currently holds the brand foundation and typography experiments that
the production site will be built on.

## Contents

| Path | Purpose |
|------|---------|
| `index.html` | Simple landing page used for typography A/B testing |
| `brand.html` | Master brand sheet (logos + colors + type scale) |
| `brand-v1.html` / `brand-v2.html` / `brand-v3.html` | Brand sheet per logo version, for side-by-side comparison |
| `brand-v1.jpg` / `brand-v2.jpg` / `brand-v3.jpg` | Exported full-page JPGs of the three brand sheets |
| `export-jpg.mjs` | Script that renders the brand sheets to JPG |
| `Public/Logos/` | Logo + wordmark SVGs (v1, v2, v3) |
| `Public/Pictures/` | Image assets |
| `Asset 15.png` | Raster wordmark |
| `Illustrator/` | Adobe Illustrator source files (not tracked — see `.gitignore`) |

## Brand kit

See `brand.html` for the canonical reference. Summary:

**Typography** (via Adobe Fonts kit `npx4mzh`)
- Display — Artifex Hand CF Heavy, 800, ALL CAPS
- Heading — The Seasons Light, 300, ALL CAPS
- Subheading — Futura PT Demibold, 600, ALL CAPS
- Paragraph — Futura PT Light, 300, sentence case

> Note: the Light and Demibold cuts still need to be added to the Adobe kit;
> until then the browser falls back to the nearest available weight.

**Colors**
- Ink `#141214` — text / logo
- Forest `#285F3C` — primary
- Leaf `#60AD62` — secondary
- Periwinkle `#7F9FFF` — accent
- Cool white `#F8FBFB` / Warm white `#FEFAF9` — backgrounds (contextual)

## Exporting the brand sheets to JPG

Requires Node and a local install of Google Chrome.

```bash
npm install            # installs playwright-core
node export-jpg.mjs    # writes brand-v1.jpg, brand-v2.jpg, brand-v3.jpg
```

## Viewing locally

These are static HTML files. Open any of them directly in a browser, or serve
the folder:

```bash
npx serve .
```
