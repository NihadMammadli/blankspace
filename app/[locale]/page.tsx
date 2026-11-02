import type { Metadata } from 'next';
import { getSite } from '@/content';
import { Hero } from '@/components/Hero';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { CardGrid, FeatureCard } from '@/components/Cards';
import { Stats } from '@/components/Stats';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { Location } from '@/components/Location';
import { SmartLink } from '@/components/SmartLink';
import { BlogSection, ClientsSection, EventsSection, RequestSection, TestimonialsSection, VenuesSection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { asset } from '@/lib/paths';
import { pageMetadata, websiteLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: '/', seo: site.home.seo });
}

export default async function Home({ params }: Props) {
  const site = await getSite((await params).locale);
  const { home: h, ui, locale } = site;
  const poster = picture(h.concept.image);

  return (
    <>
      <Hero
        size="full"
        title={h.hero.title}
        text={h.hero.text}
        picture={picture(h.hero.image)}
        video={site.media.heroVideo.src}
        scroll={{ label: ui.scrollDown, target: '#concept' }}
        actions={
          <>
            <SmartLink locale={locale} href={h.hero.primary.href} className="btn btn-primary">
              {h.hero.primary.label} <Icon name="ArrowRight" size={18} strokeWidth={2} />
            </SmartLink>
            <SmartLink locale={locale} href={h.hero.secondary.href} className="btn btn-light">
              {h.hero.secondary.label}
            </SmartLink>
          </>
        }
      />

      <ImageText
        id="concept"
        side="right"
        background="beige"
        wide
        title={h.concept.title}
        paragraphs={[h.concept.text]}
        subtext={h.concept.subtext}
        media={
          <video
            src={asset(site.media.conceptVideo.src)}
            poster={poster?.src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={h.concept.image.alt}
            style={{ aspectRatio: '16 / 9' }}
          />
        }
        actions={
          <SmartLink locale={locale} href={h.concept.button.href} className="btn btn-outline">
            {h.concept.button.label} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        }
      />

      <Section title={h.features.title} subtitle={h.features.subtitle}>
        <CardGrid columns={2}>
          {h.features.items.map((f, i) => (
            <FeatureCard key={f.id} icon={f.icon} title={f.title} text={f.text} tone={i ? 'rust' : 'stone'} />
          ))}
        </CardGrid>
        <div style={{ margin: 'var(--space-2xl) 0' }} data-reveal>
          <Stats items={h.stats} />
        </div>
        <hr className="rule" />
      </Section>

      <EventsSection site={site} title={h.hostAny.title} subtitle={h.hostAny.text} />

      <VenuesSection site={site} title={h.venues.title} />

      <ClientsSection site={site} />
      <TestimonialsSection site={site} />
      <BlogSection site={site} title={h.blog.title} subtitle={h.blog.subtitle} />
      <Location site={site} />
      <RequestSection site={site} />
      <JsonLd data={websiteLd(site)} />
    </>
  );
}
