# Website TODO

State as of 2026-07-08: full scaffold built and pushed — all brand-book routes
render, homepage is a complete landing page, motion (GSAP + ScrollTrigger) and
brand styling are wired up per `DESIGN.md`. Everything below is what's left.

## Needs input from Matt

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
- [ ] **Real testimonials** — quotes + attribution; placeholders are clearly
  fake (homepage + testimonials page).
- [ ] **Photography** — About / Coaching / Workshops pages will each want
  imagery. Available in `Brand/Public/Pictures/`: Alison's profile pic and
  three stock shots. Nothing workshop-specific exists yet.

## Build-out (no input needed)

- [ ] **Mobile menu** — header nav hides below ~820px (logo + Contact button
  remain); a proper mobile menu needs designing.
- [ ] **Real copy** — all text is placeholder written from the brand book's
  mission statement; every page marks TODOs. Inner pages (About, Approach,
  Coaching, Workshops, Testimonials) are intro + "coming soon" cards.
- [ ] **Contact form** — contact page is an email button; a form or
  scheduling link (Calendly?) should replace it.
- [ ] **Legal pages** — Terms / Privacy / Accessibility are placeholders;
  write real policies before launch.
- [ ] **Dark theme** — tokens support it (`data-theme="dark"` remaps roles)
  but there's no toggle and it's untested.
- [ ] **SEO/meta** — per-page descriptions, OG images, sitemap.
- [ ] **Deployment** — no host chosen yet; output is static (`npm run build`
  → `dist/`), so anything works (Netlify, Vercel, Cloudflare Pages, ...).

## Conventions to keep (see DESIGN.md for the full spec)

- Colors/fonts only via tokens in `src/styles/tokens.css` — never raw hex.
- Light Bronze / Eggshell is decorative only, never text.
- Motion: transform + opacity only, ease-out, reveals fire once, everything
  gated on `prefers-reduced-motion`.
- Assets the site serves get copied from `Brand/` into `static/` — `Brand/`
  itself is never served. Cream logo recolors are generated copies
  (`static/logos/half-cream.svg`); regenerate from `Brand/Public/Logos/` if
  the logo changes.
