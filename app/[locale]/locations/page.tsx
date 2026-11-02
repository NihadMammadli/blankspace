import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageText } from '@/components/ImageText';
import { Carousel } from '@/components/Carousel';
import { Icon } from '@/components/Icon';
import { QuoteBand } from '@/components/QuoteBand';
import { SmartLink } from '@/components/SmartLink';
import { Location } from '@/components/Location';
import { galleryUi } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.locations, seo: site.locations.seo });
}

export default async function LocationsPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const L = site.locations;
  const venues = L.items.map((i) => site.venues.find((v) => v.id === i.venue)).filter((v): v is NonNullable<typeof v> => Boolean(v));
  return (
    <>
      <Hero title={L.title} text={L.text} picture={picture(L.hero.image)} scroll={{ label: site.ui.scrollDown, target: `#${venues[0]?.id}` }} />
      <Breadcrumbs site={site} trail={[{ label: L.title, path: routes.locations }]} />
      {venues.map((v, i) => (
        <ImageText
          key={v.id}
          id={v.id}
          side={i % 2 ? 'right' : 'left'}
          background={i % 2 ? 'white' : 'light'}
          wide
          icon="Building2"
          kicker={`${v.address.street}, ${v.address.postalCode} ${v.address.city}`}
          title={v.name}
          paragraphs={[v.locations.text]}
          subtext={`${L.capacityLabel}: ${v.capacity.label}`}
          media={<Carousel pictures={pictures(v.locations.images)} label={v.name} ui={galleryUi(site)} />}
          actions={
            <SmartLink locale={site.locale} href={routes.venue(v.slug)} className="btn btn-primary">
              {site.ui.viewVenue} <Icon name="ArrowRight" size={18} strokeWidth={2} />
            </SmartLink>
          }
        />
      ))}
      <QuoteBand text={L.quote} />
      <Location site={site} title={L.cta.title} background="white" />
    </>
  );
}
