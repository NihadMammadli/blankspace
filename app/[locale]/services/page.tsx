import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { FeatureList } from '@/components/Cards';
import { Icon } from '@/components/Icon';
import { QuoteBand } from '@/components/QuoteBand';
import { SmartLink } from '@/components/SmartLink';
import { RequestSection, galleryUi } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { longDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.services, seo: site.services.seo, type: 'article', published: site.services.date });
}

export default async function ServicesPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const s = site.services;
  const label = site.menus.footer.flatMap((g) => g.links).find((l) => l.href === routes.services)?.label ?? s.seo.title;
  return (
    <>
      <Hero title={s.hero.title} text={s.hero.text} picture={picture(s.hero.image)} scroll={{ label: site.ui.scrollDown, target: '#intro' }} />
      <Breadcrumbs site={site} trail={[{ label, path: routes.services }]} />

      <Section id="intro" background="beige" narrow>
        <div data-reveal="stagger" style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <p className="lead">{s.intro}</p>
          <FeatureList columns={1} items={s.points.map((p, i) => ({ id: String(i), icon: 'KeyRound', label: p }))} />
        </div>
      </Section>

      <ImageText
        side="left"
        background="white"
        wide
        icon="Users"
        title={s.yesTeam.title}
        paragraphs={s.yesTeam.paragraphs}
        media={<Carousel pictures={pictures(s.teamImages.images)} label={s.yesTeam.title} ui={galleryUi(site)} />}
      >
        <FeatureList columns={1} items={s.items.map((it, i) => ({ id: String(i), icon: i ? 'Mic' : 'Sparkles', label: it.label ?? '', text: it.text }))} />
      </ImageText>

      <ImageText
        side="right"
        background="light"
        wide
        icon="Handshake"
        title={s.involvement.title}
        paragraphs={[s.involvement.text]}
        media={<Carousel pictures={pictures(s.moreImages.images)} label={s.involvement.title} ui={galleryUi(site)} />}
      />

      <QuoteBand text={s.quote} />

      <Section background="white" narrow>
        <div className="center" data-reveal="stagger" style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'center' }}>
          <p className="body">{s.outro}</p>
          <SmartLink locale={site.locale} href={s.button.href} className="btn btn-primary">
            {s.button.label} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
          <p className="subtext">
            <time dateTime={s.date}>{longDate(site.locale, s.date)}</time>
          </p>
        </div>
      </Section>

      <RequestSection site={site} />
    </>
  );
}
