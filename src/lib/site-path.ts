// Site path helper: single source for URL prefixes under the deploy base.
// The site is a GitHub Pages *project* site served at
// https://gxubaohua.github.io/caonysh/ — every root-absolute URL the pages emit
// (navigation, category filter, Inquiry Prefill link) must carry that base
// prefix, or the deployed pages 404. Astro applies the base automatically to
// astro:assets URLs but NOT to hand-written hrefs, so every internal link in
// templates goes through sitePath() (GLOSSARY: Deploy). BASE_URL is Vite's
// injection of the resolved astro base, so this stays correct in local dev
// (base '/') and in the Pages-targeted build (base '/caonysh/').
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
