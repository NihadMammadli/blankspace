/**
 * URL patterns. These mirror the folders under app/[locale]/, so they are code,
 * not content: a slug is content (it comes from the data), the folder that
 * holds it is not.
 */
export const routes = {
  home: '/',
  venue: (slug: string) => `/spaces/${slug}`,
  event: (slug: string) => `/events/${slug}`,
  commune: (slug: string) => `/venues/${slug}`,
  /** Landings ("/meeting-room") and legal pages ("/gdpr-policy") share the top level. */
  page: (slug: string) => `/${slug}`,
  post: (slug: string) => `/blog/${slug}`,
  blog: '/blog',
  contact: '/contact',
  prices: '/discover-prices',
  catering: '/catering-and-workshops',
  locations: '/locations',
  weddings: '/weddings',
  services: '/services',
} as const;

const EXTERNAL = /^(https?:|mailto:|tel:|#)/;

/** "/contact" in French → "/fr/contact/". Anchors and absolute URLs pass through. */
export function localePath(locale: string, path: string): string {
  if (EXTERNAL.test(path)) return path;
  const [p, hash] = path.split('#');
  const tail = p === '/' || p === '' ? '/' : `${p.replace(/\/+$/, '')}/`;
  return `/${locale}${tail}${hash ? `#${hash}` : ''}`;
}

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
