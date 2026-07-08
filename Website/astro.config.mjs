// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // GitHub Pages serves the site under /EssaysInBloom — CI sets BASE_PATH.
  // Locally BASE_PATH is unset, so dev/preview stay at the root.
  site: 'https://mattbloom1.github.io',
  base: process.env.BASE_PATH,
  // Serve web assets from static/ (Brand/ at the repo root is never served).
  publicDir: './static',
});
