/**
 * The only way into the content. Pages and components ask for a whole `Site`
 * in one language and take what they need from it; nothing in app/ or
 * components/ contains a user-visible string of its own.
 *
 * The source is chosen at build time:
 *   CONTENT_SOURCE=local (default) — content/data/*.json, see sources/local.ts
 *   CONTENT_SOURCE=api             — a remote endpoint, see sources/api.ts
 */
import { cache } from 'react';
import * as local from './sources/local';
import * as api from './sources/api';
import type { Site } from './types';

const source = process.env.CONTENT_SOURCE === 'api' ? api : local;

/** Every language the site is built in. */
export function getLocales(): string[] {
  return source.locales();
}

/** The whole site in one language. Cached for the length of a render. */
export const getSite = cache((locale: string): Promise<Site> => source.load(locale));

/** For generateStaticParams: one entry per language. */
export function localeParams() {
  return getLocales().map((locale) => ({ locale }));
}

export type * from './types';
