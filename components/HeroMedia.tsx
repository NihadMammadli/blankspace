'use client';

import { useEffect, useRef, useState } from 'react';
import type { Picture } from '@/lib/media';
import { asset } from '@/lib/paths';
import styles from './Hero.module.css';

/**
 * The hero's picture or film, as on damla-group: a blurred preview first, then
 * the real image fading in over it once it has arrived.
 */
export function HeroMedia({ picture, video }: { picture: Picture | null; video?: string }) {
  const [loaded, setLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // already in the cache: the load event fired before React was listening
    if (img.current?.complete && img.current.naturalWidth) setLoaded(true);
    if (film.current && film.current.readyState >= 2) setLoaded(true);
  }, []);

  return (
    <div className={styles.media} data-loaded={loaded} aria-hidden={video ? true : undefined}>
      {picture?.blur && <div className={styles.blur} style={{ backgroundImage: `url("${picture.blur}")` }} />}
      {video ? (
        <video
          ref={film}
          className={styles.sharp}
          src={asset(video)}
          poster={picture?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        picture && (
          <img
            ref={img}
            className={styles.sharp}
            src={picture.src}
            srcSet={picture.srcSet}
            sizes="100vw"
            width={picture.width}
            height={picture.height}
            alt={picture.alt}
            fetchPriority="high"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        )
      )}
    </div>
  );
}
