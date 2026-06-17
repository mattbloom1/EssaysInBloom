# Handoff — 3D essay-page hero (next session, dialed in on this)

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

**Markup — `src/pages/index.astro`** (hero is the first section):
```html
<section class="hero container" aria-label="Introduction">
  <h1 class="visually-hidden">Essays in Bloom — What's Your Story?</h1>
  <div class="hero__stage" aria-hidden="true">
    <div class="page-card" data-page="0"></div>
    <div class="page-card" data-page="1"></div>
    <div class="page-card" data-page="2"></div>
  </div>
  <div class="hero__content" data-reveal>
    <p class="hero__tagline">…</p>
    <div class="button-row hero__cta">… two .btn.lift buttons …</div>
  </div>
</section>
```
The three `.page-card`s are **empty divs** (no art yet).

**CSS — `src/styles/home.css`** (`/* --- Hero --- */` block):
- `.hero` — `position: relative; overflow: clip;` (`clip`, not `hidden`, so it
  doesn't create a scroll container that would fight ScrollTrigger).
- `.hero__content` — `position: relative; z-index: 1;` (sits above the stage).
- `.hero__stage` — `position: absolute; inset: 0; perspective: 1200px;
  pointer-events: none; z-index: 0;`
- `.page-card` — `position: absolute; top:50%; left:50%;
  width: clamp(120px,14vw,200px); aspect-ratio: 8.5/11;
  background: var(--color-paper); border + box-shadow;
  transform: translate(-50%,-50%);` (CSS resting/centered state, used when
  reduced-motion means the GSAP rig never runs).

**Motion — GSAP `<script>` at the bottom of `src/pages/index.astro`** (after
`</Base>`; Astro bundles it, homepage-only):
```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cards = gsap.utils.toArray('.page-card');
if (!reduce && cards.length) {
  gsap.registerPlugin(ScrollTrigger);
  const rest = [               // resting (top of page) per-card 3D pose
    { x: -160, y: -10, z: -260, ry:  18 },
    { x:   10, y:  20, z: -120, ry:  -8 },
    { x:  180, y: -30, z: -360, ry:  26 },
  ];
  cards.forEach((card, i) => {
    const r = rest[i % rest.length];
    gsap.set(card, { xPercent:-50, yPercent:-50, x:r.x, y:r.y, z:r.z, rotateY:r.ry });
  });
  gsap.to(cards, {            // scrubbed end pose as hero scrolls away
    x: i => rest[i].x * 2.2,
    z: i => rest[i].z - 200,
    rotateY: i => rest[i].ry * 1.8,
    yPercent: -90,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start:'top top', end:'bottom top', scrub: 0.6 },
  });
}
```
Verified working: at scroll depth the cards scrub to the end pose
(x×2.2, z−200, rotateY×1.8, yPercent −90); reduced-motion skips the whole block.

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
- **Card count / poses / scrub**: all in the `rest` array + the `gsap.to`
  multipliers + `scrub: 0.6`. Tune live in the preview.
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
