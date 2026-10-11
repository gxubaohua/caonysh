// Build-config validation for categories, tested through the real build:
// a Product referencing a category slug that Category Config does not define
// is a config error — the build must fail and name the offending product
// (spec: "build fails, error names the offending product", ADR-0004).
// The broken fixture is injected temporarily and restored afterwards via
// git; the throwaway build writes to the shared isolated outDir
// (helpers.FIXTURE_OUT_DIR) so dist/ stays intact. A full build is slow
// (Windows + npx cold start), hence the generous timeout.
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectRoot, withProductsFixture, removeFixtureOutDir } from './helpers';

describe('Build validation: product references an undefined category (built HTML seam)', () => {
  test(
    'fails the build naming the offending product when a category slug is not defined in Category Config',
    { timeout: 10 * 60 * 1000 },
    () =>
      withProductsFixture('products-undefined-category.json', (result) => {
        expect(result.failed).toBe(true);
        expect(result.output).toContain('4 Pack Iridescent Plastic Tablecloths');
        expect(result.output.toLowerCase()).toContain('category');
      }).then(removeFixtureOutDir),
  );

  // Guard: the fixture restore worked and the committed config is intact.
  test('restores the Product Config fixture after the failure test', () => {
    const original = readFileSync(resolve(projectRoot, 'test/fixtures/products-undefined-category.json'), 'utf8');
    const restored = readFileSync(resolve(projectRoot, 'src/content/products.json'), 'utf8');
    // The restored live config must not contain the fixture's broken category.
    expect(restored).not.toBe(original);
    expect(JSON.parse(restored)[0].category).toBe('tablecloths');
  });
});
