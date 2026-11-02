import type { MetadataRoute } from 'next';
import { getLocales, getSite } from '@/content';
import { absolute } from '@/lib/paths';
import { largest } from '@/lib/media';
import { allPages } from '@/lib/pages';
import { localePath } from '@/lib/routes';

export const dynamic = 'force-static';

/**
 * One entry per page and language, each listing its translations. A page shown
 * in a fallback language (legal pages, posts) is left out in that language: its
 * canonical is the original, and only the original belongs in the sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = getLocales();
  const sites = await Promise.all(locales.map((l) => getSite(l)));
  const out: MetadataRoute.Sitemap = [];
  for (const site of sites) {
    for (const page of allPages(site)) {
      if (page.lang !== site.locale) continue;
      const languages = Object.fromEntries(
        sites
          .filter((s) => allPages(s).some((p) => p.path === page.path && p.lang === s.locale))
          .map((s) => [s.locales.find((l) => l.code === s.locale)?.hreflang ?? s.locale, absolute(localePath(s.locale, page.path))]),
      );
      out.push({
        url: absolute(localePath(site.locale, page.path)),
        changeFrequency: 'monthly',
        priority: page.priority,
        alternates: Object.keys(languages).length > 1 ? { languages } : undefined,
        images: page.images.slice(0, 20).map((k) => largest(k)).filter((u): u is string => Boolean(u)),
      });
    }
  }
  return out;
}
