/**
 * How every picture is cut. `npm run images` walks media-src/ (the originals,
 * not in git), and writes public/img/<key>-<width>.webp for each width below,
 * plus content/media.json, which the Photo component reads to build srcset.
 *
 * A key is the file's path inside media-src/ without its extension, e.g.
 * media-src/events/workshops/03.webp → "events/workshops/03". Content refers to
 * pictures by that key. To replace a picture, drop a new original in under the
 * same name and run the command again.
 *
 * A width is never larger than the original; an original narrower than every
 * width is written once, at its own size.
 */
export const DEFAULT = { widths: [480, 960, 1440], quality: 72 };

/** First match wins. */
export const PROFILES = [
  // logos and testimonial badges are drawn small and need their transparency
  { match: /^clients\//, widths: [200, 400], quality: 86 },
  { match: /^testimonials\//, widths: [96, 192], quality: 86 },
  // the square event covers are 420 px originals
  { match: /\/cover$/, widths: [420] },
];

/**
 * Share cards. Messaging apps still ignore WebP, so every picture that content
 * names as a page's `seo.image` (or the brand's `ogImage`) is also written as a
 * 1200 × 630 JPEG to public/og/<key>.jpg.
 */
export const OG = { width: 1200, height: 630, quality: 80 };
