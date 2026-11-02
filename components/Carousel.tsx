'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Picture } from '@/lib/media';
import { fill } from '@/lib/format';
import { Photo } from './Photo';
import styles from './Carousel.module.css';

type Props = {
  pictures: Picture[];
  label: string;
  ui: { prev: string; next: string; slideLabel: string };
  sizes?: string;
  aspect?: string;
  /** The first picture is the page's first impression. */
  priority?: boolean;
};

/**
 * A gallery that is a scroll-snapping row underneath: it swipes on a phone and
 * scrolls with a trackpad even without JavaScript. The arrows and dots move it
 * one picture at a time.
 */
export function Carousel({ pictures, label, ui, sizes = '(max-width: 900px) 100vw, 640px', aspect = '4 / 3', priority }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = pictures.length;

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + total) % total;
    el.scrollTo({ left: n * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [total]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!total) return null;

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carousel" aria-label={label} style={{ ['--aspect' as string]: aspect }}>
      <div
        ref={track}
        className={styles.track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        }}
      >
        {pictures.map((p, i) => (
          <figure key={p.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={fill(ui.slideLabel, { n: i + 1, total })}>
            <Photo picture={p} sizes={sizes} priority={priority && i === 0} />
          </figure>
        ))}
      </div>

      {total > 1 && (
        <>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(index - 1)} aria-label={ui.prev}>
            <ArrowLeft size={20} aria-hidden />
          </button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(index + 1)} aria-label={ui.next}>
            <ArrowRight size={20} aria-hidden />
          </button>
          <div className={styles.dots}>
            {pictures.map((p, i) => (
              <button
                key={p.src}
                type="button"
                className={styles.dot}
                aria-current={i === index ? 'true' : undefined}
                aria-label={fill(ui.slideLabel, { n: i + 1, total })}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
