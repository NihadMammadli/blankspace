'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The one owner of scroll and motion.
 *
 * - Every new page starts at the top, at once. (Smooth scrolling is not set on
 *   <html>: it made each navigation open the new page where the old one was
 *   scrolled to and glide up from there.)
 * - Links to an anchor on the page ("#packages") glide there instead.
 * - Each [data-reveal] element gets `is-in` the first time it comes into view;
 *   globals.css turns that into Damla's fade-up, slide or staggered entrance.
 *   Nothing is hidden unless <html> carries `motion`, which the inline head
 *   script adds only when motion is welcome.
 */
export function Motion() {
  const pathname = usePathname();
  const first = useRef(true);

  /* a new page opens at its top */
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  /* anchors on the same page glide, unless the visitor asked for less motion */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

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
