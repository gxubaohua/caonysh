// Review-fix tests for the product detail URL and clickable ProductCard
// (built HTML seam). After the review ruling that "item" violates the
// GLOSSARY Product _Avoid: Item_ term, detail pages live at
// /products/p/<slug>/ (a non-domain path segment) and every ProductCard
// links to it — spec user story 5: a Visitor clicks a product to reach its
// detail page. The "p" segment must never collide with a Category slug, so
// Category Config validation rejects it.
import { describe, expect, test } from 'vitest';
import { readBuiltPage, withCategoriesFixture } from './helpers';
import { SITE_BASE } from './site-base';

const productsHtml = readBuiltPage('products/index.html');
const bearingsHtml = readBuiltPage('products/bearings/index.html');
const homeHtml = readBuiltPage('index.html');

describe('detail page URL /products/p/<slug>/ (built HTML seam)', () => {
  test('detail pages are served under /products/p/<slug>/', () => {
    const bearing = readBuiltPage('products/p/steel-ball-bearing/index.html');
    const nut = readBuiltPage('products/p/stainless-steel-hex-nut/index.html');
    const spacer = readBuiltPage('products/p/nylon-spacer/index.html');
    const gasket = readBuiltPage('products/p/nitrile-rubber-gasket/index.html');
    expect(bearing).toContain('Steel Ball Bearing');
    expect(nut).toContain('Stainless Steel Hex Nut');
    expect(spacer).toContain('Nylon Spacer');
    expect(gasket).toContain('Nitrile Rubber Gasket');
  });

  test('no detail page route is generated under the old /products/item/ segment', () => {
    // The Avoid term must not survive anywhere in the route manifest.
    expect(productsHtml).not.toMatch(/products\/item\//);
  });
});

describe('every ProductCard links to its detail page (spec story 5)', () => {
  test('Products grid: each card link points at its own detail URL', () => {
    expect(productsHtml).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}products/p/steel-ball-bearing/"[^>]*>[\\s\\S]*?Steel Ball Bearing`),
    );
    expect(productsHtml).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}products/p/stainless-steel-hex-nut/"[^>]*>[\\s\\S]*?Stainless Steel Hex Nut`),
    );
    expect(productsHtml).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}products/p/nylon-spacer/"[^>]*>[\\s\\S]*?Nylon Spacer`),
    );
  });

  test('Category landing grid: each card link points at its own detail URL', () => {
    expect(bearingsHtml).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}products/p/steel-ball-bearing/"[^>]*>[\\s\\S]*?Steel Ball Bearing`),
    );
    expect(bearingsHtml).not.toContain('Stainless Steel Hex Nut');
  });

  test('Home Featured section: the featured card links to its detail URL', () => {
    expect(homeHtml).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}products/p/steel-ball-bearing/"[^>]*>[\\s\\S]*?Steel Ball Bearing`),
    );
  });

  test('a card link is a link, not bare article markup', () => {
    expect(productsHtml).toMatch(/<a[^>]+class="[^"]*\bproduct-card\b[^"]*"[^>]*href="/);
  });
});

describe('Category slug "p" is reserved for detail routes (config validation seam)', () => {
  test(
    'a Category Config slug "p" fails the build, naming the offending category',
    { timeout: 10 * 60 * 1000 },
    () =>
      // Same fixture-swap build pattern as the Product Config validation
      // tests, but the swapped file is the Category Config.
      withCategoriesFixture('categories-reserved-slug.json', (result) => {
        // The build must fail because the "p" category slug collides with the
        // detail route segment, and the error must name the offending category.
        expect(result.failed).toBe(true);
        expect(result.output).toContain('Rotary Seals');
        expect(result.output).toMatch(/"p"/);
      }),
  );
});
