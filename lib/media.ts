/**
 * Turns a picture from the content ({ src: key, alt }) into what an <img>
 * needs: the cut sizes from content/media.json (written by `npm run images`),
 * a srcset, and the intrinsic size so nothing jumps while it loads. Absolute
 * URLs — pictures served by a CMS later — pass through untouched.
 */
import manifest from '@/content/media.json';
import { absolute, asset } from './paths';
import type { Img } from '@/content/types';

type Entry = { widths: number[]; width: number; height: number; blur?: string; og?: boolean };
const media = manifest as Record<string, Entry>;

/** Everything <Photo> needs, resolved on the server so client components never ship the manifest. */
export interface Picture {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
  alt: string;
  blur?: string;
}

export function picture(img: Img | null | undefined): Picture | null {
  if (!img?.src) return null;
  if (/^https?:\/\//.test(img.src)) return { src: img.src, alt: img.alt };
  const m = media[img.src];
  if (!m) return null;
  const url = (w: number) => asset(`/img/${img.src}-${w}.webp`);
  const fallback = m.widths.find((w) => w >= 960) ?? m.widths.at(-1)!;
  return {
    src: url(fallback),
    srcSet: m.widths.map((w) => `${url(w)} ${w}w`).join(', '),
    width: m.width,
    height: m.height,
    alt: img.alt,
    blur: m.blur,
  };
}

export const pictures = (imgs: Img[] | undefined) => (imgs ?? []).map(picture).filter((p): p is Picture => p !== null);

/** The 1200 × 630 JPEG share card for a picture key, when one was cut. */
export function shareCard(key: string | undefined): { url: string; width: number; height: number } | undefined {
  if (!key) return undefined;
  if (/^https?:\/\//.test(key)) return { url: key, width: 1200, height: 630 };
  return media[key]?.og ? { url: absolute(`/og/${key}.jpg`), width: 1200, height: 630 } : undefined;
}

/** The largest cut of a picture, absolute — for JSON-LD. */
export function largest(key: string | undefined): string | undefined {
  if (!key) return undefined;
  if (/^https?:\/\//.test(key)) return key;
  const m = media[key];
  return m ? absolute(`/img/${key}-${m.widths.at(-1)}.webp`) : undefined;
}
