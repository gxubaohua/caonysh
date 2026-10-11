import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

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

  test('renders a product with an exact price as a USD value', () => {
    expect(html).toContain('$8.99');
  });

  test('renders a product with a price range as a USD range', () => {
    expect(html).toContain('$7.98');
    expect(html).toContain('$8.49');
  });
});
