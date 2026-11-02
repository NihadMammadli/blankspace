'use client';

import { useState } from 'react';
import type { Picture } from '@/lib/media';
import { Photo } from './Photo';
import styles from './Story.module.css';

/** A partner or workshop card: picture, name, and a text that opens fully on request. */
export function Story({ picture, title, text, ui }: { picture: Picture | null; title: string; text: string; ui: { more: string; less: string } }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 220;
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Photo picture={picture} sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 300px" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text} data-clamped={long && !open}>
          {text}
        </p>
        {long && (
          <button type="button" className={styles.more} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? ui.less : ui.more}
          </button>
        )}
      </div>
    </article>
  );
}
