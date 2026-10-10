// Display-order seam: built HTML. The order products appear in the Products
// grid must equal the array order inside the Product Config file (user story
// 23, ADR-0004: no order field, file order is display order). The test swaps
// in a fixture whose order deliberately differs from the committed config,
// builds to an isolated outDir, and compares first-occurrence positions of
// each product name in the rendered HTML against the fixture's file order.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

const projectRoot = resolve(import.meta.dirname, '..');
const productsConfig = resolve(projectRoot, 'src/content/products.json');
const fixturePath = resolve(projectRoot, 'test/fixtures/products-shuffled-order.json');
const fixtureOutDir = resolve(projectRoot, 'dist-fixture');

/** Restore the committed Product Config; never leave a test fixture in the repo. */
function restoreProductsConfig() {
  execFileSync('git', ['checkout', '--', 'src/content/products.json'], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

afterEach(() => {
  restoreProductsConfig();
});

describe('Product display order equals Product Config file order (built HTML seam)', () => {
  test('products render in the order they appear in the JSON array', { timeout: 10 * 60 * 1000 }, () => {
    // Fixture order: Nylon Spacer, Steel Ball Bearing, Stainless Steel Hex Nut
    // (deliberately different from the committed config order).
    const fixtureOrder = ['Nylon Spacer', 'Steel Ball Bearing', 'Stainless Steel Hex Nut'];

    copyFileSync(fixturePath, productsConfig);
    try {
      execFileSync('npx', ['astro', 'build', '--outDir', 'dist-fixture'], {
        cwd: projectRoot,
        shell: process.platform === 'win32',
        stdio: 'inherit',
      });
    } finally {
      restoreProductsConfig();
    }

    const html = readFileSync(resolve(fixtureOutDir, 'products/index.html'), 'utf8');
    const positions = fixtureOrder.map((name) => html.indexOf(name));
    expect(positions.every((pos) => pos !== -1)).toBe(true);
    // Positions must be strictly increasing in file order.
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    rmSync(fixtureOutDir, { recursive: true, force: true });
  });
});
