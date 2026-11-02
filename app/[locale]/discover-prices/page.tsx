import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Section } from '@/components/Section';
import { Pricing } from '@/components/Pricing';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { FaqSection, RequestSection, TestimonialsSection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { routes } from '@/lib/routes';
import { faqLd, offersLd, pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.prices, seo: site.pricing.seo });
}

export default async function PricesPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const p = site.pricing;
  const label = site.menus.main.find((m) => m.id === 'prices')?.label ?? p.page.title;
  return (
    <>
      <Hero
        kicker={p.page.kicker}
        title={p.page.title}
        text={p.page.text}
        picture={picture(p.page.image)}
        scroll={{ label: site.ui.scrollDown, target: '#pricing' }}
        actions={
          <a href="#packages" className="btn btn-primary">
            {p.page.button} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </a>
        }
      />
      <Breadcrumbs site={site} trail={[{ label, path: routes.prices }]} />
      <Section id="pricing" title={p.title} subtitle={p.intro.join(' ')} background="light">
        <Pricing site={site} />
      </Section>
      <TestimonialsSection site={site} background="white" />
      <FaqSection site={site} background="light" />
      <RequestSection site={site} />
      <JsonLd data={offersLd(site)} />
      <JsonLd data={faqLd(site)} />
    </>
  );
}
