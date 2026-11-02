import { getLocales, getSite } from '@/content';

/**
 * /content/<locale>.json — the whole resolved `Site` object for one language,
 * exactly as the pages receive it. It is the working specification for a
 * future content API (see content/sources/api.ts): an endpoint that returns
 * this JSON can replace content/data/ without any other change.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getLocales().map((l) => ({ file: `${l}.json` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.json$/, '');
  return Response.json(await getSite(locale));
}
