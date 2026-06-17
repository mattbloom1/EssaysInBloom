# Motion System Design — Essays in Bloom

**Date:** 2026-06-17
**Status:** Design approved; spec pending user review

## Goal

Give the site a tasteful, brand-appropriate motion layer. It should feel
**elegant and literary, not gimmicky** — motion serves the reading and the brand,
never performs for its own sake. It must be **performant** (only `transform` and
`opacity` animate), **accessible** (a real `prefers-reduced-motion` experience and
no content hidden without JS), and **light** (near-zero baseline cost site-wide;
the one heavier library loads only where a signature moment needs it).

Two "earned" signature moments are the centerpiece:
1. The brand flower **blooms** in the top-left nav logo.
2. **Essay pages drift in 3D** behind/around the homepage hero as you scroll in.

Everything else is quiet: gentle scroll-into-view reveals and refined hover
micro-interactions.

## Locked decisions

| Decision | Choice | Rationale |
|---|---|---|
| Library strategy | **Hybrid** | Native CSS + IntersectionObserver for all site-wide motion; GSAP + ScrollTrigger only on the homepage for the 3D scroll. Light everywhere, powerful only where it counts. |
| Smooth scroll (Lenis) | **Skip** | Scroll-hijacking fights the user, adds accessibility cost, reads as "effecty." ScrollTrigger reads native scroll, so the 3D drift works without it. |
| Bloom location | **Nav logo** (top-left), not a hero logo | User direction. The hero loses its centered masked logo entirely. |
| Bloom timing | **Once per visit** (sessionStorage) | A greeting, not a repetitive tic. Plays the first time a visitor arrives on any page, then static for the session. |
| Bloom tech | **Pure CSS keyframes** (per-petal delays) | The flower mark is 10 separate petal paths; staggered CSS animation needs no JS library. Keeps GSAP reserved for the 3D scroll only. |
| Hero composition | **No center logo** | Hero = value-prop subline + two buttons + the 3D essay-page drift. Brand mark now lives (and blooms) in the nav. Revises homepage spec §1. |

## 1. Motion tokens (`src/styles/tokens.css`)

A small shared vocabulary so durations/easings are never hand-tuned ad hoc. Added
under a new "Motion" group; existing `--transition-fast` (150ms) and
`--transition-base` (250ms) stay for color hovers.

```
--dur-quick:  180ms;   /* hover/UI micro-interactions          */
--dur-base:   360ms;   /* standard reveal                       */
--dur-slow:   640ms;   /* larger/parallax moves                 */
--dur-bloom:  1300ms;  /* full petal bloom                      */

--ease-soft:  cubic-bezier(0.22, 1, 0.36, 1);    /* gentle ease-out, reveals/UI */
--ease-bloom: cubic-bezier(0.34, 1.3, 0.64, 1);  /* slight organic overshoot, petals */

--reveal-rise: 16px;   /* how far elements rise as they reveal  */
```

Final numeric values are tunable in the preview; these are the starting set.

## 2. Site-wide primitives — native, every page (zero dependencies)

### 2a. Reveal-on-scroll
- Markup: any element gets `data-reveal`. Card groups add a per-child index via
  inline `style="--i: 0|1|2|3"` (or set in the component loop) for a stagger.
- CSS (new `src/styles/motion.css`): a revealable element starts at
  `opacity: 0; transform: translateY(var(--reveal-rise))` **only when JS is
  present** (`.has-js [data-reveal] { … }`), and transitions to
  `opacity: 1; transform: none` when it gains `.is-revealed`. Stagger via
  `transition-delay: calc(var(--i, 0) * 80ms)`.
- JS (one shared `IntersectionObserver` in `Base.astro`): observes all
  `[data-reveal]`, adds `.is-revealed` once on enter, then unobserves (one-shot).
  `rootMargin: 0px 0px -10% 0px`, `threshold: ~0.1` so it fires just before fully
  in view.

### 2b. Hover micro-interactions (CSS only)
- Buttons: lift ~1px (`translateY(-1px)`) on hover, alongside the existing color
  shift; settle on `:active`.
- Cards (StepCard / ServiceCard / Testimonial, built in the homepage task): gentle
  lift + soft tint/shadow on hover.
- Prose links: animated underline grow (existing color transition retained).
- All within tokens; `transform`/`opacity`/`color` only.

### 2c. Progressive enhancement
- An inline pre-paint script adds `.has-js` to `<html>`. With JS off, **nothing is
  hidden** — all `[data-reveal]` content renders immediately. Motion is purely
  additive.

## 3. Signature — nav logo bloom (CSS, once per visit)

- **Markup:** replace the CSS-masked `.brand__logo` span in `Header.astro` with an
  **inlined** flower SVG component, `src/components/FlowerMark.astro`, rendering the
  10 petal/leaf paths of `Full NO Text.svg`. Paths use `fill: var(--color-ink)` so
  the mark still tints with the theme. Decorative: keep `aria-hidden`, the brand
  link keeps its `aria-label`.
- **Animation:** each petal path animates from
  `scale(0.4) rotate(-8deg); opacity: 0` → `scale(1) rotate(0); opacity: 1` with
  `--dur-bloom` / `--ease-bloom`, `transform-origin` at the floral
  base/convergence point (tuned in preview), staggered by
  `animation-delay: calc(var(--i) * 60ms)`.
- **Default state = fully bloomed.** Petals are at rest (visible, final state) by
  default. The bloom only plays when a gating class (e.g. `.bloom-play` on `<html>`)
  is present, which sets the initial hidden state and runs the keyframes. This means
  no flash on repeat loads and a correct no-JS / static render.
- **Once-per-visit gate:** a tiny inline pre-paint script checks
  `sessionStorage.getItem('eib-bloomed')`. If absent **and** not reduced-motion, it
  adds `.bloom-play` and sets the flag. Runs before paint to avoid a petal flash.
- **Reduced-motion:** the gate never adds `.bloom-play`; the logo renders static,
  fully bloomed.

## 4. Signature — hero 3D essay-page drift (GSAP, homepage only)

- **Library:** `gsap` + `ScrollTrigger`, imported as ES modules in a `<script>` in
  `src/pages/index.astro` (Astro bundles them). Ships on the homepage only; every
  other page ships zero animation JS.
- **Structure:** essay-page cards sit in a `perspective` container in the hero.
  ScrollTrigger **scrubs** their `translateZ` / `rotateY` / `translateX` against
  native scroll, so the pages drift past with parallax depth as the hero scrolls
  away. No smooth-scroll library involved.
- **Content:** placeholder page cards now (so the rig is real and tunable); final
  essay-page artwork comes from the user (see §8).
- **Reduced-motion:** the script checks
  `matchMedia('(prefers-reduced-motion: reduce)')` and **does not build the
  ScrollTrigger timeline** — the pages render in a static, composed, legible
  arrangement.

## 5. Hero composition change (revises homepage spec §1)

The approved homepage spec (`2026-06-17-homepage-design.md` §1) specifies a
centered masked logo lockup. This is **replaced**:

- **Removed:** the centered `.hero__logo` masked image.
- **Hero now contains:** the value-prop subline, the two buttons
  (**Start your story** → `/contact`; **See how it works** → `#approach`), and the
  3D essay-page drift behind/around them.
- **Kept:** the visually-hidden `<h1>` ("Essays in Bloom — What's Your Story?") for
  SEO/accessibility. The brand mark identity now lives in the nav (and blooms).

All other homepage sections (Empathy, Approach, Meet your coach, Ways we work
together, Testimonials, Closing CTA) are unchanged in content and gain only the
site-wide reveal + hover primitives from §2 (Approach steps and service cards
reveal with a stagger).

## 6. Accessibility (`prefers-reduced-motion: reduce`)

- Site-wide: a global rule makes `[data-reveal]` instant (`opacity: 1;
  transform: none; transition: none`) and flattens hover lifts.
- Nav bloom: never plays (gate skips it); logo renders static.
- Hero 3D drift: ScrollTrigger is never initialized; pages render static and
  legible.
- No motion is ever required to read content or to navigate. No keyboard/focus
  traps introduced.

## 7. Performance

- Only `transform` / `opacity` animate (compositor-friendly). `will-change` applied
  just-in-time and removed after.
- GSAP + ScrollTrigger load on the homepage only (~50KB min pre-gzip, one page).
- IntersectionObserver is one-shot (unobserves after reveal). The hero 3D rig
  lazy-inits.
- No animation of layout-affecting or expensive properties (width/height, large
  blurs, box-shadow spread) on scroll.

## 8. Collaboration model (50/50) and sequence

- **User designs (lead):** the essay-page artwork/content the 3D cards show, and
  the feel + timing intent of both the bloom and the drift (a sketch or storyboard
  is plenty). Assets land in `static/` (e.g. `static/pages/`).
- **Claude builds:** rigging the flower petals, the CSS bloom + once-per-visit gate,
  the GSAP ScrollTrigger 3D scrub, the motion tokens, the site-wide reveal/hover
  primitives, reduced-motion fallbacks, and Astro integration.
- **Together (iterate in preview):** tune timing, easing, and 3D depth live until it
  feels right.
- **Sequence:** Claude builds the system + a working **placeholder** bloom and 3D
  hero first → user reviews live → user supplies final art/intent → refine together.

## 9. Footprint (files)

- `src/styles/tokens.css` — add the Motion token group (§1).
- `src/styles/motion.css` — **new**; reveal primitive, hover refinements,
  reduced-motion rules, bloom keyframes. Imported by `main.css` after
  `components.css`.
- `src/layouts/Base.astro` — add the pre-paint `.has-js` + once-per-visit bloom-gate
  inline script, and the shared IntersectionObserver reveal script.
- `src/components/FlowerMark.astro` — **new**; inlined, animatable flower mark.
- `src/components/Header.astro` — use `FlowerMark` in place of the masked
  `.brand__logo` span.
- `src/pages/index.astro` — hero markup change (§5) + the GSAP/ScrollTrigger hero
  script (homepage only).
- `package.json` — add `gsap` dependency (and `npm install`).

## 10. Out of scope (separate tasks)

- Page transitions between routes (Astro View Transitions) — deferred; not needed
  for the two signature beats.
- Motion on pages other than the homepage beyond the shared reveal/hover primitives.
- Final essay-page artwork (user-supplied; placeholders until then).
- The homepage content build itself — this spec is folded into that build via the
  writing-plans step; the homepage layout/content remains per
  `2026-06-17-homepage-design.md` (as revised in §5).

## Open items

- **Workshops service card** (homepage spec §5): still pending user confirmation of
  whether Workshops is an active service. Unrelated to motion; tracked in the
  homepage build.
- Final petal `transform-origin`, token values, and 3D depth are tuned in the
  preview together.
