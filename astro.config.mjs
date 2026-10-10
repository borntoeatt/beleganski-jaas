// @ts-check
import { defineConfig } from 'astro/config';

// Static site: `astro build` writes plain HTML/CSS/JS to dist/, served by nginx.
export default defineConfig({
  site: 'https://alex-jaas.dporkov.tech',
  server: { port: 8080 },
  // Keep whitespace between tags: the layout relies on spaces between inline elements
  compressHTML: false,
});
