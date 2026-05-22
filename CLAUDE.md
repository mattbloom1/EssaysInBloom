# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Essays in Bloom** — website and brand assets. The repo currently contains the
brand foundation (logos, colors, typography) and static HTML used for
typography A/B testing. The production site has not been built yet.

## GitHub

- Repo: `mattbloom1/EssaysInBloom` (private)
- The active `gh` account for this repo is **`mattbloom1`** (the machine also has
  a `matthewGVC` account — do not push under it).
- **Do not push unless explicitly asked.** The user reviews changes locally first.

## Brand kit (source of truth: `brand.html`)

### Typography — Adobe Fonts kit `npx4mzh`
Each style maps to one CSS variable so A/B swaps only touch the `:root` block:

| Style | Font (Adobe family) | Weight | Case |
|-------|--------------------|--------|------|
| Display | `artifex-hand-cf` | 800 | ALL CAPS |
| Heading | `the-seasons` | 300 | ALL CAPS |
| Subheading | `futura-pt` | 600 | ALL CAPS |
| Paragraph | `futura-pt` | 300 | sentence |

Tracking is 0 throughout. The kit currently only ships the 400/700 cuts of
The Seasons and Futura PT — the **Light (300)** and **Demi (600)** weights still
need adding in fonts.adobe.com. Keep the CSS weights at the spec-intended values
so they render correctly once the cuts are added.

### Colors
| Role | Hex |
|------|-----|
| Ink (text/logo) | `#141214` |
| Forest (primary) | `#285F3C` |
| Leaf (secondary) | `#60AD62` |
| Periwinkle (accent) | `#7F9FFF` |
| Cool white (bg) | `#F8FBFB` |
| Warm white (bg) | `#FEFAF9` |

### Logos
Three versions live in `Public/Logos/`: v1 (unprefixed), `v2 *`, `v3 *`. Each has
a mark, a long wordmark, and a tall wordmark. Logo art is near-black and reverses
cleanly to white on dark backgrounds (`filter: invert(1)`).

## Conventions

- Static HTML/CSS only so far; no build step. Brand sheets share an inline
  `:root` token block — keep colors/type identical across `brand-v*.html`.
- **Adobe Illustrator source files (`*.ai`) are gitignored** and live in
  `Illustrator/`. Do not commit them (they are large binaries).
- `node_modules/` and the local `.claude/` directory are gitignored.

## Regenerating brand-sheet JPGs

`node export-jpg.mjs` renders `brand-v{1,2,3}.html` to full-page JPGs using
`playwright-core` driving the system Chrome (`channel: 'chrome'`).
