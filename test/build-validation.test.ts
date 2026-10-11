// Build-validation seam: the astro build *process* itself. Bad Product Config
// must be rejected at build time with an error naming the offending product
// (user story 27, ADR-0004). Each test swaps in an invalid fixture, runs a
// real build as a subprocess, asserts the non-zero exit and the product name
// in stderr, and always restores the original Product Config via git.
import { describe, expect, test } from 'vitest';
import { withProductsFixture, removeFixtureOutDir } from './helpers';

// Each test runs a full `astro build` subprocess (minutes on Windows).
const BUILD_TEST_TIMEOUT = 10 * 60 * 1000;

describe('build validation of Product Config (build process seam)', () => {
  test(
    'a product with no images fails the build, naming the product',
    { timeout: BUILD_TEST_TIMEOUT },
    () =>
      withProductsFixture('products-missing-images.json', (result) => {
        expect(result.failed).toBe(true);
        expect(result.output).toContain('Brass Washer');
        expect(result.output).toMatch(/missing images/i);
      }).then(removeFixtureOutDir),
  );

  test(
    'a product with no category fails the build, naming the product',
    { timeout: BUILD_TEST_TIMEOUT },
    () =>
      withProductsFixture('products-missing-category.json', (result) => {
        expect(result.failed).toBe(true);
        expect(result.output).toContain('Brass Washer');
        expect(result.output).toMatch(/missing (a )?category/i);
      }).then(removeFixtureOutDir),
  );
});
