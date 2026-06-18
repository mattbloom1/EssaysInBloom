# Spec — hero "page arc"

**Date:** 2026-06-17
**Status:** BUILT + iterated with the user. **Supersedes** the 3-page
scroll-drift hero (`HERO_3D_CONFIG` / `.hero-region`). Cold-start-resumable.

> ## ⚡ As built (current state — read this first; it overrides the "pinned" framing below)
>
> The hero is the homepage's first section: a centered **"essays in bloom"
> wordmark** (top), tagline, two CTA buttons; behind/around them, **N essay
> pages** (cycling `Paper1/2/3.png`) animate along a quadratic-Bézier arc
> (entry → crest → bottom-left stack), peeling in **staggered** as you scroll.
>
> Key changes since the original design below:
> - **Pinned, but the scene keeps moving** (the no-pin version felt too fast;
>   user chose pin-with-motion). GSAP **ScrollTrigger `pin: true` + scrub** over
>   `config.pin`% of scroll (field name `pin` now means "scroll distance" —
>   bigger = slower; starts at `top top`). During the lock the pages animate AND
>   the hero content (wordmark/tagline/buttons) drifts up `config.contentRise`%
>   + fades (`tween.fromTo`), so it reads as slow-motion scroll, not a freeze.
> - **`reverse` toggle** — `false` = pages fly IN (entry→stack); `true` = fly
>   AWAY (stack→entry). Implemented as `dirT = reverse ? 1-t : t`.
> - The **empathy beat was removed**; hero → straight to The Approach.
> - The nav is **NOT sticky** (tried it, user reverted — `header` is back to just
>   a border-bottom in `components.css`).
> - Hero content is **top-aligned** (`align-items: start`, `padding-block:
>   var(--space-20) var(--space-12)`), not vertically centered, so the wordmark
>   sits high.
>
> **Files (all built):** rig `src/scripts/hero-pages.ts` (`HERO_PAGES_CONFIG` +
> `mountHeroPages()`, seeded per-page jitter, 0-viewport guard, resize rebuild,
> reduced-motion = settled stack); dev tuner `src/scripts/hero-pages-tuner.ts`
> (knobs: count, length%, scrub, stagger, scale, rise%, reverse, entry, crest,
> stack; Copy → paste over `HERO_PAGES_CONFIG`); `src/components/Wordmark.astro`
> (inlined SVG, `currentColor`); markup in `src/pages/index.astro`; styles in
> `src/styles/home.css`. Pages use the `.page-card__ink` mask (theme-adaptive).
>
> **Current `HERO_PAGES_CONFIG`:** count 10, pin 150, scrub 2.3, scale 1,
> stagger 0.1, contentRise 45, reverse false, entry
> {x50,y76,spread150,rotMin-26,rotMax26}, crest {x50,y70},
> stack {x48,y82,dx0,dy-0.5,rotJitter10}. (Tune live via the dev panel.)
>
> **Verification note:** build clean + dev bits stripped from `dist`; pin
> (pin-spacer present), content drift (yPercent + fade), arc logic, and
> no-sticky-nav confirmed via DOM checks; light+dark looked right in earlier
> screenshots. Screenshots hang while GSAP's scrub ticker is live (page never
> goes idle) — a preview-tool quirk, not a site bug. **Worth a real-browser
> scroll once** to feel the slow-motion pacing.

## Concept

The hero is a **pinned (scroll-locked) section**. While locked, the centered
hero column — the **"essays in bloom" wordmark** (top), the tagline, and the two
CTA buttons — stays put. As the user scrolls, **~12 paper pages** fly in from
**off-screen bottom-right** at slightly random orientations, **arc up and over
the wordmark**, and settle into a **partially-neat stack at bottom-left**. Pages
peel in **staggered** (one after another) across the scroll. When the lock
releases, the page flows into **The Approach**.

User decisions (locked):
- Hero content = wordmark above + existing tagline + two buttons below, all
  pinned/visible during the lock.
- Pacing: **medium**, lock ≈ 1.5–2 screens, pages staggered in.
- The old 3-page drift AND the **"Not sure where to start?"** empathy beat are
  **removed**; after the pin → straight to The Approach.
- Reuse the 3 paper designs (`Paper1/2/3.png`), **≥10 pages** (default 12).
- Pages pass **in front of** the wordmark, arc cresting just above it.

## Approach

GSAP **ScrollTrigger pin + scrub** on `.hero`, driving a **staggered timeline**.
Each page follows a **hand-rolled quadratic Bézier** arc (entry → crest above
wordmark → stack) — chosen over MotionPathPlugin because per-page jittered
endpoints + custom rotation interpolation are simpler and more tunable this way.
No new dependency (GSAP + ScrollTrigger already in use, homepage-only).

## Geometry (all in % of the pinned stage, converted to px at runtime + on resize)

- **Entry P0:** off-screen bottom-right, ~`(112%, 78%)` + per-page spread.
- **Crest C (control point):** above the wordmark, ~`(50%, 8%)`.
- **Stack P1:** bottom-left, ~`(16%, 82%)` + per-page step offset + jitter.
- Page position at scrubbed progress `t∈[0,1]`:
  `B(t) = (1-t)² P0 + 2(1-t)t C + t² P1`.
- Rotation interpolates `entryRot → stackRot` (eased), NOT path-auto-orient.

Per-page params are **deterministic** (seeded PRNG, e.g. mulberry32 seeded by a
constant) so live tuner rebuilds don't jitter every frame. Page `i` uses art
`Paper{(i % 3) + 1}.png`. z-index increases with `i` (later pages on top; the
in-flight page sits above settled ones).

## Timeline

`gsap.timeline({ scrollTrigger: { trigger:'.hero', pin:true, scrub, start:'top top', end:'+=<pin>%' } })`.
For each page: a proxy `{t:0}` tweened `t:1, ease:'none'` placed at start
`i * stagger`; `onUpdate` computes `B(t)` + rotation and `gsap.set`s the card.
Stagger overlaps pages into a flowing stream. Absolute durations are irrelevant
under scrub (proportional to scroll).

## Reduced motion

Rig still **injects** the N cards and places them in the **settled stack**
(final `P1_i` + `stackRot_i`), but builds **no pin/scrub timeline** — the motif
stays, motion doesn't. Wordmark/tagline/buttons render normally. No-JS users see
the hero text without pages (decorative, `aria-hidden`).

## Config (`HERO_PAGES_CONFIG`, single source of truth + tuner)

```
count        // # pages (≥10), default 12
pin          // pin length, % of viewport (~160)
scrub        // ScrollTrigger scrub seconds
scale        // page-size multiplier
stagger      // timeline units between page starts
entry  { x, y, spread, rotMin, rotMax }   // % + entry rotation range (deg)
crest  { x, y }                           // % control point
stack  { x, y, dx, dy, rotJitter }        // % target + per-page px step + ± deg
```

## Theming

- Pages: existing `.page-card__ink` mask (Paper PNG masks `var(--color-ink)`),
  theme-adaptive. Verify light + dark.
- Wordmark: **inline** `static/logos/Text Only.svg` (no fill attr → set
  `fill: var(--color-ink)`), wrapped in `<h1>` with visually-hidden text
  "Essays in Bloom".

## Files / build sequence

1. **`src/scripts/hero-pages.ts`** (rename from `hero-3d.ts`): `HERO_PAGES_CONFIG`
   + `mountHeroPages()` (inject cards, seeded params, pin+scrub timeline, settled
   stack, reduced-motion fallback). Returns API `{ config, cards, stage, rebuild }`.
2. **`src/scripts/hero-pages-tuner.ts`** (rename from `hero-3d-tuner.ts`): expose
   all knobs above; live rebuild; Copy → `HERO_PAGES_CONFIG` snippet.
3. **`src/pages/index.astro`**: pinned `.hero` with inlined wordmark `<h1>` +
   tagline + buttons + `.hero__stage`; remove empathy `<section>` and
   `.hero-region` wrapper; update `<script>` to import/mount + dev-only tuner.
4. **`src/styles/home.css`**: `.hero` pinned layout (`min-height:100vh`, centered
   column, `overflow:clip`); `.hero__stage` (absolute, full hero, `z` above
   content, pointer-events none); `.hero__wordmark` size/fill; keep `.page-card`
   + `.page-card__ink`; drop `.hero-region` + empathy rules + old z-index bits.

## Verify

`npm run build` clean + tuner stripped from `dist/`. Preview: pin holds, pages
stagger in along the arc and stack bottom-left, light + dark legible,
reduced-motion shows the settled stack, no console errors. Screenshot proof.
Then update the handoff note + memory; commit a working checkpoint.
