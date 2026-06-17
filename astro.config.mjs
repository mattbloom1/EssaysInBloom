// @ts-check
import { defineConfig } from 'astro/config';

// Web-served static assets live in ./static so they don't collide with the
// existing Public/ brand sources (which must NOT be served).
export default defineConfig({
  publicDir: './static',
});
