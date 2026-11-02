#!/usr/bin/env node
/**
 * Checks content/data/ before every build, so a broken edit stops the build
 * instead of reaching the site. Errors stop it; warnings are printed and let
 * it through.
 *
 *   - every language file parses and has no key the English file lacks (a typo)
 *   - every entry in site.json has its English text
 *   - every picture key the content names exists in content/media.json
 *   - slugs are unique and URL-safe
 *   - *stars* are balanced, and no invisible characters slipped in
 *
 * A key missing from French or Dutch is only a warning: the page shows the
 * English text there.
 */
import fs from 'node:fs';

const DATA = 'content/data';
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where} — ${msg}`);
const warn = (where, msg) => warnings.push(`${where} — ${msg}`);

const read = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`content:check — ${file} is not valid JSON.\n  ${e.message}`);
    process.exit(1);
  }
};

const site = read(`${DATA}/site.json`);
const media = fs.existsSync('content/media.json') ? read('content/media.json') : {};
const codes = site.locales.map((l) => l.code);
const docs = Object.fromEntries(codes.map((c) => [c, fs.existsSync(`${DATA}/${c}.json`) ? read(`${DATA}/${c}.json`) : null]));
const base = docs[site.defaultLocale];

for (const [code, doc] of Object.entries(docs)) {
  if (!doc) err(`${code}.json`, 'the file is missing, but site.json lists the language.');
  else if (doc.schema !== site.schema) err(`${code}.json`, `schema ${doc.schema}, site.json is schema ${site.schema}.`);
}
if (!base) {
  console.error(`content:check — the default language file ${site.defaultLocale}.json is missing.`);
  process.exit(1);
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/* ---------------------------------------------- languages against English */
function compare(ref, doc, path, code) {
  for (const k of Object.keys(doc)) {
    if (!(k in ref)) err(`${code}.json › ${path}${k}`, `not in ${site.defaultLocale}.json — a misspelt key is never shown.`);
  }
  for (const [k, v] of Object.entries(ref)) {
    if (!(k in doc)) {
      warn(`${code}.json › ${path}${k}`, `missing; the ${site.defaultLocale} text is shown.`);
      continue;
    }
    if (isObj(v) && isObj(doc[k])) compare(v, doc[k], `${path}${k}.`, code);
  }
}
for (const code of codes) {
  if (code !== site.defaultLocale && docs[code]) compare(base, docs[code], '', code);
}

/* ------------------------------- every shared entry has its English text */
function entries(shared, text, path) {
  if (Array.isArray(shared) && shared.length && shared.every((x) => isObj(x) && typeof x.id === 'string')) {
    const seen = new Set();
    for (const item of shared) {
      if (seen.has(item.id)) err(`site.json › ${path}`, `the id "${item.id}" is used twice.`);
      seen.add(item.id);
      if (isObj(text) && !(item.id in text)) err(`${site.defaultLocale}.json › ${path}`, `has no text for "${item.id}".`);
      if (isObj(text?.[item.id])) entries(item, text[item.id], `${path}.${item.id}`);
    }
    if ('slug' in shared[0]) {
      const slugs = new Set();
      for (const item of shared) {
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug)) err(`site.json › ${path}.${item.id}`, `the slug "${item.slug}" is not lowercase-and-dashes.`);
        if (slugs.has(item.slug)) err(`site.json › ${path}`, `the slug "${item.slug}" is used twice.`);
        slugs.add(item.slug);
      }
    }
    return;
  }
  if (isObj(shared)) for (const [k, v] of Object.entries(shared)) entries(v, isObj(text) ? text[k] : undefined, path ? `${path}.${k}` : k);
}
entries(site, base, '');

/* --------------------------------------------- every picture key resolves */
const PICTURE_KEYS = new Set(['image', 'images', 'poster', 'ogImage']);
function pictures(node, path) {
  if (Array.isArray(node)) return node.forEach((v, i) => pictures(v, `${path}[${i}]`));
  if (!isObj(node)) return;
  for (const [k, v] of Object.entries(node)) {
    if (PICTURE_KEYS.has(k)) {
      for (const key of [v].flat()) {
        if (typeof key === 'string' && !/^https?:\/\//.test(key) && !media[key]) {
          err(`site.json › ${path}.${k}`, `no picture called "${key}". Run \`npm run images\` after adding its original to media-src/.`);
        }
      }
    }
    pictures(v, path ? `${path}.${k}` : k);
  }
}
pictures(site, '');

/* ------------------------------------------------------------ text hygiene */
function strings(node, path, code) {
  if (Array.isArray(node)) return node.forEach((v, i) => strings(v, `${path}[${i}]`, code));
  if (isObj(node)) return Object.entries(node).forEach(([k, v]) => strings(v, path ? `${path}.${k}` : k, code));
  if (typeof node !== 'string') return;
  // *stars* mark the accent inside headings
  if (/(title|heading)$/i.test(path) && (node.match(/\*/g) || []).length % 2) warn(`${code}.json › ${path}`, 'has an odd number of * characters.');
  if (/[​‌‍﻿]/.test(node)) warn(`${code}.json › ${path}`, 'contains an invisible character.');
  if (/�/.test(node)) err(`${code}.json › ${path}`, 'contains a broken character (�) — the file was saved in the wrong encoding.');
}
for (const [code, doc] of Object.entries(docs)) if (doc) strings(doc, '', code);

/* ------------------------------------------------------------------ report */
const missing = warnings.filter((w) => w.includes('is shown.'));
for (const w of warnings.filter((w) => !w.includes('is shown.'))) console.warn(`⚠ ${w}`);
if (missing.length) {
  console.warn(`⚠ ${missing.length} text(s) fall back to ${site.defaultLocale}:`);
  for (const w of missing) console.warn(`    ${w.split(' — ')[0]}`);
}
for (const e of errors) console.error(`✗ ${e}`);
if (errors.length) {
  console.error(`\ncontent:check — ${errors.length} problem(s). Nothing was built.`);
  process.exit(1);
}
console.log(`content:check — ${codes.length} languages, ${Object.keys(media).length} pictures, all good.`);
