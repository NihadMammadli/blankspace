/**
 * Page metadata and structured data, built from the content. Every page calls
 * `pageMetadata` with its path and its `seo` block; the language alternates,
 * canonical, Open Graph and Twitter cards follow from that.
 */
import type { Metadata } from 'next';
import type { EventType, Post, Seo, Site, Venue } from '@/content/types';
import { absolute, NOINDEX } from './paths';
import { localePath, routes } from './routes';
import { largest, shareCard } from './media';

interface PageMeta {
  site: Site;
  /** Path without the language, e.g. "/events/workshops". */
  path: string;
  seo: Seo;
  /** The language the page's text is really in, when it differs (English-only pages). */
  lang?: string;
  type?: 'website' | 'article';
  published?: string;
}

export function pageMetadata({ site, path, seo, lang, type = 'website', published }: PageMeta): Metadata {
  const written = lang ?? site.locale;
  // a page shown in a fallback language points search engines at the original
  const canonical = absolute(localePath(written, path));
  const languages: Record<string, string> = {};
  if (written === site.locale) {
    for (const l of site.locales) languages[l.hreflang] = absolute(localePath(l.code, path));
    languages['x-default'] = absolute(localePath(site.defaultLocale, path));
  }
  const card = shareCard(seo.image) ?? shareCard(site.brand.ogImage);
  const here = site.locales.find((l) => l.code === site.locale);
  // spelled out rather than left to the layout's template, which Next skips for a page in the layout's own segment
  const fullTitle = seo.brand === false ? seo.title : site.meta.titleTemplate.replace('%s', seo.title);
  const title = { absolute: fullTitle };

  return {
    title,
    description: seo.description,
    keywords: seo.keywords || undefined,
    alternates: { canonical, languages: Object.keys(languages).length ? languages : undefined },
    openGraph: {
      type,
      url: absolute(localePath(site.locale, path)),
      siteName: site.meta.siteName,
      locale: here?.ogLocale,
      alternateLocale: site.locales.filter((l) => l.code !== site.locale).map((l) => l.ogLocale),
      title: fullTitle,
      description: seo.description,
      images: card ? [{ ...card, alt: fullTitle }] : undefined,
      ...(published ? { publishedTime: published } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: seo.description, images: card ? [card.url] : undefined },
    robots: NOINDEX ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/* ------------------------------------------------------------- JSON-LD */

const orgId = () => `${absolute('/')}#organization`;

function postal(v: Venue) {
  return {
    '@type': 'PostalAddress',
    streetAddress: v.address.street,
    postalCode: v.address.postalCode,
    addressLocality: v.address.city,
    addressCountry: v.address.countryCode,
  };
}

/** The business itself, with both venues and the published prices. On every page. */
export function organizationLd(site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(),
    name: site.brand.legalName,
    alternateName: site.brand.name,
    url: absolute(localePath(site.locale, '/')),
    logo: absolute(site.brand.logo.dark),
    image: largest(site.brand.ogImage),
    email: site.contact.email,
    telephone: site.contact.phone,
    foundingDate: String(site.brand.foundingYear),
    sameAs: site.social.map((s) => s.url),
    address: site.venues[0] ? postal(site.venues[0]) : undefined,
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: site.contact.email, telephone: site.contact.phone, availableLanguage: site.locales.map((l) => l.name) }],
    location: site.venues.map((v) => ({ '@id': `${absolute(localePath(site.locale, routes.venue(v.slug)))}#venue` })),
  };
}

export function websiteLd(site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.meta.siteName,
    url: absolute(localePath(site.locale, '/')),
    inLanguage: site.locale,
    publisher: { '@id': orgId() },
  };
}

/** A venue as a place people can book. */
export function venueLd(site: Site, v: Venue) {
  const url = absolute(localePath(site.locale, routes.venue(v.slug)));
  return {
    '@context': 'https://schema.org',
    '@type': ['EventVenue', 'LocalBusiness'],
    '@id': `${url}#venue`,
    name: v.name,
    description: v.seo.description,
    url,
    image: [v.hero.images[0]?.src, ...(v.gallery?.images ?? []).slice(0, 4).map((i) => i.src)].map((k) => largest(k)).filter(Boolean),
    telephone: site.contact.phone,
    email: site.contact.email,
    address: postal(v),
    maximumAttendeeCapacity: v.capacity.max,
    ...(v.area ? { floorSize: { '@type': 'QuantitativeValue', value: v.area, unitCode: 'MTK' } } : {}),
    amenityFeature: (v.highlights ?? v.equipped?.items ?? []).map((f) => ({ '@type': 'LocationFeatureSpecification', name: f.label, value: true })),
    parentOrganization: { '@id': orgId() },
  };
}

/** The published prices, as offers. */
export function offersLd(site: Site) {
  const p = site.pricing;
  const venueName = (id: string) => site.venues.find((v) => v.id === id)?.name ?? id;
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: p.title,
    provider: { '@id': orgId() },
    itemListElement: [
      ...p.packages.map((pk) => ({
        '@type': 'Offer',
        name: pk.name,
        price: pk.price,
        priceCurrency: p.currency,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: pk.price, priceCurrency: p.currency, unitText: site.ui.perPerson },
      })),
      ...p.flatRates.items.flatMap((r) => [
        { '@type': 'Offer', name: `${venueName(r.venue)} — ${site.ui.halfDay}`, price: r.halfDay, priceCurrency: p.currency },
        { '@type': 'Offer', name: `${venueName(r.venue)} — ${site.ui.fullDay}`, price: r.fullDay, priceCurrency: p.currency },
      ]),
    ],
  };
}

export function faqLd(site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: site.faq.items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer.join(' ') },
    })),
  };
}

export function breadcrumbLd(site: Site, trail: { label: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: site.ui.home, path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.label,
      item: absolute(localePath(site.locale, t.path)),
    })),
  };
}

export function postLd(site: Site, post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: post.lang,
    image: largest(post.image.src),
    url: absolute(localePath(post.lang, routes.post(post.slug))),
    author: { '@id': orgId() },
    publisher: { '@id': orgId() },
  };
}

export function eventTypeLd(site: Site, e: EventType) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: e.title,
    description: e.seo.description,
    serviceType: e.title,
    url: absolute(localePath(site.locale, routes.event(e.slug))),
    image: largest(e.gallery.images[0]?.src),
    provider: { '@id': orgId() },
    areaServed: { '@type': 'City', name: site.venues[0]?.address.city },
  };
}

