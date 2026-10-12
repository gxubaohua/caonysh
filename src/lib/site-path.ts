// Site path helper: single source for URL prefixes under the deploy base.
// The site is served at the root of its custom domain
// https://www.caonysh.com/ (GitHub Pages + custom domain), so the deploy base
// is '/'. Every root-absolute URL the pages emit (navigation, category
// filter, Inquiry Prefill link) still goes through sitePath() — it keeps the
// prefix correct in local dev too, and stays correct automatically if the
// deploy base ever changes again (e.g. back to a project-site prefix). Astro
// applies the base automatically to astro:assets URLs but NOT to hand-written
// hrefs, so every internal link in templates goes through sitePath()
// (GLOSSARY: Deploy). BASE_URL is Vite's injection of the resolved astro
// base, so this stays correct in local dev (base '/') and in the
// Pages-targeted build (base '/').
const base = import.meta.env.BASE_URL ?? '/';

/**
 * Prefix a root-absolute site path with the deploy base.
 * Accepts paths with or without a leading slash; returns a path starting
 * with a slash. Non-site URLs (mailto:, https://, #anchors) must not be
 * passed through here.
 */
export function sitePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${normalized}`;
}
