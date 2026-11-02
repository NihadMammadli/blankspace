# blankspace — Brussels

The website of **blankspace**, two private event venues in the Brussels EU
Quarter: Blankspace Schuman (a townhouse behind the Berlaymont, 5–50 guests) and
Blankspace Place du Luxembourg (250 m² next to the European Parliament, 10–150
guests). A Damla Group venture, rebuilt from the live www.blankspace.brussels in
the Damla Group design language.

Next.js (App Router) + TypeScript, statically exported, in English, French and
Dutch. No CMS, no server, no runtime data — and no user-visible string in the
code: every word, number, link and picture comes from the content layer.

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /en/
npm run build      # content check → static export to out/ → SEO audit
npm start          # serve out/ on :3000
npm run typecheck
```

**Preview:** https://nihadmammadli.github.io/blankspace/ (every push to `main`).

## What is in it

46 pages per language, 138 in all, plus a language-picking root and a 404.

| Route | Pages | Template |
|---|---|---|
| `/` | home | hero film, concept, why, events, venues, clients, testimonials, blog, map, request form |
| `/spaces/<venue>` | 2 | Schuman (four rooms) and Place du Luxembourg (features, services, gallery), video tour, flat rate |
| `/events/<event>` | 8 | one per kind of event, with its gallery |
| `/venues/<commune>` | 6 | "event venue near Ixelles" — access, events, the full price list, FAQ |
| `/<landing>` | 10 | search landings: meeting room, conference room, wedding venues… |
| `/discover-prices` | 1 | packages and flat rates (a 404 on the old site) |
| `/catering-and-workshops`, `/locations`, `/weddings`, `/services`, `/contact` | 5 | |
| `/blog`, `/blog/<post>` | 1 + 9 | |
| `/terms-and-conditions`, `/gdpr-policy`, `/csr-policy` | 3 | |

Every URL of the old site is kept as it was — including the misspelt
`/events/coctail-receptions` — so the rankings it has earned carry over.

## Structure

```
app/                 routes only: each page asks for content and lays out sections
  [locale]/          the site, once per language (the root layout sets <html lang>)
  (root)/            "/" — sends the visitor to their language
  content/[file]/    /content/<locale>.json — the resolved content, see below
  global-not-found   the 404, with the site's header and footer
  sitemap.ts robots.ts manifest.ts
components/          one file per piece of the page, with its CSS module
content/
  types.ts           the content contract — the shape every page receives
  index.ts           getSite(locale): the only way in
  sources/local.ts   assembles a Site from content/data/
  sources/api.ts     fetches a Site from an API instead
  data/site.json     everything that does not change with the language
  data/en|fr|nl.json every word, per language
  media.json         the cut sizes of every picture (generated)
lib/                 paths, routes, formatting, media, SEO
scripts/             content check, image pipeline, post-build audit
public/img/          the cut pictures (generated)    public/og/  share cards (generated)
```

## Content

**Nothing in `app/` or `components/` contains a user-visible string.** Pages call
`getSite(locale)` and receive one typed object (`content/types.ts`) holding the
whole site in that language.

Today that object is assembled from JSON:

- `content/data/site.json` — what does not change with the language: slugs,
  prices, capacities, picture keys, links, menu structure.
- `content/data/<locale>.json` — every word in one language.

The two merge by `id`: an array of `{ "id": … }` objects in `site.json` takes its
words from the object with the same id in the language file. English sits under
every other language, so a missing translation shows English instead of a gap.
Pictures are stored as a key plus alt text and arrive as `{ src, alt }`.

Small conventions the text understands: `*stars*` mark the bronze accent inside a
heading; `{n}`, `{name}`, `{email}` are filled in by the page.

`npm run build` runs `npm run content:check` first. It refuses a misspelt key, a
picture that does not exist, a duplicate slug or a broken character, and lists
the texts that fall back to English.

### Moving to an API

Set two variables and the build reads from an endpoint instead of the files:

```bash
CONTENT_SOURCE=api
CONTENT_API_URL='https://cms.example.com/api/site?locale={locale}'
CONTENT_API_TOKEN=…            # optional, sent as a Bearer token
CONTENT_LOCALES=en,fr,nl       # optional
```

The endpoint returns the `Site` object for one language. Its exact shape is
`content/types.ts`, and every build publishes the current one at
**`/content/en.json`** (and `fr`, `nl`) — that file *is* the specification.
Pictures may stay as keys from `content/media.json` or become absolute URLs;
both work. No page or component changes.

The site is static, so new content means a new build: point the CMS's publish
webhook at the deploy workflow (`workflow_dispatch`).

## Images

```bash
npm run images           # cut what is new
npm run images -- --all  # cut everything again
```

The originals live in `media-src/`, which is **not in git** (48 MB; they were
taken from the old site). The script writes `public/img/<key>-<width>.webp` at
480, 960 and 1440 px — never wider than the original — logos at 200/400, a 16 px
blurred preview for each, and `content/media.json`, which the `Photo` component
reads to build `srcset`. A picture's key is its path inside `media-src/` without
the extension: `media-src/events/workshops/03.webp` → `events/workshops/03`.

Every picture the content names as a page's `seo.image` is also cut as a
1200 × 630 JPEG share card in `public/og/` (messaging apps ignore WebP).

The two background films stay on the venue's Cloudflare R2 bucket; their posters
are frames cut from them.

## SEO

- Per page: title, description, canonical, `hreflang` for every language plus
  `x-default`, Open Graph and Twitter cards with a 1200 × 630 JPEG.
- Pages that exist in English only (legal pages, blog posts) are shown in every
  language but marked `lang="en"`, carry a notice, and name the English page as
  canonical; the sitemap lists only the originals.
- Structured data: Organization on every page; EventVenue + LocalBusiness on the
  venue pages; OfferCatalog with the published prices; FAQPage; Service for each
  kind of event; BlogPosting; BreadcrumbList.
- `sitemap.xml` with language alternates and image entries, built from the
  content, so a new event or post is listed without anyone remembering to.
- After every build `scripts/postbuild.mjs` audits all pages and fails the build
  if one lost its title, description, canonical, share card or single `<h1>`.
- Responsive images with width and height, lazy below the fold; the hero film,
  map and YouTube tour load nothing from a third party until asked.

The Pages preview is built with `NEXT_PUBLIC_NOINDEX=true` (every page says
`noindex`) so it never competes with the live domain.

## Deploying

**GitHub Pages (preview).** `.github/workflows/deploy.yml` runs on every push to
`main`: install → typecheck → build → check the `/blankspace` base path reached
the markup → publish `out/`. `ci.yml` runs the same on pull requests.

**Production (www.blankspace.brussels).** Build without a base path and without
`NEXT_PUBLIC_NOINDEX`, then serve `out/` from any static host:

```bash
NEXT_PUBLIC_SITE_URL=https://www.blankspace.brussels npm run build
```

### Environment

| Variable | Default | Meaning |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.blankspace.brussels` | origin for canonicals, sitemap, share cards |
| `NEXT_PUBLIC_BASE_PATH` | empty | sub-path, e.g. `/blankspace` on Pages |
| `NEXT_PUBLIC_NOINDEX` | empty | `true` for previews |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | `contact.formEndpoint` in `site.json` | where the request form POSTs JSON |
| `CONTENT_SOURCE`, `CONTENT_API_URL`, `CONTENT_API_TOKEN`, `CONTENT_LOCALES` | local | see *Moving to an API* |

## The request form

With no endpoint configured, sending opens the visitor's email app with the
request filled in, addressed to the venue (the form says so). Set
`contact.formEndpoint` in `site.json` — or `NEXT_PUBLIC_CONTACT_ENDPOINT` — to
any URL that accepts a JSON POST (`firstName`, `lastName`, `country`, `phone`,
`email`, `message`, `name`, `locale`), e.g. the Damla Group backend's contact
API, and it posts there instead.

## What changed from the old site

Fixed while importing: the Dutch catering section was German; the Ixelles page
was titled "City of Brussels"; "Our Worskshops", "DINAMIC", "GPDR", "l Tratturi",
"hybrid meetings1", "250 m" (²), a truncated workshop sentence; one blog post
dated 2013; landing-page meta tags that were English in every language (now
translated); and `/discover-prices`, which was a 404, is now the price page.

Still English only, as before — they need a translator, not a developer: the
three legal pages and the nine blog posts.

## Design

The visual system — Urbanist, navy and ink, bronze actions, gold frames — is
damla-group's, recorded in [DESIGN.md](DESIGN.md).
