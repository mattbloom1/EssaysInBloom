# Homepage Design — Essays in Bloom

**Date:** 2026-06-17
**Status:** Design approved; spec pending user review

## Goal

Replace the current homepage (brand-system *showcase scaffolding* in
`src/pages/index.astro`) with the real marketing homepage. It should:

1. Hook with the brand and tagline (*"What's Your Story?"*).
2. Educate a first-time visitor on the coaching **approach** (the "bloom"
   discovery → drafting process).
3. Build trust (Alison's credentials, room for testimonials).
4. Funnel to **contact** (email inquiry).

## Audience & voice

- **Primary:** the student applicant — second person ("your story"), warm and
  encouraging.
- **Secondary:** parents / decision-makers — trust signals (credentials,
  process, outcomes) woven in, not a separate track.
- **Voice:** warm, collaborative (*"Together, we…"*), literary growth/bloom
  metaphor; professional yet approachable. Consistent with the brand book and
  the current live essaysinbloom.com.

## Conversion

- Primary action: **get in touch by email** (`EssaysInBloom@gmail.com`). There
  is no booking tool today.
- Homepage CTAs link to `/contact` (the Contact page surfaces the email, and a
  form later if desired). The hero also offers a secondary "see how it works"
  in-page jump to the Approach section.

## Structure

A blend of "journey" and "concise hub": ~7 concise sections, each linking out to
its fuller page. Middle length. Light + dark themes must both work (existing
tokens already theme).

### 1. Hero — *existing component, light tweak*
- Masked logo lockup (`Full.svg`) + value-prop subline + two buttons.
- Subline (draft): "College application essay coaching that turns your real
  experiences into a Common App essay only you could write."
- Buttons: **Start your story** → `/contact` (primary); **See how it works** →
  `#approach` (secondary, in-page jump).
- Keep the visually-hidden `<h1>`: "Essays in Bloom — What's Your Story?" for
  SEO/accessibility.

### 2. Empathy beat — *short*
- One heading + one short paragraph.
- Draft heading: "Not sure where to start?"
- Draft body: "A blank essay box is the hardest part. Together, we find the
  story that's already yours — and shape it into words admissions officers
  remember."

### 3. The Approach — *centerpiece; new step-cards component*
- Heading: "How your essay blooms."
- Four steps (label + one line):
  1. **Discover** — "We clarify the roles you play, what you do, and what you
     care about."
  2. **Draft** — "Your ideas become words through an iterative drafting
     process."
  3. **Refine** — "We shape and polish until the narrative is vibrant and
     cohesive."
  4. **Bloom** — "Your Common App and supplemental essays show admissions
     officers exactly why you belong."
- Link: "See the full approach →" → `/approach`.
- Anchor target `#approach` for the hero's secondary button.

### 4. Meet your coach — *trust strip*
- Heading: "Meet your coach."
- Short intro line + credentials: 10+ years college essay coaching · IECA
  associate member · adjunct writing professor · former high-school English
  teacher · M.A. in Teaching English.
- Headshot: `/pictures/AlisonProfilePic.webp`.
- Link: "More about Alison →" → `/about`.

### 5. Ways we work together — *new service-cards component*
- Heading: "Ways we work together."
- Two cards:
  - **Coaching** — 1:1 essay guidance, Common App + supplementals → `/coaching`
  - **Workshops** — small-group sessions → `/workshops`
- Default: include both (Workshops is in the nav, treated as a real offering).
  If Workshops is not active, drop to a single Coaching card.

### 6. What families say — *testimonials; placeholders only*
- Heading: "What families say."
- 1–2 testimonial card slots with **clearly-marked placeholder text**. No
  invented quotes are published; real quotes to be supplied later.
- Link: "Read more →" → `/testimonials`.

### 7. Closing CTA — *soft brand band*
- A band with a soft brand tint/gradient.
- Heading: "What's your story? Let's find it together."
- Button: **Get in touch** → `/contact`.

## Components

New (brand-tokened; Astro components under `src/components/` and/or section
markup + rules in `src/styles/components.css`):

- **SectionHeading** — eyebrow + heading pattern shared across sections.
- **StepCard** — the Approach steps.
- **ServiceCard** — the services.
- **Testimonial** — quote card (placeholder content).
- **CtaBand** — the closing call-to-action band.

Reused unchanged: hero, `.btn`, link styles, type scale, color tokens,
`.container` / `.section` layout, dark-mode behavior.

## Styling constraints

- Use existing design tokens only (colors, type, spacing, radius) — no new
  fonts or colors.
- Honor the brand ALL-CAPS rule for display/heading/subheading.
- Verify both light and dark themes in the Astro preview.
- Keep components small and single-purpose.

## Out of scope (separate tasks)

- Body content for the other pages (About, Approach, Coaching, Workshops,
  Testimonials, Contact).
- Contact form / booking tool — homepage links to `/contact`; the Contact page
  is handled separately.
- Real testimonials (placeholders for now).
- New photography beyond the existing logo, Alison headshot, and stock images
  already in `static/pictures/`.

## Removed

- The brand-system showcase `<section>` currently in `src/pages/index.astro`.

## To confirm during build

- Final copy — the above is first-draft; the user edits.
- Whether to show the headshot in section 4 (assumed yes).
