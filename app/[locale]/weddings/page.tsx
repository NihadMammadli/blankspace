import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { BreadcrumbLd } from '@/components/BreadcrumbLd';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { Photo } from '@/components/Photo';
import { Icon } from '@/components/Icon';
import { QuoteBand } from '@/components/QuoteBand';
import { SmartLink } from '@/components/SmartLink';
import { RequestSection, TestimonialsSection, galleryUi } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.weddings, seo: site.weddings.seo });
}

export default async function WeddingsPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const w = site.weddings;
  const addresses = site.venues.map((v) => `${v.name} · ${v.address.street}, ${v.address.postalCode} ${v.address.city}`).join('  —  ');
  return (
    <>
      <Hero title={w.hero.title} text={w.hero.text} picture={picture(w.hero.image)} scroll={{ label: site.ui.scrollDown, target: '#canvas' }}>
        <p style={{ marginTop: 18, fontSize: 15, color: 'var(--on-dark-muted)' }}>{addresses}</p>
      </Hero>
      <BreadcrumbLd site={site} trail={[{ label: w.hero.title, path: routes.weddings }]} />

      <Section id="canvas" title={w.canvas.title} background="beige" narrow>
        <div className="body center" data-reveal="stagger">
          {w.canvas.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Section>

      <ImageText
        side="left"
        background="white"
        wide
        icon="KeyRound"
        title={w.exclusivity.title}
        paragraphs={w.exclusivity.paragraphs}
        media={<Carousel pictures={pictures(w.gallery.images)} label={w.exclusivity.title} ui={galleryUi(site)} />}
      />

      <QuoteBand text={w.quote} />

      <ImageText
        side="right"
        background="light"
        icon="Handshake"
        title={w.support.title}
        paragraphs={[w.support.text]}
        media={<Photo picture={picture(w.support.image)} sizes="(max-width: 900px) 92vw, 560px" />}
        actions={
          <SmartLink locale={site.locale} href={routes.contact} className="btn btn-primary">
            {w.cta.button} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        }
      />

      <TestimonialsSection site={site} background="white" />
      <Section title={w.cta.title} subtitle={w.cta.text} background="beige" />
      <RequestSection site={site} />
    </>
  );
}
