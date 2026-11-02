/**
 * Bands that several pages share. Each takes the whole `Site` and picks what it
 * needs, so a page is a short list of sections.
 */
import type { Site } from '@/content/types';
import { asset } from '@/lib/paths';
import { picture, pictures } from '@/lib/media';
import { routes } from '@/lib/routes';
import { countryName, fill } from '@/lib/format';
import { CardGrid, FeatureList, PhotoCard } from './Cards';
import { ContactForm } from './ContactForm';
import { Carousel } from './Carousel';
import { Faq } from './Faq';
import { Icon } from './Icon';
import { ImageText } from './ImageText';
import { LogoGrid } from './LogoGrid';
import { Photo } from './Photo';
import { PostCard } from './PostCard';
import { Section } from './Section';
import { SmartLink } from './SmartLink';
import { Testimonials } from './Testimonials';

type Bg = 'white' | 'beige' | 'light';

/** The eight kinds of event, as photo cards. */
export function EventsSection({ site, exclude, title, subtitle, background = 'white' }: { site: Site; exclude?: string; title?: string; subtitle?: string; background?: Bg }) {
  const events = site.events.filter((e) => e.id !== exclude);
  return (
    <Section id="events" title={title ?? site.eventsSection.title} subtitle={subtitle} background={background}>
      <CardGrid columns={4}>
        {events.map((e) => (
          <PhotoCard
            key={e.id}
            locale={site.locale}
            href={routes.event(e.slug)}
            picture={picture(e.card.image)}
            title={e.card.title}
            text={e.card.text}
            cta={site.ui.discover}
          />
        ))}
      </CardGrid>
    </Section>
  );
}

/** Both venues, as alternating picture-and-text bands. */
export function VenuesSection({ site, title, startBackground = 'light' }: { site: Site; title?: string; startBackground?: Bg }) {
  const other: Bg = startBackground === 'light' ? 'white' : 'light';
  return (
    <div id="venues">
      {title && <Section title={title} background={startBackground} className="tight-bottom" />}
      {site.venues.map((v, i) => (
        <ImageText
          key={v.id}
          side={i % 2 ? 'right' : 'left'}
          background={i % 2 ? other : startBackground}
          icon="Building2"
          title={v.name}
          as="h3"
          media={<Photo picture={picture(v.card.image)} sizes="(max-width: 900px) 92vw, 560px" />}
          paragraphs={[v.card.text]}
          subtext={`${v.address.street}, ${v.address.postalCode} ${v.address.city} · ${v.capacity.label}`}
          actions={
            <SmartLink locale={site.locale} href={routes.venue(v.slug)} className="btn btn-primary">
              {site.ui.viewVenue} <Icon name="ArrowRight" size={18} strokeWidth={2} />
            </SmartLink>
          }
        />
      ))}
    </div>
  );
}

export function ClientsSection({ site, background = 'white' }: { site: Site; background?: Bg }) {
  return (
    <Section title={site.clients.title} subtitle={site.clients.subtitle} background={background}>
      <LogoGrid logos={pictures(site.clients.items.map((c) => c.image))} />
    </Section>
  );
}

export function TestimonialsSection({ site, background = 'light' }: { site: Site; background?: Bg }) {
  const t = site.testimonials;
  return (
    <Section id="testimonials" title={t.title} background={background}>
      <Testimonials
        items={t.items.map((i) => ({ id: i.id, quote: i.quote, author: i.author, company: i.company, role: i.role, picture: picture(i.image) }))}
        ui={{ more: site.ui.more, less: site.ui.less, prev: site.ui.prev, next: site.ui.next }}
      />
    </Section>
  );
}

export function FaqSection({ site, background = 'white' }: { site: Site; background?: Bg }) {
  return (
    <Section id="faq" title={site.faq.title} background={background}>
      <Faq items={site.faq.items} />
    </Section>
  );
}

export function RequestSection({ site }: { site: Site }) {
  const f = site.ui.form;
  const countries = site.contact.countries
    .map((code) => ({ code, name: countryName(site.locale, code) }))
    .sort((a, b) => a.name.localeCompare(b.name, site.locale));
  return (
    <ContactForm
      locale={site.locale}
      strings={f}
      endpoint={process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || site.contact.formEndpoint}
      email={site.contact.email}
      countries={countries}
      defaultCountry={site.contact.defaultCountry}
      logo={{ src: asset(site.brand.logo.dark), alt: site.brand.name }}
    />
  );
}

export function BlogSection({ site, title, subtitle, exclude, background = 'white' }: { site: Site; title: string; subtitle?: string; exclude?: string; background?: Bg }) {
  const posts = site.blog.posts.filter((p) => p.id !== exclude).slice(0, 3);
  if (!posts.length) return null;
  return (
    <Section title={title} subtitle={subtitle} background={background}>
      <CardGrid columns={3}>
        {posts.map((p) => (
          <PostCard key={p.id} site={site} post={p} />
        ))}
      </CardGrid>
      <p className="center" style={{ marginTop: 'var(--space-xl)' }}>
        <SmartLink locale={site.locale} href={routes.blog} className="btn btn-outline">
          {site.blog.title} <Icon name="ArrowRight" size={18} strokeWidth={2} />
        </SmartLink>
      </p>
    </Section>
  );
}

/** "Why Blankspace?" — the six promises beside the photographs. */
export function WhySection({ site, background = 'light' }: { site: Site; background?: Bg }) {
  const w = site.why;
  return (
    <ImageText
      background={background}
      side="right"
      kicker={w.title}
      title={w.heading}
      paragraphs={[w.intro]}
      wide
      media={<Carousel pictures={pictures(w.gallery.images)} label={w.title} ui={{ prev: site.ui.prev, next: site.ui.next, slideLabel: site.ui.slideLabel }} aspect="1 / 1" />}
    >
      <FeatureList items={w.items} />
      <p className="body">{w.outro}</p>
    </ImageText>
  );
}

export const galleryUi = (site: Site) => ({ prev: site.ui.prev, next: site.ui.next, slideLabel: site.ui.slideLabel });

export const guests = (site: Site, n: number) => fill(site.ui.upTo, { n });
