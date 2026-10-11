// Home page selling points and Featured Products (built HTML seam).
// Featured products come from Product Config in file order (user story 24,
// ADR-0004); the section is absent when no product is marked featured —
// covered by a fixture-replacement test that swaps the Product Config,
// rebuilds into the isolated fixture outDir (helpers.withProductsFixture),
// asserts, then restores the committed config. Building into the shared
// dist/ would wipe pages other test files still read, making the suite
// order-dependent.
import { describe, expect, test } from 'vitest';
import { readBuiltPage, readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';

describe('Home page selling points and Featured Products (built HTML seam)', () => {
  const html = readBuiltPage('index.html');

  test('renders company selling points for B2B buyers', () => {
    expect(html).toMatch(/Quality/i);
    expect(html).toMatch(/MOQ/i);
  });

  test('renders the Featured Product section with the featured products from the Product Config', () => {
    expect(html).toMatch(/Featured Products?/i);
    // nine products are marked featured in the committed config (one per listing, ADR-0006)
    expect(html).toContain('Iridescent Plastic Tablecloths Disposable Table Cover');
    expect(html).toContain('Crinkle Paper Filler for Gift Baskets Gift Boxes(White&amp;Gold)');
    expect(html).toContain('36PCS Plant Stake Arms for Tomato Cage');
  });

  test('renders no Featured section when no product is marked featured', { timeout: 420_000 }, () =>
    withProductsFixture('products-none-featured.json', (result) => {
      expect(result.failed).toBe(false);
      const rebuiltHome = readFixtureBuiltPage('index.html');
      expect(rebuiltHome).not.toMatch(/Featured Products?/i);
      expect(rebuiltHome).not.toContain('Iridescent Plastic Tablecloths Disposable Table Cover');
    }).then(removeFixtureOutDir),
  );
});
