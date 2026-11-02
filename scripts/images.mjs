#!/usr/bin/env node
/**
 * Cuts every original in media-src/ into responsive WebP files and writes the
 * manifest content/media.json. See scripts/images.config.mjs.
 *
 *   npm run images            only pictures whose outputs are missing
 *   npm run images -- --all   everything again
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { DEFAULT, PROFILES, OG } from './images.config.mjs';

const SRC = 'media-src';
const OUT = 'public/img';
const OG_OUT = 'public/og';
const MANIFEST = 'content/media.json';
const all = process.argv.includes('--all');

if (!fs.existsSync(SRC)) {
  console.error(`images — there is no ${SRC}/ folder. The originals are kept out of git; see README → Images.`);
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.(jpe?g|png|webp|svg)$/i.test(e.name) ? [p] : [];
  });
}

/** Every picture content names as a share card. */
function ogKeys() {
  const keys = new Set();
  const visit = (o, parent) => {
    if (Array.isArray(o)) return o.forEach((v) => visit(v, parent));
    if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if ((parent === 'seo' && k === 'image') || k === 'ogImage') {
          if (typeof v === 'string') keys.add(v);
        } else visit(v, k);
      }
    }
  };
  for (const f of fs.readdirSync('content/data')) visit(JSON.parse(fs.readFileSync(`content/data/${f}`, 'utf8')));
  return keys;
}

const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const manifest = {};
const og = ogKeys();
let cut = 0;

for (const file of walk(SRC).sort()) {
  const key = file.slice(SRC.length + 1).replace(/\.[^.]+$/, '').split(path.sep).join('/');
  const profile = PROFILES.find((p) => p.match.test(key)) ?? DEFAULT;
  const input = () => sharp(file, { density: /\.svg$/i.test(file) ? 300 : 72 }).rotate();
  const meta = await input().metadata();
  const srcW = meta.autoOrient?.width ?? meta.width;
  const srcH = meta.autoOrient?.height ?? meta.height;
  let widths = profile.widths.filter((w) => w <= srcW);
  if (!widths.length) widths = [Math.min(srcW, Math.max(...profile.widths))];

  const outputs = widths.map((w) => path.join(OUT, `${key}-${w}.webp`));
  const fresh = !all && previous[key] && outputs.every((o) => fs.existsSync(o));
  if (!fresh) {
    fs.mkdirSync(path.dirname(outputs[0]), { recursive: true });
    for (const w of widths) {
      await input().resize({ width: w, withoutEnlargement: true }).webp({ quality: profile.quality ?? DEFAULT.quality, effort: 5 })
        .toFile(path.join(OUT, `${key}-${w}.webp`));
    }
    cut++;
  }

  const largest = widths.at(-1);
  const entry = { widths, width: largest, height: Math.round((srcH / srcW) * largest) };
  // a 16 px preview the hero shows blurred while the real picture loads
  entry.blur = fresh && previous[key]?.blur
    ? previous[key].blur
    : `data:image/webp;base64,${(await input().resize(16).webp({ quality: 40 }).toBuffer()).toString('base64')}`;

  if (og.has(key)) {
    const target = path.join(OG_OUT, `${key}.jpg`);
    if (all || !fs.existsSync(target)) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      await input().resize(OG.width, OG.height, { fit: 'cover', position: 'attention' }).flatten({ background: '#ffffff' })
        .jpeg({ quality: OG.quality, mozjpeg: true }).toFile(target);
    }
    entry.og = true;
  }
  manifest[key] = entry;
}

const missing = [...og].filter((k) => !manifest[k]);
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
console.log(`images — ${Object.keys(manifest).length} pictures (${cut} cut now), ${[...og].length - missing.length} share cards.`);
if (missing.length) {
  console.error(`images — content names share cards with no original: ${missing.join(', ')}`);
  process.exit(1);
}
