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
// Detail routes cover every product in the committed Product Config (ADR-0006:
// one Product per Amazon listing variant).
const routes: Record<string, string[]> = {
  'index.html': ['Featured Products', 'Iridescent Plastic Tablecloths Disposable Table Cover'],
  'products/index.html': ['Iridescent Plastic Tablecloths Disposable Table Cover', 'Crinkle Paper Filler for Gift Baskets Gift Boxes(White&amp;Gold)', '36PCS Plant Stake Arms for Tomato Cage'],
  'products/tablecloths/index.html': ['Tablecloths', 'Iridescent Plastic Tablecloths Disposable Table Cover', 'Blue', 'Purple'],
  'products/gift-packaging/index.html': ['Gift Packaging', 'Crinkle Paper Filler for Gift Baskets Gift Boxes(White&amp;Gold)', 'Navy Blue', 'Red'],
  'products/garden-supplies/index.html': ['Garden Supplies', '36PCS Plant Stake Arms for Tomato Cage', '60PCS'],
  'products/p/foil-glitter-tablecloth-iridescent/index.html': ['Iridescent Plastic Tablecloths Disposable Table Cover', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-blue/index.html': ['Table Cover Blue', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-pink/index.html': ['Table Cover Pink', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-black-silver/index.html': ['Black&amp;Silver', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-pink-silver/index.html': ['Pink&amp;Silver', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-gold/index.html': ['Table Cover Gold', 'Send Inquiry'],
  'products/p/foil-glitter-tablecloth-purple/index.html': ['Table Cover Purple', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-white-gold/index.html': ['Crinkle Paper Filler for Gift Baskets Gift Boxes(White&amp;Gold)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-shiny-white/index.html': ['(Shiny White)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-blue/index.html': ['(Blue)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-navy-blue/index.html': ['(Navy Blue)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-brown/index.html': ['(Brown)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-4-mix-color/index.html': ['(4 Mix Color)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-green/index.html': ['(Green)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-pink/index.html': ['(Pink)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-black/index.html': ['(Black)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-white/index.html': ['(White)', 'Send Inquiry'],
  'products/p/crinkle-paper-filler-red/index.html': ['(Red)', 'Send Inquiry'],
  'products/p/plant-stake-arms-36-pcs/index.html': ['36PCS Plant Stake Arms for Tomato Cage', 'Send Inquiry'],
  'products/p/plant-stake-arms-60-pcs/index.html': ['60PCS Plant Stake Arms', 'Send Inquiry'],
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
      const tablecloths = pages['products/p/foil-glitter-tablecloth-iridescent/index.html'];
      expect(tablecloths).toMatch(
        new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=4%20Pack%20Iridescent%20Plastic%20Tablecloths%20Disposable%20Table%20Cover%2054%20x%20108%20In"`),
      );
    });
  });
});
