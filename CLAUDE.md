# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Essays in Bloom** — brand assets (logos, colors, typography). A previous
Astro website was removed for a fresh start; see `WEBSITE-RESET-NOTES.md` for
what was deleted, where assets moved, and the brand values (palette, fonts) to
carry into the next site.

## GitHub

- Repo: `mattbloom1/EssaysInBloom` (private)
- The active `gh` account for this repo is **`mattbloom1`** (the machine also has
  a `matthewGVC` account — do not push under it).
- **Pre-launch:** committing and pushing directly to `main` is fine without
  asking. Once the site has live viewers, we'll switch to a staging / PR-review
  flow — the user will say when.

## Conventions

- `Public/` holds brand assets: final logos (`Public/Logos/`), photos and
  textures (`Public/Pictures/`), and the brand book / mockups / logo archive
  (`Public/Branding and Process/`).
- **Adobe source files (`*.ai`, `*.indd`) live in `Adobe/` and are tracked in
  Git** — commit them alongside other changes. They are large binaries (some
  20 MB+), so keep an eye on repo size, but do not gitignore them.
- Fonts are served from the Adobe Fonts (Typekit) kit `npx4mzh`.
- The local `.claude/` directory is gitignored.
