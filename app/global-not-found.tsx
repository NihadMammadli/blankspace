import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';
import { getLocales, getSite } from '@/content';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { SmartLink } from '@/components/SmartLink';
import { picture } from '@/lib/media';
import { asset } from '@/lib/paths';
import './globals.css';

const urbanist = Urbanist({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-urbanist' });

/**
 * The 404 for every missing address. It is served at the site root, before
 * anyone knows which language was meant, so it speaks the default language.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite(getLocales()[0]);
  return { title: `${site.notFound.title} | ${site.meta.siteName}`, robots: { index: false, follow: true } };
}

export default async function GlobalNotFound() {
  const site = await getSite(getLocales()[0]);
  const n = site.notFound;
  return (
    <html lang={site.locale} className={urbanist.variable}>
      <body>
        <Header
          locale={site.locale}
          locales={site.locales.map(({ code, label, name }) => ({ code, label, name }))}
          logo={{ src: asset(site.brand.logo.light), width: site.brand.logo.width, height: site.brand.logo.height, alt: site.brand.name }}
          menu={site.menus.main}
          contact={{ label: site.menus.cta.label, href: site.menus.cta.href }}
          ui={{ menuOpen: site.ui.menuOpen, menuClose: site.ui.menuClose, mainNav: site.ui.mainNav, language: site.ui.language, home: site.ui.home, tagline: site.ui.tagline, brand: site.brand.name }}
        />
        <main id="main">
          <Hero
            kicker="404"
            title={n.title}
            text={n.text}
            picture={picture(n.image)}
            actions={
              <SmartLink locale={site.locale} href="/" className="btn btn-primary">
                {n.button}
              </SmartLink>
            }
          />
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
