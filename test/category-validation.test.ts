import { describe, expect, test } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectRoot } from './helpers';

// Build-config validation for categories, tested through the real build:
// a Product referencing a category slug that Category Config does not define
// is a config error — the build must fail and name the offending product
// (spec: "build fails, error names the offending product", ADR-0004).
// The broken fixture is injected temporarily and restored afterwards; the
// throwaway build writes to a scratch outDir so dist/ stays intact.
// A full build is slow (Windows + npx cold start), hence the generous timeout.
const productsJsonPath = resolve(projectRoot, 'src/content/products.json');
const originalProductsJson = readFileSync(productsJsonPath, 'utf8');
const BUILD_TIMEOUT_MS = 10 * 60 * 1000;

function runBuild(outDir: string): { status: number; stderr: string } {
  try {
    execFileSync('npx', ['astro', 'build', '--outDir', outDir], {
      cwd: projectRoot,
      shell: process.platform === 'win32',
      stdio: 'pipe',
    });
    return { status: 0, stderr: '' };
  } catch (error) {
    const err = error as { status?: number; stderr?: Buffer | string };
    return {
      status: err.status ?? 1,
      stderr: (err.stderr ? err.stderr.toString() : '') + String((error as Error).message ?? ''),
    };
  }
}

describe('Build validation: product references an undefined category (built HTML seam)', () => {
  const outDir = resolve(projectRoot, 'dist-validation-run');

  test(
    'fails the build naming the offending product when a category slug is not defined in Category Config',
    () => {
      const broken = JSON.parse(originalProductsJson) as Array<{ category: string }>;
      broken[0].category = 'no-such-category';
      try {
        writeFileSync(productsJsonPath, JSON.stringify(broken, null, 2));
        const result = runBuild(outDir);
        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain('Steel Ball Bearing');
        expect(result.stderr.toLowerCase()).toContain('category');
      } finally {
        writeFileSync(productsJsonPath, originalProductsJson);
        if (existsSync(outDir)) {
          rmSync(outDir, { recursive: true, force: true });
        }
      }
    },
    BUILD_TIMEOUT_MS,
  );

  // Guard: the fixture restore worked and the original config is intact.
  test('restores the Product Config fixture after the failure test', () => {
    expect(readFileSync(productsJsonPath, 'utf8')).toBe(originalProductsJson);
  });
});
