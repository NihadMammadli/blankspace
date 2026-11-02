import type { ReactNode } from 'react';
import type { Picture } from '@/lib/media';
import { Em } from './Rich';
import { HeroMedia } from './HeroMedia';
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
 * white. The section fades in, the picture sharpens over its blurred preview,
 * then the title, text and buttons rise one after another (0.2s, 0.4s, 0.6s)
 * and the scroll cue bounces.
 */
export function Hero({ title, kicker, text, picture, video, actions, size = 'page', scroll, children }: Props) {
  return (
    <section className={styles.hero} data-size={size}>
      <HeroMedia picture={picture} video={video} />
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
