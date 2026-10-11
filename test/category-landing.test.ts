import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { SITE_BASE } from './site-base';

describe('Category landing pages (built HTML seam)', () => {
  // Fix 3 (review): landing pages render inside BaseLayout, so the grid
  // styles (.product-grid) resolve and the pages carry site nav/footer.
  test('landing pages adopt the BaseLayout shell: nav and footer furniture', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}about/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}contact/"`));
    expect(tablecloths).toMatch(/<footer[^>]*>[\s\S]*service@caonysh\.com[\s\S]*<\/footer>/);
  });

  test('landing page grid renders with the shared product grid styles', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    expect(tablecloths).toMatch(/class="[^"]*\bproduct-grid\b[^"]*"/);
    expect(tablecloths).toMatch(/\.product-grid\s*\{/);
  });

  test('gives every non-empty category a landing page at /products/<category>/', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    const giftPackaging = readBuiltPage('products/gift-packaging/index.html');
    const gardenSupplies = readBuiltPage('products/garden-supplies/index.html');
    expect(tablecloths).toMatch(/^<!doctype html>/i);
    expect(giftPackaging).toMatch(/^<!doctype html>/i);
    expect(gardenSupplies).toMatch(/^<!doctype html>/i);
  });

  test("renders only the category's own products in the landing page grid", () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    const giftPackaging = readBuiltPage('products/gift-packaging/index.html');
    const gardenSupplies = readBuiltPage('products/garden-supplies/index.html');
    expect(tablecloths).toContain('Foil Glitter Plastic Tablecloths');
    expect(tablecloths).not.toContain('Crinkle Paper Filler');
    expect(giftPackaging).toContain('Crinkle Paper Filler');
    expect(giftPackaging).not.toContain('Foil Glitter Plastic Tablecloths');
    expect(gardenSupplies).toContain('Plant Stake Arms');
    expect(gardenSupplies).not.toContain('Crinkle Paper Filler');
  });

  test('renders the category description when one is configured', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    expect(tablecloths).toContain('Disposable foil-glitter and iridescent plastic tablecloths');
  });

  test('uses a category-specific page title', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    const giftPackaging = readBuiltPage('products/gift-packaging/index.html');
    expect(tablecloths).toMatch(/<title>Tablecloths \| Caonysh<\/title>/);
    expect(giftPackaging).toMatch(/<title>Gift Packaging \| Caonysh<\/title>/);
  });

  test('uses a category-specific meta description', () => {
    const tablecloths = readBuiltPage('products/tablecloths/index.html');
    const gardenSupplies = readBuiltPage('products/garden-supplies/index.html');
    expect(tablecloths).toMatch(/<meta name="description" content="[^"]*Disposable foil-glitter[^"]*"/);
    expect(gardenSupplies).toMatch(/<meta name="description" content="[^"]*Garden Supplies[^"]*"/);
  });
});
