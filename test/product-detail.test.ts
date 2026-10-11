import { describe, expect, test } from 'vitest';
import { readBuiltPage, readFixtureBuiltPage, withProductsFixture, removeFixtureOutDir } from './helpers';
import { SITE_BASE } from './site-base';

describe('Product detail page (built HTML seam)', () => {
  // Fix 3 (review): detail pages render inside BaseLayout, so they carry the
  // site nav/footer and the dead-end navigation disappears.
  test('adopts the BaseLayout shell: nav and footer furniture', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}about/"`));
    expect(tablecloths).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}contact/"`));
    expect(tablecloths).toMatch(/<footer[^>]*>[\s\S]*service@caonysh\.com[\s\S]*<\/footer>/);
  });

  test('exists for each product in the Product Config', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).toContain('Iridescent Plastic Tablecloths Disposable Table Cover');

    const filler = readBuiltPage('products/p/crinkle-paper-filler-white-gold/index.html');
    expect(filler).toContain('Crinkle Paper Filler for Gift Baskets Gift Boxes(White&amp;Gold)');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms-36-pcs/index.html');
    expect(stakeArms).toContain('36PCS Plant Stake Arms for Tomato Cage');
  });

  test('renders a gallery image for every photo in the Product Config', () => {
    // committed config image counts (ADR-0006): iridescent 7, white-gold 8,
    // stakes 5 — the verbatim Amazon galleries capped at the CSS-switchable 8
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    const tableclothsImgs = tablecloths.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(tableclothsImgs.length).toBe(7);

    const filler = readBuiltPage('products/p/crinkle-paper-filler-white-gold/index.html');
    const fillerImgs = filler.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(fillerImgs.length).toBe(8);

    const stakeArms = readBuiltPage('products/p/plant-stake-arms-36-pcs/index.html');
    const stakeArmsImgs = stakeArms.match(/<img[^>]*class="[^"]*\bgallery-image\b[^"]*"/g) ?? [];
    expect(stakeArmsImgs.length).toBe(5);
  });

  test('gallery photos are switchable via per-photo controls', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    // each gallery photo has a radio control selecting it (CSS-only switching)
    const radios = tablecloths.match(/<input[^>]*type="radio"[^>]*name="gallery-[^"]*"/g) ?? [];
    expect(radios.length).toBe(7);
    // the first photo is the default view
    expect(tablecloths).toMatch(/<input[^>]*type="radio"[^>]*checked/);
  });

  test('renders the verbatim Amazon Bullet Points as a list (ADR-0006)', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    // the five bullets from the Amazon listing, rendered as <ul class="bullets">
    expect(tablecloths).toMatch(/<ul class="bullets"/);
    const bulletItems = tablecloths.match(/<li[^>]*>Fits Most Standard Tables[\s\S]*?<\/li>/g) ?? [];
    expect(bulletItems.length).toBe(1);
    expect(tablecloths).toContain('Disposable Table Cloth: Combines convenience with elegance');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms-36-pcs/index.html');
    expect(stakeArms).toContain('Package includes 36 pcs tomato cage connectors');
  });

  test('renders a price range for a product with min and max price', { timeout: 10 * 60 * 1000 }, () =>
    // The committed config has no min–max product, so the range rendering on
    // the detail page is covered through the fixture-seam pattern: swap a
    // config with a range in, rebuild into the isolated outDir, assert,
    // restore.
    withProductsFixture('products-price-range.json', (result) => {
      expect(result.failed).toBe(false);
      // the fixture gives plant-stake-arms-60-pcs a 9.99–14.99 range
      const stakeArms = readFixtureBuiltPage('products/p/plant-stake-arms-60-pcs/index.html');
      expect(stakeArms).toContain('$9.99');
      expect(stakeArms).toContain('$14.99');
    }).then(removeFixtureOutDir),
  );

  test('renders an exact USD price for a product with only a min price', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).toContain('$7.89');

    const filler = readBuiltPage('products/p/crinkle-paper-filler-white-gold/index.html');
    expect(filler).toContain('$8.99');
  });

  test('does not show an MOQ when the product declares none', () => {
    // committed config: no product declares an MOQ
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).not.toContain('MOQ');
  });

  test('renders the Specs table as key-value rows from the Product Config', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    // committed specs for foil-glitter-tablecloth-iridescent
    expect(tablecloths).toContain('Specs');
    expect(tablecloths).toContain('Size');
    expect(tablecloths).toContain('54 x 108 in (rectangle)');
    expect(tablecloths).toContain('Pack');
    expect(tablecloths).toContain('4 tablecloths');
    expect(tablecloths).toContain('Color');
    expect(tablecloths).toContain('Iridescent');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms-36-pcs/index.html');
    expect(stakeArms).toContain('36 arms');
    expect(stakeArms).toContain('11.8 in (30 cm)');
    expect(stakeArms).toContain('11 mm');
  });

  test('links the Inquiry button to the Contact page with the product name query parameter', () => {
    // The Inquiry Prefill link carries the deploy base (GLOSSARY: Deploy).
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=4%20Pack%20Iridescent%20Plastic%20Tablecloths%20Disposable%20Table%20Cover%2054%20x%20108%20In"`),
    );
    expect(tablecloths).toContain('Send Inquiry');

    const stakeArms = readBuiltPage('products/p/plant-stake-arms-36-pcs/index.html');
    // the prefill carries the full encoded Amazon title (the full-width
    // comma encodes as %EF%BC%8C); assert through the first phrase only
    expect(stakeArms).toMatch(
      new RegExp(`<a[^>]+href="${SITE_BASE}contact\\?product=36PCS%20Plant%20Stake%20Arms%20for%20Tomato%20Cage%EF%BC%8CExpandable`),
    );
  });

  test('has a product-specific title and meta description', () => {
    const tablecloths = readBuiltPage('products/p/foil-glitter-tablecloth-iridescent/index.html');
    expect(tablecloths).toMatch(/<title>4 Pack Iridescent Plastic Tablecloths Disposable Table Cover 54 x 108 In \| Caonysh<\/title>/);
    expect(tablecloths).toMatch(
      /<meta name="description" content="Iridescent disposable plastic tablecloths with a sparkly metallic finish, 54 x 108 in rectangle, 4 pack, for parties, weddings, and holiday events\.">/,
    );

    const filler = readBuiltPage('products/p/crinkle-paper-filler-white-gold/index.html');
    expect(filler).toMatch(/<title>Caonysh 8\.5oz Crinkle Paper Filler for Gift Baskets Gift Boxes\(White&amp;Gold\) \| Caonysh<\/title>/);
    expect(filler).toMatch(
      /<meta name="description" content="Crinkle-cut shredded paper filler in white &amp; gold, 8\.5 oz, for stuffing gift baskets and gift boxes with cushioning and decorative fill\.">/,
    );
  });
});
