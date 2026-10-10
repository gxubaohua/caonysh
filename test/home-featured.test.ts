// Home page selling points and Featured Products (built HTML seam).
// Featured products come from Product Config in file order (user story 24,
// ADR-0004); the section is absent when no product is marked featured —
// covered by a fixture-replacement test that swaps the Product Config,
// rebuilds into an isolated outDir (the ticket-02 fixture pattern), asserts,
// then restores the committed config. Building into the shared dist/ would
// wipe pages other test files still read, making the suite order-dependent.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

const projectRoot = resolve(import.meta.dirname, '..');
const productsConfig = resolve(projectRoot, 'src/content/products.json');

/** Restore the committed Product Config via git; never leave a fixture behind. */
function restoreProductsConfig() {
  execFileSync('git', ['checkout', '--', 'src/content/products.json'], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

describe('Home page selling points and Featured Products (built HTML seam)', () => {
  const html = readBuiltPage('index.html');

  test('renders company selling points for B2B buyers', () => {
    expect(html).toMatch(/Quality/i);
    expect(html).toMatch(/MOQ/i);
  });

  test('renders the Featured Product section with the featured product from the Product Config', () => {
    expect(html).toMatch(/Featured Products?/i);
    expect(html).toContain('Steel Ball Bearing'); // the one featured fixture product
  });

  test('renders only featured products on Home; the full grid lives on the Products page', () => {
    // Hex Nut and Nylon Spacer are not featured, so they must not appear on Home.
    expect(html).not.toContain('Stainless Steel Hex Nut');
    expect(html).not.toContain('Nylon Spacer');
  });

  test('renders no Featured section when no product is marked featured', () => {
    const fixtureOutDir = resolve(projectRoot, 'dist-fixture');
    copyFileSync(resolve(projectRoot, 'test/fixtures/products-none-featured.json'), productsConfig);
    try {
      execFileSync('npx', ['astro', 'build', '--outDir', 'dist-fixture'], {
        cwd: projectRoot,
        stdio: 'ignore',
        shell: process.platform === 'win32',
      });
      const rebuiltHome = readFileSync(resolve(fixtureOutDir, 'index.html'), 'utf8');
      expect(rebuiltHome).not.toMatch(/Featured Products?/i);
      expect(rebuiltHome).not.toContain('Steel Ball Bearing');
    } finally {
      restoreProductsConfig();
      rmSync(fixtureOutDir, { recursive: true, force: true });
    }
  }, 420_000);
});
