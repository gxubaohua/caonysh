// Whole-site smoke test: one build (global-setup) and a systematic sweep of
// every route the site is expected to produce (Home, Products, one landing
// page per non-empty Category, one detail page per Product, About, Contact).
// The value over the per-page suites is completeness: every route is asserted
// to exist, carry a non-empty title, its own content marker, and — because
// the site deploys to a GitHub Pages project site — internal links that are
// prefixed with the site base path. Per spec Testing Decisions, the only seam
// is the built HTML under dist/.
import { describe, expect, test } from 'vitest';
import { readBuiltPage, projectRoot } from './helpers';
import { SITE_BASE } from './site-base';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// The full route manifest: route file -> marker content unique to that page.
const routes: Record<string, string[]> = {
  'index.html': ['Featured Products', 'Foil Glitter Plastic Tablecloths'],
  'products/index.html': ['Foil Glitter Plastic Tablecloths', 'Crinkle Paper Filler', 'Plant Stake Arms'],
  'products/tablecloths/index.html': ['Tablecloths', 'Foil Glitter Plastic Tablecloths'],
  'products/gift-packaging/index.html': ['Gift Packaging', 'Crinkle Paper Filler'],
  'products/garden-supplies/index.html': ['Garden Supplies', 'Plant Stake Arms'],
  'products/p/foil-glitter-tablecloths/index.html': ['Foil Glitter Plastic Tablecloths', 'Send Inquiry'],
  'products/p/crinkle-paper-filler/index.html': ['Crinkle Paper Filler', 'Send Inquiry'],
  'products/p/plant-stake-arms/index.html': ['Plant Stake Arms', 'Send Inquiry'],
  'about/index.html': ['About Caonysh'],
  'contact/index.html': ['Contact Us', 'inquiry-form'],
};

describe('whole-site smoke (built HTML seam)', () => {
  describe('every route exists and carries its own content', () => {
    for (const [route, markers] of Object.entries(routes)) {
      test(`${route} exists with a non-empty title and its content markers`, () => {
        const html = readBuiltPage(route);
        expect(html).toMatch(/^<!doctype html>/i);
        const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null;
        expect(title, 'title present and non-empty').toBeTruthy();
        expect(title!.trim().length).toBeGreaterThan(0);
        for (const marker of markers) {
          expect(html, `marker "${marker}"`).toContain(marker);
        }
      });
    }
  });

  test('no category route survives beyond the three defined categories', () => {
    // Committed Category Config defines exactly tablecloths, gift-packaging,
    // garden-supplies — every category has a product, so no fifth route may
    // exist (guards against stale routes from renamed categories).
    for (const stale of ['bearings', 'fasteners', 'gaskets', 'rotary-seals']) {
      expect(existsSync(resolve(projectRoot, 'dist', 'products', stale))).toBe(false);
    }
  });

  describe('GitHub Pages base path (deploy seam)', () => {
    const pages: Record<string, string> = Object.fromEntries(
      Object.keys(routes).map((route) => [route, readBuiltPage(route)]),
    );

    test('every root-absolute href on every page is prefixed with the site base', () => {
      for (const [route, html] of Object.entries(pages)) {
        const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((match) => match[1]);
        expect(hrefs.length, `${route} has internal links to check`).toBeGreaterThan(0);
        for (const href of hrefs) {
          expect(href.startsWith(SITE_BASE), `${route}: href "${href}" must start with ${SITE_BASE}`).toBe(true);
        }
      }
    });

    test('every root-absolute asset src on every page is prefixed with the site base', () => {
      // astro:assets handles the base for optimized images; the smoke check
      // pins that behavior so a config regression cannot silently strip it.
      for (const [route, html] of Object.entries(pages)) {
        const srcs = [...html.matchAll(/\ssrc="(\/[^"]*)"/g)].map((match) => match[1]);
        for (const src of srcs) {
          expect(src.startsWith(SITE_BASE), `${route}: src "${src}" must start with ${SITE_BASE}`).toBe(true);
        }
      }
    });

    test('the Inquiry Prefill link on detail pages keeps the product query under the base', () => {
      const tablecloths = pages['products/p/foil-glitter-tablecloths/index.html'];
      expect(tablecloths).toMatch(
        new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=Foil%20Glitter%20Plastic%20Tablecloths"`),
      );
    });
  });
});
