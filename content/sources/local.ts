/**
 * The local content source: assembles a `Site` from the JSON files in
 * content/data/. It plays the part a CMS or API will play later.
 *
 *   site.json     everything that does not change with the language — slugs,
 *                 prices, capacities, picture keys, links
 *   <locale>.json every word, in one language
 *
 * The two are merged by id: an array of `{ id, … }` objects in site.json takes
 * its text from the object of the same id in the language file. The English
 * file sits underneath every other language, so a missing translation shows
 * the English text instead of a hole.
 */
import shared from '../data/site.json';
import en from '../data/en.json';
import fr from '../data/fr.json';
import nl from '../data/nl.json';
import { routes } from '@/lib/routes';
import type { Link, Site } from '../types';

type Json = Record<string, unknown>;
const DOCS: Record<string, Json> = { en, fr, nl };

const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const isIdArray = (v: unknown): v is Json[] => Array.isArray(v) && v.length > 0 && v.every((x) => isObject(x) && typeof x.id === 'string');

/** Deep merge; an id-array on the left takes its fields from an id-keyed object on the right. */
function merge(base: unknown, over: unknown): unknown {
  if (over === undefined) return base;
  if (isIdArray(base) && isObject(over)) return base.map((item) => merge(item, over[item.id as string]));
  if (isObject(base) && isObject(over)) {
    const out: Json = { ...base };
    for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
    return out;
  }
  if (isObject(over) && base === undefined) return merge({}, over);
  return over;
}

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

/**
 * Pictures are stored as keys plus alt text; the site wants `{ src, alt }`.
 *   { image: "key", imageAlt: "…" }            → image: { src, alt }
 *   { images: ["k1", "k2"], alt: "… {n} …" }   → images: [{ src, alt }, …]
 *   { images: […], alts: ["…", "…"] }           → one alt per picture
 */
function pictures(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(pictures);
  if (!isObject(node)) return node;
  const out: Json = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === 'imageAlt' || ((k === 'alt' || k === 'alts') && Array.isArray(node.images))) continue;
    out[k] = pictures(v);
  }
  if (typeof node.image === 'string') out.image = { src: node.image, alt: (node.imageAlt as string) ?? '' };
  if (Array.isArray(node.images) && node.images.every((x) => typeof x === 'string')) {
    const keys = node.images as string[];
    const alts = node.alts as string[] | undefined;
    const alt = (node.alt as string | undefined) ?? '';
    out.images = keys.map((src, i) => ({ src, alt: alts?.[i] ?? fill(alt, { n: i + 1, total: keys.length }) }));
  }
  return out;
}

/** The link to every item of a collection, for menus written as `"links": "events"`. */
function collectionLinks(site: Site, name: string): Link[] {
  switch (name) {
    case 'events':
      return site.events.map((e) => ({ label: e.navLabel, href: routes.event(e.slug) }));
    case 'venues':
      return site.venues.map((v) => ({ label: v.name, href: routes.venue(v.slug) }));
    case 'communes':
      return site.communes.map((c) => ({ label: c.name, href: routes.commune(c.slug) }));
    case 'legal':
      return site.legal.map((p) => ({ label: p.label, href: routes.page(p.slug) }));
    default:
      throw new Error(`content: menus refer to an unknown collection "${name}"`);
  }
}

type RawMenu = { id: string; label: string; caption?: string; href?: string; children?: string; extra?: Link[] };
type RawGroup = { id: string; title: string; links: string | Link[] };

export function locales(): string[] {
  return shared.locales.map((l) => l.code);
}

export async function load(locale: string): Promise<Site> {
  const doc = DOCS[locale];
  if (!doc) throw new Error(`content: no language file for "${locale}"`);
  const fallback = shared.defaultLocale;
  const merged = merge(merge(shared, DOCS[fallback]), locale === fallback ? undefined : doc) as Json;
  const site = pictures(merged) as unknown as Site & { menus: Json };
  site.locale = locale;

  // the language a page is really written in: legal pages and posts exist in English only
  const own = (section: string, sub: string | null, id: string, field: string) => {
    const s = doc[section] as Json | undefined;
    const items = (sub ? (s?.[sub] as Json | undefined) : s) as Json | undefined;
    return Boolean((items?.[id] as Json | undefined)?.[field]);
  };
  site.legal = site.legal.map((p) => ({ ...p, lang: own('legal', null, p.id, 'blocks') ? locale : fallback }));
  site.blog.posts = site.blog.posts
    .map((p) => ({ ...p, lang: own('blog', 'posts', p.id, 'body') ? locale : fallback }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const menus = merged.menus as { main: RawMenu[]; footer: RawGroup[]; legal: string; cta: Site['menus']['cta'] };
  site.menus = {
    main: menus.main.map((m) => ({
      id: m.id,
      label: m.label,
      caption: m.caption,
      href: m.href,
      children: m.children ? [...collectionLinks(site, m.children), ...(m.extra ?? [])] : undefined,
    })),
    footer: menus.footer.map((g) => ({ id: g.id, title: g.title, links: typeof g.links === 'string' ? collectionLinks(site, g.links) : g.links })),
    legal: collectionLinks(site, menus.legal),
    cta: menus.cta,
  };
  return site;
}
