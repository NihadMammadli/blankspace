/**
 * Every page the site builds, per language, derived from the content. The
 * sitemap is generated from this list, so a new event, venue or post appears
 * in it without anyone remembering to add it.
 */
import type { Site } from '@/content/types';
import { routes } from './routes';

export interface PageEntry {
  path: string;
  /** The language the page's text is really in. */
  lang: string;
  /** Picture keys worth listing in the image sitemap. */
  images: string[];
  priority: number;
}

export function allPages(site: Site): PageEntry[] {
  const here = site.locale;
  const fixed: [string, number, string[]][] = [
    [routes.home, 1, [site.home.hero.image.src]],
    [routes.prices, 0.9, [site.pricing.page.image.src]],
    [routes.locations, 0.8, site.venues.flatMap((v) => v.locations.images.map((i) => i.src))],
    [routes.catering, 0.7, [site.catering.hero.image.src, ...site.catering.caterers.items.map((c) => c.image.src)]],
    [routes.weddings, 0.7, [site.weddings.hero.image.src, ...site.weddings.gallery.images.map((i) => i.src)]],
    [routes.services, 0.6, [site.services.hero.image.src]],
    [routes.blog, 0.6, []],
    [routes.contact, 0.7, [site.contactPage.hero.image.src]],
  ];
  return [
    ...fixed.map(([path, priority, images]) => ({ path, priority, images, lang: here })),
    ...site.venues.map((v) => ({ path: routes.venue(v.slug), priority: 0.9, lang: here, images: [...v.hero.images, ...(v.gallery?.images ?? []), ...(v.rooms ?? []).flatMap((r) => r.gallery.images)].map((i) => i.src) })),
    ...site.events.map((e) => ({ path: routes.event(e.slug), priority: 0.8, lang: here, images: e.gallery.images.map((i) => i.src) })),
    ...site.communes.map((c) => ({ path: routes.commune(c.slug), priority: 0.6, lang: here, images: [] })),
    ...site.landings.map((l) => ({ path: routes.page(l.slug), priority: 0.7, lang: here, images: [] })),
    ...site.legal.map((p) => ({ path: routes.page(p.slug), priority: 0.2, lang: p.lang, images: [] })),
    ...site.blog.posts.map((p) => ({ path: routes.post(p.slug), priority: 0.5, lang: p.lang, images: [p.image.src] })),
  ];
}
