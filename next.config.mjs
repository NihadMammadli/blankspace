/**
 * A static export: `next build` writes the whole site to out/, and anything
 * that serves files can host it — GitHub Pages today, the venue's own domain
 * later.
 *
 * GitHub Pages serves a project repo from /<repo>/, so the build reads the
 * prefix from NEXT_PUBLIC_BASE_PATH (set by the deploy workflow). Locally and
 * at a domain root it is empty.
 */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  // app/global-not-found.tsx: one 404 for every missing address, with the site's own header and footer
  experimental: { globalNotFound: true },
};

export default nextConfig;
