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
});
