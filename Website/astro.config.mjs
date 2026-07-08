// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Serve web assets from static/ (Brand/ at the repo root is never served).
  publicDir: './static',
});
