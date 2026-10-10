import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

// Build the real site once before any test runs, so tests can assert on the
// public seam only: the generated HTML under dist/.
//
// Fixture-replacement tests (ticket 05 Home "no featured products" branch,
// following the ticket 02 pattern) rebuild with a swapped Product Config.
// Restoring by rebuilding is too slow on this machine, so global-setup also
// snapshots the committed-config Home HTML to test/baseline-dist/ for those
// tests to restore dist/index.html from after mutating fixtures.
const projectRoot = resolve(import.meta.dirname, '..');
const distDir = resolve(projectRoot, 'dist');
const baselineDir = resolve(projectRoot, 'test/baseline-dist');

export default function setup() {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }
  execFileSync('npx', ['astro', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  mkdirSync(baselineDir, { recursive: true });
  copyFileSync(resolve(distDir, 'index.html'), resolve(baselineDir, 'index.html'));
}
