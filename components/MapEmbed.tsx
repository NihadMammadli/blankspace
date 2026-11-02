'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { fill } from '@/lib/format';
import styles from './Location.module.css';

type Place = { id: string; name: string; address: string };
type Props = { places: Place[]; ui: { showMap: string; mapNote: string; mapTitle: string; directions: string } };

/**
 * Google Maps loads only when the visitor asks for it: no third-party request,
 * no cookie and no layout cost until then.
 */
export function MapEmbed({ places, ui }: Props) {
  const [current, setCurrent] = useState(places[0]?.id);
  const [loaded, setLoaded] = useState(false);
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
        {loaded ? (
          <iframe
            key={place.id}
            title={fill(ui.mapTitle, { name: place.name })}
            src={`https://www.google.com/maps?q=${query}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={styles.placeholder}>
            <MapPin size={36} aria-hidden />
            <p>
              <strong>{place.name}</strong>
              <br />
              {place.address}
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setLoaded(true)}>
              {ui.showMap}
            </button>
            <small>{ui.mapNote}</small>
          </div>
        )}
      </div>
      <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer">
        {ui.directions} →
      </a>
    </div>
  );
}
