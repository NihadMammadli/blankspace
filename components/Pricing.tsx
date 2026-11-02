import type { Pricing as PricingData, Site } from '@/content/types';
import { money } from '@/lib/format';
import { Icon } from './Icon';
import { SmartLink } from './SmartLink';
import styles from './Pricing.module.css';

type Props = {
  site: Site;
  /** Which part to show. */
  show?: 'all' | 'packages' | 'flat';
  /** Only this venue's flat rate. */
  venue?: string;
};

export function Pricing({ site, show = 'all', venue }: Props) {
  const p: PricingData = site.pricing;
  const { locale, ui } = site;
  const feature = (id: string) => p.features.find((f) => f.id === id);
  const rates = p.flatRates.items.filter((r) => !venue || r.venue === venue);

  const List = ({ ids }: { ids: string[] }) => (
    <ul className={styles.features}>
      {ids.map((id) => {
        const f = feature(id);
        return f ? (
          <li key={id}>
            <Icon name={f.icon} size={20} className={styles.featureIcon} />
            {f.label}
          </li>
        ) : null;
      })}
    </ul>
  );

  return (
    <div className={styles.wrap}>
      {show !== 'flat' && (
        <div id="packages" className={styles.packages} data-reveal="stagger">
          {p.packages.map((pk) => (
            <article key={pk.id} className={styles.card} data-highlight={pk.highlight || undefined}>
              <h3 className={styles.name}>{pk.name}</h3>
              <p className={styles.price}>
                <span className={styles.amount}>{money(locale, pk.price, p.currency)}</span>
                <span className={styles.unit}>{ui.perPerson}</span>
              </p>
              <List ids={pk.features} />
              <SmartLink locale={locale} href="/contact" className={`btn ${pk.highlight ? 'btn-primary' : 'btn-outline'} ${styles.button}`}>
                {ui.quote}
              </SmartLink>
            </article>
          ))}
        </div>
      )}

      {show !== 'packages' && (
        <div className={styles.flat}>
          {show === 'all' && (
            <header className={styles.flatHead} data-reveal>
              <h3 className="title center">{p.flatRates.title}</h3>
              <p className="body center">{p.flatRates.text}</p>
            </header>
          )}
          <div className={styles.rates} data-columns={rates.length} data-reveal="stagger">
            {rates.map((r) => (
              <article key={r.id} className={`${styles.card} ${styles.rate}`}>
                <h3 className={styles.name}>{r.title}</h3>
                <dl className={styles.periods}>
                  <div>
                    <dt>{ui.halfDay}</dt>
                    <dd>{money(locale, r.halfDay, p.currency)}</dd>
                  </div>
                  <div>
                    <dt>{ui.fullDay}</dt>
                    <dd>{money(locale, r.fullDay, p.currency)}</dd>
                  </div>
                </dl>
                <List ids={r.features} />
                <SmartLink locale={locale} href="/contact" className={`btn btn-primary ${styles.button}`}>
                  {ui.quote}
                </SmartLink>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
