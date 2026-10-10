import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

describe('Products page grid (built HTML seam)', () => {
  const html = readBuiltPage('products/index.html');

  test('renders every product from the Product Config', () => {
    expect(html).toContain('Steel Ball Bearing');
    expect(html).toContain('Stainless Steel Hex Nut');
    expect(html).toContain('Nylon Spacer');
  });

  test('renders a product image for every product', () => {
    expect(html).toMatch(/<img[^>]+src="[^"]+"/);
    // three products, three grid images
    const gridImages = html.match(/<img/g) ?? [];
    expect(gridImages.length).toBeGreaterThanOrEqual(3);
  });

  test('renders a product with an exact price as a USD value', () => {
    expect(html).toContain('$0.08');
  });

  test('renders a product with a price range as a USD range', () => {
    expect(html).toContain('$1.20');
    expect(html).toContain('$1.50');
  });

  test('renders "Contact for price" for a product with no price', () => {
    expect(html).toContain('Contact for price');
  });
});
