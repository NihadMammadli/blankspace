import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { BreadcrumbLd } from '@/components/BreadcrumbLd';
import { ImageText } from '@/components/ImageText';
import { Section } from '@/components/Section';
import { CardGrid } from '@/components/Cards';
import { Carousel } from '@/components/Carousel';
import { Photo } from '@/components/Photo';
import { Story } from '@/components/Story';
import { RequestSection, TestimonialsSection, galleryUi } from '@/components/Sections';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.catering, seo: site.catering.seo });
}

export default async function CateringPage({ params }: Props) {
  const site = await getSite((await params).locale);
  const c = site.catering;
  const more = { more: site.ui.showMore, less: site.ui.showLess };
  return (
    <>
      <Hero kicker={c.hero.kicker} title={c.hero.title} text={c.hero.text} picture={picture(c.hero.image)} scroll={{ label: site.ui.scrollDown, target: '#catering' }} />
      <BreadcrumbLd site={site} trail={[{ label: c.hero.title, path: routes.catering }]} />

      <ImageText
        id="catering"
        side="right"
        background="beige"
        wide
        kicker={c.intro.kicker}
        title={c.intro.title}
        paragraphs={c.intro.paragraphs}
        media={<Carousel pictures={pictures(c.gallery.images)} label={c.intro.title} ui={galleryUi(site)} />}
      />

      <Section title={c.caterers.title} background="white">
        <CardGrid columns={4}>
          {c.caterers.items.map((it) => (
            <Story key={it.id} picture={picture(it.image)} title={it.name} text={it.text} ui={more} />
          ))}
        </CardGrid>
      </Section>

      <ImageText
        side="left"
        background="light"
        kicker={c.workshops.kicker}
        title={c.workshops.title}
        paragraphs={c.workshops.paragraphs}
        media={<Photo picture={picture(c.workshops.image)} sizes="(max-width: 900px) 92vw, 560px" />}
      />

      <Section title={c.stories.title} background="white">
        <CardGrid columns={4}>
          {c.stories.items.map((it) => (
            <Story key={it.id} picture={picture(it.image)} title={it.name} text={it.text} ui={more} />
          ))}
        </CardGrid>
      </Section>

      <TestimonialsSection site={site} />
      <RequestSection site={site} />
    </>
  );
}
