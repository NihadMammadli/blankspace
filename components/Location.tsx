import type { Site } from '@/content/types';
import { tel } from '@/lib/format';
import { Icon } from './Icon';
import { MapEmbed } from './MapEmbed';
import { Section } from './Section';
import styles from './Location.module.css';

/** Where to find us: the map on one side, how to get there on the other. */
export function Location({ site, title, background = 'light' }: { site: Site; title?: string; background?: 'white' | 'light' | 'beige' }) {
  const { ui, location, contact } = site;
  const places = site.venues.map((v) => ({ id: v.id, name: v.name, address: `${v.address.street}, ${v.address.postalCode} ${v.address.city}` }));
  return (
    <Section id="location" title={title ?? ui.contactUs} background={background}>
      <div className={styles.grid}>
        <div data-reveal="left">
          <MapEmbed places={places} ui={{ showMap: ui.showMap, mapNote: ui.mapNote, mapTitle: ui.mapTitle, directions: ui.directions }} />
        </div>
        <div className={styles.details} data-reveal="right">
          <h3 className="h3">{location.title}</h3>
          <p className="body">{location.text}</p>
          <ul className={styles.facts}>
            <li>
              <Icon name="Phone" size={20} className={styles.factIcon} />
              <span>
                <strong>{ui.phone}</strong>
                <a href={tel(contact.phone)}>{contact.phone}</a>
              </span>
            </li>
            <li>
              <Icon name="Mail" size={20} className={styles.factIcon} />
              <span>
                <strong>{ui.email}</strong>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </span>
            </li>
            <li>
              <Icon name="MapPin" size={20} className={styles.factIcon} />
              <span>
                <strong>{ui.address}</strong>
                {places.map((p) => (
                  <span key={p.id} className={styles.line}>
                    {p.name}: {p.address}
                  </span>
                ))}
              </span>
            </li>
            <li>
              <Icon name="Car" size={20} className={styles.factIcon} />
              <span>
                <strong>{ui.parking}</strong>
                {location.parking}
              </span>
            </li>
            <li>
              <Icon name="Train" size={20} className={styles.factIcon} />
              <span>
                <strong>{ui.transport}</strong>
                {location.transport}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
