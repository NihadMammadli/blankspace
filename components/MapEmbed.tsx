'use client';

import { useState } from 'react';
import { fill } from '@/lib/format';
import styles from './Location.module.css';

type Place = { id: string; name: string; address: string };
type Props = { places: Place[]; ui: { mapTitle: string; directions: string } };

/** The map of each venue, one tab per venue. It loads as it scrolls into view. */
export function MapEmbed({ places, ui }: Props) {
  const [current, setCurrent] = useState(places[0]?.id);
  const place = places.find((p) => p.id === current) ?? places[0];
  if (!place) return null;
  const query = encodeURIComponent(`${place.name}, ${place.address}`);

  return (
    <div className={styles.map}>
      {places.length > 1 && (
        <div className={styles.tabs} role="tablist">
          {places.map((p) => (
            <button key={p.id} type="button" role="tab" aria-selected={p.id === place.id} className={styles.tab} onClick={() => setCurrent(p.id)}>
              {p.name}
            </button>
          ))}
        </div>
      )}
      <div className={styles.frame}>
        <iframe
          key={place.id}
          title={fill(ui.mapTitle, { name: place.name })}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer">
        {ui.directions} →
      </a>
    </div>
  );
}
