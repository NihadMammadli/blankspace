# blankspace design system

blankspace is a Damla Group venue, and its site speaks the Damla Group design
language (damla-group/frontend): the same type, palette, buttons, cards and
motion, applied to blankspace's photographs and words. Tokens live in
`app/globals.css`; each component carries its own CSS module.

## Colour

| Token | Value | Role |
|---|---|---|
| `--navy` | `#343D52` | The header and the mobile drawer |
| `--ink` | `#0F1729` | Headings, the footer, the hero veil |
| `--bronze` | `#9C6D36` | Every action: primary buttons, links, icon tiles |
| `--bronze-hover` | `#B87D3F` | Primary button hover |
| `--bronze-light` | `#BD8543` | Service-card discs, footer icons |
| `--gold` | `#D4AF37` | Frames, rules, focus rings, active dots — never a fill |
| `--beige` | `#E8E0D5` | Section ground; drawer body |
| `--light` | `#F5F3F0` | Section ground |
| `--sand` | `#ECE0CF` | Outline-button hover |
| `--text` | `#4A5565` | Body copy |

Sections alternate white, beige and light grey down the page; the footer is ink.

## Type

**Urbanist** (Google Fonts, 300–700) for everything. Large titles are weight
**400**, not bold — hierarchy comes from size:

| Use | Size |
|---|---|
| Hero title | `clamp(36px, 7vw, 72px)` |
| Section title (`.title`) | `clamp(32px, 5vw, 51px)` / 1.25 |
| Card titles | 21px / 500 |
| Lead (`.lead`) | `clamp(16px, 2vw, 19px)` / 500 |
| Body (`.body`) | `clamp(15px, 1.5vw, 17px)` / 1.6, `#4A5565` |
| Kicker (`.kicker`) | 13px / 600, uppercase, 0.16em, bronze |

`*stars*` in a heading render as the bronze accent (`<em>`), as in Damla's
"Rooted in Hospitality. *Driven by Innovation*".

## Components

- **Header** — fixed, 80px (64px on phones), navy. Links at 80% white; the hover
  lifts 2px and a bronze underline grows from the centre. Events and Spaces open
  white dropdown panels with a bronze top edge. Languages EN/FR/NL keep the
  current page. The bronze *Contact Us* button closes the row. Under 1080px: a
  drawer from the right — navy head, beige body, bronze left border on the
  current link, contact button and tagline at the foot.
- **Hero** — full first screen on the home page, 68svh elsewhere. Photograph or
  film under a navy veil (`rgba(15,23,41,.7) → .6`), centred white title; the
  title, text and buttons rise in at 0.2s / 0.4s / 0.6s; a bouncing mouse icon
  leads down. The picture's blurred 16px preview shows until it loads.
- **ImageText** — Damla's picture-and-text band. The picture (488:542, radius 10,
  large shadow) sits in a gold frame offset 24px; it slides in from its side and
  the text from the other. Optional bronze icon tile before the title.
- **FeatureCard** — wide gradient card, white icon tile, 34px title; gold border
  on hover.
- **IconCard** — white service card, bronze disc, 21px title; bronze border and
  deeper shadow on hover.
- **PhotoCard** — Damla's project card: 4:5 photograph under a dark veil; on
  hover it lifts 8px, the picture zooms, the text and a gold *Discover* rise in.
- **Stats** — gold ring, number counting up once (easeOutQuart, 1.4s), label.
- **Testimonials** — white cards, three across, gold quote mark, *More/Less* for
  long quotes, round white arrows and bronze page dots.
- **Carousel** — scroll-snapping row (works without JavaScript), round white
  arrows, gold pill for the current dot.
- **Pricing** — package cards with the price in bronze 44px; the premium
  packages carry a gold border and the filled button.
- **ContactForm** — the logo in a gold-framed panel beside the form; inputs
  radius 10, gold border on hover and focus.
- **Footer** — ink. A call to action (title, text, bronze button), then the brand
  column (logo, tagline, both addresses, phone, email, social) and four link
  columns, then the small print and legal links.

## Buttons

| Class | Look |
|---|---|
| `.btn-primary` | bronze fill, white text; hover lifts 2px with a bronze shadow |
| `.btn-light` | 2px white outline on dark grounds |
| `.btn-outline` | white fill, ink outline; hover sand |

All are 8px radius, 16px / 600, `14px 28px`; an arrow nudges right on hover.

## Motion

The page is complete without JavaScript. An inline script in `<head>` adds
`motion` to `<html>` only when the visitor has not asked for reduced motion —
that class is the only thing that hides anything, and it removes itself after
three seconds if the bundle never arrives. `components/Motion.tsx` then adds
`is-in` to each `[data-reveal]` element as it enters the viewport:

| `data-reveal` | Entrance |
|---|---|
| (empty) | fade up 50px, 0.8s ease-out |
| `left` / `right` | slide in 100px from that side |
| `fade` | fade only |
| `stagger` | the children fade up 0.1s apart |

On phones, slides become fade-ups and everything runs at 0.6s. With reduced
motion nothing moves and the films are paused.

## Rules

- Gold frames and rules; bronze acts. Never fill a button with gold.
- Titles stay at weight 400.
- Every picture comes through `Photo` with a `sizes` hint; no picture without alt
  text from the content.
- No user-visible string in a component — it belongs in `content/data/`.
