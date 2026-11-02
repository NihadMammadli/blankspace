import type { ReactNode } from 'react';
import { Em } from './Rich';
import styles from './Section.module.css';

type Props = {
  id?: string;
  title?: string;
  subtitle?: string;
  kicker?: string;
  background?: 'white' | 'beige' | 'light' | 'ink';
  /** Narrow column for reading. */
  narrow?: boolean;
  className?: string;
  children?: ReactNode;
  /** Heading level of the title. */
  as?: 'h2' | 'h3';
};

/** A band of the page: Damla's alternating grounds, a centred title and subtitle, then content. */
export function Section({ id, title, subtitle, kicker, background = 'white', narrow, className, children, as: H = 'h2' }: Props) {
  return (
    <section id={id} className={`${styles.section} bg-${background} ${className ?? ''}`}>
      <div className={`container ${narrow ? 'narrow' : ''}`}>
        {(title || subtitle) && (
          <header className={styles.head} data-reveal="stagger">
            {kicker && <p className="kicker">{kicker}</p>}
            {title && (
              <H className="title center">
                <Em text={title} />
              </H>
            )}
            {subtitle && <p className={`body center ${styles.subtitle}`}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
