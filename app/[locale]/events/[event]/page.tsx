import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocales, getSite } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageText } from '@/components/ImageText';
import { Carousel } from '@/components/Carousel';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { SmartLink } from '@/components/SmartLink';
import { ClientsSection, EventsSection, FaqSection, RequestSection, TestimonialsSection, galleryUi } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { eventTypeLd, faqLd, pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; event: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const out = [];
  for (const locale of getLocales()) {
    for (const e of (await getSite(locale)).events) out.push({ locale, event: e.slug });
  }
  return out;
}

async function load(params: Props['params']) {
  const { locale, event } = await params;
  const site = await getSite(locale);
  const e = site.events.find((x) => x.slug === event);
  if (!e) notFound();
  return { site, e };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, e } = await load(params);
  return pageMetadata({ site, path: routes.event(e.slug), seo: e.seo });
}

export default async function EventPage({ params }: Props) {
  const { site, e } = await load(params);
  const { ui, locale } = site;
  const eventsLabel = site.menus.main.find((m) => m.id === 'events')?.label ?? '';

  return (
    <>
      <Hero
        kicker={eventsLabel}
        title={e.title}
        text={e.card.text}
        picture={picture(e.gallery.images[0])}
        scroll={{ label: ui.scrollDown, target: '#about' }}
        actions={
          <SmartLink locale={locale} href={routes.contact} className="btn btn-primary">
            {ui.quote} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        }
      />
      <Breadcrumbs site={site} trail={[{ label: e.title, path: routes.event(e.slug) }]} />

      <ImageText
        id="about"
        side="right"
        background="beige"
        wide
        kicker={site.brand.name}
        title={e.seo.title}
        paragraphs={e.intro}
        media={<Carousel pictures={pictures(e.gallery.images)} label={e.title} ui={galleryUi(site)} />}
        actions={
          <SmartLink locale={locale} href={routes.contact} className="btn btn-primary">
            {ui.quote} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        }
      />

      <EventsSection site={site} exclude={e.id} />
      <ClientsSection site={site} background="light" />
      <TestimonialsSection site={site} background="white" />
      <FaqSection site={site} background="light" />
      <RequestSection site={site} />
      <JsonLd data={eventTypeLd(site, e)} />
      <JsonLd data={faqLd(site)} />
    </>
  );
}
