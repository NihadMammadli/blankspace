import type { Metadata } from 'next';
import { getSite, localeParams } from '@/content';
import { Hero } from '@/components/Hero';
import { BreadcrumbLd } from '@/components/BreadcrumbLd';
import { Section } from '@/components/Section';
import { CardGrid } from '@/components/Cards';
import { PostCard } from '@/components/PostCard';
import { RequestSection } from '@/components/Sections';
import { picture } from '@/lib/media';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };
export const generateStaticParams = localeParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return pageMetadata({ site, path: routes.blog, seo: site.blog.seo });
}

export default async function BlogIndex({ params }: Props) {
  const site = await getSite((await params).locale);
  const b = site.blog;
  return (
    <>
      <Hero title={b.title} text={b.intro} picture={picture(b.posts[0]?.image)} scroll={{ label: site.ui.scrollDown, target: '#posts' }} />
      <BreadcrumbLd site={site} trail={[{ label: b.title, path: routes.blog }]} />
      <Section id="posts" background="light">
        <CardGrid columns={3}>
          {b.posts.map((p) => (
            <PostCard key={p.id} site={site} post={p} />
          ))}
        </CardGrid>
      </Section>
      <RequestSection site={site} />
    </>
  );
}
