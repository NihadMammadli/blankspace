/**
 * The content contract.
 *
 * Every word, number, link and picture on the site arrives as one `Site`
 * object per language, from `getSite(locale)` in content/index.ts. Today it is
 * assembled from the JSON files in content/data/ (see sources/local.ts); later
 * it can come from an API (sources/api.ts) that returns this same shape. The
 * components never import data directly, so swapping the source changes nothing
 * else.
 */

export type Locale = string;

/** A picture. `src` is a key from content/media.json (e.g. "events/workshops/03") or an absolute URL. */
export interface Img {
  src: string;
  alt: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords?: string;
  /** Share-card picture key. */
  image?: string;
  /** false: the title is complete as written and must not get the " | blankspace" suffix. */
  brand?: boolean;
}

/** `href` is a site path without the language ("/contact"), an anchor ("#venues") or an absolute URL. */
export interface Link {
  label: string;
  href: string;
  caption?: string;
}

export interface LocaleInfo {
  code: Locale;
  label: string;
  name: string;
  hreflang: string;
  ogLocale: string;
}

export interface Feature {
  id: string;
  icon: string;
  label: string;
}

export interface TextBlock {
  title: string;
  text: string;
}

export interface LabelledText {
  label?: string;
  text: string;
}

export type Block =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'list'; items: LabelledText[] };

export interface Gallery {
  title?: string;
  images: Img[];
}

export interface Address {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  countryCode: string;
}

export interface MenuItem {
  id: string;
  label: string;
  caption?: string;
  href?: string;
  children?: Link[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  paragraphs: string[];
  gallery: Gallery;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  nameLines: string[];
  shortName: string;
  youtubeId: string;
  address: Address;
  capacity: { min: number; max: number; label: string };
  area?: number;
  seo: Seo;
  hero: Gallery;
  card: { text: string; image: Img };
  intro: TextBlock;
  exclusivity?: TextBlock;
  roomsTitle?: string;
  rooms?: Room[];
  highlights?: Feature[];
  equipped?: { title: string; text: string; items: Feature[] };
  why?: { title: string; paragraphs: string[]; expertiseTitle: string; expertise: LabelledText[]; gallery: Gallery };
  services?: { title: string; items: (LabelledText & { id: string; icon: string })[] };
  gallery?: Gallery;
  tour: TextBlock;
  locations: { text: string; images: Img[] };
}

export interface EventType {
  id: string;
  slug: string;
  title: string;
  navLabel: string;
  intro: string[];
  card: { title: string; text: string; image: Img };
  gallery: Gallery;
  seo: Seo;
}

export interface Commune {
  id: string;
  slug: string;
  name: string;
  title: string;
  text: string;
  access: { title: string; items: LabelledText[] };
  image: Img;
  seo: Seo;
}

export interface Landing {
  id: string;
  slug: string;
  title: string;
  intro: string;
  seo: Seo;
}

export interface LegalPage {
  id: string;
  slug: string;
  label: string;
  title: string;
  blocks: Block[];
  image: Img;
  seo: Seo;
  /** The language the text is actually written in (legal pages exist in English only). */
  lang: Locale;
}

export interface Post {
  id: string;
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: Img;
  body: Block[];
  seo: Seo;
  lang: Locale;
}

export interface Pricing {
  currency: string;
  title: string;
  intro: string[];
  features: Feature[];
  packages: { id: string; name: string; price: number; features: string[]; highlight?: boolean }[];
  flatRates: { title: string; text: string; items: { id: string; venue: string; title: string; halfDay: number; fullDay: number; features: string[] }[] };
  page: { kicker: string; title: string; text: string; button: string; image: Img };
  seo: Seo;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  role?: string;
  image: Img;
}

export interface Site {
  locale: Locale;
  defaultLocale: Locale;
  locales: LocaleInfo[];
  meta: { siteName: string; titleTemplate: string; description: string };
  brand: {
    name: string;
    legalName: string;
    foundingYear: number;
    logo: { light: string; dark: string; width: number; height: number };
    icon: string;
    ogImage: string;
  };
  contact: { phone: string; email: string; privacyEmail: string; formEndpoint: string; defaultCountry: string; countries: string[] };
  social: { id: string; url: string }[];
  media: { heroVideo: { src: string; poster: string }; conceptVideo: { src: string; poster: string } };
  /** Interface strings: buttons, labels, form, accessibility names. */
  ui: Ui;
  menus: { main: MenuItem[]; footer: { id: string; title: string; links: Link[] }[]; legal: Link[]; cta: { title: string; text: string; label: string; href: string } };
  equipment: Feature[];

  home: {
    seo: Seo;
    hero: { title: string; text: string; image: Img; primary: Link; secondary: Link };
    concept: { title: string; text: string; subtext: string; image: Img; button: Link };
    hostAny: { title: string; text: string; image: Img };
    stats: { id: string; value: number; suffix?: string; icon: string; label: string }[];
    features: { title: string; subtitle: string; items: { id: string; icon: string; title: string; text: string }[] };
    venues: { title: string };
    blog: { title: string; subtitle: string };
  };
  venues: Venue[];
  events: EventType[];
  eventsSection: { title: string; versatileTitle: string; versatileText: string };
  communes: Commune[];
  landings: Landing[];
  landing: { support: string; more: string };
  legal: LegalPage[];
  pricing: Pricing;
  why: { title: string; heading: string; intro: string; outro: string; items: Feature[]; gallery: Gallery };
  faq: { title: string; items: { id: string; question: string; answer: string[] }[] };
  testimonials: { title: string; intro: string[]; items: Testimonial[] };
  clients: { title: string; subtitle: string; items: { id: string; name: string; image: Img }[] };
  location: { title: string; text: string; parking: string; transport: string };

  catering: {
    seo: Seo;
    hero: { kicker: string; title: string; text: string; image: Img };
    intro: { kicker: string; title: string; paragraphs: string[] };
    gallery: Gallery;
    caterers: { title: string; items: { id: string; name: string; text: string; image: Img }[] };
    workshops: { kicker: string; title: string; paragraphs: string[]; image: Img };
    stories: { title: string; items: { id: string; name: string; text: string; image: Img }[] };
  };
  locations: {
    seo: Seo;
    title: string;
    text: string;
    hero: { image: Img };
    capacityLabel: string;
    items: { id: string; venue: string }[];
    quote: string;
    cta: { title: string; text: string; button: string };
  };
  weddings: {
    seo: Seo;
    hero: { title: string; text: string; image: Img };
    canvas: { title: string; paragraphs: string[] };
    exclusivity: { title: string; paragraphs: string[] };
    gallery: Gallery;
    quote: string;
    support: { title: string; text: string; image: Img };
    cta: { title: string; text: string; button: string };
  };
  services: {
    seo: Seo;
    date: string;
    hero: { title: string; text: string; image: Img };
    intro: string;
    points: string[];
    yesTeam: { title: string; paragraphs: string[] };
    teamImages: Gallery;
    items: LabelledText[];
    moreImages: Gallery;
    involvement: TextBlock;
    quote: string;
    outro: string;
    button: Link;
  };
  blog: { title: string; intro: string; seo: Seo; categories: Record<string, string>; posts: Post[] };
  contactPage: { seo: Seo; title: string; text: string; hero: { image: Img } };
  notFound: { title: string; text: string; button: string; image: Img };
}

/** The interface strings, typed from the English file so a missing key is a compile error. */
export type Ui = (typeof import('./data/en.json'))['ui'];
