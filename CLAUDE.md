# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Essays in Bloom** — website and brand assets, split at the top level:

- `Website/` — the website: **Astro 6** (static output), scaffolded with all
  routes, brand styling, and GSAP motion. Read `Website/DESIGN.md` (design
  system + styling direction) and `Website/TODO.md` (current state, open
  items) before working on it. `Website/WEBSITE-RESET-NOTES.md` records the
  previous site's removal and how to recover it.
- `Brand/` — everything else: brand and design assets.

## GitHub

- Repo: `mattbloom1/EssaysInBloom` (private)
- The active `gh` account for this repo is **`mattbloom1`** (the machine also has
  a `matthewGVC` account — do not push under it).
- **Pre-launch:** committing and pushing directly to `main` is fine without
  asking. Once the site has live viewers, we'll switch to a staging / PR-review
  flow — the user will say when.

## Conventions

- **Website** (run npm commands from inside `Website/`): `npm run dev` to
  serve; `npm run build` outputs static HTML to `Website/dist/`. Routes in
  `src/pages/*.astro`; shared shell (head, fonts) in `src/layouts/Base.astro`;
  components in `src/components/`; styles in `src/styles/` (`main.css` imports
  the rest; brand palette/fonts are CSS custom properties in `tokens.css`).
  Web-served assets live in `Website/static/` (Astro's `publicDir`) — copy
  what the site needs from `Brand/` into there; `Brand/` itself is never
  served.
- `Brand/Public/` holds brand assets: final logos (`Brand/Public/Logos/`),
  photos and textures (`Brand/Public/Pictures/`), and the brand book /
  mockups / logo archive (`Brand/Public/Branding and Process/`).
- **Adobe source files (`*.ai`, `*.indd`) live in `Brand/Adobe/` and are
  tracked in Git** — commit them alongside other changes. They are large
  binaries (some 20 MB+), so keep an eye on repo size, but do not gitignore
  them.
- Fonts are served from the Adobe Fonts (Typekit) kit `npx4mzh`.
- The local `.claude/` directory is gitignored.
