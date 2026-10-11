import { describe, expect, test } from 'vitest';
import { readBuiltPage, readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';
import { SITE_BASE } from './site-base';

describe('Product detail page (built HTML seam)', () => {
  // Fix 3 (review): detail pages render inside BaseLayout, so they carry the
  // site nav/footer and the dead-end navigation disappears.
  test('adopts the BaseLayout shell: nav and footer furniture', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}about/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}contact/"`));
    expect(tablecloths).toMatch(/<footer[^>]*>[\s\S]*service@caonysh\.com[\s\S]*<\/footer>/);
  });

  test('exists for each product in the Product Config', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).toContain('Foil Glitter Plastic Tablecloths');

    const filler = readBuiltPage('products/p/crinkle-paper-filler/index.html');
    expect(filler).toContain('Crinkle Paper Filler');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms/index.html');
    expect(stakeArms).toContain('Plant Stake Arms');
  });

  test('renders a gallery image for every photo in the Product Config', () => {
    // every product in the committed config has 4 images
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    const tableclothsImgs = tablecloths.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(tableclothsImgs.length).toBe(4);

    const filler = readBuiltPage('products/p/crinkle-paper-filler/index.html');
    const fillerImgs = filler.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(fillerImgs.length).toBe(4);

    const stakeArms = readBuiltPage('products/p/plant-stake-arms/index.html');
    const stakeArmsImgs = stakeArms.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(stakeArmsImgs.length).toBe(4);
  });

  test('gallery photos are switchable via per-photo controls', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    // each gallery photo has a radio control selecting it (CSS-only switching)
    const radios = tablecloths.match(/<input[^>]*type="radio"[^>]*name="gallery-[^"]*"/g) ?? [];
    expect(radios.length).toBe(4);
    // the first photo is the default view
    expect(tablecloths).toMatch(/<input[^>]*type="radio"[^>]*checked/);
  });

  test('renders a price range for a product with min and max price', { timeout: 10 * 60 * 1000 }, () =>
    // The committed config has no min–max product, so the range rendering on
    // the detail page is covered through the fixture-seam pattern: swap a
    // config with a range in, rebuild into the isolated outDir, assert,
    // restore.
    withProductsFixture('products-price-range.json', (result) => {
      expect(result.failed).toBe(false);
      const stakeArms = readFixtureBuiltPage('products/p/plant-stake-arms/index.html');
      expect(stakeArms).toContain('$9.99');
      expect(stakeArms).toContain('$14.99');
    }).then(removeFixtureOutDir),
  );

  test('renders an exact USD price for a product with only a min price', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).toContain('$8.49');

    const filler = readBuiltPage('products/p/crinkle-paper-filler/index.html');
    expect(filler).toContain('$8.99');
  });

  test('does not show an MOQ when the product declares none', () => {
    // committed config: no product declares an MOQ
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).not.toContain('MOQ');
  });

  test('renders the Specs table as key-value rows from the Product Config', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    // committed specs for foil-glitter-tablecloths
    expect(tablecloths).toContain('Specs');
    expect(tablecloths).toContain('Size');
    expect(tablecloths).toContain('54 x 108 in (rectangle)');
    expect(tablecloths).toContain('Pack');
    expect(tablecloths).toContain('4 tablecloths');
    expect(tablecloths).toContain('Colors');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms/index.html');
    expect(stakeArms).toContain('36 arms');
    expect(stakeArms).toContain('11.8 in (30 cm)');
    expect(stakeArms).toContain('11 mm');
  });

  test('links the Inquiry button to the Contact page with the product name query parameter', () => {
    // The Inquiry Prefill link carries the deploy base (GLOSSARY: Deploy).
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=Foil%20Glitter%20Plastic%20Tablecloths"`),
    );
    expect(tablecloths).toContain('Send Inquiry');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms/index.html');
    expect(stakeArms).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=Plant%20Stake%20Arms"`),
    );
  });

  test('has a product-specific title and meta description', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloths/index.html');
    expect(tablecloths).toMatch(/<title>Foil Glitter Plastic Tablecloths \| Caonysh<\/title>/);
    expect(tablecloths).toMatch(
      /<meta name="description" content="Disposable foil-glitter plastic tablecloths for rectangle banquet tables, available in seven colors for parties, weddings, and holiday events\.">/,
    );

    const filler = readBuiltPage('products/p/crinkle-paper-filler/index.html');
    expect(filler).toMatch(/<title>Crinkle Paper Filler \| Caonysh<\/title>/);
    expect(filler).toMatch(
      /<meta name="description" content="Crinkle-cut shredded paper filler for gift baskets and gift boxes, adding cushioning and decorative fill in white and gold\.">/,
    );
  });
});
