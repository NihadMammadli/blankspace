import type { ReactNode } from 'react';
import type { Picture } from '@/lib/media';
import { asset } from '@/lib/paths';
import { Em } from './Rich';
import { Photo } from './Photo';
import styles from './Hero.module.css';

type Props = {
  title: string;
  kicker?: string;
  text?: string;
  picture: Picture | null;
  /** A muted, looping background film; the picture is its poster. */
  video?: string;
  actions?: ReactNode;
  /** 'full' fills the first screen (home); 'page' is shorter, for inner pages. */
  size?: 'full' | 'page';
  /** Where the bouncing arrow leads. */
  scroll?: { label: string; target: string };
  children?: ReactNode;
};

/**
 * Damla's hero: a photograph (or film) under a navy veil, the title centred in
 * white, and everything rising in after it — title, then text, then buttons.
 * The picture's 16 px preview sits blurred underneath until it arrives.
 */
export function Hero({ title, kicker, text, picture, video, actions, size = 'page', scroll, children }: Props) {
  return (
    <section className={styles.hero} data-size={size}>
      <div className={styles.media} style={picture?.blur ? { backgroundImage: `url("${picture.blur}")` } : undefined} aria-hidden={video ? true : undefined}>
        {video ? (
          <video
            className={styles.video}
            src={asset(video)}
            poster={picture?.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : (
          <Photo picture={picture} sizes="100vw" className={styles.image} priority />
        )}
      </div>
      <div className={styles.veil} />

      <div className={styles.content}>
        {kicker && <p className={`kicker ${styles.kicker}`}>{kicker}</p>}
        <h1 className={styles.title}>
          <Em text={title} />
        </h1>
        {text && <p className={styles.text}>{text}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
        {children}
      </div>

      {scroll && (
        <a href={scroll.target} className={styles.scroll} aria-label={scroll.label}>
          <span className={styles.mouse} aria-hidden />
        </a>
      )}
    </section>
  );
}
