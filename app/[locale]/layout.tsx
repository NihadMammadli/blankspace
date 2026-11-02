import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';
import { getSite, localeParams } from '@/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Motion, MOTION_SCRIPT } from '@/components/Motion';
import { JsonLd } from '@/components/JsonLd';
import { asset, SITE_URL } from '@/lib/paths';
import { organizationLd } from '@/lib/seo';
import '../globals.css';

const urbanist = Urbanist({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-urbanist',
});

export const dynamicParams = false;
export const generateStaticParams = localeParams;

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const site = await getSite((await params).locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.home.seo.title, template: site.meta.titleTemplate },
    description: site.meta.description,
    applicationName: site.meta.siteName,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#343d52',
  colorScheme: 'light',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const site = await getSite(locale);
  const contact = site.menus.cta;

  return (
    <html lang={locale} className={urbanist.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {site.ui.skip}
        </a>
        <Header
          locale={locale}
          locales={site.locales.map(({ code, label, name }) => ({ code, label, name }))}
          logo={{ src: asset(site.brand.logo.light), width: site.brand.logo.width, height: site.brand.logo.height, alt: site.brand.name }}
          menu={site.menus.main}
          contact={{ label: contact.label, href: contact.href }}
          ui={{
            menuOpen: site.ui.menuOpen,
            menuClose: site.ui.menuClose,
            mainNav: site.ui.mainNav,
            language: site.ui.language,
            home: site.ui.home,
            tagline: site.ui.tagline,
            brand: site.brand.name,
          }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer site={site} />
        <Motion />
        <JsonLd data={organizationLd(site)} />
      </body>
    </html>
  );
}
