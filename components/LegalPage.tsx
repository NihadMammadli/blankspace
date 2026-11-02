import type { LegalPage as Legal, Site } from '@/content/types';
import { picture } from '@/lib/media';
import { routes } from '@/lib/routes';
import { Hero } from './Hero';
import { BreadcrumbLd } from './BreadcrumbLd';
import { Blocks } from './Rich';
import { Section } from './Section';

/** Terms, privacy and CSR. Written in English only, and marked as such in other languages. */
export function LegalPage({ site, page }: { site: Site; page: Legal }) {
  const foreign = page.lang !== site.locale;
  return (
    <>
      <Hero title={page.title} picture={picture(page.image)} />
      <BreadcrumbLd site={site} trail={[{ label: page.label, path: routes.page(page.slug) }]} />
      <Section narrow>
        {foreign && <p className="notice">{site.ui.englishOnly}</p>}
        <article lang={foreign ? page.lang : undefined}>
          <Blocks blocks={page.blocks} className="prose" />
        </article>
      </Section>
    </>
  );
}
