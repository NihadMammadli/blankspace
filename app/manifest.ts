import type { MetadataRoute } from 'next';
import { getLocales, getSite } from '@/content';
import { asset } from '@/lib/paths';

export const dynamic = 'force-static';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite(getLocales()[0]);
  return {
    name: `${site.brand.name} — ${site.home.seo.title}`,
    short_name: site.brand.name,
    description: site.meta.description,
    start_url: asset(`/${site.defaultLocale}/`),
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#343d52',
    icons: [
      { src: asset(site.brand.icon), sizes: 'any', type: 'image/svg+xml' },
      { src: asset('/brand/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  };
}
