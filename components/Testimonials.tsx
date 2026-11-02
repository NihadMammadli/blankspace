'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import type { Picture } from '@/lib/media';
import { Photo } from './Photo';
import styles from './Testimonials.module.css';

type Item = { id: string; quote: string; author: string; company: string; role?: string; picture: Picture | null };
type Props = { items: Item[]; ui: { more: string; less: string; prev: string; next: string } };

/** What clients said: Damla's card row, three at a time on a wide screen, with arrows and page dots. */
export function Testimonials({ items, ui }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05)));
      setPage(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    };
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const go = (p: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(pages - 1, p));
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={styles.wrap}>
      <ul ref={track} className={styles.track}>
        {items.map((t) => {
          const long = t.quote.length > 260;
          const expanded = open[t.id];
          return (
            <li key={t.id} className={styles.card}>
              <Quote className={styles.mark} size={30} aria-hidden />
              <blockquote className={styles.quote} data-clamped={long && !expanded}>
                <p>{t.quote}</p>
              </blockquote>
              {long && (
                <button type="button" className={styles.more} aria-expanded={expanded} onClick={() => setOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}>
                  {expanded ? ui.less : ui.more}
                </button>
              )}
              <footer className={styles.footer}>
                {t.picture && (
                  <span className={styles.badge}>
                    <Photo picture={t.picture} sizes="56px" />
                  </span>
                )}
                <span>
                  <strong className={styles.name}>{t.author || t.company}</strong>
                  {(t.author ? t.company || t.role : t.role) && <span className={styles.role}>{t.author ? t.company || t.role : t.role}</span>}
                </span>
              </footer>
            </li>
          );
        })}
      </ul>

      {pages > 1 && (
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={() => go(page - 1)} disabled={page === 0} aria-label={ui.prev}>
            <ArrowLeft size={18} aria-hidden />
          </button>
          {pages > 8 ? (
            <span className={styles.counter} aria-live="polite">
              {page + 1} / {pages}
            </span>
          ) : (
            <div className={styles.dots}>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} type="button" className={styles.dot} aria-current={i === page ? 'true' : undefined} aria-label={`${i + 1} / ${pages}`} onClick={() => go(i)} />
              ))}
            </div>
          )}
          <button type="button" className={styles.arrow} onClick={() => go(page + 1)} disabled={page >= pages - 1} aria-label={ui.next}>
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
