# Handoff — 3D essay-page hero (next session, dialed in on this)

> **⚠️ SUPERSEDED (2026-06-17).** The 3-page scroll-*drift* hero described below
> was replaced by a **pinned page-arc** hero (scroll locks; ~12 pages arc over a
> centered "essays in bloom" wordmark and stack at bottom-left; the empathy beat
> was removed). Current source of truth:
> **`docs/superpowers/specs/2026-06-17-hero-page-arc-design.md`**. Rig is now
> `src/scripts/hero-pages.ts` (+ `hero-pages-tuner.ts`), NOT `hero-3d.ts`.
> Still valid below: the **paper-mask** technique (`Paper{1,2,3}.png` masking
> `.page-card__ink` for theme-adaptive ink) — reused unchanged. Ignore the
> drift/`.hero-region`/perspective/empathy bits.

**Date:** 2026-06-17
**Purpose:** This doc is a cold-start brief for a session focused **only** on the
hero's 3D essay-page drift. The homepage + motion system are already built,
reviewed, verified, and pushed to `origin/main`. The 3D pages are currently
**placeholders**; this is the 50/50 step where Alison/Matt provides real
essay-page art + direction and we design/tune the motion together.

Read this doc + the referenced files; you do not need the rest of the chat.

## Locked decisions (do NOT relitigate)

- The hero has **no centered logo**; the brand mark lives (and blooms once/visit)
  in the nav. Hero = subline + two buttons + the 3D pages behind them.
- The 3D moment is **CSS 3D transforms scrubbed by native scroll via GSAP
  ScrollTrigger** — no WebGL/Three.js, no Lenis/smooth-scroll. GSAP ships on the
  **homepage only**.
- Motion is restrained/literary, **transform/opacity only**, **reduced-motion
  safe**, reuse brand tokens (no new fonts/colors), verify **light + dark**.
- Full rationale: `docs/superpowers/specs/2026-06-17-motion-system-design.md`
  (esp. §4 hero drift, §8 the 50/50 split). Build plan:
  `docs/superpowers/plans/2026-06-17-homepage-with-motion.md` (Task B3/B4).

## Current implementation (exact)

**Markup — `src/pages/index.astro`**: a `.hero-region` wrapper holds the stage
plus BOTH the hero and the empathy beat, so the pages drift across both
sections (origin centered between them):
```html
<div class="hero-region">
  <div class="hero__stage" aria-hidden="true">
    <div class="page-card" data-page="0"><span class="page-card__ink"></span></div>
    <div class="page-card" data-page="1"><span class="page-card__ink"></span></div>
    <div class="page-card" data-page="2"><span class="page-card__ink"></span></div>
  </div>
  <section class="hero container" aria-label="Introduction">
    <h1 class="visually-hidden">Essays in Bloom — What's Your Story?</h1>
    <div class="hero__content" data-reveal>
      <p class="hero__tagline">…</p>
      <div class="button-row hero__cta">… two .btn.lift buttons …</div>
    </div>
  </section>
  <section class="container container--narrow section empathy" data-reveal>…</section>
</div>
```
The cards now hold real art: `static/pictures/Paper{1,2,3}.png` — transparent
PNGs of handwriting "scribble" lines (rough → polished). They're applied as a
**CSS mask** on `.page-card__ink` (filled with `var(--color-ink)` at 82%), NOT
as `<img>` — so the writing takes the theme's ink color and stays legible on
both light (dark ink on linen) and dark (linen ink on coffee) paper. Per-card
mask is keyed off `[data-page]` in `home.css`. Source of truth is
`static/pictures/` (NOT `dist/`, which is gitignored + rebuilt).

**CSS — `src/styles/home.css`** (`/* --- Hero --- */` block):
- `.hero-region` — `position: relative; overflow: clip;` — the stage's
  containing block; spans hero + empathy; `clip` (not `hidden`) contains the
  drifting pages without a scroll container that would fight ScrollTrigger.
- `.hero` — `position: relative;` (no longer clips; the region does).
- `.hero__content` / `.empathy` — `position: relative; z-index: 1;` (both sit
  above the stage so the cards stay decorative behind the text).
- `.hero__stage` — `position: absolute; inset: 0; perspective: 1200px;
  pointer-events: none; z-index: 0;` (now spans the whole region).
- `.page-card` — `position: absolute; top:50%; left:50%;
  width: clamp(120px,14vw,200px); aspect-ratio: 8.5/11;
  background: var(--color-paper); border + box-shadow;
  transform: translate(-50%,-50%);` (CSS resting/centered state, used when
  reduced-motion means the GSAP rig never runs). `top:50%` now centers cards in
  the **combined** region (≈ the hero/empathy boundary).

**Motion — `src/scripts/hero-3d.ts`** (config + rig), mounted from the
`<script>` at the bottom of `src/pages/index.astro` (after `</Base>`; Astro
bundles it, homepage-only):
- `HERO_3D_CONFIG` — the single source of truth: `perspective`,
  `perspectiveOrigin{X,Y}`, `scrub`, a `rest[]` pose per card (`x/y/z/ry`), and
  an `end` block (`xMul`, `zOffset`, `ryMul`, `yPercent`) describing the
  scrubbed exit drift. Every magic number is here, commented, with units/signs.
- `mountHero3D()` — builds the rig from the config: sets stage perspective +
  origin, `gsap.set`s each card's resting pose, and creates the scrubbed
  `gsap.to` (`scrollTrigger` `top top → bottom top`). Returns an API
  (`{ config, cards, stage, rebuild }`) or `null` under reduced-motion / no
  cards (then cards rest in their CSS-centered state).

Defaults match the old inline values (rest poses unchanged; `end` =
`xMul 2.2, zOffset -200, ryMul 1.8, yPercent -90`; `scrub 0.6`; `perspective
1200`, origin `50/50`).

**Live tuner — `src/scripts/hero-3d-tuner.ts`** (dev-only): a floating slider
panel (top-right) that drives the rig in real time — Stage / Exit drift /
Card N groups, one slider+number per knob. Drag to tune by feel, then **Copy**
emits a `HERO_3D_CONFIG` snippet to paste over the one in `hero-3d.ts`. It's
dynamically imported behind `import.meta.env.DEV`, so Vite strips it (and the
import) from production — verified absent from `dist/`. Adapts to card count
(reads the actual `.page-card`s and extends/trims `rest` to match).

## What the user provides (their half of 50/50)

- **Real essay-page artwork/content** for the cards (e.g. a rough first draft vs.
  a polished final, or pages showing the Discover→Bloom progression). Drop assets
  in `static/` (suggest `static/pages/`). Then swap the empty `.page-card` divs for
  the art — simplest is an `<img>` inside each card, or a `background-image`.
- **Direction on the motion feel**: how many pages, their start/end poses, depth,
  rotation, parallax speed, whether they fan/converge, timing.

## Tuning checklist (deferred from review — address with the real art)

- **`perspective-origin`** on `.hero__stage` (currently default center) — set once
  cards are placed so foreshortening reads right across the spread.
- **`y` vs `yPercent` exit asymmetry**: the scrub animates `yPercent:-90` on top of
  each card's resting `y`, so cards exit at slightly different heights. Decide if
  that's wanted; if not, animate `y` to a common value or drop per-card `y`.
- **`will-change: transform`** on `.page-card` if profiling shows jank (GSAP
  already layer-promotes; add only if needed, and clear after).
- **Card count / poses / scrub**: all in `HERO_3D_CONFIG` (`rest[]` + `end` +
  `scrub`). Easiest path — run `npm run dev`, drag the dev tuner panel
  (top-right), then Copy → paste over `HERO_3D_CONFIG`. `perspective-origin`
  above is now a live knob in that panel too.
- If you add real images, re-confirm **light + dark** legibility and that cards
  don't overflow horizontally on mobile (the `.hero` has `overflow: clip`).

## Constraints to preserve (don't regress)

- Only `transform`/`opacity` animate. Keep the `if (!reduce && …)` guard so the
  ScrollTrigger timeline is never built under `prefers-reduced-motion` (cards then
  rest in their CSS-centered state — keep that legible).
- GSAP stays homepage-only (import lives in this page's `<script>`).
- Reuse tokens; no new fonts/colors. Decorative cards stay `aria-hidden`.
- After changes: `npm run build` must pass; verify in preview (`npm run dev` →
  http://localhost:4321), scroll to confirm the scrub, check both themes, confirm
  no console errors.

## Pointers

- Specs: `docs/superpowers/specs/2026-06-17-motion-system-design.md`,
  `…/2026-06-17-homepage-design.md`
- Build plan: `docs/superpowers/plans/2026-06-17-homepage-with-motion.md`
- SDD ledger (full execution history + deferred list): `.git/sdd/progress.md`
- Resolved open item: **Workshops is an active service** — keep both the Coaching
  and Workshops service cards (no change needed).
