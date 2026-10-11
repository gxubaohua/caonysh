// Display-order seam: built HTML. The order products appear in the Products
// grid must equal the array order inside the Product Config file (user story
// 23, ADR-0004: no order field, file order is display order). The test swaps
// in a fixture whose order deliberately differs from the committed config,
// builds to the isolated fixture outDir (helpers.withProductsFixture), and
// compares first-occurrence positions of each product name in the rendered
// HTML against the fixture's file order.
import { describe, expect, test } from 'vitest';
import { readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';

describe('Product display order equals Product Config file order (built HTML seam)', () => {
  test('products render in the order they appear in the JSON array', { timeout: 10 * 60 * 1000 }, () =>
    withProductsFixture('products-shuffled-order.json', (result) => {
      // Fixture order: Plant Stake Arms, Foil Glitter Plastic Tablecloths,
      // Crinkle Paper Filler (deliberately different from the committed
      // config order).
      expect(result.failed).toBe(false);
      const fixtureOrder = ['Plant Stake Arms', 'Foil Glitter Plastic Tablecloths', 'Crinkle Paper Filler'];

      const html = readFixtureBuiltPage('products/index.html');
      const positions = fixtureOrder.map((name) => html.indexOf(name));
      expect(positions.every((pos) => pos !== -1)).toBe(true);
      // Positions must be strictly increasing in file order.
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    }).then(removeFixtureOutDir),
  );
});
