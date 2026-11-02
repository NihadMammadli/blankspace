import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocales, getSite } from '@/content';
import { Hero } from '@/components/Hero';
import { BreadcrumbLd } from '@/components/BreadcrumbLd';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { FeatureList } from '@/components/Cards';
import { Photo } from '@/components/Photo';
import { Pricing } from '@/components/Pricing';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { SmartLink } from '@/components/SmartLink';
import { EventsSection, FaqSection, RequestSection, TestimonialsSection, WhySection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { routes } from '@/lib/routes';
import { faqLd, offersLd, pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; commune: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const out = [];
  for (const locale of getLocales()) {
    for (const c of (await getSite(locale)).communes) out.push({ locale, commune: c.slug });
  }
  return out;
}

async function load(params: Props['params']) {
  const { locale, commune } = await params;
  const site = await getSite(locale);
  const c = site.communes.find((x) => x.slug === commune);
  if (!c) notFound();
  return { site, c };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, c } = await load(params);
  return pageMetadata({ site, path: routes.commune(c.slug), seo: c.seo });
}

export default async function CommunePage({ params }: Props) {
  const { site, c } = await load(params);
  const { ui, locale } = site;
  const parent = site.landings.find((l) => l.id === 'venues');

  return (
    <>
      <Hero
        title={c.title}
        text={c.text}
        picture={picture(site.venues.at(-1)?.hero.images[0] ?? site.home.hero.image)}
        scroll={{ label: ui.scrollDown, target: '#access' }}
        actions={
          <>
            <a href="#packages" className="btn btn-primary">
              {site.pricing.page.button} <Icon name="ArrowRight" size={18} strokeWidth={2} />
            </a>
            <SmartLink locale={locale} href={routes.contact} className="btn btn-light">
              {ui.quote}
            </SmartLink>
          </>
        }
      />
      <BreadcrumbLd
        site={site}
        trail={[...(parent ? [{ label: parent.title, path: routes.page(parent.slug) }] : []), { label: c.name, path: routes.commune(c.slug) }]}
      />

      <ImageText
        id="access"
        side="left"
        background="light"
        icon="MapPin"
        title={c.access.title}
        media={<Photo picture={picture(c.image)} sizes="(max-width: 900px) 92vw, 560px" />}
      >
        <FeatureList
          columns={1}
          items={c.access.items.map((it, i) => ({ id: String(i), icon: /driv|car|voiture|auto|parking/i.test(`${it.label} ${it.text}`) ? 'Car' : 'Train', label: it.label ?? it.text, text: it.label ? it.text : undefined }))}
        />
      </ImageText>

      <EventsSection site={site} title={site.eventsSection.versatileTitle} subtitle={site.eventsSection.versatileText.replace(/:$/, '.')} />

      <Section id="pricing" title={site.pricing.title} subtitle={site.pricing.intro.join(' ')} background="beige">
        <Pricing site={site} />
      </Section>

      <WhySection site={site} background="white" />
      <TestimonialsSection site={site} />
      <FaqSection site={site} />
      <RequestSection site={site} />
      <JsonLd data={faqLd(site)} />
      <JsonLd data={offersLd(site)} />
    </>
  );
}
