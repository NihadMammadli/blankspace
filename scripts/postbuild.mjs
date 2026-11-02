#!/usr/bin/env node
/**
 * After `next build`: prepare out/ for static hosting and audit what search
 * engines will read. Fails the build if a page lost its title, description,
 * canonical or H1, so an SEO regression cannot be deployed quietly.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'out';

// GitHub Pages: do not run Jekyll, which would hide the _next/ folder
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

if (!fs.existsSync(path.join(OUT, '404.html'))) {
  console.error('postbuild — out/404.html is missing.');
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== '_next' && e.name !== 'img' && e.name !== 'og') walk(p);
    } else if (e.name === 'index.html') pages.push(p);
  }
})(OUT);

const problems = [];
let checked = 0;
for (const file of pages) {
  const rel = path.relative(OUT, file);
  if (rel === 'index.html' || rel.startsWith('404') || rel.startsWith('_not-found')) continue;
  const html = fs.readFileSync(file, 'utf8');
  checked++;
  const need = {
    title: /<title>[^<]{10,}<\/title>/,
    description: /<meta name="description" content="[^"]{50,}"/,
    canonical: /<link rel="canonical" href="https?:\/\/[^"]+"/,
    h1: /<h1[\s>]/,
    lang: /<html lang="[a-z]{2}"/,
    'og:image': /<meta property="og:image" content="[^"]+"/,
  };
  const missing = Object.entries(need).filter(([, re]) => !re.test(html)).map(([k]) => k);
  if ((html.match(/<h1[\s>]/g) || []).length > 1) missing.push('a single h1');
  if (missing.length) problems.push(`${rel}: ${missing.join(', ')}`);
}

for (const p of problems) console.error(`✗ ${p}`);
if (problems.length) {
  console.error(`postbuild — ${problems.length} of ${checked} pages fail the SEO audit.`);
  process.exit(1);
}
console.log(`postbuild — ${checked} pages, each with a title, description, canonical, share card and one h1.`);
