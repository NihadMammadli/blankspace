import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocales, getSite } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { CardGrid, FeatureCard, FeatureList, IconCard } from '@/components/Cards';
import { Carousel } from '@/components/Carousel';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { Location } from '@/components/Location';
import { Pricing } from '@/components/Pricing';
import { SmartLink } from '@/components/SmartLink';
import { Stats } from '@/components/Stats';
import { YouTube } from '@/components/YouTube';
import { RequestSection, TestimonialsSection, galleryUi, guests } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { pageMetadata, venueLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; venue: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const out = [];
  for (const locale of getLocales()) {
    for (const v of (await getSite(locale)).venues) out.push({ locale, venue: v.slug });
  }
  return out;
}

async function load(params: Props['params']) {
  const { locale, venue } = await params;
  const site = await getSite(locale);
  const v = site.venues.find((x) => x.slug === venue);
  if (!v) notFound();
  return { site, v };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, v } = await load(params);
  return pageMetadata({ site, path: routes.venue(v.slug), seo: v.seo });
}

export default async function VenuePage({ params }: Props) {
  const { site, v } = await load(params);
  const { ui, locale } = site;
  const equipment = (ids: string[]) => site.equipment.filter((e) => ids.includes(e.id));
  const locationsLabel = site.menus.main.find((m) => m.id === 'spaces')?.label ?? '';

  return (
    <>
      <Hero
        kicker={`${v.address.street} · ${v.address.postalCode} ${v.address.city}`}
        title={v.name}
        text={v.capacity.label}
        picture={picture(v.hero.images[0])}
        scroll={{ label: ui.scrollDown, target: '#about' }}
        actions={
          <>
            <a href="#tour" className="btn btn-primary">
              {ui.discoverTour} <Icon name="MonitorPlay" size={18} strokeWidth={2} />
            </a>
            <SmartLink locale={locale} href={routes.contact} className="btn btn-light">
              {ui.quote}
            </SmartLink>
          </>
        }
      />
      <Breadcrumbs site={site} trail={[{ label: locationsLabel, path: routes.locations }, { label: v.name, path: routes.venue(v.slug) }]} />

      <ImageText
        id="about"
        background="beige"
        side="left"
        wide
        icon="Building2"
        title={v.intro.title}
        paragraphs={[v.intro.text]}
        media={<Carousel pictures={pictures([...v.hero.images, ...v.locations.images])} label={v.name} ui={galleryUi(site)} />}
        actions={
          <SmartLink locale={locale} href={routes.contact} className="btn btn-primary">
            {ui.quote} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        }
      />

      {(v.exclusivity || v.highlights) && (
        <Section background="white">
          {v.exclusivity && <FeatureCard icon="KeyRound" title={v.exclusivity.title} text={v.exclusivity.text} />}
          {v.highlights && (
            <Stats
              items={v.highlights.map((h) => ({
                id: h.id,
                icon: h.icon,
                value: h.id === 'area' ? v.area ?? 0 : v.capacity.max,
                suffix: h.id === 'area' ? ' m²' : '',
                label: h.label,
              }))}
            />
          )}
        </Section>
      )}

      {v.rooms && (
        <>
          {v.roomsTitle && <Section title={v.roomsTitle} background="light" className="tight-bottom" />}
          {v.rooms.map((r, i) => (
            <ImageText
              key={r.id}
              id={r.id}
              side={i % 2 ? 'right' : 'left'}
              background={i % 2 ? 'white' : 'light'}
              wide
              framed={false}
              title={r.name}
              as="h3"
              paragraphs={r.paragraphs}
              subtext={guests(site, r.capacity)}
              media={<Carousel pictures={pictures(r.gallery.images)} label={r.name} ui={galleryUi(site)} />}
            >
              <FeatureList items={equipment(r.equipment)} columns={3} />
            </ImageText>
          ))}
        </>
      )}

      {v.equipped && (
        <Section title={v.equipped.title} subtitle={v.equipped.text} background="light">
          <CardGrid columns={3}>
            {v.equipped.items.map((f) => (
              <IconCard key={f.id} icon={f.icon} title={f.label} />
            ))}
          </CardGrid>
        </Section>
      )}

      {v.why && (
        <ImageText
          side="right"
          background="white"
          wide
          title={v.why.title}
          paragraphs={v.why.paragraphs}
          media={<Carousel pictures={pictures(v.why.gallery.images)} label={v.why.title} ui={galleryUi(site)} />}
        >
          <h3 className="lead">{v.why.expertiseTitle}</h3>
          <FeatureList columns={1} items={v.why.expertise.map((e, i) => ({ id: String(i), icon: 'Sparkles', label: e.label ?? '', text: e.text }))} />
        </ImageText>
      )}

      {v.services && (
        <Section title={v.services.title} background="beige">
          <CardGrid columns={3}>
            {v.services.items.map((s) => (
              <IconCard key={s.id} icon={s.icon} title={s.label} text={s.text} />
            ))}
          </CardGrid>
        </Section>
      )}

      {v.gallery && v.gallery.images.length > 0 && (
        <Section title={v.gallery.title} background="white">
          <div style={{ maxWidth: 1000, margin: '0 auto' }} data-reveal>
            <Carousel pictures={pictures(v.gallery.images)} label={v.gallery.title ?? v.name} ui={galleryUi(site)} sizes="(max-width: 1000px) 100vw, 1000px" aspect="3 / 2" />
          </div>
        </Section>
      )}

      <Section id="tour" title={v.tour.title} subtitle={v.tour.text} background="light">
        <div data-reveal>
          <YouTube id={v.youtubeId} title={v.tour.title} poster={picture(v.hero.images[0])} ui={{ playVideo: ui.playVideo, videoNote: ui.videoNote }} />
        </div>
      </Section>

      <Section title={site.pricing.flatRates.title} subtitle={site.pricing.flatRates.text} background="white">
        <Pricing site={site} show="flat" venue={v.id} />
        <p className="center" style={{ marginTop: 'var(--space-xl)' }}>
          <SmartLink locale={locale} href={routes.prices} className="text-link">
            {site.pricing.page.button} <Icon name="ArrowRight" size={16} strokeWidth={2} />
          </SmartLink>
        </p>
      </Section>

      <TestimonialsSection site={site} />
      <Location site={site} background="white" />
      <RequestSection site={site} />
      <JsonLd data={venueLd(site, v)} />
    </>
  );
}
