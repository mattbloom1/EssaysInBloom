/**
 * Site motion — GSAP + ScrollTrigger.
 * Rules (see Website/DESIGN.md): ease out, transform+opacity only,
 * reveals fire once, everything gated on prefers-reduced-motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      scrollTrigger: { trigger: section, start: 'top 80%', once: true },
    });
  });

  // Footer bloom (homepage only) — the book opens, then each petal grows in
  // from a near-invisible point at the shared spine origin while spinning
  // into place, then the pen nib rises last.
  const footerBloom = document.querySelector('[data-footer-bloom]');
  if (footerBloom) {
    const book = footerBloom.querySelector<SVGGElement>('[data-bloom-book]')!;
    const pen = footerBloom.querySelector<SVGGElement>('[data-bloom-pen]')!;

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
      petalEls[petal] = footerBloom.querySelector<SVGGElement>(`[data-bloom-petal="${petal}"]`)!;
      const path = footerBloom.querySelector<SVGPathElement>(`[data-bloom-petal-rotate="${petal}"]`)!;
      petalRotateEls[petal] = path;
      const b = path.getBBox();
      petalOrigins[petal] = `${b.x + b.width / 2} ${b.y + b.height / 2}`;
    });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: footerBloom, start: 'top 75%', once: true },
    });

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
});
