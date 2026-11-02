import styles from './QuoteBand.module.css';

/** A line the page wants remembered, between two gold rules. */
export function QuoteBand({ text, background = 'beige' }: { text: string; background?: 'beige' | 'light' | 'white' }) {
  return (
    <section className={`${styles.band} bg-${background}`}>
      <figure className="container narrow" data-reveal>
        <hr className="rule" />
        <blockquote className={styles.quote}>
          <p>“{text}”</p>
        </blockquote>
        <hr className="rule" />
      </figure>
    </section>
  );
}
