// Shared constant: the deploy base the build targets (astro.config.mjs
// `base`, mirrored here for assertions on the built-HTML seam). The site is
// served at the root of its custom domain https://www.caonysh.com/, so
// root-absolute href/src in dist/ carry no extra path prefix.
export const SITE_BASE = '/';
