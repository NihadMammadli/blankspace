import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocales, getSite } from '@/content';
import { LandingPage } from '@/components/LandingPage';
import { LegalPage } from '@/components/LegalPage';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

/**
 * The top-level pages that come from content: search landings
 * ("/meeting-room") and legal pages ("/gdpr-policy"). "/venues" is a landing
 * too, but it also has children, so it has a folder of its own.
 */
type Props = { params: Promise<{ locale: string; page: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const out = [];
  for (const locale of getLocales()) {
    const site = await getSite(locale);
    for (const p of [...site.landings, ...site.legal]) if (p.slug !== 'venues') out.push({ locale, page: p.slug });
  }
  return out;
}

async function load(params: Props['params']) {
  const { locale, page } = await params;
  const site = await getSite(locale);
  const landing = site.landings.find((p) => p.slug === page);
  const legal = site.legal.find((p) => p.slug === page);
  if (!landing && !legal) notFound();
  return { site, landing, legal };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, landing, legal } = await load(params);
  if (legal) return pageMetadata({ site, path: routes.page(legal.slug), seo: legal.seo, lang: legal.lang });
  return pageMetadata({ site, path: routes.page(landing!.slug), seo: landing!.seo });
}

export default async function TopLevelPage({ params }: Props) {
  const { site, landing, legal } = await load(params);
  return legal ? <LegalPage site={site} page={legal} /> : <LandingPage site={site} page={landing!} />;
}
