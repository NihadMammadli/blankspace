'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import styles from './Stats.module.css';

type Item = { id: string; value: number; suffix?: string; label: string; icon: string };

/** Damla's figures: a gold ring, the number counting up the first time it is seen, the label. */
export function Stats({ items }: { items: Item[] }) {
  return (
    <ul className={styles.stats}>
      {items.map((it) => (
        <li key={it.id} className={styles.item}>
          <span className="icon-ring">
            <Icon name={it.icon} size={30} />
          </span>
          <Counter value={it.value} suffix={it.suffix} />
          <span className={styles.label}>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  // the real number is in the HTML; the count-up is a decoration on top
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !document.documentElement.classList.contains('motion')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;
    setShown(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round((1 - Math.pow(1 - t, 4)) * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={styles.number}>
      {shown}
      {suffix}
    </span>
  );
}
