# Essays in Bloom — Website Design Reference

Working reference for building the site. Distilled from the brand book
(`Brand/Public/Branding and Process/Essays In Bloom Branding.pdf`, 2026,
v.final) and mapped to code where relevant. The brand book is the source of
truth; this file is the web translation of it.

In code, colors and fonts live as CSS custom properties in
`src/styles/tokens.css` — always use the tokens, never raw hex values, so the
dark variant keeps working.

---

## Colors

Two palettes, each with the same five roles. Light is the default; dark remaps
the roles (opt in with `data-theme="dark"` on `<html>`).

### Light variant (default)

| Role | Swatch | Hex | Token | Web usage |
|------|--------|-----|-------|-----------|
| Paper | Soft Linen | `#F2EDE3` | `--color-paper` | Page and section backgrounds |
| Ink | Shadow Grey | `#2B2622` | `--color-ink` | Body text |
| Primary | Evergreen | `#133430` | `--color-primary` | Headings, brand moments, dark panels |
| Accent | Hunter Green | `#29603D` | `--color-accent` | Links, buttons, interactive states |
| Soft | Light Bronze | `#E0A98D` | `--color-soft` | Warm highlights, decoration |

### Dark variant

| Role | Swatch | Hex | Web usage |
|------|--------|-----|-----------|
| Paper | Dark Coffee | `#2A2119` | Page background |
| Ink | Soft Linen | `#F2EDE3` | Body text |
| Primary | Cinnamon Wood | `#B5654A` | Headings, brand moments |
| Accent | Burnt Peach | `#E2754E` | Links, buttons, interactive states |
| Soft | Eggshell | `#F2EAD8` | Highlights, decoration |

### Gradients

The brand book defines two gradient blends:

- **Stone** — Shadow Grey → Evergreen (`--gradient-stone`)
- **Bloom** — Evergreen → Light Bronze (`--gradient-bloom`)

Use for large surfaces (hero panels, section dividers), not for text or small
UI.

### Tints

The book shows each brand hue stepping toward paper in five stops. In code,
express these with `color-mix()` rather than new hex values, e.g.:

```css
color-mix(in srgb, var(--evergreen) 25%, var(--soft-linen))
```

(The old site tokenized these as `--primary-100/75/50/25/10` etc. — recoverable
via `WEBSITE-RESET-NOTES.md` if we want the full ramp back.)

### Periwinkle experiment (not in the brand book)

**Trial color, reversible on request:** Periwinkle / lavender blue
`#8B8FD4` (`--periwinkle`, tints `--peri-25`/`--peri-10`).

- **Dark text only.** Periwinkle on paper is ~2.5:1 — it fails WCAG even for
  large text, so never use it *as* text color on light backgrounds.
  Evergreen or Ink text *on* solid periwinkle passes AA.
- Current usage: one bento card (`.card--peri`), one testimonial card tint
  (`.card--peri-tint`), marquee separators, homepage step numbers.
- **To revert completely:**
  `git revert $(git log --grep="periwinkle" --format=%H -1)`

### Contrast rules

- Ink on Paper and Primary on Paper are the workhorse text pairings — both
  pass WCAG AA comfortably in either variant.
- **Light Bronze / Eggshell (Soft) is decorative only** — it does not have
  enough contrast on Paper for text or essential icons.
- White text on Accent (Hunter Green) is fine for buttons; check anything
  smaller than button text against AA before using.

---

## Fonts

Loaded from the Adobe Fonts (Typekit) kit **`npx4mzh`**, linked in
`src/layouts/Base.astro`. The brand book's type system, with the web
font-family strings the kit actually serves:

| Role | Typeface (book) | Web family | Weight (book) | Case | Tracking | Token |
|------|-----------------|------------|---------------|------|----------|-------|
| Display | Artifex Hand CF Heavy | `artifex-hand-cf` | 800 Heavy | ALL CAPS | 0 | `--font-display` |
| Heading | The Seasons Light | `the-seasons` | 300 Light | ALL CAPS | 0 | `--font-heading` |
| Subheading | Futura PT Demibold | `futura-pt` | 600 Demibold | ALL CAPS | 0 | `--font-subheading` |
| Paragraph | Futura PT Light | `futura-pt` | 300 Light | Sentence case | 0 | `--font-body` |

Notes:

- **Tracking is 0 everywhere** — don't add letter-spacing.
- **Kit weight gap:** the kit currently ships only 400/700 for `the-seasons`
  and `futura-pt`, so Heading renders at 400 (book wants 300) and
  Subheading at 700 (book wants 600). To match the book exactly, add the
  Light (300) and Demibold (600) weights to kit `npx4mzh` in Adobe Fonts,
  then update the `--weight-*` tokens.
- Fallback stacks (already in `tokens.css`): serifs fall back to Georgia /
  Times New Roman; Futura PT falls back to Century Gothic / Avenir Next /
  Segoe UI / system-ui.
- Display (Artifex Hand) is for rare, large brand moments — the wordmark
  register. Most pages should only need Heading / Subheading / Paragraph.

---

## Logo (quick reference)

Full detail is in the brand book; assets are in `Brand/Public/Logos/`
(copy what the site needs into `Website/static/`).

- **Lockup:** lotus-book-pen mark + "Essays in Bloom" wordmark + tagline
  *"What's Your Story?"*. Scale ladder from the book: full lockup at large
  sizes → mark + wordmark → mark only → pen-nib bud at the smallest sizes.
- **Clearspace:** keep the height/width of the pen-nib bookmark clear on all
  sides; no text or graphics inside that area.
- **Favicon:** the pen nib — light-on-dark and dark-on-light versions, already
  wired up in `Base.astro` via `prefers-color-scheme`.

---

## Site structure (from the brand book's web framework page)

- **Root:** Homepage
- **Main nav:** About · Approach · Coaching · Workshops · Testimonials · Contact
- **Footer pages:** Terms of Service · Privacy Policy · Accessibility Statement
- **Footer elements (not pages):** social media links, copyright notice

---

# Styling Direction — inspired by tonemaki.com

## Shape & Layout
- Generous border-radius everywhere: ~16–24px on cards, fully rounded (pill) buttons
- Chunky rounded cards on colored square backgrounds; lots of whitespace
- Bento-grid style sections with mixed card sizes

## Typography
- Big, confident, uppercase display headings (condensed/bold grotesque feel)
- Friendly, roomy body text; strong size hierarchy between H1 → caption
- Occasional playful emphasis via weight/color, not italics

*(Brand translation: the uppercase-grotesque display register maps to
Futura PT Demibold ALL CAPS — `--font-subheading` — pushed big; The Seasons
stays for the serif brand moments. Both are already ALL CAPS in the type
system above, so the direction and the brand book agree.)*

## Vibe
- Warm, tactile, playful-premium; soft shadows only (low opacity, large blur)
- No hard borders — separation via background color shifts and radius

## Motion Principles
- Smooth, springy micro-interactions: hover scale (1.02–1.05), gentle ease-out
- Scroll-triggered reveals (fade + slight translate-up), staggered children
- Infinite marquee/ticker strips for logos or tags
- Timing: 300–500ms, cubic-bezier(0.22, 1, 0.36, 1) — nothing snappy or linear

## Motion Implementation

### Easing & timing tokens

```css
:root {
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);   /* default for everything */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot, hovers only */
  --dur-fast: 300ms;
  --dur-med:  500ms;
  --dur-slow: 800ms;
}
```

### Hover micro-interactions (CSS only)

```css
.card, .btn {
  transition: transform var(--dur-fast) var(--ease-spring),
              box-shadow var(--dur-fast) var(--ease-out-soft);
}
.card:hover { transform: scale(1.03); box-shadow: 0 20px 40px rgb(0 0 0 / 0.08); }
.btn:hover  { transform: scale(1.05); }
.btn:active { transform: scale(0.97); transition-duration: 120ms; }

/* Link underline sweep */
.link { background: linear-gradient(currentColor, currentColor) 0 100% / 0 2px no-repeat;
        transition: background-size var(--dur-fast) var(--ease-out-soft); }
.link:hover { background-size: 100% 2px; }
```

### Scroll reveals — staggered (GSAP + ScrollTrigger)

```js
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray("[data-reveal]").forEach((section) => {
  gsap.from(section.querySelectorAll("[data-reveal-child]"), {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.1,                     // children cascade in
    scrollTrigger: { trigger: section, start: "top 80%", once: true },
  });
});
```

```css
/* CSS-only fallback (no GSAP) */
[data-reveal-child] { opacity: 0; translate: 0 40px;
  transition: opacity var(--dur-slow) var(--ease-out-soft),
              translate var(--dur-slow) var(--ease-out-soft); }
.is-visible [data-reveal-child] { opacity: 1; translate: 0 0; }
.is-visible [data-reveal-child]:nth-child(2) { transition-delay: 100ms; }
.is-visible [data-reveal-child]:nth-child(3) { transition-delay: 200ms; }
/* toggle .is-visible with a small IntersectionObserver */
```

### Infinite marquee (CSS)

```css
.marquee { overflow: hidden; }
.marquee__track { display: flex; gap: 2rem; width: max-content;
  animation: marquee 25s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
/* duplicate the content once inside the track so -50% loops seamlessly */
```

### Hero entrance (on load)

```js
gsap.timeline({ defaults: { ease: "power3.out" } })
  .from(".hero h1",   { y: 60, opacity: 0, duration: 0.9 })
  .from(".hero p",    { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
  .from(".hero .btn", { scale: 0.9, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
```

## Motion Rules
- Everything eases OUT — fast start, soft landing. Never linear (except marquee).
- Transform + opacity only; never animate width/height/top/left.
- Reveals fire once, not on every scroll pass.
- Respect prefers-reduced-motion: wrap all animations in
  `@media (prefers-reduced-motion: no-preference) { ... }`

---

*Sections to grow as design decisions get made: type scale, spacing,
components, imagery.*
