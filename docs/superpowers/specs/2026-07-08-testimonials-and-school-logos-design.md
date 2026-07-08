# Real testimonials + school-logo marquee — design

Date: 2026-07-08
Status: Approved, ready for implementation plan

## Context

`Website/TODO.md` lists "Real testimonials" as an open input item. The
homepage (`src/pages/index.astro`) has two placeholder quote cards and a
text-only `Marquee` strip (service names). `src/pages/testimonials.astro` is
an unbuilt "coming soon" stub. Matt supplied 8 real testimonials and a list of
schools students have been admitted to, and asked whether the marquee could
show school logos instead of its current text.

`Website/DESIGN.md`'s Motion Principles already list "Infinite marquee/ticker
strips for logos or tags" as an anticipated pattern, so this is on-plan, not
a detour.

## Goals

1. Replace all placeholder testimonial content with the real testimonials
   below, on both the homepage and a fully built `/testimonials` page.
2. Replace the homepage marquee's text items with a monochrome, infinitely
   scrolling strip of school logos.

## Non-goals

- No CMS or external data-fetching layer — testimonials/schools live in
  plain `.ts` data modules, consistent with the site's current no-CMS,
  fully-static approach.
- No lightbox/carousel/interactive behavior on the testimonials page — a
  static bento grid, consistent with the rest of the site.
- No changes to other open `TODO.md` items (photography, contact form,
  mobile menu, dark-theme toggle, etc.).

## Source content

### Testimonials (verbatim)

1. **Emma G.** — University of Wisconsin - Madison, Class of 2024
   > Alison helped me write my main college application essay. Trying to
   > finish it before the start of my senior year of high school was
   > difficult. Alison helped me compile all of my messy first drafts into
   > the essay I am most proud to have written. She was patient with me and
   > provided amazing advice and support while also making sure that it was
   > MY essay, with words coming from me. Overall her help guided me to the
   > final draft of my essay, the best essay I have ever written. She was
   > such an amazing help!

2. **Judy C.**, Parent, Class of 2026
   > Owen is so excited to attend South Carolina. It was down to the wire so
   > to speak. We finally got to visit USC in April and he loved it! He was
   > also accepted to Chapman into the film school and he felt very proud
   > about that, but ultimately USC had a lot of what he wanted and it is
   > near family in the Carolinas, he loves that too. Cannot thank you
   > enough for how much you helped him, and I have told many friends and
   > family how wonderful you were to work with. I recommend you to
   > everyone! Thank you again!

3. **Allie K.** — University of Virginia, Kinesiology Major, Class of 2020
   > Alison's advice and guidance as I wrote my medical school personal
   > statement helped me clarify the story I was struggling to tell. She
   > improved my repetitive vocabulary and sentence structure while staying
   > true to my narrative voice. She helped me describe my strengths and
   > support them with concrete stories, a crucial part of an admissions
   > essay. Alison also made collaborating remotely very easy. Her
   > thoughtful comments and edits on my statement demonstrated the time and
   > effort she puts in with her clients. I am grateful for Alison's wisdom
   > and guidance during this process and will certainly use her for my
   > writing in the future.

4. **Carter S.** — Franklin & Marshall College, Class of 2023
   > I had an amazing experience working with Alison on my common app essay.
   > She was able to help me brainstorm ideas. Once we found one that worked
   > I was able to draw it out into a finalized essay with her assistance.
   > We were able to work together to properly portray the message I was
   > going for. She was a great help with every step of the essay writing
   > process. I could not thank her more for her professional insight.

5. **Holly G.**, Parent
   > As a parent navigating college admissions for the first time, there are
   > so many unknowns and a tremendous amount to accomplish to feel
   > confidently that you have supported your child the best way you can.
   > Our choice to work with Alison on the essay portion was both a huge
   > relief and a super effective way to stay on track. It was a reasonable
   > investment for what turned out to be a great pay off. Removing myself
   > from that particular process was healthy and super productive.

6. **Max M.** — University of Maryland - College Park, Class of 2020
   > Alison helped me write two essays for my college application. She
   > taught me what colleges are looking for in an essay and helped me
   > expand my ideas. After we brainstormed ideas, we organized the essay
   > and rearranged the paragraphs. Finally, we edited and improved the
   > syntax. After two individual meetings, Alison and I were in touch via
   > email making any finishing touches on the paper. I have been accepted
   > into both of the schools I applied to using the essay.

7. **Nathan K.** — Clark University, Class of 2022
   > Alison helped me find the experiences in my past that best answered the
   > question who am I? Through many meetings Alison helped me narrow down
   > all the ideas I had for an essay, which college admissions officers
   > would want to read, and together Alison and I created a formal, concise
   > essay that showed admissions officers who I am and why I would succeed
   > in college. We worked through many drafts, editing for content and
   > grammar, until we eventually arrived at a final draft which helped me
   > get into the school I have happily spent the last three years at.
   > Alison was vital in helping me craft a good college essay.

8. **David B.** — Franklin & Marshall College, Class of 2018
   > The Coach called us on Friday. David has been accepted to Franklin and
   > Marshall and he has a spot on the wrestling team! It must have been the
   > great essay that put him over the top! We are very happy and excited.
   > Thank you for all your help. His writing has improved and now he has
   > the skills to finish the year off strong.

Attribution strings render exactly as given above (name + role/school/class
as provided per testimonial — some have a class year, some a major, some
neither).

### Schools for the logo marquee (10, deduped)

From Matt's explicit "schools attended" list:

- University of Texas, Austin (McCombs School of Business)
- University of Wisconsin, Madison (School of Business)
- University of Michigan, Ann Arbor (Pharmaceutical Sciences)
- Chapman University (Dodge College of Film and Media Arts)
- University of Maryland, College Park
- U.S. Merchant Marine Academy

Additional schools named in testimonial attributions, not already covered:

- University of South Carolina (Judy C.'s testimonial)
- University of Virginia (Allie K.)
- Franklin & Marshall College (Carter S., David B.)
- Clark University (Nathan K.)

The marquee shows the university-level mark only (not school/program
sub-logos — those aren't reliably available as standalone marks and would
look inconsistent in a single strip).

## Design

### 1. Data layer

- `Website/src/data/testimonials.ts` — exports a typed array of
  `{ quote: string; attribution: string }` for all 8 testimonials above, in
  the order listed.
- `Website/src/data/schools.ts` — exports a typed array of
  `{ name: string; logo: string; alt: string }` for the 10 schools, where
  `logo` is a site-relative path (via `withBase`) into
  `static/logos/schools/`.

Both pages (`index.astro`, `testimonials.astro`) import from these modules
instead of hardcoding content, so there's a single source of truth.

### 2. School logo assets

- Source each school's official logo/seal as an SVG where one can be
  reliably found (Wikimedia Commons and similar are typically good sources
  for institutional seals/wordmarks), falling back to PNG if no SVG exists.
- Save into `Website/static/logos/schools/<slug>.<ext>`, one file per
  school.
- If a specific school's mark can't be sourced with confidence, that
  school's marquee entry falls back to a plain text wordmark (styled like
  the current marquee text) instead of blocking the whole feature — this
  keeps the feature shippable even if 1-2 logos are hard to track down.

### 3. Marquee component changes

`Marquee.astro` currently takes `items: string[]` and renders text spans
with a "✦" separator. Extend it to also accept a `logos` prop:

```ts
interface Props {
  items?: string[];
  logos?: { name: string; logo: string; alt: string }[];
}
```

When `logos` is provided, render `<img>` tags (with the text fallback
described above for any entry missing a `logo`) instead of text spans, and
drop the "✦" separator (doesn't read well between logos). The existing
infinite-scroll track mechanic (duplicate the list once, animate
`translateX(-50%)`, pause on hover, `prefers-reduced-motion` gating) is
unchanged — only the rendered item markup differs.

Monochrome treatment (so 10 schools' differing brand colors don't clash),
via CSS `filter` — robust regardless of each source logo's original colors:

```css
.marquee__logo img {
  filter: brightness(0) opacity(0.65);
  height: 2rem;
  width: auto;
}
:root[data-theme='dark'] .marquee__logo img {
  filter: brightness(0) invert(1) opacity(0.75);
}
```

A small caption beneath the strip: "Logos are trademarks of their
respective institutions." — standard, low-key practice for this kind of
"where our students got in" display; keeps the usage clearly nominative
(identifying schools factually, not implying endorsement).

`src/pages/index.astro` swaps its `marqueeItems` text array for the
`schools` data import and passes it as the new `logos` prop.

### 4. Homepage testimonials section

Expand from 2 placeholder cards to 3 real ones, using the existing bento
grid (6 columns) as `span-2` each (3 × 2 = 6, fills one row exactly — no
grid changes needed). Picks, for a mix of voices/schools/length:

- Emma G. (student, Wisconsin-Madison)
- Judy C. (parent, South Carolina)
- Max M. (student, Maryland)

Below the bento row, add a "Read more stories" link/button (`btn--soft`,
matching the site's existing button system) pointing to `/testimonials/`.

### 5. `/testimonials` page

Replace the "coming soon" stub with all 8 testimonials in a bento grid,
each as a `span-3` quote card (4 rows × 2 columns on desktop, collapsing per
the existing bento breakpoints). Alternate card background variants
(`card--soft`, `card--paper`, `card--peri-tint`, `card--accent`) across the
8 cards for visual rhythm, matching how the homepage services/process
sections already vary card backgrounds.

The `.quote` / `.quote blockquote` / `.quote figcaption` styles currently
live scoped inside `index.astro`'s `<style>` block. Move them into
`components.css` (shared, unscoped) so both pages use the same rule set
instead of duplicating it — a small, targeted refactor since both pages now
need it.

Keep the page's existing `PageIntro` and `CtaBand` usage; only the middle
"coming soon" section is replaced.

### 6. Accessibility & responsive

- Each logo `<img>` gets `alt` set to the school's full name (not empty/
  decorative — these convey real information, unlike the hero mark image).
- Marquee remains `role="presentation"` on the outer wrapper (unchanged);
  individual logo images carry the meaningful alt text.
- Text-fallback entries (if any) reuse the existing `.marquee__item` text
  styling for visual consistency with logo entries.
- No changes to existing `prefers-reduced-motion` handling.
- Bento breakpoints for the testimonials page reuse the existing
  `.bento`/`span-3` responsive rules — no new CSS breakpoints needed.

## Open risk / judgment call

University names/seals are trademarks. Displaying them factually to show
where alumni were admitted (not implying sponsorship or endorsement) is
standard, widely-used practice among independent college consultants and
fits nominative fair use. The small attribution caption under the marquee
keeps this explicit. No further legal review is in scope here.
