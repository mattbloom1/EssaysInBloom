# Website Reset Notes

**Date:** 2026-07-08

The Astro website was removed for a fresh start. This file records what was
deleted, what was kept, and how to recover anything if needed.

## How to recover deleted files

Everything removed here still exists in Git history. The last commit that
contains the full website is:

```
caf1dc64dc35c70fe25df265131dd9d2dc7bf48f  (2026-06-18)
```

To view or restore a file from it:

```bash
git show caf1dc6:src/styles/tokens.css          # view a file
git checkout caf1dc6 -- src/                    # restore a whole directory
```

## What was deleted

### Astro project scaffolding
- `astro.config.mjs` — Astro config (static output, `publicDir` pointed at `static/`)
- `package.json` / `package-lock.json` — the only dependency was `astro` v6

### `src/` — all site code
- **Pages** (`src/pages/`): `index`, `about`, `approach`, `coaching`,
  `workshops`, `testimonials`, `contact`, `accessibility`, `privacy`, `terms`
- **Layout** (`src/layouts/Base.astro`): shared head, Adobe Fonts (Typekit) kit
  `npx4mzh` link, dark/light theme script
- **Components** (`src/components/`): `Header`, `Footer`, `Wordmark`,
  `FlowerMark`, `CtaBand`, `SectionHeading`, `ServiceCard`, `StepCard`,
  `Testimonial`
- **Styles** (`src/styles/`): `tokens.css` (design tokens — key values
  preserved below), `reset`, `typography`, `layout`, `components`, `motion`,
  `home`, with `main.css` importing the rest
- **Scripts** (`src/scripts/`): `hero-pages.ts` and `hero-pages-tuner.ts` —
  the 3D scroll-driven hero animation on the homepage

### `docs/` — website design documents
- `docs/superpowers/specs/2026-06-17-homepage-design.md`
- `docs/superpowers/specs/2026-06-17-motion-system-design.md`
- `docs/superpowers/specs/2026-06-17-hero-page-arc-design.md`
- `docs/superpowers/plans/2026-06-17-homepage-with-motion.md`
- `docs/superpowers/notes/2026-06-17-3d-hero-pages-handoff.md`

### `static/`
- `robots.txt` (the only web-only file; everything else in `static/` was moved,
  see below)

## What was moved (not deleted)

The final brand assets that the site served from `static/` were relocated into
`Public/` so they live with the rest of the brand material:

- `static/logos/` → `Brand/Public/Logos/` — final logo set (Full, Full NO
  Text, Half, Small, Text Only, Favicon Light/Dark)
- `static/pictures/` → `Brand/Public/Pictures/` — profile photo, paper
  textures, stock photos

## What was kept untouched

- `Brand/Adobe/` — Illustrator/InDesign source files
- `Brand/Public/Branding and Process/` — brand book PDF, business card and
  letterhead mockups, archived logo explorations (v1–v6)

*(After the reset, the repo was reorganized into two top-level folders:
`Website/` for the site and `Brand/` for everything else — the paths above
reflect that.)*

## Brand values worth carrying into the next site

These lived only in `src/styles/tokens.css` (full file recoverable via the
commit above).

### Palette — light variant
| Swatch | Hex | Role |
|---|---|---|
| Soft Linen | `#F2EDE3` | paper |
| Shadow Grey | `#2B2622` | ink |
| Evergreen | `#133430` | primary |
| Hunter Green | `#29603D` | accent |
| Light Bronze | `#E0A98D` | soft |

### Palette — dark variant
| Swatch | Hex | Role |
|---|---|---|
| Dark Coffee | `#2A2119` | paper |
| Soft Linen | `#F2EDE3` | ink |
| Cinnamon Wood | `#B5654A` | primary |
| Burnt Peach | `#E2754E` | accent |
| Eggshell | `#F2EAD8` | soft |

### Typography
Fonts load from Adobe Fonts (Typekit) kit **`npx4mzh`**:

- **Display:** Artifex Hand CF (`artifex-hand-cf`), weight 800 (Heavy)
- **Headings:** The Seasons (`the-seasons`) — brand book wants Light (300);
  the kit only ships 400/700, so add 300 to the kit to match the book
- **Subheadings/Body:** Futura PT (`futura-pt`) — book wants Demibold (600)
  and Light (300); kit only ships 400/700, same caveat
