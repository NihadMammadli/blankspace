import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSite, localeParams } from '@/content';
import { LandingPage } from '@/components/LandingPage';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export const generateStaticParams = localeParams;

async function load(params: Props['params']) {
  const site = await getSite((await params).locale);
  const page = site.landings.find((p) => p.slug === 'venues');
  if (!page) notFound();
  return { site, page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, page } = await load(params);
  return pageMetadata({ site, path: routes.page(page.slug), seo: page.seo });
}

export default async function VenuesLanding({ params }: Props) {
  const { site, page } = await load(params);
  return <LandingPage site={site} page={page} />;
}
