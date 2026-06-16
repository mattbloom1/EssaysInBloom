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

## Conventions

- Static HTML/CSS only so far; no build step. `brand.html` is the single brand
  sheet — it stacks every logo option and shares an inline `:root` token block.
- **Adobe source files (`*.ai`, `*.indd`) live in `Adobe/` and are tracked in
  Git** — commit them alongside other changes. They are large binaries (some
  20 MB+), so keep an eye on repo size, but do not gitignore them.
- The local `.claude/` directory is gitignored.
