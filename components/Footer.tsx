import type { Site } from '@/content/types';
import { asset } from '@/lib/paths';
import { fill, tel } from '@/lib/format';
import { Icon } from './Icon';
import { SmartLink } from './SmartLink';
import styles from './Footer.module.css';

/** Damla's footer: a call to action on ink, then the columns, then the small print. */
export function Footer({ site }: { site: Site }) {
  const { locale, menus, ui, brand, contact } = site;
  return (
    <footer className={styles.footer}>
      <section className={styles.cta} data-reveal>
        <h2 className={styles.ctaTitle}>{menus.cta.title}</h2>
        <p className={styles.ctaText}>{menus.cta.text}</p>
        <SmartLink locale={locale} href={menus.cta.href} className="btn btn-primary">
          {menus.cta.label}
          <Icon name="ArrowRight" size={18} strokeWidth={2} />
        </SmartLink>
      </section>

      <div className={styles.bottom}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <SmartLink locale={locale} href="/" aria-label={`${brand.name} — ${ui.home}`}>
              <img src={asset(brand.logo.light)} width={brand.logo.width} height={brand.logo.height} alt={brand.name} className={styles.logo} loading="lazy" />
            </SmartLink>
            <p className={styles.muted}>{ui.tagline}</p>
            <ul className={styles.contact}>
              {site.venues.map((v) => (
                <li key={v.id}>
                  <Icon name="MapPin" size={18} className={styles.icon} />
                  <span>
                    <strong>{v.name}</strong>
                    <br />
                    {v.address.street}, {v.address.postalCode} {v.address.city}
                  </span>
                </li>
              ))}
              <li>
                <Icon name="Phone" size={18} className={styles.icon} />
                <a href={tel(contact.phone)}>{contact.phone}</a>
              </li>
              <li>
                <Icon name="Mail" size={18} className={styles.icon} />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            </ul>
            <div className={styles.social}>
              <span className="sr-only">{ui.followUs}</span>
              {site.social.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${brand.name} — ${s.id}`}>
                  <Icon name={s.id === 'instagram' ? 'Instagram' : 'Linkedin'} size={22} />
                </a>
              ))}
            </div>
          </div>

          {menus.footer.map((group) => (
            <nav key={group.id} className={styles.column} aria-label={group.title}>
              <p className={styles.columnTitle}>{group.title}</p>
              <ul>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <SmartLink locale={locale} href={l.href} className={styles.link}>
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.legal}>
          <p>{fill(ui.rights, { year: new Date().getFullYear(), name: brand.legalName })}</p>
          <ul>
            {menus.legal.map((l) => (
              <li key={l.href}>
                <SmartLink locale={locale} href={l.href} className={styles.link}>
                  {l.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
