import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Location } from '@/components/Location';
import { RequestSection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { tel } from '@/lib/format';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { Icon } from '@/components/Icon';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.contact, seo: site.contactPage.seo });
}

export default async function ContactPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const c = site.contactPage;
  return (
    <>
      <Hero
        title={c.title}
        text={c.text}
        picture={picture(c.hero.image)}
        actions={
          <>
            <a href={tel(site.contact.phone)} className="btn btn-primary">
              <Icon name="Phone" size={18} strokeWidth={2} /> {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className="btn btn-light">
              <Icon name="Mail" size={18} strokeWidth={2} /> {site.contact.email}
            </a>
          </>
        }
      />
      <Breadcrumbs site={site} trail={[{ label: c.title, path: routes.contact }]} />
      <RequestSection site={site} />
      <Location site={site} title={site.location.title} />
    </>
  );
}
