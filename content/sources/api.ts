/**
 * The API content source. Set CONTENT_SOURCE=api and CONTENT_API_URL to a URL
 * template, e.g. `https://cms.example.com/api/site?locale={locale}`, and the
 * build fetches each language from it instead of reading content/data/.
 *
 * The endpoint must return the `Site` object described in content/types.ts —
 * the same object sources/local.ts assembles. Every build publishes that object
 * at /content/<locale>.json, so the expected response is always one click away.
 * Pictures may be keys from content/media.json or absolute URLs.
 */
import type { Site } from '../types';

const url = (locale: string) => {
  const template = process.env.CONTENT_API_URL;
  if (!template) throw new Error('content: CONTENT_SOURCE=api needs CONTENT_API_URL');
  return template.includes('{locale}') ? template.replace('{locale}', locale) : `${template.replace(/\/+$/, '')}/${locale}`;
};

async function get<T>(target: string): Promise<T> {
  const res = await fetch(target, {
    headers: { accept: 'application/json', ...(process.env.CONTENT_API_TOKEN ? { authorization: `Bearer ${process.env.CONTENT_API_TOKEN}` } : {}) },
    cache: 'force-cache',
  });
  if (!res.ok) throw new Error(`content: ${target} answered ${res.status}`);
  return res.json() as Promise<T>;
}

export function locales(): string[] {
  return (process.env.CONTENT_LOCALES ?? 'en,fr,nl').split(',').map((s) => s.trim()).filter(Boolean);
}

export async function load(locale: string): Promise<Site> {
  return get<Site>(url(locale));
}
