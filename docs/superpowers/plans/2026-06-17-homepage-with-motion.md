# Homepage + Motion System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the real Essays in Bloom homepage per the approved homepage spec, with a tasteful, accessible motion system folded in — replacing the brand-system showcase scaffolding.

**Architecture:** A hybrid motion approach. Site-wide motion (scroll-reveal, hover) is native CSS + one shared IntersectionObserver; the two signature beats use heavier tech only where needed — the nav-logo petal **bloom** is pure CSS keyframes (once per visit), and the homepage hero's **3D essay-page drift** is GSAP + ScrollTrigger loaded on the homepage only. No smooth-scroll library. Homepage content is built from small, single-purpose Astro components styled with brand tokens.

**Tech Stack:** Astro 6 (static, no client framework), vanilla CSS with custom-property tokens, native IntersectionObserver, GSAP + ScrollTrigger (homepage only).

## Source specs (read both before starting)

- Motion system: `docs/superpowers/specs/2026-06-17-motion-system-design.md`
- Homepage design: `docs/superpowers/specs/2026-06-17-homepage-design.md` (hero is **revised** by motion spec §5 — no centered logo)

## Global Constraints

- **Astro 6**, no client framework. `npm run dev` serves on port 4321; `npm run build` must succeed for every task.
- **Reuse existing design tokens only** — no new fonts or colors. Brand palette/type/spacing/radius live in `src/styles/tokens.css`.
- **Honor the brand ALL-CAPS rule** for display/heading/subheading (buttons already uppercase via `.btn`).
- **Only `transform` and `opacity` animate.** `will-change` applied just-in-time, removed after.
- **Accessibility:** no content hidden without JS (`.has-js` gate); a real `prefers-reduced-motion: reduce` path on every animated element; no focus traps.
- **GSAP loads on the homepage only.** Every other page ships zero animation JS.
- **Both light and dark themes** must be verified in the preview (`data-theme="dark"` on `<html>`).
- **Frequent commits:** one per task. Pushing to `main` is fine pre-launch.

## Verification approach (no unit-test runner in this project)

There is no test framework, and adding one is out of scope. Each task is verified by:
1. **Build:** `npm run build` exits 0 (catches Astro/import/syntax errors).
2. **Preview:** with `npm run dev` running, use the preview tools to check — no console errors, correct rendering in **light and dark**, and the task's specific behavior (reveal fires, bloom plays once, drift scrubs on scroll, reduced-motion path).
Where a task has real JS logic, the step lists the exact observable behavior to confirm.

## File structure (created / modified)

**Motion foundation (Phase A):**
- `src/styles/tokens.css` *(modify)* — add Motion token group.
- `src/styles/motion.css` *(create)* — reveal primitive, hover refinements, reduced-motion rules, bloom keyframes. Imported by `main.css`.
- `src/styles/main.css` *(modify)* — add `@import "motion.css";` (and later `home.css`).
- `src/layouts/Base.astro` *(modify)* — pre-paint `.has-js` + once-per-visit bloom gate; shared reveal IntersectionObserver.
- `src/components/FlowerMark.astro` *(create)* — inlined, animatable flower mark.
- `src/components/Header.astro` *(modify)* — use `FlowerMark` instead of the masked `.brand__logo` span.
- `src/styles/components.css` *(modify)* — remove the old `.brand__logo` mask rule; add hover-lift refinements where shared.

**Homepage build (Phase B):**
- `package.json` *(modify)* — add `gsap`.
- `src/components/SectionHeading.astro`, `StepCard.astro`, `ServiceCard.astro`, `Testimonial.astro`, `CtaBand.astro` *(create)*.
- `src/pages/index.astro` *(rewrite)* — 7 sections + hero 3D rig script.
- `src/styles/home.css` *(create)* — homepage section + component styles. Imported by `main.css`.
- `src/styles/components.css` *(modify)* — remove the `.showcase*`, `.swatch*`, `.tint*`, `.clearspace*`, `.favicon*` style guide rules (dead after the rewrite).

---

# Phase A — Motion foundation (site-wide, ships independently)

### Task A1: Motion tokens

**Files:**
- Modify: `src/styles/tokens.css` (append inside `:root`, after the Transitions group ~line 105)

- [ ] **Step 1: Add the Motion token group**

In `src/styles/tokens.css`, immediately after the `--transition-base` line inside `:root`, add:

```css
  /* --- Motion --- */
  --dur-quick:  180ms;   /* hover / UI micro-interactions */
  --dur-base:   360ms;   /* standard scroll reveal        */
  --dur-slow:   640ms;   /* larger / parallax moves       */
  --dur-bloom:  1300ms;  /* full petal bloom              */

  --ease-soft:  cubic-bezier(0.22, 1, 0.36, 1);   /* gentle ease-out: reveals, UI */
  --ease-bloom: cubic-bezier(0.34, 1.3, 0.64, 1); /* organic overshoot: petals    */

  --reveal-rise: 16px;   /* how far elements rise as they reveal */
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat(motion): add motion tokens (durations, easings, reveal distance)"
```

---

### Task A2: Reveal primitive + hover + reduced-motion (`motion.css`)

**Files:**
- Create: `src/styles/motion.css`
- Modify: `src/styles/main.css`

**Interfaces:**
- Produces: the `[data-reveal]` contract (start hidden when `.has-js`, reveal on `.is-revealed`, stagger via `--i`), consumed by Base.astro's observer (A3) and homepage sections (Phase B). Hover-lift utility `.lift` consumed by buttons/cards.

- [ ] **Step 1: Create `src/styles/motion.css`**

```css
/* ============================================================
   Motion — reveal-on-scroll, hover lifts, reduced-motion
   Depends on tokens.css. Progressive enhancement: motion only
   applies when <html> has .has-js (added before paint by Base).
   ============================================================ */

/* --- Reveal-on-scroll --- */
/* Hidden state applies ONLY when JS is present, so no-JS shows everything. */
.has-js [data-reveal] {
  opacity: 0;
  transform: translateY(var(--reveal-rise));
  transition: opacity var(--dur-base) var(--ease-soft),
              transform var(--dur-base) var(--ease-soft);
  transition-delay: calc(var(--i, 0) * 80ms);
  will-change: opacity, transform;
}

.has-js [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  will-change: auto;
}

/* --- Hover lift (buttons, cards) --- */
.lift {
  transition: transform var(--dur-quick) var(--ease-soft),
              box-shadow var(--dur-quick) var(--ease-soft);
}
.lift:hover {
  transform: translateY(-2px);
}
.lift:active {
  transform: translateY(0);
}

/* --- Reduced motion: everything instant, no transforms --- */
@media (prefers-reduced-motion: reduce) {
  .has-js [data-reveal],
  .has-js [data-reveal].is-revealed {
    opacity: 1;
    transform: none;
    transition: none;
    will-change: auto;
  }
  .lift,
  .lift:hover,
  .lift:active {
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 2: Import it in `src/styles/main.css`**

Add after the `components.css` import line:

```css
@import "components.css";
@import "motion.css";
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/styles/motion.css src/styles/main.css
git commit -m "feat(motion): add reveal primitive, hover lift, reduced-motion rules"
```

---

### Task A3: `.has-js` flag, reveal observer, once-per-visit bloom gate (`Base.astro`)

**Files:**
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `[data-reveal]` from A2.
- Produces: `.has-js` and (conditionally) `.bloom-play` classes on `<html>`; the shared observer that adds `.is-revealed`.

- [ ] **Step 1: Add the pre-paint flag + bloom gate**

In `src/layouts/Base.astro`, inside the existing `<script is:inline>` in `<head>` (the theme script), append this logic **inside the same IIFE**, after the theme block:

```js
        // Progressive-enhancement flag (enables reveal hidden-states).
        document.documentElement.classList.add('has-js');

        // Once-per-visit bloom gate. Play only on first arrival this session,
        // and never when the visitor prefers reduced motion.
        var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduce && !sessionStorage.getItem('eib-bloomed')) {
          document.documentElement.classList.add('bloom-play');
          sessionStorage.setItem('eib-bloomed', '1');
        }
```

(Keep the existing `try/catch` wrapping; these lines go before the closing `} catch (e) {}`.)

- [ ] **Step 2: Add the shared reveal observer**

In `src/layouts/Base.astro`, inside the existing module `<script>` at the end of `<body>`, append after the theme-toggle logic:

```js
      // Reveal-on-scroll: reveal each [data-reveal] once as it enters view.
      const revealEls = document.querySelectorAll('[data-reveal]');
      if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          }
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
        revealEls.forEach((el) => io.observe(el));
      } else {
        // No observer support: show everything.
        revealEls.forEach((el) => el.classList.add('is-revealed'));
      }
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Verify in preview**

Start dev (`npm run dev`) and load any page. Confirm: `<html>` has `class="has-js"` (and `bloom-play` on first load this session; reload in the same tab → `bloom-play` absent). No console errors. (Reveal visuals are verified once sections exist in Phase B.)

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat(motion): has-js flag, reveal observer, once-per-visit bloom gate"
```

---

### Task A4: Animatable flower mark + nav bloom

**Files:**
- Create: `src/components/FlowerMark.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/styles/components.css` (replace `.brand__logo` rule)
- Modify: `src/styles/motion.css` (add bloom keyframes)

**Interfaces:**
- Consumes: `.bloom-play` on `<html>` from A3.
- Produces: `<FlowerMark />` component (inline SVG, tints with `--color-ink`).

- [ ] **Step 1: Create `src/components/FlowerMark.astro`**

The flower mark `static/logos/Full NO Text.svg` contains **9** `<path>` elements (viewBox `0 0 87.89 48.24`). Inline them so each petal is individually animatable. Copy the 9 `d` values **verbatim, in document order** from that SVG into the `petals` array below (they already exist in that tracked file):

```astro
---
// Inline, animatable version of static/logos/Full NO Text.svg.
// Petals tint with the theme via fill: var(--color-ink).
const petals: string[] = [
  // Paste the 9 path `d` values from static/logos/Full NO Text.svg here, in order.
  // e.g. "M22.63,16.2c2.17,12.77,...12.25Z",
];
---
<svg
  class="flower"
  viewBox="0 0 87.89 48.24"
  role="img"
  aria-hidden="true"
  focusable="false"
>
  {petals.map((d, i) => (
    <path d={d} style={`--i:${i}`} />
  ))}
</svg>
```

- [ ] **Step 2: Add flower styling + bloom keyframes to `src/styles/motion.css`**

Append:

```css
/* --- Flower mark + bloom --- */
.flower {
  display: block;
  height: 100%;
  width: auto;
}
.flower path {
  fill: var(--color-ink);
}

/* Default = fully bloomed (static). The bloom only runs when <html>.bloom-play
   is present, so there is no flash on repeat loads or with JS off. */
.bloom-play .flower path {
  transform-origin: 44px 44px;          /* floral base; fine-tune in preview */
  animation: bloom-petal var(--dur-bloom) var(--ease-bloom) both;
  animation-delay: calc(var(--i) * 60ms);
}

@keyframes bloom-petal {
  from { opacity: 0; transform: scale(0.4) rotate(-8deg); }
  to   { opacity: 1; transform: scale(1) rotate(0); }
}

@media (prefers-reduced-motion: reduce) {
  .bloom-play .flower path { animation: none; }
}
```

- [ ] **Step 3: Use `FlowerMark` in `src/components/Header.astro`**

Add to the frontmatter imports: `import FlowerMark from './FlowerMark.astro';`
Replace the brand-logo span:

```astro
    <a class="brand" href="/" aria-label="Essays in Bloom — home">
      <span class="brand__logo"><FlowerMark /></span>
    </a>
```

- [ ] **Step 4: Update `.brand__logo` in `src/styles/components.css`**

Replace the existing `.brand__logo` rule (the masked-background version) with a sizing box for the inline SVG:

```css
.brand__logo {
  display: block;
  height: 40px;
  aspect-ratio: 87.89 / 48.24;   /* Full NO Text.svg viewBox */
}
```

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 6: Verify in preview**

Load the homepage in a fresh session. Confirm: the nav flower **blooms once** (petals stagger open), reload in the same tab → static (no replay), the mark **tints** correctly in light and dark, and under reduced-motion (emulate) it renders static/open. Tune `transform-origin` if the petals open from the wrong point.

- [ ] **Step 7: Commit**

```bash
git add src/components/FlowerMark.astro src/components/Header.astro src/styles/components.css src/styles/motion.css
git commit -m "feat(motion): animatable flower mark with once-per-visit nav bloom"
```

---

# Phase B — Homepage build with motion

### Task B1: Add GSAP dependency

**Files:**
- Modify: `package.json` (+ `package-lock.json`)

- [ ] **Step 1: Install GSAP**

Run: `npm install gsap`
Expected: `gsap` appears under `dependencies` in `package.json`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add gsap dependency (homepage 3D hero)"
```

---

### Task B2: `SectionHeading` component + `home.css` scaffold

**Files:**
- Create: `src/components/SectionHeading.astro`
- Create: `src/styles/home.css`
- Modify: `src/styles/main.css`

**Interfaces:**
- Produces: `<SectionHeading eyebrow? heading />` — eyebrow (small caps) + heading. Consumed by all Phase B sections.

- [ ] **Step 1: Create `src/components/SectionHeading.astro`**

```astro
---
interface Props { eyebrow?: string; heading: string; id?: string; }
const { eyebrow, heading, id } = Astro.props;
---
<header class="section-heading" data-reveal>
  {eyebrow && <p class="section-heading__eyebrow">{eyebrow}</p>}
  <h2 class="section-heading__title" id={id}>{heading}</h2>
</header>
```

- [ ] **Step 2: Create `src/styles/home.css` with the heading styles**

```css
/* ============================================================
   Homepage sections & components
   ============================================================ */

.section-heading { display: grid; gap: var(--space-3); margin-bottom: var(--space-10); }
.section-heading__eyebrow {
  font-family: var(--font-subheading);
  font-weight: var(--weight-subheading);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}
.section-heading__title { font-size: var(--text-3xl); }
```

- [ ] **Step 3: Import `home.css` in `src/styles/main.css`** (after `motion.css`):

```css
@import "motion.css";
@import "home.css";
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionHeading.astro src/styles/home.css src/styles/main.css
git commit -m "feat(home): SectionHeading component + home.css scaffold"
```

---

### Task B3: Hero rebuild (no center logo) + 3D page container

**Files:**
- Modify: `src/pages/index.astro` (replace the file's hero; remove showcase — full rewrite begins here)
- Modify: `src/styles/home.css` (hero styles)

**Interfaces:**
- Produces: `.hero__stage` containing `.page-card` elements (placeholders) targeted by the GSAP rig in B4.

- [ ] **Step 1: Rewrite `src/pages/index.astro`** to the hero only (sections are added in later tasks; keep the file building at each step):

```astro
---
import Base from '../layouts/Base.astro';
---

<Base>
  <!-- Hero: no center logo; subline + buttons + 3D essay-page drift -->
  <section class="hero container" aria-label="Introduction">
    <h1 class="visually-hidden">Essays in Bloom — What's Your Story?</h1>

    <div class="hero__stage" aria-hidden="true">
      <div class="page-card" data-page="0"></div>
      <div class="page-card" data-page="1"></div>
      <div class="page-card" data-page="2"></div>
    </div>

    <div class="hero__content" data-reveal>
      <p class="hero__tagline">
        College application essay coaching that turns your real experiences
        into a Common App essay only you could write.
      </p>
      <div class="button-row hero__cta">
        <a class="btn btn--primary lift" href="/contact">Start Your Story</a>
        <a class="btn btn--secondary lift" href="#approach">See How It Works</a>
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Replace the `.hero*` rules in `src/styles/home.css`** (add hero + placeholder page styling):

```css
/* --- Hero --- */
.hero {
  position: relative;
  display: grid;
  justify-items: center;
  text-align: center;
  gap: var(--space-8);
  padding-block: var(--space-24) var(--space-20);
  overflow: clip;             /* contain drifting pages */
}
.hero__content { display: grid; justify-items: center; gap: var(--space-8); position: relative; z-index: 1; }
.hero__tagline { max-width: 48ch; font-size: var(--text-lg); color: color-mix(in srgb, var(--color-ink) 80%, transparent); }

/* 3D stage + placeholder essay pages (final art supplied by user) */
.hero__stage {
  position: absolute;
  inset: 0;
  perspective: 1200px;
  pointer-events: none;
  z-index: 0;
}
.page-card {
  position: absolute;
  top: 50%; left: 50%;
  width: clamp(120px, 14vw, 200px);
  aspect-ratio: 8.5 / 11;
  background: var(--color-paper);
  border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
  border-radius: var(--radius-sm);
  box-shadow: 0 12px 40px color-mix(in srgb, var(--color-ink) 12%, transparent);
  transform: translate(-50%, -50%);
}
```

- [ ] **Step 3: Remove the old `.hero*` rules from `src/styles/components.css`** (the `.hero`, `.hero__logo`, `.hero__tagline` block, ~lines 235-258) to avoid duplication.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 5: Verify in preview**

Homepage shows the tagline + two buttons centered, with three faint placeholder "pages" stacked behind. Light and dark both legible. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/styles/home.css src/styles/components.css
git commit -m "feat(home): rebuild hero without center logo; add 3D page stage"
```

---

### Task B4: GSAP 3D essay-page drift (homepage only, reduced-motion guarded)

**Files:**
- Modify: `src/pages/index.astro` (add a module `<script>`)

- [ ] **Step 1: Add the hero rig script** at the end of `src/pages/index.astro`, after `</Base>`:

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = gsap.utils.toArray<HTMLElement>('.page-card');

  if (!reduce && cards.length) {
    gsap.registerPlugin(ScrollTrigger);

    // Resting layout: fan the pages out in depth.
    const rest = [
      { x: -160, y: -10, z: -260, ry:  18 },
      { x:   10, y:  20, z: -120, ry:  -8 },
      { x:  180, y: -30, z: -360, ry:  26 },
    ];
    cards.forEach((card, i) => {
      const r = rest[i % rest.length];
      gsap.set(card, { xPercent: -50, yPercent: -50, x: r.x, y: r.y, z: r.z, rotateY: r.ry });
    });

    // Scrub: pages drift further apart + rotate as the hero scrolls away.
    gsap.to(cards, {
      x: (i: number) => rest[i % rest.length].x * 2.2,
      z: (i: number) => rest[i % rest.length].z - 200,
      rotateY: (i: number) => rest[i % rest.length].ry * 1.8,
      yPercent: -90,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  }
</script>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exits 0 (Astro bundles gsap into the page script).

- [ ] **Step 3: Verify in preview**

Scroll the homepage: the placeholder pages **drift and rotate in 3D** as the hero leaves, tied to scroll position (scrub). Under reduced-motion (emulate), the script does not initialize and pages sit in their CSS resting positions, legible. No console errors. (Final easing/depth and real page art are tuned later with the user — spec §8.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): GSAP ScrollTrigger 3D essay-page drift (reduced-motion safe)"
```

---

### Task B5: Empathy beat section

**Files:**
- Modify: `src/pages/index.astro` (add section inside `<Base>`, after the hero)
- Modify: `src/styles/home.css`

- [ ] **Step 1: Add the section markup** after the hero `</section>`:

```astro
  <!-- Empathy beat -->
  <section class="container section narrow empathy" data-reveal>
    <h2 class="empathy__heading">Not sure where to start?</h2>
    <p class="empathy__body">
      A blank essay box is the hardest part. Together, we find the story that's
      already yours — and shape it into words admissions officers remember.
    </p>
  </section>
```

- [ ] **Step 2: Add styles** to `home.css`:

```css
/* --- Empathy beat --- */
.empathy { display: grid; gap: var(--space-4); text-align: center; }
.empathy__heading { font-size: var(--text-2xl); }
.empathy__body { font-size: var(--text-md); color: color-mix(in srgb, var(--color-ink) 80%, transparent); max-width: 60ch; margin-inline: auto; }
```

- [ ] **Step 3: Build + verify + commit**

Run: `npm run build` (exits 0). In preview, the empathy text reveals on scroll-in (light + dark).

```bash
git add src/pages/index.astro src/styles/home.css
git commit -m "feat(home): empathy beat section"
```

---

### Task B6: Approach section + `StepCard` (the `#approach` anchor)

**Files:**
- Create: `src/components/StepCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

**Interfaces:**
- Produces: `<StepCard index step label body />` — numbered step card with staggered reveal.

- [ ] **Step 1: Create `src/components/StepCard.astro`**

```astro
---
interface Props { index: number; step: string; label: string; body: string; }
const { index, step, label, body } = Astro.props;
---
<article class="step-card lift" data-reveal style={`--i:${index}`}>
  <p class="step-card__step">{step}</p>
  <h3 class="step-card__label">{label}</h3>
  <p class="step-card__body">{body}</p>
</article>
```

- [ ] **Step 2: Add the Approach section** to `index.astro` (after the empathy section). Import `SectionHeading` and `StepCard` in the frontmatter.

```astro
  <!-- The Approach -->
  <section class="container section approach" id="approach">
    <SectionHeading eyebrow="The Approach" heading="How your essay blooms." />
    <div class="step-grid">
      <StepCard index={0} step="01" label="Discover" body="We clarify the roles you play, what you do, and what you care about." />
      <StepCard index={1} step="02" label="Draft" body="Your ideas become words through an iterative drafting process." />
      <StepCard index={2} step="03" label="Refine" body="We shape and polish until the narrative is vibrant and cohesive." />
      <StepCard index={3} step="04" label="Bloom" body="Your Common App and supplemental essays show admissions officers exactly why you belong." />
    </div>
    <p class="section-link"><a href="/approach" class="lift">See the full approach →</a></p>
  </section>
```

Frontmatter imports (top of `index.astro`):

```astro
import SectionHeading from '../components/SectionHeading.astro';
import StepCard from '../components/StepCard.astro';
```

- [ ] **Step 3: Add styles** to `home.css`:

```css
/* --- Approach --- */
.step-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-6); }
.step-card {
  display: grid; gap: var(--space-3);
  padding: var(--space-6);
  background: var(--primary-10);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  border-radius: var(--radius-md);
}
.step-card__step { font-family: var(--font-subheading); font-weight: var(--weight-subheading); color: var(--color-accent); letter-spacing: 0.08em; }
.step-card__label { font-size: var(--text-xl); }
.step-card__body { color: color-mix(in srgb, var(--color-ink) 80%, transparent); }
.section-link { margin-top: var(--space-8); }
.section-link a { font-family: var(--font-subheading); font-weight: var(--weight-subheading); }
```

- [ ] **Step 4: Build + verify + commit**

Run: `npm run build` (exits 0). In preview: four step cards reveal with a **stagger**, hover-lift works, the hero's "See How It Works" button jumps to `#approach`. Light + dark.

```bash
git add src/components/StepCard.astro src/pages/index.astro src/styles/home.css
git commit -m "feat(home): Approach section with staggered StepCards"
```

---

### Task B7: Meet your coach (trust strip)

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

- [ ] **Step 1: Add the section** (after Approach):

```astro
  <!-- Meet your coach -->
  <section class="container section coach" data-reveal>
    <img class="coach__photo" src="/pictures/AlisonProfilePic.webp" width="220" height="220"
         alt="Alison Bloomfield, college essay coach" loading="lazy" decoding="async" />
    <div class="coach__body">
      <SectionHeading eyebrow="Meet Your Coach" heading="Meet your coach." />
      <p>Alison brings a teacher's ear and an editor's eye to every essay.</p>
      <ul class="coach__creds">
        <li>10+ years college essay coaching</li>
        <li>IECA associate member</li>
        <li>Adjunct writing professor</li>
        <li>Former high-school English teacher</li>
        <li>M.A. in Teaching English</li>
      </ul>
      <p class="section-link"><a href="/about" class="lift">More about Alison →</a></p>
    </div>
  </section>
```

- [ ] **Step 2: Styles** in `home.css`:

```css
/* --- Meet your coach --- */
.coach { display: grid; grid-template-columns: auto 1fr; gap: var(--space-10); align-items: center; }
.coach__photo { border-radius: var(--radius-md); object-fit: cover; }
.coach__creds { display: grid; gap: var(--space-2); margin-top: var(--space-4); list-style: none; padding: 0; color: color-mix(in srgb, var(--color-ink) 80%, transparent); }
.coach__creds li { padding-left: var(--space-5); position: relative; }
.coach__creds li::before { content: "✦"; position: absolute; left: 0; color: var(--color-soft); }
@media (max-width: 640px) { .coach { grid-template-columns: 1fr; justify-items: center; text-align: center; } }
```

- [ ] **Step 3: Build + verify + commit**

Run: `npm run build` (exits 0). Preview: headshot + credentials, reveals on scroll, responsive stack under 640px, light + dark.

```bash
git add src/pages/index.astro src/styles/home.css
git commit -m "feat(home): Meet your coach trust strip"
```

---

### Task B8: Ways we work together + `ServiceCard`

**Files:**
- Create: `src/components/ServiceCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

> **Open item:** Include both Coaching and Workshops by default (Workshops is in the nav). If the user confirms Workshops is **not** active, delete the second `<ServiceCard>` and switch `.service-grid` to one column.

**Interfaces:**
- Produces: `<ServiceCard index title body href cta />`.

- [ ] **Step 1: Create `src/components/ServiceCard.astro`**

```astro
---
interface Props { index: number; title: string; body: string; href: string; cta: string; }
const { index, title, body, href, cta } = Astro.props;
---
<article class="service-card lift" data-reveal style={`--i:${index}`}>
  <h3 class="service-card__title">{title}</h3>
  <p class="service-card__body">{body}</p>
  <a class="service-card__cta" href={href}>{cta} →</a>
</article>
```

- [ ] **Step 2: Add the section** to `index.astro` (import `ServiceCard`):

```astro
  <!-- Ways we work together -->
  <section class="container section services">
    <SectionHeading eyebrow="Services" heading="Ways we work together." />
    <div class="service-grid">
      <ServiceCard index={0} title="Coaching" body="1:1 essay guidance for your Common App and supplemental essays." href="/coaching" cta="Explore coaching" />
      <ServiceCard index={1} title="Workshops" body="Small-group sessions that build momentum together." href="/workshops" cta="Explore workshops" />
    </div>
  </section>
```

- [ ] **Step 3: Styles** in `home.css`:

```css
/* --- Services --- */
.service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--space-6); }
.service-card {
  display: grid; gap: var(--space-3);
  padding: var(--space-8);
  background: var(--soft-10);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  border-radius: var(--radius-md);
}
.service-card__title { font-size: var(--text-xl); }
.service-card__body { color: color-mix(in srgb, var(--color-ink) 80%, transparent); }
.service-card__cta { font-family: var(--font-subheading); font-weight: var(--weight-subheading); margin-top: var(--space-2); }
```

- [ ] **Step 4: Build + verify + commit**

Run: `npm run build` (exits 0). Preview: two service cards, staggered reveal, hover-lift, light + dark.

```bash
git add src/components/ServiceCard.astro src/pages/index.astro src/styles/home.css
git commit -m "feat(home): Ways we work together with ServiceCards"
```

---

### Task B9: Testimonials + `Testimonial` (placeholders only)

**Files:**
- Create: `src/components/Testimonial.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

> **Constraint:** No invented quotes. Cards are **clearly-marked placeholders** until the user supplies real testimonials.

- [ ] **Step 1: Create `src/components/Testimonial.astro`**

```astro
---
interface Props { index: number; quote: string; attribution: string; placeholder?: boolean; }
const { index, quote, attribution, placeholder = false } = Astro.props;
---
<figure class="testimonial" class:list={[{ 'testimonial--placeholder': placeholder }]} data-reveal style={`--i:${index}`}>
  <blockquote class="testimonial__quote">{quote}</blockquote>
  <figcaption class="testimonial__by">{attribution}</figcaption>
</figure>
```

- [ ] **Step 2: Add the section** to `index.astro` (import `Testimonial`):

```astro
  <!-- What families say -->
  <section class="container section testimonials">
    <SectionHeading eyebrow="Testimonials" heading="What families say." />
    <div class="testimonial-grid">
      <Testimonial index={0} placeholder={true} quote="Real family testimonial coming soon." attribution="— Placeholder" />
      <Testimonial index={1} placeholder={true} quote="Real family testimonial coming soon." attribution="— Placeholder" />
    </div>
    <p class="section-link"><a href="/testimonials" class="lift">Read more →</a></p>
  </section>
```

- [ ] **Step 3: Styles** in `home.css`:

```css
/* --- Testimonials --- */
.testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); }
.testimonial {
  display: grid; gap: var(--space-4);
  padding: var(--space-8);
  border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
  border-radius: var(--radius-md);
}
.testimonial__quote { font-family: var(--font-heading); font-size: var(--text-lg); font-style: italic; }
.testimonial__by { color: color-mix(in srgb, var(--color-ink) 65%, transparent); }
.testimonial--placeholder { opacity: 0.7; border-style: dashed; }
```

- [ ] **Step 4: Build + verify + commit**

Run: `npm run build` (exits 0). Preview: two dashed placeholder cards clearly marked as placeholders, reveal on scroll, light + dark.

```bash
git add src/components/Testimonial.astro src/pages/index.astro src/styles/home.css
git commit -m "feat(home): testimonials section with marked placeholders"
```

---

### Task B10: Closing CTA + `CtaBand`

**Files:**
- Create: `src/components/CtaBand.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/home.css`

- [ ] **Step 1: Create `src/components/CtaBand.astro`**

```astro
---
interface Props { heading: string; cta: string; href: string; }
const { heading, cta, href } = Astro.props;
---
<section class="cta-band" data-reveal>
  <div class="container cta-band__inner">
    <h2 class="cta-band__heading">{heading}</h2>
    <a class="btn btn--primary lift" href={href}>{cta}</a>
  </div>
</section>
```

- [ ] **Step 2: Add to `index.astro`** (import `CtaBand`, place as the last child of `<Base>`):

```astro
  <CtaBand heading="What's your story? Let's find it together." cta="Get in Touch" href="/contact" />
```

- [ ] **Step 3: Styles** in `home.css`:

```css
/* --- Closing CTA band --- */
.cta-band { margin-top: var(--space-24); background: var(--gradient-bloom); }
.cta-band__inner { display: grid; justify-items: center; gap: var(--space-6); text-align: center; padding-block: var(--space-20); }
.cta-band__heading { font-size: var(--text-3xl); color: var(--soft-linen); }
```

- [ ] **Step 4: Build + verify + commit**

Run: `npm run build` (exits 0). Preview: soft bloom-gradient band with heading + button, reveals on scroll, legible in light + dark.

```bash
git add src/components/CtaBand.astro src/pages/index.astro src/styles/home.css
git commit -m "feat(home): closing CTA band"
```

---

### Task B11: Remove dead style-guide CSS + final verification pass

**Files:**
- Modify: `src/styles/components.css`

- [ ] **Step 1: Delete the showcase style-guide rules** now unused after the index rewrite: the `/* --- Showcase ... --- */` block through the favicon-chip rules (`.showcase`, `.showcase__block`, `.swatch*`, `.tint*`, `.clearspace*`, `.favicon*`). Keep `.visually-hidden` and everything above the Showcase block.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 3: Full verification pass in preview**

Walk the whole homepage in **light and dark**:
- Nav flower blooms once per session; static on reload; reduced-motion static.
- Hero: tagline + buttons; 3D pages drift on scroll; reduced-motion → static legible pages.
- Each section reveals on scroll (stagger on the card grids); hover-lift on buttons/cards/links.
- No console errors; no horizontal overflow; focus rings intact.
- Emulate `prefers-reduced-motion: reduce`: everything renders complete and instant.

- [ ] **Step 4: Commit**

```bash
git add src/styles/components.css
git commit -m "chore(home): remove dead brand-showcase styles"
```

---

## Self-review (completed during planning)

- **Spec coverage** — Motion spec: tokens (A1), reveal+hover+reduced-motion (A2), has-js/observer/bloom-gate (A3), nav bloom (A4), GSAP 3D hero (B4), hero-logo removal (B3), performance constraints (Global + per task), 50/50 placeholder-first sequence (B4 note + spec §8). Homepage spec: hero (B3), empathy (B5), approach+anchor (B6), coach (B7), services+Workshops open item (B8), testimonials placeholders (B9), CTA band (B10), showcase removal (B11), SectionHeading shared (B2).
- **Placeholder scan** — no "TBD/TODO/handle edge cases" steps; the only deferred content is the user-supplied essay-page art (explicitly collaborative per spec §8) and the 9 SVG `d` strings (copied verbatim from an in-repo tracked file).
- **Type consistency** — component prop names (`index`, `step`, `label`, `body`, `title`, `href`, `cta`, `quote`, `attribution`, `placeholder`, `eyebrow`, `heading`) are consistent between each component's definition and its call sites; `.page-card` / `data-page` match between B3 markup and B4 script; `[data-reveal]` / `.is-revealed` / `--i` / `.has-js` / `.bloom-play` consistent across A2/A3/A4 and B sections.

## Open items (carry into execution)

- **Workshops** active? Default includes it (B8). User to confirm; if not active, drop the second ServiceCard.
- **Final essay-page art + bloom/drift timing** are tuned with the user in the preview after the placeholder rig lands (spec §8). Token values (A1), petal `transform-origin` (A4), and 3D depth/easing (B4) are the live-tuning knobs.
