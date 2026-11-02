import type { ReactNode } from 'react';
import type { Picture } from '@/lib/media';
import { Icon } from './Icon';
import { Photo } from './Photo';
import { SmartLink } from './SmartLink';
import styles from './Cards.module.css';

/** Damla's wide feature card: a white icon tile beside a large title. */
export function FeatureCard({ icon, title, text, tone = 'stone' }: { icon: string; title: string; text: string; tone?: 'stone' | 'rust' }) {
  return (
    <article className={styles.feature} data-tone={tone}>
      <span className={styles.featureIcon}>
        <Icon name={icon} size={36} />
      </span>
      <div className={styles.featureText}>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className="body">{text}</p>
      </div>
    </article>
  );
}

/** Damla's service card: bronze disc, title, description. */
export function IconCard({ icon, title, text, children }: { icon: string; title?: string; text?: string; children?: ReactNode }) {
  return (
    <article className={styles.iconCard}>
      <span className={styles.disc}>
        <Icon name={icon} size={28} />
      </span>
      {title && <h3 className={styles.iconTitle}>{title}</h3>}
      {text && <p className={styles.iconText}>{text}</p>}
      {children}
    </article>
  );
}

export function CardGrid({ children, columns = 3, className }: { children: ReactNode; columns?: 2 | 3 | 4; className?: string }) {
  return (
    <div className={`${styles.grid} ${className ?? ''}`} data-columns={columns} data-reveal="stagger">
      {children}
    </div>
  );
}

/** Damla's project card: a photograph under a dark veil, the title rising as the text appears. */
export function PhotoCard({ locale, href, picture, title, text, cta }: { locale: string; href: string; picture: Picture | null; title: string; text?: string; cta?: string }) {
  return (
    <SmartLink locale={locale} href={href} className={styles.photoCard}>
      <Photo picture={picture} sizes="(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 300px" className={styles.photoImg} />
      <span className={styles.veil} />
      <span className={styles.photoBody}>
        <span className={styles.photoTitle}>{title}</span>
        {text && <span className={styles.photoText}>{text}</span>}
        {cta && (
          <span className={styles.photoCta}>
            {cta} <Icon name="ArrowRight" size={16} strokeWidth={2} />
          </span>
        )}
      </span>
    </SmartLink>
  );
}

/** A plain list of icon + label rows, for equipment and amenities. */
export function FeatureList({ items, columns = 2 }: { items: { id: string; icon: string; label: string; text?: string }[]; columns?: 1 | 2 | 3 }) {
  return (
    <ul className={styles.featureList} data-columns={columns}>
      {items.map((f) => (
        <li key={f.id}>
          <span className={styles.featureListIcon}>
            <Icon name={f.icon} size={22} />
          </span>
          <span>
            {f.text ? <strong>{f.label}</strong> : f.label}
            {f.text && <span className={styles.featureListText}>{f.text}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
