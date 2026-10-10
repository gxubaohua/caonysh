import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages *project* site (johoka/caonysh): served at
  // https://johoka.github.io/caonysh/, so the build targets that base path.
  // astro:assets URLs pick the base up automatically; hand-written hrefs in
  // templates go through src/lib/site-path.ts.
  site: 'https://johoka.github.io',
  base: '/caonysh/',
});
