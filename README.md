# Essays in Bloom

Website and brand assets for **Essays in Bloom**, split at the top level:

| Path | Purpose |
|------|---------|
| `Website/` | The website — Astro 6, static output |
| `Brand/` | Everything else: brand and design assets |

## Brand contents

| Path | Purpose |
|------|---------|
| `Brand/Adobe/` | Illustrator / InDesign source files (tracked in Git) |
| `Brand/Public/Logos/` | Final logo set (SVG) |
| `Brand/Public/Pictures/` | Photos and textures |
| `Brand/Public/Branding and Process/` | Brand book PDF, mockups, archived logo explorations |

## Website

**Live test site:** <https://mattbloom1.github.io/EssaysInBloom/> — deployed
automatically by GitHub Actions on every push to `main` that touches
`Website/`.

A fresh Astro scaffold, being rebuilt from scratch:

```bash
cd Website
npm install
npm run dev      # local dev server
npm run build    # static HTML to Website/dist/
```

Routes live in `Website/src/pages/`, the shared shell in
`Website/src/layouts/Base.astro`, styles in `Website/src/styles/` (brand
palette and fonts are tokens in `tokens.css`), and web-served assets in
`Website/static/`.

The previous site was removed for a fresh start — see
`Website/WEBSITE-RESET-NOTES.md` for what was deleted, how to recover it, and
the brand values carried into this build.
