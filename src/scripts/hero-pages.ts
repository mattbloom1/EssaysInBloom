import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Pinned hero "page arc". While the hero is scroll-locked, N essay pages fly in
 * from off-screen bottom-right, arc up and over the centered wordmark, and
 * settle into a partially-neat stack at bottom-left. Pages peel in staggered as
 * you scroll. Reduced-motion shows the settled stack with no pin/scroll-jacking.
 *
 * To tune by hand: `npm run dev`, drag the dev "Hero pages" panel (top-right),
 * then Copy → paste over HERO_PAGES_CONFIG below. All geometry is in % of the
 * stage (responsive); rotations in degrees.
 *
 * The page look (paper, ink mask, size) lives in src/styles/home.css
 * (.page-card / .page-card__ink).
 */

interface Pt {
  /** % of stage width. */
  x: number;
  /** % of stage height. */
  y: number;
}

export interface HeroPagesConfig {
  /** Number of pages (≥10). Cards cycle Paper1/2/3. */
  count: number;
  /** Scroll distance the effect plays over, as % of viewport height. Larger =
   *  the animation is spread over more scroll, so it plays out more slowly. */
  pin: number;
  /** ScrollTrigger scrub lag (seconds; higher = silkier). */
  scrub: number;
  /** Page size multiplier (1 = the CSS clamp size). */
  scale: number;
  /** Scroll-timeline units between each page's start (smaller = tighter stream). */
  stagger: number;
  /** Reverse the flight: pages start stacked and fly AWAY (stack → off-screen)
   *  as you scroll, instead of flying in. */
  reverse: boolean;
  /** Entry: off-screen start point + spread + entry rotation range (deg). */
  entry: { x: number; y: number; spread: number; rotMin: number; rotMax: number };
  /** Crest: the arc's control point, above the wordmark. */
  crest: Pt;
  /** Stack target + per-page step (dx/dy, %) + rotation jitter (± deg). */
  stack: { x: number; y: number; dx: number; dy: number; rotJitter: number };
}

// ── TUNE ME ──────────────────────────────────────────────────────────────
export const HERO_PAGES_CONFIG: HeroPagesConfig = {
  count: 10,
  pin: 150,
  scrub: 2.3,
  scale: 1,
  stagger: 0.1,
  reverse: false,
  entry: { x: 50, y: 76, spread: 150, rotMin: -26, rotMax: 26 },
  crest: { x: 50, y: 70 },
  stack: { x: 48, y: 82, dx: 0, dy: -0.5, rotJitter: 10 },
};
// ───────────────────────────────────────────────────────────────────────────

const SEED = 0x9e3779b1;

/** Deterministic PRNG so live rebuilds (tuner) don't reshuffle every frame. */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface PageParams {
  p0: Pt;
  c: Pt;
  p1: Pt;
  entryRot: number;
  stackRot: number;
}

/** Per-page geometry, derived deterministically from the config + index. */
function makeParams(config: HeroPagesConfig, i: number, rand: () => number): PageParams {
  const e = config.entry;
  const s = config.stack;
  return {
    p0: { x: e.x + (rand() * 2 - 1) * e.spread, y: e.y + (rand() * 2 - 1) * e.spread * 0.5 },
    c: { x: config.crest.x, y: config.crest.y },
    p1: { x: s.x + i * s.dx + (rand() * 2 - 1) * 1.2, y: s.y + i * s.dy + (rand() * 2 - 1) * 0.8 },
    entryRot: e.rotMin + rand() * (e.rotMax - e.rotMin),
    stackRot: (rand() * 2 - 1) * s.rotJitter,
  };
}

interface Ctx {
  W: number;
  H: number;
  cardW: number;
  cardH: number;
  scale: number;
}

/** Position a card along its quadratic arc at scrubbed progress t ∈ [0,1]. */
function place(card: HTMLElement, p: PageParams, t: number, ctx: Ctx) {
  const x0 = (p.p0.x / 100) * ctx.W;
  const y0 = (p.p0.y / 100) * ctx.H;
  const xc = (p.c.x / 100) * ctx.W;
  const yc = (p.c.y / 100) * ctx.H;
  const x1 = (p.p1.x / 100) * ctx.W;
  const y1 = (p.p1.y / 100) * ctx.H;
  const mt = 1 - t;
  const x = mt * mt * x0 + 2 * mt * t * xc + t * t * x1;
  const y = mt * mt * y0 + 2 * mt * t * yc + t * t * y1;
  const rot = p.entryRot + (p.stackRot - p.entryRot) * t;
  gsap.set(card, { x: x - ctx.cardW / 2, y: y - ctx.cardH / 2, rotation: rot, scale: ctx.scale });
}

export interface HeroPagesApi {
  /** Live, mutable config — the tuner edits this in place, then calls rebuild(). */
  config: HeroPagesConfig;
  stage: HTMLElement;
  /** Re-inject cards + rebuild the pinned timeline (or settled stack). */
  rebuild: () => void;
  /** The current scrubbed timeline (null under reduced motion). For dev/debug. */
  readonly timeline: gsap.core.Timeline | null;
}

export function mountHeroPages(): HeroPagesApi | null {
  const stage = document.querySelector<HTMLElement>('.hero__stage');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!stage || !hero) return null;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);

  const config = HERO_PAGES_CONFIG;
  let tween: gsap.core.Timeline | null = null;

  function injectCards(): HTMLElement[] {
    stage!.replaceChildren();
    const cards: HTMLElement[] = [];
    for (let i = 0; i < config.count; i++) {
      const card = document.createElement('div');
      card.className = 'page-card';
      card.dataset.page = String(i % 3);
      card.style.zIndex = String(i); // later pages stack on top
      const ink = document.createElement('span');
      ink.className = 'page-card__ink';
      card.appendChild(ink);
      stage!.appendChild(card);
      cards.push(card);
    }
    return cards;
  }

  function rebuild() {
    tween?.scrollTrigger?.kill(true);
    tween?.kill();
    tween = null;

    const rect = stage!.getBoundingClientRect();
    // Layout not ready yet (e.g. first paint before the viewport has a size, or
    // a hidden tab). Building a pinned ScrollTrigger off a 0-size measurement
    // corrupts it — wait for a real measurement.
    if (rect.width === 0 || rect.height === 0) {
      requestAnimationFrame(rebuild);
      return;
    }

    const cards = injectCards();
    const ctx: Ctx = {
      W: rect.width,
      H: rect.height,
      cardW: cards[0]?.offsetWidth ?? 0,
      cardH: cards[0]?.offsetHeight ?? 0,
      scale: config.scale,
    };

    const rand = mulberry32(SEED);
    const params = cards.map((_, i) => makeParams(config, i, rand));

    if (reduce) {
      // Settled stack, no motion.
      cards.forEach((card, i) => place(card, params[i], 1, ctx));
      return;
    }

    // Direction: forward = fly in (entry → stack); reverse = fly away
    // (stack → entry) as you scroll.
    const dirT = (pt: number) => (config.reverse ? 1 - pt : pt);
    cards.forEach((card, i) => place(card, params[i], dirT(0), ctx)); // initial pose

    // No pin: the hero scrolls normally (no freeze). The animation just scrubs
    // over `pin`% of scroll, so a large value + scrub makes the effect play out
    // slowly as you scroll. Begins as soon as the hero reaches the top.
    tween = gsap.timeline({
      scrollTrigger: {
        trigger: hero!,
        start: 'top top',
        end: `+=${config.pin}%`,
        scrub: config.scrub,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      const proxy = { t: 0 };
      tween!.to(
        proxy,
        { t: 1, ease: 'power1.inOut', duration: 1, onUpdate: () => place(card, params[i], dirT(proxy.t), ctx) },
        i * config.stagger,
      );
    });
  }

  rebuild();

  // Recompute on resize (positions are cached in px). Debounced.
  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(rebuild, 200);
  });

  return {
    config,
    stage,
    rebuild,
    get timeline() {
      return tween;
    },
  };
}
