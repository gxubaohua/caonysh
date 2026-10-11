// Review-fix tests (built HTML seam):
// 1. Price Strategy two-state also covers a *missing* `price` key (spec
//    c-1): a maintainer deleting the key — not setting it to null — must get
//    "Contact for price", not a crashed build or a TypeError.
// 2. Site Config reserves an analytics ID slot that stays empty by default
//    (spec story 29 / Implementation Decisions "analysis" — reserve the
//    slot, install nothing).
import { describe, expect, test } from 'vitest';
import { readBuiltPage, readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';

describe('Price Strategy with the price key absent (built HTML seam)', () => {
  test(
    'a product without a price key builds and renders "Contact for price"',
    { timeout: 10 * 60 * 1000 },
    () =>
      // The fixture is the committed Product Config with
      // crinkle-paper-filler-white-gold's `price` key deleted (rather than
      // set to null).
      withProductsFixture('products-price-key-absent.json', (result) => {
        expect(result.failed).toBe(false);
        const detail = readFixtureBuiltPage('products/p/crinkle-paper-filler-white-gold/index.html');
        expect(detail).toContain('Contact for price');
        const grid = readFixtureBuiltPage('products/index.html');
        expect(grid).toContain('Contact for price');
      }).then(removeFixtureOutDir),
  );
});

describe('analytics reserved slot in Site Config (built HTML seam)', () => {
  const home = readBuiltPage('index.html');
  const products = readBuiltPage('products/index.html');

  test('default config ships no analytics script tags', () => {
    expect(home).not.toMatch(/<script[^>]*analytics/i);
    expect(home).not.toMatch(/gtag\(|googletagmanager|analytics\.js|plausible/i);
    expect(products).not.toMatch(/gtag\(|googletagmanager|analytics\.js|plausible/i);
  });

  test('the reserved slot renders an explicit placeholder comment only', () => {
    // Site Config reserves the future analytics ID: null means the page ships
    // nothing but a marker comment documenting the reserved slot.
    expect(home).toMatch(/<!-- analytics reserved slot: no analytics id configured -->/);
  });
});
