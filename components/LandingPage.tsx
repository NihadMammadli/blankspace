import type { Landing, Site } from '@/content/types';
import { picture } from '@/lib/media';
import { routes } from '@/lib/routes';
import { Hero } from './Hero';
import { Breadcrumbs } from './Breadcrumbs';
import { Icon } from './Icon';
import { Location } from './Location';
import { Section } from './Section';
import { SmartLink } from './SmartLink';
import { ClientsSection, EventsSection, RequestSection, VenuesSection } from './Sections';

/** A search landing page ("Meeting Room in Brussels"): the promise, both venues, the events, the way in. */
export function LandingPage({ site, page }: { site: Site; page: Landing }) {
  const { ui, locale } = site;
  return (
    <>
      <Hero
        title={page.title}
        text={site.home.hero.text}
        picture={picture(site.home.concept.image)}
        video={site.media.heroVideo.src}
        scroll={{ label: ui.scrollDown, target: '#about' }}
        actions={
          <>
            <a href="#venues" className="btn btn-primary">
              {site.home.hero.primary.label} <Icon name="ArrowRight" size={18} strokeWidth={2} />
            </a>
            <SmartLink locale={locale} href={routes.contact} className="btn btn-light">
              {ui.quote}
            </SmartLink>
          </>
        }
      />
      <Breadcrumbs site={site} trail={[{ label: page.title, path: routes.page(page.slug) }]} />

      <Section id="about" background="beige" narrow>
        <div className="center" data-reveal="stagger" style={{ display: 'grid', gap: 'var(--space-md)', justifyItems: 'center' }}>
          <p className="lead">{page.intro}</p>
          <p className="body">{site.landing.support}</p>
          <SmartLink locale={locale} href={routes.prices} className="btn btn-primary">
            {site.landing.more} <Icon name="ArrowRight" size={18} strokeWidth={2} />
          </SmartLink>
        </div>
      </Section>

      <VenuesSection site={site} title={site.home.venues.title} startBackground="white" />
      <EventsSection site={site} background="light" />
      <ClientsSection site={site} />
      <Location site={site} />
      <RequestSection site={site} />
    </>
  );
}
