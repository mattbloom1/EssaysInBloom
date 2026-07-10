/**
 * Site motion — GSAP + ScrollTrigger.
 * Rules (see Website/DESIGN.md): ease out, transform+opacity only,
 * reveals fire once, everything gated on prefers-reduced-motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountMeshGradient } from './mesh-gradient';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  // Hero / page-intro entrance
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('[data-hero-title]', { y: 60, opacity: 0, duration: 0.9 });
    if (hero.querySelector('[data-hero-copy]')) {
      tl.from('[data-hero-copy]', { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.5');
    }
    if (hero.querySelector('[data-hero-actions]')) {
      tl.from(
        '[data-hero-actions] > *',
        { scale: 0.9, opacity: 0, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.08 },
        '-=0.4',
      );
    }
    if (hero.querySelector('[data-hero-media]')) {
      tl.from('[data-hero-media]', { y: 48, opacity: 0, duration: 0.9 }, 0.25);
    }
  }

  // Hero photo parallax — the img is 126% of its clipping box's height, so
  // sliding it up as the page scrolls stays inside the rounded frame.
  const heroMedia = document.querySelector<HTMLElement>('[data-hero-media]');
  if (heroMedia) {
    gsap.fromTo(
      heroMedia.querySelector('img'),
      { yPercent: 0 },
      {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroMedia,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  // Seed-to-story timeline (homepage) — pin the stage and scrub the track
  // horizontally so each step slides through the center of the screen.
  // Without JS the same markup is a native horizontal scroller with snap.
  const processStage = document.querySelector<HTMLElement>('[data-process-stage]');
  const processTrack = document.querySelector<HTMLElement>('[data-process-track]');
  if (processStage && processTrack) {
    processStage.classList.add('is-pinned');
    const maxX = () => Math.max(0, processTrack.scrollWidth - processStage.clientWidth);
    const headerH = () => document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;

    const slide = gsap.to(processTrack, {
      x: () => -maxX(),
      ease: 'none',
      scrollTrigger: {
        trigger: processStage,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        start: () => `top ${headerH() + 24}px`,
        end: () => `+=${Math.max(maxX(), 1)}`,
        invalidateOnRefresh: true,
      },
    });

    // Each step "slots in" as the track carries it toward center.
    gsap.utils.toArray<Element>('[data-process-step]').forEach((step) => {
      gsap.from(step, {
        opacity: 0.2,
        y: 28,
        scale: 0.94,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: step,
          containerAnimation: slide,
          start: 'left 78%',
          end: 'center 55%',
          scrub: true,
        },
      });
    });
  }

  // CTA band (mesh gradient panel) — starts container-width and grows to
  // full-bleed as it scrolls into view. Width is the one property this
  // effect genuinely needs; it's a single element, scrubbed, so the layout
  // cost stays acceptable.
  const ctaBand = document.querySelector<HTMLElement>('[data-cta-band]');
  const ctaPanel = ctaBand?.querySelector<HTMLElement>('[data-cta]');
  if (ctaBand && ctaPanel) {
    gsap.to(ctaPanel, {
      // 100% of the full-width band, not 100vw — vw includes the scrollbar
      // gutter, which pushed the panel past the viewport at full scroll.
      width: '100%',
      borderRadius: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: ctaBand,
        start: 'top 85%',
        end: 'top 20%',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  // Scroll-triggered staggered reveals
  gsap.utils.toArray<Element>('[data-reveal]').forEach((section) => {
    const children = section.querySelectorAll('[data-reveal-child]');
    if (!children.length) return;
    gsap.from(children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      // strip inline transform/opacity once each element lands — an
      // interrupted tween can otherwise freeze siblings mid-stagger,
      // leaving side-by-side cards permanently offset
      clearProps: 'all',
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });
  });

  // Header logo bloom — on every page load the mark assembles itself: the
  // book opens, then each petal grows in from a near-invisible point at the
  // shared spine origin while spinning into place, then the pen nib rises
  // last. (Values were tuned when this lived above the footer; they scale
  // with the SVG, so they hold at logo size.)
  const bloomMark = document.querySelector('[data-bloom]');
  if (bloomMark) {
    const book = bloomMark.querySelector<SVGGElement>('[data-bloom-book]')!;
    const pen = bloomMark.querySelector<SVGGElement>('[data-bloom-pen]')!;

    const PETALS = ['inner-left', 'inner-right', 'mid-left', 'mid-right', 'outer-left', 'outer-right'] as const;
    const PETAL_CONFIG: Record<(typeof PETALS)[number], { fromX: number; fromY: number; fromScale: number; fromRotation: number; duration: number; start: number }> = {
      'inner-left': { fromX: 10, fromY: -543, fromScale: 0.001, fromRotation: 90, duration: 1, start: 0.2 },
      'inner-right': { fromX: 600, fromY: -543, fromScale: 0.001, fromRotation: -90, duration: 1, start: 1 },
      'mid-left': { fromX: 10, fromY: -200, fromScale: 0.001, fromRotation: 90, duration: 1, start: 0.4 },
      'mid-right': { fromX: 600, fromY: -200, fromScale: 0.001, fromRotation: 90, duration: 1, start: 1.2 },
      'outer-left': { fromX: 10, fromY: -200, fromScale: 0.001, fromRotation: 90, duration: 1, start: 0.6 },
      'outer-right': { fromX: 600, fromY: -189, fromScale: 0.001, fromRotation: 90, duration: 1, start: 1.4 },
    };

    // GSAP does not reliably read a CSS transform-origin (stylesheet or
    // inline) for its own SVG transforms — it needs the origin fed through
    // its `svgOrigin` API as absolute SVG-user-unit coordinates, or scale and
    // position silently pivot around the wrong point. getBBox() is local
    // geometry, unaffected by ancestor transforms, so each origin below is
    // computed once up front: the book's own bottom-center, the shared spine
    // point every petal blooms from, and each petal's own center (so
    // rotation spins it in place instead of orbiting the shared point).
    const bookBox = book.getBBox();
    const bookOrigin = `${bookBox.x + bookBox.width / 2} ${bookBox.y + bookBox.height}`;
    const sharedOrigin = '0 0';

    const petalEls: Record<string, SVGGElement> = {};
    const petalRotateEls: Record<string, SVGPathElement> = {};
    const petalOrigins: Record<string, string> = {};
    PETALS.forEach((petal) => {
      petalEls[petal] = bloomMark.querySelector<SVGGElement>(`[data-bloom-petal="${petal}"]`)!;
      const path = bloomMark.querySelector<SVGPathElement>(`[data-bloom-petal-rotate="${petal}"]`)!;
      petalRotateEls[petal] = path;
      const b = path.getBBox();
      petalOrigins[petal] = `${b.x + b.width / 2} ${b.y + b.height / 2}`;
    });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(book, { scaleX: 1.67, scaleY: 0.96, opacity: 0, svgOrigin: bookOrigin, duration: 2 }, 0);

    PETALS.forEach((petal) => {
      const cfg = PETAL_CONFIG[petal];
      tl.from(
        petalEls[petal],
        { x: cfg.fromX, y: cfg.fromY, scaleX: cfg.fromScale, scaleY: cfg.fromScale, opacity: 0, svgOrigin: sharedOrigin, duration: cfg.duration },
        cfg.start,
      );
      tl.from(
        petalRotateEls[petal],
        { rotation: cfg.fromRotation, svgOrigin: petalOrigins[petal], duration: cfg.duration },
        cfg.start,
      );
    });

    tl.from(pen, { y: 150, opacity: 0, duration: 1, ease: 'back.out(1.6)' }, 2);
  }

  // Animated liquid mesh behind the CTA. Mounted inside the reduced-motion
  // gate on purpose: reduced-motion users keep the static CSS gradient
  // fallback that shows through the untouched canvas.
  const meshCanvas = document.querySelector<HTMLCanvasElement>('[data-cta-mesh]');
  if (meshCanvas) mountMeshGradient(meshCanvas);
});
