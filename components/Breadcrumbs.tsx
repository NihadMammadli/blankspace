import type { Site } from '@/content/types';
import { breadcrumbLd } from '@/lib/seo';
import { JsonLd } from './JsonLd';
import { SmartLink } from './SmartLink';
import styles from './Breadcrumbs.module.css';

/** Where this page sits, for people and (as BreadcrumbList) for search engines. */
export function Breadcrumbs({ site, trail }: { site: Site; trail: { label: string; path: string }[] }) {
  const all = [{ label: site.ui.home, path: '/' }, ...trail];
  return (
    <nav className={styles.bar} aria-label={site.ui.breadcrumb}>
      <ol className="container">
        {all.map((t, i) => (
          <li key={t.path}>
            {i < all.length - 1 ? (
              <SmartLink locale={site.locale} href={t.path}>
                {t.label}
              </SmartLink>
            ) : (
              <span aria-current="page">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbLd(site, trail)} />
    </nav>
  );
}
