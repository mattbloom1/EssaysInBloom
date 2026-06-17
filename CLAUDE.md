# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Essays in Bloom** — website and brand assets. Built with **Astro** (static
output). The brand foundation (logos, colors, typography) is in place; most page
content is still being built out.

## GitHub

- Repo: `mattbloom1/EssaysInBloom` (private)
- The active `gh` account for this repo is **`mattbloom1`** (the machine also has
  a `matthewGVC` account — do not push under it).
- **Pre-launch:** committing and pushing directly to `main` is fine without
  asking. Once the site has live viewers, we'll switch to a staging / PR-review
  flow — the user will say when.

## Conventions

- **Astro 6**, no client framework. `npm run dev` to serve; `npm run build`
  outputs static HTML to `dist/`.
- Structure: routes in `src/pages/*.astro`; shared shell (head, theme script) in
  `src/layouts/Base.astro`; shared nav/footer in `src/components/Header.astro` and
  `Footer.astro` (active tab is computed at build time from the URL — no JS
  injection); styles in `src/styles/*.css` (`main.css` imports the rest).
- Design tokens (brand colors, type, spacing, radius) are CSS custom properties
  in `src/styles/tokens.css`. Fonts load via the Adobe Fonts (Typekit) kit linked
  in `Base.astro`.
- Web-served static assets live in `static/` (logos, pictures, robots.txt);
  Astro's `publicDir` is set to `./static` so it does **not** serve `Public/`.
- `Public/` holds non-served brand sources (the brand book, mockups, fonts).
- **Adobe source files (`*.ai`, `*.indd`) live in `Adobe/` and are tracked in
  Git** — commit them alongside other changes. They are large binaries (some
  20 MB+), so keep an eye on repo size, but do not gitignore them.
- The local `.claude/` directory is gitignored.
