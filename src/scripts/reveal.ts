import { animate, stagger } from 'animejs';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Revela elementos [data-reveal] al entrar en viewport, con stagger por grupo. */
export function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (reduced) {
    els.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    setupSquiggles(true);
    setupHero(true);
    return;
  }

  // Agrupar por contenedor [data-reveal-group] para hacer stagger.
  const grouped = new Map<Element | null, HTMLElement[]>();
  for (const el of els) {
    const group = el.closest('[data-reveal-group]');
    const arr = grouped.get(group) ?? [];
    arr.push(el);
    grouped.set(group, arr);
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        obs.unobserve(el);
        const group = el.closest('[data-reveal-group]');
        const siblings = grouped.get(group) ?? [el];
        if (siblings.length > 1 && group) {
          // anima todo el grupo una sola vez
          if ((group as HTMLElement).dataset.revealed) continue;
          (group as HTMLElement).dataset.revealed = '1';
          siblings.forEach((s) => obs.unobserve(s));
          animate(siblings, {
            opacity: [0, 1],
            translateY: [24, 0],
            scale: [0.985, 1],
            duration: 750,
            delay: stagger(90),
            ease: 'out(3)',
            onComplete: () => siblings.forEach((s) => (s.style.transform = '')),
          });
        } else {
          animate(el, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            ease: 'out(3)',
            onComplete: () => (el.style.transform = ''),
          });
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach((el) => io.observe(el));
  setupSquiggles(false);
  setupHero(false);
}

/** Dibuja trazos SVG [data-squiggle] (stroke-dashoffset) al hacer scroll. */
function setupSquiggles(instant: boolean) {
  const paths = Array.from(document.querySelectorAll<SVGPathElement>('[data-squiggle] path'));
  for (const p of paths) {
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = instant ? '0' : String(len);
  }
  if (instant) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const svg = entry.target;
        obs.unobserve(svg);
        const ps = svg.querySelectorAll<SVGPathElement>('path');
        animate(ps, {
          strokeDashoffset: [(el: any) => el.getTotalLength(), 0],
          duration: 1100,
          delay: stagger(120),
          ease: 'inOut(2)',
        });
      }
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll('[data-squiggle]').forEach((s) => io.observe(s));
}

/** Entrada escalonada del hero. */
function setupHero(instant: boolean) {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const items = hero.querySelectorAll<HTMLElement>('[data-hero-item]');
  if (instant) {
    // Movimiento reducido: el video de portada queda quieto en su póster.
    hero.querySelectorAll<HTMLVideoElement>('[data-hero-video]').forEach((v) => {
      v.removeAttribute('autoplay');
      v.pause();
    });
    items.forEach((i) => {
      i.style.opacity = '1';
      i.style.transform = 'none';
    });
    return;
  }
  animate(items, {
    opacity: [0, 1],
    translateY: [28, 0],
    duration: 800,
    delay: stagger(120, { start: 150 }),
    ease: 'out(3)',
  });
}
