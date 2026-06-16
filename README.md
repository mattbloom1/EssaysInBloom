# Essays in Bloom

Website and brand assets for **Essays in Bloom**.

This repo currently holds the brand foundation and typography experiments that
the production site will be built on.

## Contents

| Path | Purpose |
|------|---------|
| `index.html` | Simple landing page used for typography A/B testing |
| `brand.html` | Master brand sheet — all logo options stacked + colors + type scale |
| `brand.jpg` | Exported full-page JPG of the brand sheet |
| `export-jpg.mjs` | Script that renders the brand sheet to JPG |
| `Public/Logos/` | Logo + wordmark SVGs (options v1–v6) |
| `Public/Pictures/` | Image assets |
| `Illustrator/` | Adobe Illustrator source files (not tracked — see `.gitignore`) |

## Exporting the brand sheets to JPG

Requires Node and a local install of Google Chrome.

```bash
npm install            # installs playwright-core
node export-jpg.mjs    # writes brand.jpg
```

## Viewing locally

These are static HTML files. Open any of them directly in a browser, or serve
the folder:

```bash
npx serve .
```
