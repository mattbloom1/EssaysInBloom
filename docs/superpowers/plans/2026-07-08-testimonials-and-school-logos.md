# Real Testimonials + School-Logo Marquee Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all placeholder testimonial content with 8 real testimonials (homepage + a fully built `/testimonials` page), and replace the homepage's text marquee with a monochrome, infinitely-scrolling strip of real school logos.

**Architecture:** Two new plain-`.ts` data modules (`src/data/testimonials.ts`, `src/data/schools.ts`) feed existing Astro pages/components — no CMS, no new build tooling. The existing `Marquee.astro` component gains a `logos` prop alongside its current `items` prop. The existing `.quote` card styling moves from a page-scoped `<style>` block into shared `components.css` so two pages can reuse it.

**Tech Stack:** Astro 6 (static output), plain CSS with custom-property tokens, no test framework.

**Spec:** `docs/superpowers/specs/2026-07-08-testimonials-and-school-logos-design.md`

## Global Constraints

- Colors/fonts only via CSS custom properties in `src/styles/tokens.css` — never raw hex values in new CSS.
- Every internal `href`/asset `src` uses `withBase()` from `src/lib/withBase.ts`.
- No CMS or data-fetching layer — testimonials/schools content lives in plain `.ts` data modules.
- Motion: reuse the existing `data-reveal` / `data-reveal-child` scroll-reveal pattern and the existing marquee infinite-scroll mechanic exactly as-is; do not introduce new animation.
- **No test framework is configured in this repo** (`Website/package.json` has only `dev`/`build`/`preview` scripts; no `astro check`, no unit test runner). The correctness gate for every task is: (a) `npm run build` inside `Website/` completes with no errors, and (b) a visual check via the preview tool (start the dev server, navigate, screenshot/inspect). Do not invent a test command that doesn't exist in this repo.
- Logos are trademarks of their respective schools — the marquee must carry the small attribution caption specified in the spec (nominative-use disclosure), not present them as endorsements.
- Tasks 2, 3, and 4 make sequential edits to the same shared files (`index.astro`, `components.css`) — execute strictly in numeric order, never in parallel.

---

### Task 1: School logo assets + `schools.ts` data file

**Files:**
- Create: `Website/static/logos/schools/ut-austin.svg`
- Create: `Website/static/logos/schools/wisconsin-madison.svg`
- Create: `Website/static/logos/schools/michigan.svg`
- Create: `Website/static/logos/schools/chapman.svg`
- Create: `Website/static/logos/schools/maryland.svg`
- Create: `Website/static/logos/schools/usmma.svg`
- Create: `Website/static/logos/schools/south-carolina.svg`
- Create: `Website/static/logos/schools/virginia.svg`
- Create: `Website/static/logos/schools/franklin-marshall.svg`
- Create: `Website/static/logos/schools/clark.svg`
- Create: `Website/src/data/schools.ts`

**Interfaces:**
- Produces: `School` interface `{ name: string; logo: string; alt: string }` and `export const schools: School[]` (10 entries) from `Website/src/data/schools.ts`. Task 2 imports this.

- [ ] **Step 1: Download the 10 logo files**

These URLs were verified (via `curl`, checking HTTP status and content-type) to resolve to real image files during planning. Wikimedia's file CDN (`upload.wikimedia.org`) rate-limits rapid requests (429), so download sequentially with a delay between each — `--retry` handles transient 429s automatically.

Run from the repo root:

```bash
mkdir -p Website/static/logos/schools
cd Website/static/logos/schools

declare -a LOGOS=(
  "ut-austin|https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Texas_at_Austin_logo.svg"
  "wisconsin-madison|https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_the_University_of_Wisconsin.svg"
  "michigan|https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_the_University_of_Michigan.svg"
  "chapman|https://commons.wikimedia.org/wiki/Special:FilePath/Chapman_University_logo.svg"
  "maryland|https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Maryland_wordmark.svg"
  "usmma|https://commons.wikimedia.org/wiki/Special:FilePath/United_States_Merchant_Marine_Academy_seal.svg"
  "south-carolina|https://www.sc.edu/about/offices_and_divisions/communications/images/toolbox/logos/grid-usc-logo-centered.svg"
  "virginia|https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Virginia_seal.svg"
  "franklin-marshall|https://commons.wikimedia.org/wiki/Special:FilePath/Franklin_marshall_college_logo.svg"
  "clark|https://commons.wikimedia.org/wiki/Special:FilePath/Clark_University_wordmark.svg"
)

for entry in "${LOGOS[@]}"; do
  slug="${entry%%|*}"
  url="${entry#*|}"
  curl -sL --retry 8 --retry-all-errors --retry-delay 10 --max-time 60 \
    -A "Mozilla/5.0 (compatible; EssaysInBloomBot/1.0)" \
    -o "${slug}.svg" "$url"
  sleep 8
done
```

- [ ] **Step 2: Verify every downloaded file is really an image, not an error page**

```bash
cd Website/static/logos/schools
for f in *.svg; do
  echo "$f: $(wc -c < "$f") bytes — $(file -b "$f")"
done
```

Expected: all 10 lines say `SVG Scalable Vector Graphics image` (or `XML ... SVG` on some `file` builds), each well over 3000 bytes. If any line instead says `HTML document` or is only ~2200 bytes, that download hit a rate limit or 404 — re-run Step 1 for just that one slug (the loop is idempotent; you can copy a single entry out and re-run it with a longer `sleep`).

**Known asset caveat:** the Franklin & Marshall file (`franklin-marshall.svg`) is the only current-looking F&M mark available on Wikimedia Commons but isn't explicitly labeled "primary" on its file page — open it after download (e.g. in a browser) and eyeball that it's a normal horizontal F&M wordmark, not something obviously wrong (a mascot-only icon, a dated seal, etc.). If it looks wrong, search Franklin & Marshall's own site (fandm.edu) for a "brand" or "logo" page and substitute that file instead, keeping the same destination path.

- [ ] **Step 3: Create the schools data file**

`Website/src/data/schools.ts`:

```ts
import { withBase } from '../lib/withBase';

export interface School {
  name: string;
  logo: string;
  alt: string;
}

export const schools: School[] = [
  { name: 'University of Texas at Austin', logo: withBase('/logos/schools/ut-austin.svg'), alt: 'University of Texas at Austin logo' },
  { name: 'University of Wisconsin-Madison', logo: withBase('/logos/schools/wisconsin-madison.svg'), alt: 'University of Wisconsin-Madison logo' },
  { name: 'University of Michigan', logo: withBase('/logos/schools/michigan.svg'), alt: 'University of Michigan logo' },
  { name: 'Chapman University', logo: withBase('/logos/schools/chapman.svg'), alt: 'Chapman University logo' },
  { name: 'University of Maryland, College Park', logo: withBase('/logos/schools/maryland.svg'), alt: 'University of Maryland, College Park logo' },
  { name: 'U.S. Merchant Marine Academy', logo: withBase('/logos/schools/usmma.svg'), alt: 'U.S. Merchant Marine Academy logo' },
  { name: 'University of South Carolina', logo: withBase('/logos/schools/south-carolina.svg'), alt: 'University of South Carolina logo' },
  { name: 'University of Virginia', logo: withBase('/logos/schools/virginia.svg'), alt: 'University of Virginia logo' },
  { name: 'Franklin & Marshall College', logo: withBase('/logos/schools/franklin-marshall.svg'), alt: 'Franklin & Marshall College logo' },
  { name: 'Clark University', logo: withBase('/logos/schools/clark.svg'), alt: 'Clark University logo' },
];
```

- [ ] **Step 4: Commit**

```bash
git add Website/static/logos/schools Website/src/data/schools.ts
git commit -m "feat(site): add school logo assets and data"
```

---

### Task 2: Marquee logo support + homepage wiring

**Files:**
- Modify: `Website/src/components/Marquee.astro`
- Modify: `Website/src/styles/components.css`
- Modify: `Website/src/pages/index.astro` (marquee section only — lines ~9-17 `marqueeItems` const, and lines ~67-70 the `<div class="strip">` block)

**Interfaces:**
- Consumes: `School` type and `schools` array from `Website/src/data/schools.ts` (Task 1).
- Produces: `Marquee.astro` now accepts `Props { items?: string[]; logos?: School[] }` — exactly one of the two should be passed by any consumer.

- [ ] **Step 1: Extend `Marquee.astro` to render logos**

Replace the full contents of `Website/src/components/Marquee.astro`:

```astro
---
interface LogoItem {
  name: string;
  logo: string;
  alt: string;
}

interface Props {
  items?: string[];
  logos?: LogoItem[];
}
const { items, logos } = Astro.props;
---

<div class="marquee" role="presentation">
  <div class="marquee__track">
    {logos
      ? logos.map((school) => (
          <span class="marquee__logo">
            <img src={school.logo} alt={school.alt} loading="lazy" />
          </span>
        ))
      : items?.map((item) => <span class="marquee__item">{item}</span>)}
    {/* duplicate once so the -50% keyframe loops seamlessly */}
    {logos
      ? logos.map((school) => (
          <span class="marquee__logo" aria-hidden="true">
            <img src={school.logo} alt="" loading="lazy" />
          </span>
        ))
      : items?.map((item) => <span class="marquee__item" aria-hidden="true">{item}</span>)}
  </div>
</div>
```

- [ ] **Step 2: Add logo-marquee CSS**

In `Website/src/styles/components.css`, immediately after the existing `.marquee__item::after { ... }` block (the "✦" separator rule), add:

```css
.marquee__logo {
  display: flex;
  align-items: center;
  height: 2.5rem;
}

.marquee__logo img {
  height: 100%;
  width: auto;
  max-width: 9rem;
  object-fit: contain;
  filter: brightness(0) opacity(0.65);
}

[data-theme="dark"] .marquee__logo img {
  filter: brightness(0) invert(1) opacity(0.75);
}
```

- [ ] **Step 3: Wire the homepage marquee to schools + add attribution caption**

In `Website/src/pages/index.astro`, remove the `marqueeItems` constant (the `const marqueeItems = [...]` block, currently lines 9-17) and add an import instead. The frontmatter's import block currently reads:

```astro
import Base from '../layouts/Base.astro';
import { withBase } from '../lib/withBase';
import Marquee from '../components/Marquee.astro';
import CtaBand from '../components/CtaBand.astro';
```

Change it to:

```astro
import Base from '../layouts/Base.astro';
import { withBase } from '../lib/withBase';
import Marquee from '../components/Marquee.astro';
import CtaBand from '../components/CtaBand.astro';
import { schools } from '../data/schools';
```

Then delete the `marqueeItems` array entirely, and replace the marquee markup block:

```astro
    <!-- Marquee -->
    <div class="strip">
      <Marquee items={marqueeItems} />
    </div>
```

with:

```astro
    <!-- Marquee -->
    <div class="strip">
      <Marquee logos={schools} />
      <p class="strip__caption">Logos are trademarks of their respective institutions.</p>
    </div>
```

Finally, in the same file's `<style>` block, add a rule for the new caption right after the existing `.strip { ... }` rule:

```css
  .strip__caption {
    margin-top: var(--space-3);
    text-align: center;
    font-size: var(--text-xs);
    color: var(--color-ink);
    opacity: 0.6;
  }
```

- [ ] **Step 4: Build and visually verify**

```bash
cd Website && npm run build
```

Expected: build completes with no errors (no leftover reference to `marqueeItems`).

Then start the preview server (use the project's preview tool, not raw Bash, per the harness rules) and check the homepage: the strip between the hero and the "What we do" section should show a horizontally scrolling row of 10 grayscale-ish school logos (not text), each recognizable, looping seamlessly, pausing on hover. Confirm the small "Logos are trademarks..." caption renders beneath it. Screenshot for the record.

- [ ] **Step 5: Commit**

```bash
git add Website/src/components/Marquee.astro Website/src/styles/components.css Website/src/pages/index.astro
git commit -m "feat(site): swap homepage marquee from service text to school logos"
```

---

### Task 3: Testimonials data + homepage quote section

**Files:**
- Create: `Website/src/data/testimonials.ts`
- Modify: `Website/src/pages/index.astro` (testimonials section — the `<!-- Testimonials -->` block, and its scoped `<style>` block)
- Modify: `Website/src/styles/components.css`

**Interfaces:**
- Produces: `Testimonial` interface `{ quote: string; attribution: string }` and `export const testimonials: Testimonial[]` (8 entries, in the order below) from `Website/src/data/testimonials.ts`. Task 4 also consumes this.
- Consumes (from Task 1/2): none directly, but this task lands in the same `components.css`/`index.astro` files Task 2 touched — do this task after Task 2 to avoid merge conflicts.

- [ ] **Step 1: Create the testimonials data file**

`Website/src/data/testimonials.ts`:

```ts
export interface Testimonial {
  quote: string;
  attribution: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: `Alison helped me write my main college application essay. Trying to finish it before the start of my senior year of high school was difficult. Alison helped me compile all of my messy first drafts into the essay I am most proud to have written. She was patient with me and provided amazing advice and support while also making sure that it was MY essay, with words coming from me. Overall her help guided me to the final draft of my essay, the best essay I have ever written. She was such an amazing help!`,
    attribution: 'Emma G. — University of Wisconsin-Madison, Class of 2024',
  },
  {
    quote: `Owen is so excited to attend South Carolina. It was down to the wire so to speak. We finally got to visit USC in April and he loved it! He was also accepted to Chapman into the film school and he felt very proud about that, but ultimately USC had a lot of what he wanted and it is near family in the Carolinas, he loves that too. Cannot thank you enough for how much you helped him, and I have told many friends and family how wonderful you were to work with. I recommend you to everyone! Thank you again!`,
    attribution: 'Judy C., Parent — Class of 2026',
  },
  {
    quote: `Alison's advice and guidance as I wrote my medical school personal statement helped me clarify the story I was struggling to tell. She improved my repetitive vocabulary and sentence structure while staying true to my narrative voice. She helped me describe my strengths and support them with concrete stories, a crucial part of an admissions essay. Alison also made collaborating remotely very easy. Her thoughtful comments and edits on my statement demonstrated the time and effort she puts in with her clients. I am grateful for Alison's wisdom and guidance during this process and will certainly use her for my writing in the future.`,
    attribution: 'Allie K. — University of Virginia, Kinesiology Major, Class of 2020',
  },
  {
    quote: `I had an amazing experience working with Alison on my common app essay. She was able to help me brainstorm ideas. Once we found one that worked I was able to draw it out into a finalized essay with her assistance. We were able to work together to properly portray the message I was going for. She was a great help with every step of the essay writing process. I could not thank her more for her professional insight.`,
    attribution: 'Carter S. — Franklin & Marshall College, Class of 2023',
  },
  {
    quote: `As a parent navigating college admissions for the first time, there are so many unknowns and a tremendous amount to accomplish to feel confidently that you have supported your child the best way you can. Our choice to work with Alison on the essay portion was both a huge relief and a super effective way to stay on track. It was a reasonable investment for what turned out to be a great pay off. Removing myself from that particular process was healthy and super productive.`,
    attribution: 'Holly G., Parent',
  },
  {
    quote: `Alison helped me write two essays for my college application. She taught me what colleges are looking for in an essay and helped me expand my ideas. After we brainstormed ideas, we organized the essay and rearranged the paragraphs. Finally, we edited and improved the syntax. After two individual meetings, Alison and I were in touch via email making any finishing touches on the paper. I have been accepted into both of the schools I applied to using the essay.`,
    attribution: 'Max M. — University of Maryland, College Park, Class of 2020',
  },
  {
    quote: `Alison helped me find the experiences in my past that best answered the question who am I? Through many meetings Alison helped me narrow down all the ideas I had for an essay, which college admissions officers would want to read, and together Alison and I created a formal, concise essay that showed admissions officers who I am and why I would succeed in college. We worked through many drafts, editing for content and grammar, until we eventually arrived at a final draft which helped me get into the school I have happily spent the last three years at. Alison was vital in helping me craft a good college essay.`,
    attribution: 'Nathan K. — Clark University, Class of 2022',
  },
  {
    quote: `The Coach called us on Friday. David has been accepted to Franklin and Marshall and he has a spot on the wrestling team! It must have been the great essay that put him over the top! We are very happy and excited. Thank you for all your help. His writing has improved and now he has the skills to finish the year off strong.`,
    attribution: 'David B. — Franklin & Marshall College, Class of 2018',
  },
];
```

- [ ] **Step 2: Move `.quote` styles into shared `components.css`**

In `Website/src/pages/index.astro`'s `<style>` block, delete these two rules (currently near the bottom, after `.step__n`):

```css
  .quote blockquote {
    margin: 0 0 var(--space-4);
    font-size: var(--text-md);
    line-height: 1.5;
  }

  .quote figcaption {
    font-family: var(--font-subheading);
    font-weight: var(--weight-subheading);
    text-transform: uppercase;
    font-size: var(--text-sm);
    color: var(--color-accent);
  }
```

Add the same two rules into `Website/src/styles/components.css`, right after the `.card--photo img { ... }` block:

```css
.quote blockquote {
  margin: 0 0 var(--space-4);
  font-size: var(--text-md);
  line-height: 1.5;
}

.quote figcaption {
  font-family: var(--font-subheading);
  font-weight: var(--weight-subheading);
  text-transform: uppercase;
  font-size: var(--text-sm);
  color: var(--color-accent);
}
```

- [ ] **Step 3: Swap the homepage testimonials section to 3 real quotes + a "read more" link**

In `Website/src/pages/index.astro`, add this import alongside the `schools` import added in Task 2:

```astro
import { testimonials } from '../data/testimonials';
```

Add this near the top of the frontmatter, after the imports (alongside where `steps` is defined):

```js
// Curated for variety: student + parent voices, three different schools.
const homepageTestimonials = [testimonials[0], testimonials[1], testimonials[5]];
const homepageCardVariants = ['card--soft', 'card--peri-tint', 'card--paper'];
```

Replace the whole `<!-- Testimonials -->` section:

```astro
    <!-- Testimonials -->
    <section class="section" data-reveal>
      <div class="container">
        <div class="section__head">
          <p class="eyebrow" data-reveal-child>Kind words</p>
          <h2 data-reveal-child>Stories that bloomed</h2>
        </div>
        <div class="bento">
          <!-- TODO: real testimonials -->
          <figure class="card card--soft span-3 quote" data-reveal-child>
            <blockquote>
              "Placeholder testimonial — a few sentences from a student or
              parent about working together."
            </blockquote>
            <figcaption>Student, Class of 2026</figcaption>
          </figure>
          <figure class="card card--peri-tint span-3 quote" data-reveal-child>
            <blockquote>
              "Placeholder testimonial — another voice, ideally a contrasting
              perspective (parent, different school year)."
            </blockquote>
            <figcaption>Parent</figcaption>
          </figure>
        </div>
      </div>
    </section>
```

with:

```astro
    <!-- Testimonials -->
    <section class="section" data-reveal>
      <div class="container">
        <div class="section__head">
          <p class="eyebrow" data-reveal-child>Kind words</p>
          <h2 data-reveal-child>Stories that bloomed</h2>
        </div>
        <div class="bento">
          {homepageTestimonials.map((t, i) => (
            <figure class={`card ${homepageCardVariants[i]} span-2 quote`} data-reveal-child>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>{t.attribution}</figcaption>
            </figure>
          ))}
        </div>
        <p class="testimonials__more" data-reveal-child>
          <a href={withBase('/testimonials/')} class="btn btn--soft">Read more stories</a>
        </p>
      </div>
    </section>
```

Add the button's spacing rule to the same file's `<style>` block, next to `.bento__quote`:

```css
  .testimonials__more {
    margin-top: var(--space-8);
    text-align: center;
  }
```

- [ ] **Step 4: Build and visually verify**

```bash
cd Website && npm run build
```

Expected: build completes with no errors.

Start the preview server and check the homepage "Kind words" section: 3 real quote cards (Emma G., Judy C., Max M.) in one row, each a different card background, with a "Read more stories" button centered beneath. Screenshot for the record.

- [ ] **Step 5: Commit**

```bash
git add Website/src/data/testimonials.ts Website/src/pages/index.astro Website/src/styles/components.css
git commit -m "feat(site): replace placeholder homepage testimonials with real quotes"
```

---

### Task 4: Build out the `/testimonials` page

**Files:**
- Modify: `Website/src/pages/testimonials.astro`
- Modify: `Website/TODO.md`

**Interfaces:**
- Consumes: `Testimonial` type and `testimonials` array from `Website/src/data/testimonials.ts` (Task 3).

- [ ] **Step 1: Replace the page stub with the full testimonials grid**

Replace the full contents of `Website/src/pages/testimonials.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import PageIntro from '../components/PageIntro.astro';
import CtaBand from '../components/CtaBand.astro';
import { testimonials } from '../data/testimonials';

const cardVariants = ['card--soft', 'card--paper', 'card--peri-tint', 'card--accent'];
---

<Base title="Testimonials — Essays in Bloom">
  <main>
    <PageIntro
      eyebrow="Testimonials"
      title="Stories that bloomed"
      lede="Real words from the students and parents Alison has worked with."
    />
    <section class="section container" data-reveal>
      <div class="bento">
        {testimonials.map((t, i) => (
          <figure class={`card ${cardVariants[i % cardVariants.length]} span-3 quote`} data-reveal-child>
            <blockquote>“{t.quote}”</blockquote>
            <figcaption>{t.attribution}</figcaption>
          </figure>
        ))}
      </div>
    </section>
    <CtaBand />
  </main>
</Base>
```

- [ ] **Step 2: Check off the TODO item**

In `Website/TODO.md`, under "## Needs input from Matt", change:

```markdown
- [ ] **Real testimonials** — quotes + attribution; placeholders are clearly
  fake (homepage + testimonials page).
```

to:

```markdown
- [x] **Real testimonials** — quotes + attribution; placeholders are clearly
  fake (homepage + testimonials page).
```

- [ ] **Step 3: Build and visually verify the whole feature end-to-end**

```bash
cd Website && npm run build
```

Expected: build completes with no errors.

Start the preview server and check:
- `/testimonials/` shows all 8 testimonials in a 2-column bento grid (4 rows), backgrounds alternating across the 4 card variants, each with its real quote and attribution.
- Resize to a narrow (mobile) viewport and confirm the bento collapses to a single column per the existing responsive rules (no new breakpoint work needed — just confirm nothing overflows/clips).
- Re-check the homepage's "Read more stories" button actually navigates to `/testimonials/`.
- If a dark-mode toggle is reachable (there isn't one wired up yet per `TODO.md`), you can still sanity-check dark mode by evaluating `document.documentElement.dataset.theme = 'dark'` in the preview and confirming the marquee logos flip to the light/cream filter and the quote cards still read fine; then reload to reset.

Screenshot both pages for the record.

- [ ] **Step 4: Commit**

```bash
git add Website/src/pages/testimonials.astro Website/TODO.md
git commit -m "feat(site): build out full testimonials page, mark TODO item done"
```
