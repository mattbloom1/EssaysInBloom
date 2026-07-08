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

*Sections to grow as design decisions get made: type scale, spacing, motion,
components, imagery.*
