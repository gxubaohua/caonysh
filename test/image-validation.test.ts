// Review-fix test (build process seam): a Product Config image path that
// points at a file which does not exist must fail the build naming the
// offending product (spec a-4 / user story 27: bad config never reaches
// production, errors name the product). Without this check Astro's asset
// pipeline throws an unlabelled internal error.
import { describe, expect, test } from 'vitest';
import { withProductsFixture, removeFixtureOutDir } from './helpers';

describe('image path validation (build process seam)', () => {
  test(
    'an image path pointing at a missing file fails the build, naming the product',
    { timeout: 10 * 60 * 1000 },
    () =>
      // Fixture: committed Product Config with a typo'd second image path on
      // crinkle-paper-filler.
      withProductsFixture('products-image-typo.json', (result) => {
        expect(result.failed).toBe(true);
        expect(result.output).toContain('Crinkle Paper Filler');
        expect(result.output).toMatch(/crinkle-paper-filler-typo\.jpg/);
      }).then(removeFixtureOutDir),
  );
});
