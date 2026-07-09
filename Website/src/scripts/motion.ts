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

  // Footer bloom (homepage only) — the mark opens like a book, then blooms,
  // then the pen nib rises. Closed-book artwork is a separate asset overlaid
  // on the book base; everything else animates from the mark's own paths.
  const footerBloom = document.querySelector('[data-footer-bloom]');
  if (footerBloom) {
    const closed = footerBloom.querySelector('[data-bloom-closed]');
    const book = footerBloom.querySelector('[data-bloom-book]');
    const pen = footerBloom.querySelector('[data-bloom-pen]');
    const innerTier = footerBloom.querySelectorAll('[data-bloom-tier="inner"] path');
    const midTier = footerBloom.querySelectorAll('[data-bloom-tier="mid"] path');
    const outerTier = footerBloom.querySelectorAll('[data-bloom-tier="outer"] path');

    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: footerBloom, start: 'top 75%', once: true },
      })
      .fromTo(closed, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.15, duration: 0.5, ease: 'power2.in' }, 0)
      .from(book, { scaleX: 0.82, scaleY: 0.9, opacity: 0, duration: 0.6 }, 0.15)
      .from(innerTier, { scale: 0.5, y: 20, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.45)
      .from(midTier, { scale: 0.5, y: 24, opacity: 0, duration: 0.55, stagger: 0.06 }, 0.55)
      .from(outerTier, { scale: 0.5, y: 28, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.68)
      .from(pen, { y: 24, opacity: 0, duration: 0.45, ease: 'back.out(1.6)' }, 0.95);
  }
});
