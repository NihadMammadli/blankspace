import type { Picture } from '@/lib/media';
import { Photo } from './Photo';
import styles from './LogoGrid.module.css';

/** The organisations that have hosted here, in Damla's even grid. */
export function LogoGrid({ logos }: { logos: Picture[] }) {
  return (
    <ul className={styles.grid} data-reveal="stagger">
      {logos.map((l) => (
        <li key={l.src} className={styles.cell}>
          <Photo picture={l} sizes="200px" />
        </li>
      ))}
    </ul>
  );
}
