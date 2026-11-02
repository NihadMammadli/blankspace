'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { Picture } from '@/lib/media';
import { Photo } from './Photo';
import styles from './YouTube.module.css';

type Props = { id: string; title: string; poster: Picture | null; ui: { playVideo: string; videoNote: string } };

/** The video tour, as a picture until it is played: YouTube is not contacted before that. */
export function YouTube({ id, title, poster, ui }: Props) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.wrap}>
      {playing ? (
        <iframe
          className={styles.frame}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`${ui.playVideo}: ${title}`}>
          <Photo picture={poster} sizes="(max-width: 1000px) 100vw, 960px" />
          <span className={styles.veil} />
          <span className={styles.play}>
            <Play size={30} fill="currentColor" aria-hidden />
          </span>
          <span className={styles.label}>{ui.playVideo}</span>
        </button>
      )}
      <p className={styles.note}>{ui.videoNote}</p>
    </div>
  );
}
