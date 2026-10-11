// Shared test utilities. The only test seam is the built HTML under dist/
// (spec Testing Decisions), so these helpers cover: reading built pages from
// the global-setup build, and the fixture-replacement pattern (swap in a
// Product/Category Config fixture, rebuild into an isolated outDir, assert,
// always restore the committed config). Assertions on titles and meta
// descriptions read the <title>/<meta name="description"> from that HTML.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');

export { projectRoot };

export function readBuiltPage(relPath: string): string {
  return readFileSync(resolve(projectRoot, 'dist', relPath), 'utf8');
}

/** <title> text of a built page, or null when absent. */
export function pageTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null;
}

/** meta description content of a built page, or null when absent. */
export function metaDescription(html: string): string | null {
  return html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ?? null;
}

// Isolated outDir for fixture builds: never dist/, which the global-setup
// build owns and other test files read (see .gitignore).
export const FIXTURE_OUT_DIR = 'dist-fixture';

/** Restore the committed config file; never leave a test fixture behind. */
function restoreViaGit(relPath: string): void {
  execFileSync('git', ['checkout', '--', relPath], {
    cwd: projectRoot,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

export interface FixtureBuildResult {
  /** Combined stdout+stderr, or a sentinel when the build unexpectedly succeeded. */
  output: string;
  /** True when the build exited non-zero (the expected case for validation fixtures). */
  failed: boolean;
}

/**
 * Swap the committed Product Config for a fixture, rebuild into the isolated
 * outDir, and always restore the committed file — even when the assertion
 * inside `fn` throws. The fixture outDir is removed before the swap so each
 * run asserts only the pages this build produced. `fn` receives the combined
 * build output (stdout+stderr), or the sentinel 'BUILD SUCCEEDED UNEXPECTEDLY'
 * when the build unexpectedly exits zero.
 */
export async function withProductsFixture(
  fixtureName: string,
  fn: (result: FixtureBuildResult) => Promise<void> | void,
): Promise<void> {
  const productsConfig = 'src/content/products.json';
  copyFileSync(resolve(projectRoot, 'test/fixtures', fixtureName), resolve(projectRoot, productsConfig));
  rmSync(resolve(projectRoot, FIXTURE_OUT_DIR), { recursive: true, force: true });
  try {
    const result = runBuild();
    await fn(result);
  } finally {
    restoreViaGit(productsConfig);
  }
}

/** Run `astro build` into the isolated fixture outDir, capturing output. */
function runBuild(): FixtureBuildResult {
  try {
    const output = execFileSync('npx', ['astro', 'build', '--outDir', FIXTURE_OUT_DIR], {
      cwd: projectRoot,
      shell: process.platform === 'win32',
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    void output;
    return { output: 'BUILD SUCCEEDED UNEXPECTEDLY', failed: false };
  } catch (error) {
    const err = error as { stdout?: string; stderr?: Buffer | string };
    const stderr = typeof err.stderr === 'string' ? err.stderr : (err.stderr?.toString() ?? '');
    return { output: `${err.stdout ?? ''}\n${stderr}`, failed: true };
  }
}

/**
 * Swap the committed Category Config for a fixture, rebuild into the isolated
 * outDir, and always restore the committed file — even when `fn` throws.
 * `fn` receives the same build result shape as withProductsFixture.
 */
export async function withCategoriesFixture(
  fixtureName: string,
  fn: (result: FixtureBuildResult) => Promise<void> | void,
): Promise<void> {
  const categoriesConfig = 'src/content/categories.json';
  copyFileSync(resolve(projectRoot, 'test/fixtures', fixtureName), resolve(projectRoot, categoriesConfig));
  rmSync(resolve(projectRoot, FIXTURE_OUT_DIR), { recursive: true, force: true });
  try {
    const result = runBuild();
    await fn(result);
  } finally {
    restoreViaGit(categoriesConfig);
  }
}

/** Read a page from the fixture build's outDir (not dist/). */
export function readFixtureBuiltPage(relPath: string): string {
  return readFileSync(resolve(projectRoot, FIXTURE_OUT_DIR, relPath), 'utf8');
}

/** Remove the fixture build's outDir (after its pages are no longer needed). */
export function removeFixtureOutDir(): void {
  rmSync(resolve(projectRoot, FIXTURE_OUT_DIR), { recursive: true, force: true });
}
