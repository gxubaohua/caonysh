import { describe, expect, test } from 'vitest';
import { readBuiltPage, readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';

describe('Products page grid (built HTML seam)', () => {
  const html = readBuiltPage('products/index.html');

  test('renders every product from the Product Config', () => {
    expect(html).toContain('Foil Glitter Plastic Tablecloths');
    expect(html).toContain('Crinkle Paper Filler');
    expect(html).toContain('Plant Stake Arms');
  });

  test('renders a product image for every product', () => {
    expect(html).toMatch(/<img[^>]+src="[^"]+"/);
    // three products, three grid images
    const gridImages = html.match(/<img/g) ?? [];
    expect(gridImages.length).toBeGreaterThanOrEqual(3);
  });

  test('renders every product price as an exact USD value', () => {
    // committed config: every product has a min-only price
    expect(html).toContain('$8.49');
    expect(html).toContain('$8.99');
    expect(html).toContain('$11.99');
  });

  test('renders a price range as a USD range when a product declares a max', { timeout: 10 * 60 * 1000 }, () =>
    // The committed config has no min–max product, so the range rendering
    // (spec user story 7) is covered through the fixture-seam pattern, like
    // the price-key-absent test: swap a config with a range in, rebuild into
    // the isolated outDir, assert, restore.
    withProductsFixture('products-price-range.json', (result) => {
      expect(result.failed).toBe(false);
      const grid = readFixtureBuiltPage('products/index.html');
      expect(grid).toContain('$9.99');
      expect(grid).toContain('$14.99');
    }).then(removeFixtureOutDir),
  );
});
