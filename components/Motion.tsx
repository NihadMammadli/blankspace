'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The one owner of scroll motion. Each [data-reveal] element gets `is-in` the
 * first time it comes into view; globals.css turns that into Damla's fade-up,
 * slide or staggered entrance. Nothing is hidden unless <html> carries
 * `motion`, which the inline head script adds only when motion is welcome.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fired = 'true';
    const reduced = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (reduced) {
      root.classList.remove('motion');
      document.querySelectorAll<HTMLVideoElement>('video[autoplay]').forEach((v) => v.pause());
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

/** Runs before first paint: opt in to motion, and opt back out if the bundle never loads. */
export const MOTION_SCRIPT = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;d.classList.add('motion');setTimeout(function(){if(d.dataset.fired!=='true')d.classList.remove('motion')},3000)}catch(e){}})()`;
