import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages with a custom domain (repo Settings > Pages): the site is
  // served at https://www.caonysh.com/ — domain root, no /caonysh/ project
  // prefix. astro:assets URLs are root-absolute automatically; hand-written
  // hrefs in templates go through src/lib/site-path.ts.
  site: 'https://www.caonysh.com',
  base: '/',
});
