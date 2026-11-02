import type { Site } from '@/content/types';
import { breadcrumbLd } from '@/lib/seo';
import { JsonLd } from './JsonLd';

/** Where the page sits, for search engines only (BreadcrumbList); nothing is drawn on the page. */
export function BreadcrumbLd({ site, trail }: { site: Site; trail: { label: string; path: string }[] }) {
  return <JsonLd data={breadcrumbLd(site, trail)} />;
}
