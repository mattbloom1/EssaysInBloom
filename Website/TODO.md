# Website TODO

State as of 2026-07-09: full scaffold built and pushed — all brand-book routes
render, homepage is a complete landing page (hero photo with parallax, linked
black-logo school grid, pinned seed-to-story timeline, mesh-gradient CTA,
editorial testimonials), inner pages have filler layouts, and there's a
working mobile menu. Motion (GSAP + ScrollTrigger) and brand styling are
wired up per `DESIGN.md`. Everything below is what's left.

## Needs input from Matt

- [ ] **Mobile nav book icon** — Matt wants the mobile menu toggle to be a
  **closed book that becomes an open book** when the menu is selected/open
  (instead of the current hamburger-to-X lines). Needs the two icon states
  drawn from the brand mark; the toggle button in
  `src/components/Header.astro` is ready for the SVG swap.

- [ ] **Footer flower SVGs** — Matt wants to add fun flower SVGs to the
  footer later (decorative, on-brand blooms scattered in
  `src/components/Footer.astro`).

- [ ] **Seed-to-story artwork** — the four flower-stage drawings in the
  homepage timeline (seed → plant → water → bloom, inline SVGs in
  `src/pages/index.astro`) are line-art placeholders. Matt will make final
  SVGs or Lottie animations to swap in.

- [ ] **Filler copy review** — About bio paragraphs, Approach phase details,
  Coaching packages, and Workshop formats are drafted filler (each file is
  marked with a `FILLER COPY` comment) so the layouts can be judged; Alison
  to supply/approve real wording, offers, and prices.

- [ ] **Periwinkle experiment — keep or revert?** `#8B8FD4` was trialed as a
  pop color (one bento card, a testimonial tint, marquee separators, step
  numbers). It's a single commit; to undo everything:
  `git revert $(git log --grep="periwinkle" --format=%H -1)`
  Details in `DESIGN.md` → "Periwinkle experiment".

- [ ] **Typekit weights** — add The Seasons **Light (300)** and Futura PT
  **Demibold (600)** to Adobe Fonts kit `npx4mzh`, then bump
  `--weight-heading` to 300 and `--weight-subheading` to 600 in
  `src/styles/tokens.css` to match the brand book.
- [ ] **Contact email** — `essaysinbloom@gmail.com` is used in the footer and
  contact page (taken from the letterhead mockup); confirm or correct.
- [ ] **Social links** — footer Instagram/LinkedIn point to `#`.
- [x] **Real testimonials** — quotes + attribution; placeholders are clearly
  fake (homepage + testimonials page).
- [ ] **Photography** — Coaching / Workshops pages could still use imagery
  (About now uses Alison's profile pic; the homepage hero and bento use two
  of the stock shots). Nothing workshop-specific exists yet.

## Build-out (no input needed)

- [x] **Mobile menu** — hamburger toggle + full-screen evergreen overlay
  below ~820px (`src/components/Header.astro`): large centered links,
  Contact pill inside the menu (the header CTA hides on mobile), scroll
  locked while open. Icon still to be replaced with the open/closed book
  (see above).
- [x] **Mobile optimization pass** (2026-07-15) — fluid type scale
  (`--text-xl`…`--text-5xl` clamp down to 320px screens), ≥44px touch
  targets (buttons, hamburger, footer links), hover effects gated on
  `(hover: hover)` so taps don't stick, shorter mobile hero with stacked
  full-width CTAs, homepage seed-to-story timeline stacks vertically below
  821px (the pinned horizontal scrub is desktop-only in `motion.ts`),
  tighter card/section/gutter spacing on phones, and overflow fixes at
  320px (h1 sizes, email button).
- [ ] **Real copy** — inner pages now have full filler layouts (About,
  Approach, Coaching, Workshops, Testimonials, Contact); wording still needs
  Alison's review — see "Filler copy review" above.
- [ ] **Calendly link** — the contact page has a Calendly inline embed wired
  up behind a placeholder: put the real scheduling URL in `CALENDLY_URL` at
  the top of `src/pages/contact.astro` and the booking panel appears (until
  then the page shows the email card as primary).
- [ ] **Legal pages** — Terms / Privacy / Accessibility are placeholders;
  write real policies before launch.
- [x] **SEO/meta** — canonical, OG/Twitter cards, JSON-LD
  (EducationalOrganization), sitemap (`@astrojs/sitemap` + `robots.txt`),
  Typekit preconnect, and a 404 page all landed 2026-07-13 in `Base.astro` /
  `astro.config.mjs`. robots.txt hardcodes the Pages URL — update it (and
  `site` in the config) when the custom domain lands.
- [x] **Deployment (test)** — GitHub Pages via
  `.github/workflows/deploy-pages.yml`: every push to `main` that touches
  `Website/` deploys to <https://mattbloom1.github.io/EssaysInBloom/>.
  The repo was made public (2026-07-08) so Pages works on the free plan —
  note that everything in the repo is now visible, including `Brand/`.
  Pages source is set to "GitHub Actions" in repo settings. Links use
  `withBase()` (`src/lib/withBase.ts`) because Pages serves under a subpath —
  use it for every internal href/src. For real launch, revisit hosting
  (custom domain; Netlify/Vercel/Cloudflare or Pages + CNAME).

## Conventions to keep (see DESIGN.md for the full spec)

- Colors/fonts only via tokens in `src/styles/tokens.css` — never raw hex.
- Light Bronze / Eggshell is decorative only, never text.
- Motion: transform + opacity only, ease-out, reveals fire once, everything
  gated on `prefers-reduced-motion`.
- Assets the site serves get copied from `Brand/` into `static/` — `Brand/`
  itself is never served. Cream logo recolors are generated copies
  (`static/logos/half-cream.svg`); regenerate from `Brand/Public/Logos/` if
  the logo changes.
