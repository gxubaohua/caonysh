import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { SITE_BASE } from './site-base';

describe('Category landing pages (built HTML seam)', () => {
  // Fix 3 (review): landing pages render inside BaseLayout, so the grid
  // styles (.product-grid) resolve and the pages carry site nav/footer.
  test('landing pages adopt the BaseLayout shell: nav and footer furniture', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    expect(bearings).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/"`));
    expect(bearings).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}about/"`));
    expect(bearings).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}contact/"`));
    expect(bearings).toMatch(/<footer[^>]*>[\s\S]*service@caonysh\.com[\s\S]*<\/footer>/);
  });

  test('landing page grid renders with the shared product grid styles', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    expect(bearings).toMatch(/class="[^"]*\bproduct-grid\b[^"]*"/);
    expect(bearings).toMatch(/\.product-grid\s*\{/);
  });

  test('gives every non-empty category a landing page at /products/<category>/', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    const fasteners = readBuiltPage('products/fasteners/index.html');
    const gaskets = readBuiltPage('products/gaskets/index.html');
    expect(bearings).toMatch(/^<!doctype html>/i);
    expect(fasteners).toMatch(/^<!doctype html>/i);
    expect(gaskets).toMatch(/^<!doctype html>/i);
  });

  test("renders only the category's own products in the landing page grid", () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    const fasteners = readBuiltPage('products/fasteners/index.html');
    const gaskets = readBuiltPage('products/gaskets/index.html');
    expect(bearings).toContain('Steel Ball Bearing');
    expect(bearings).not.toContain('Stainless Steel Hex Nut');
    expect(fasteners).toContain('Stainless Steel Hex Nut');
    expect(fasteners).toContain('Nylon Spacer');
    expect(fasteners).not.toContain('Steel Ball Bearing');
    expect(gaskets).toContain('Nitrile Rubber Gasket');
  });

  test('renders the category description when one is configured', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    const gaskets = readBuiltPage('products/gaskets/index.html');
    expect(bearings).toContain('Precision ball and roller bearings');
    expect(gaskets).toContain('Flat and ring gaskets');
  });

  test('renders no description copy when the category has none', () => {
    const fasteners = readBuiltPage('products/fasteners/index.html');
    expect(fasteners).not.toMatch(/class="category-description"/);
  });

  test('uses a category-specific page title', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    const fasteners = readBuiltPage('products/fasteners/index.html');
    expect(bearings).toMatch(/<title>Bearings \| Caonysh<\/title>/);
    expect(fasteners).toMatch(/<title>Fasteners \| Caonysh<\/title>/);
  });

  test('uses a category-specific meta description', () => {
    const bearings = readBuiltPage('products/bearings/index.html');
    const fasteners = readBuiltPage('products/fasteners/index.html');
    expect(bearings).toMatch(/<meta name="description" content="[^"]*Precision ball and roller bearings[^"]*"/);
    expect(fasteners).toMatch(/<meta name="description" content="[^"]*Fasteners[^"]*"/);
  });
});
