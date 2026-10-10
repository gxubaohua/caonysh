import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { SITE_BASE } from './site-base';

describe('Product detail page (built HTML seam)', () => {
  test('exists for each product in the Product Config', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    expect(bearing).toContain('Steel Ball Bearing');

    const nut = readBuiltPage('products/item/stainless-steel-hex-nut/index.html');
    expect(nut).toContain('Stainless Steel Hex Nut');

    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).toContain('Nylon Spacer');
  });

  test('renders a gallery image for every photo in the Product Config', () => {
    // steel-ball-bearing has 4 images in the fixture
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    const bearingImgs = bearing.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(bearingImgs.length).toBe(4);

    // nylon-spacer has 4 images, stainless-steel-hex-nut has 3
    const nut = readBuiltPage('products/item/stainless-steel-hex-nut/index.html');
    const nutImgs = nut.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(nutImgs.length).toBe(3);

    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    const spacerImgs = spacer.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(spacerImgs.length).toBe(4);
  });

  test('gallery photos are switchable via per-photo controls', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    // each gallery photo has a radio control selecting it (CSS-only switching)
    const radios = bearing.match(/<input[^>]*type="radio"[^>]*name="gallery-[^"]*"/g) ?? [];
    expect(radios.length).toBe(4);
    // the first photo is the default view
    expect(bearing).toMatch(/<input[^>]*type="radio"[^>]*checked/);
  });

  test('renders a price range for a product with min and max price', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    expect(bearing).toContain('$1.20');
    expect(bearing).toContain('$1.50');
  });

  test('renders an exact USD price for a product with only a min price', () => {
    const nut = readBuiltPage('products/item/stainless-steel-hex-nut/index.html');
    expect(nut).toContain('$0.08');
  });

  test('renders "Contact for price" for a product with no price', () => {
    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).toContain('Contact for price');
  });

  test('shows the MOQ on a product that declares one', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    // fixture: moq 1000
    expect(bearing).toMatch(/1,?000/);
    expect(bearing).toContain('MOQ');

    const nut = readBuiltPage('products/item/stainless-steel-hex-nut/index.html');
    // fixture: moq 5000
    expect(nut).toMatch(/5,?000/);
    expect(nut).toContain('MOQ');
  });

  test('does not show an MOQ on a product without one', () => {
    // fixture: nylon-spacer has moq null
    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).not.toContain('MOQ');
  });

  test('renders the Specs table as key-value rows from the Product Config', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    // fixture specs for steel-ball-bearing
    expect(bearing).toContain('Specs');
    expect(bearing).toContain('Material');
    expect(bearing).toContain('Chrome steel (GCr15)');
    expect(bearing).toContain('Bore');
    expect(bearing).toContain('10 mm');
    expect(bearing).toContain('Seal');
    expect(bearing).toContain('2RS');

    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).toContain('Nylon 66');
    expect(spacer).toContain('Inner diameter');
    expect(spacer).toContain('4 mm');
  });

  test('links the Inquiry button to the Contact page with the product name query parameter', () => {
    // The Inquiry Prefill link carries the deploy base (GLOSSARY: Deploy).
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    expect(bearing).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=Steel%20Ball%20Bearing"`),
    );
    expect(bearing).toContain('Send Inquiry');

    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=Nylon%20Spacer"`),
    );
  });

  test('has a product-specific title and meta description', () => {
    const bearing = readBuiltPage('products/item/steel-ball-bearing/index.html');
    expect(bearing).toMatch(/<title>Steel Ball Bearing \| Caonysh<\/title>/);
    expect(bearing).toMatch(
      /<meta name="description" content="Precision steel ball bearing for industrial machinery, sealed for long service life\.">/,
    );

    const spacer = readBuiltPage('products/item/nylon-spacer/index.html');
    expect(spacer).toMatch(/<title>Nylon Spacer \| Caonysh<\/title>/);
    expect(spacer).toMatch(
      /<meta name="description" content="Lightweight nylon spacer for electrical insulation and vibration damping\.">/,
    );
  });
});
