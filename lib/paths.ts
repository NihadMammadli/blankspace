/**
 * Where the site lives. GitHub Pages serves a project repo from a sub-path
 * (/blankspace), so every absolute URL that Next does not rewrite itself — a
 * raw <img src>, a <video>, anything in metadata or JSON-LD — goes through
 * these helpers.
 *
 * Both values are set at build time (see .github/workflows/deploy.yml). Locally
 * they are empty, which is exactly right for `next dev`.
 */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** '' at a domain root, '/blankspace' on GitHub Pages. Never a trailing slash. */
export const BASE_PATH = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** Absolute origin, no path. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.blankspace.brussels').replace(/\/+$/, '');

/** True for preview builds (GitHub Pages) that must not compete with the live domain in search. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === 'true';

/** Prefix a public/ path: `asset('/img/a.webp')` → '/blankspace/img/a.webp'. Absolute URLs pass through. */
export function asset(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolute URL of a site path, for canonicals, hreflang, sitemap, Open Graph and JSON-LD. */
export function absolute(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${asset(path)}`;
}
