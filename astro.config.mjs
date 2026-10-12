import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages *project* site (gxubaohua/caonysh): served at
  // https://gxubaohua.github.io/caonysh/, so the build targets that base path.
  // astro:assets URLs pick the base up automatically; hand-written hrefs in
  // templates go through src/lib/site-path.ts.
  site: 'https://gxubaohua.github.io',
  base: '/caonysh/',
});
