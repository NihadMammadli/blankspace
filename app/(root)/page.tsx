import type { Metadata } from 'next';
import { getLocales, getSite } from '@/content';
import { absolute, asset } from '@/lib/paths';

/**
 * "/" has no content of its own. A static export cannot redirect on the
 * server, so the page sends the visitor to the language their browser prefers
 * (or the default) and tells search engines the real home is /<default>/.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locales = getLocales();
  const site = await getSite(locales[0]);
  return {
    title: site.home.seo.title,
    alternates: { canonical: absolute(`/${site.defaultLocale}/`) },
    robots: { index: false, follow: true },
  };
}

export default async function RootRedirect() {
  const locales = getLocales();
  const site = await getSite(locales[0]);
  const fallback = asset(`/${site.defaultLocale}/`);
  const script = `(function(){var l=${JSON.stringify(locales)},p=(navigator.languages||[navigator.language||'']).map(function(x){return String(x).slice(0,2).toLowerCase()}).filter(function(x){return l.indexOf(x)>-1})[0]||${JSON.stringify(site.defaultLocale)};location.replace(${JSON.stringify(asset('/'))}+p+'/')})()`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${fallback}`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p>
        <a href={fallback}>{site.brand.name}</a>
      </p>
    </>
  );
}
