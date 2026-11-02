import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocales, getSite } from '@/content';
import { Hero } from '@/components/Hero';
import { BreadcrumbLd } from '@/components/BreadcrumbLd';
import { Section } from '@/components/Section';
import { Blocks } from '@/components/Rich';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { SmartLink } from '@/components/SmartLink';
import { BlogSection, RequestSection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { longDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import { pageMetadata, postLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const out = [];
  for (const locale of getLocales()) {
    for (const p of (await getSite(locale)).blog.posts) out.push({ locale, slug: p.slug });
  }
  return out;
}

async function load(params: Props['params']) {
  const { locale, slug } = await params;
  const site = await getSite(locale);
  const post = site.blog.posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return { site, post };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site, post } = await load(params);
  return pageMetadata({ site, path: routes.post(post.slug), seo: { ...post.seo, image: post.image.src }, lang: post.lang, type: 'article', published: post.date });
}

export default async function PostPage({ params }: Props) {
  const { site, post } = await load(params);
  const foreign = post.lang !== site.locale;
  const category = site.blog.categories[post.category] ?? post.category;
  return (
    <>
      <Hero kicker={category} title={post.title} picture={picture(post.image)}>
        <p style={{ marginTop: 18, color: 'var(--on-dark-muted)' }}>
          <time dateTime={post.date}>{longDate(site.locale, post.date)}</time>
        </p>
      </Hero>
      <BreadcrumbLd site={site} trail={[{ label: site.blog.title, path: routes.blog }, { label: post.title, path: routes.post(post.slug) }]} />
      <Section narrow>
        {foreign && <p className="notice">{site.ui.englishOnly}</p>}
        <article lang={foreign ? post.lang : undefined}>
          <p className="lead" style={{ marginBottom: 'var(--space-lg)' }}>
            {post.excerpt}
          </p>
          <Blocks blocks={post.body} className="prose" />
        </article>
        <p style={{ marginTop: 'var(--space-2xl)' }}>
          <SmartLink locale={site.locale} href={routes.blog} className="text-link">
            <Icon name="ArrowRight" size={16} strokeWidth={2} className="flip" /> {site.ui.backToBlog}
          </SmartLink>
        </p>
      </Section>
      <BlogSection site={site} title={site.ui.related} exclude={post.id} background="light" />
      <RequestSection site={site} />
      <JsonLd data={postLd(site, post)} />
    </>
  );
}
