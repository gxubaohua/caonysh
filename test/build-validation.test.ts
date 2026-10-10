// Build-validation seam: the astro build *process* itself. Bad Product Config
// must be rejected at build time with an error naming the offending product
// (user story 27, ADR-0004). Each test swaps in an invalid fixture, runs a
// real build as a subprocess, asserts the non-zero exit and the product name
// in stderr, and always restores the original Product Config via git.
import { execFileSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const productsConfig = resolve(projectRoot, 'src/content/products.json');
const fixtures = resolve(projectRoot, 'test/fixtures');

// Each test runs a full `astro build` subprocess (minutes on Windows).
const BUILD_TEST_TIMEOUT = 10 * 60 * 1000;

/** Restore the committed Product Config; never leave a bad fixture in the repo. */
function restoreProductsConfig() {
  execFileSync('git', ['checkout', '--', 'src/content/products.json'], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

/**
 * Run a real `astro build` against a fixture Product Config.
 * Output goes to dist-fixture/ so the main dist/ built by global-setup for
 * other test files is never clobbered. Returns combined stdout+stderr.
 */
function buildWithFixture(fixtureName: string): string {
  copyFileSync(resolve(fixtures, fixtureName), productsConfig);
  try {
    execFileSync('npx', ['astro', 'build', '--outDir', 'dist-fixture'], {
      cwd: projectRoot,
      shell: process.platform === 'win32',
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    const err = error as { stdout?: string; stderr?: string };
    return `${err.stdout ?? ''}\n${err.stderr ?? ''}`;
  }
  // Build unexpectedly succeeded — sentinel that fails every assertion below.
  return 'BUILD SUCCEEDED UNEXPECTEDLY';
}

afterEach(() => {
  restoreProductsConfig();
});

describe('build validation of Product Config (build process seam)', () => {
  test('a product with no images fails the build, naming the product', { timeout: BUILD_TEST_TIMEOUT }, () => {
    const output = buildWithFixture('products-missing-images.json');

    expect(output).not.toBe('BUILD SUCCEEDED UNEXPECTEDLY');
    expect(output).toContain('Brass Washer');
    expect(output).toMatch(/missing images/i);
  });

  test('a product with no category fails the build, naming the product', { timeout: BUILD_TEST_TIMEOUT }, () => {
    const output = buildWithFixture('products-missing-category.json');

    expect(output).not.toBe('BUILD SUCCEEDED UNEXPECTEDLY');
    expect(output).toContain('Brass Washer');
    expect(output).toMatch(/missing (a )?category/i);
  });
});
