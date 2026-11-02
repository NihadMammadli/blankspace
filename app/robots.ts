import type { MetadataRoute } from 'next';
import { absolute, NOINDEX } from '@/lib/paths';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: NOINDEX ? { userAgent: '*', disallow: '/' } : { userAgent: '*', allow: '/' },
    sitemap: absolute('/sitemap.xml'),
  };
}
