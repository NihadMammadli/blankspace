import type { ReactNode } from 'react';
import { Em } from './Rich';
import { Icon } from './Icon';
import styles from './ImageText.module.css';

type Props = {
  id?: string;
  /** A centred title over the whole band, for the first of a run of rows ("Host any event anywhere"). */
  heading?: string;
  headingText?: string;
  /** A <Photo>, a film or a <Carousel>. */
  media: ReactNode;
  side?: 'left' | 'right';
  icon?: string;
  kicker?: string;
  title: string;
  as?: 'h2' | 'h3';
  paragraphs?: string[];
  subtext?: string;
  actions?: ReactNode;
  children?: ReactNode;
  background?: 'white' | 'beige' | 'light';
  /** Damla's gold frame behind the picture. */
  framed?: boolean;
  /** Give the media more room (films, carousels). */
  wide?: boolean;
};

/**
 * Damla's image-and-text band. The picture slides in from its own side and the
 * text from the other; on a phone they stack, text first.
 */
export function ImageText({ id, heading, headingText, media, side = 'left', icon, kicker, title, as: H = 'h2', paragraphs = [], subtext, actions, children, background = 'light', framed = true, wide }: Props) {
  const mediaBlock = (
    <div className={`${styles.media} ${wide ? styles.wide : ''} ${framed ? `frame ${side === 'right' ? 'frame-right' : ''}` : ''}`} data-reveal={side}>
      {media}
    </div>
  );
  return (
    <section id={id} className={`${styles.section} bg-${background}`} data-side={side}>
      <div className="container">
        {heading && (
          <header className={styles.head} data-reveal="stagger">
            <h2 className="title center">
              <Em text={heading} />
            </h2>
            {headingText && <p className="body center">{headingText}</p>}
          </header>
        )}
        <div className={styles.inner}>
        {side === 'left' && mediaBlock}
        <div className={styles.content} data-reveal={side === 'left' ? 'right' : 'left'}>
          {kicker && <p className="kicker">{kicker}</p>}
          <div className={styles.titleRow}>
            {icon && (
              <span className="icon-box">
                <Icon name={icon} size={28} />
              </span>
            )}
            <H className="title">
              <Em text={title} />
            </H>
          </div>
          {paragraphs.length > 0 && (
            <div className="body">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {children}
          {subtext && <p className="subtext">{subtext}</p>}
          {actions && <div className="btn-row">{actions}</div>}
        </div>
        {side === 'right' && mediaBlock}
        </div>
      </div>
    </section>
  );
}
