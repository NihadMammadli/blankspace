import { Plus } from 'lucide-react';
import styles from './Faq.module.css';

/** Questions as native disclosure widgets: they open without JavaScript and every answer is in the HTML. */
export function Faq({ items }: { items: { id: string; question: string; answer: string[] }[] }) {
  return (
    <div className={styles.list} data-reveal="stagger">
      {items.map((q, i) => (
        <details key={q.id} className={styles.item} open={i === 0}>
          <summary className={styles.question}>
            <span>{q.question}</span>
            <Plus size={22} className={styles.icon} aria-hidden />
          </summary>
          <div className={`body ${styles.answer}`}>
            {q.answer.map((a, j) => (
              <p key={j}>{a}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
