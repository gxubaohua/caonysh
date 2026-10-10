import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

// Build the real site once before any test runs, so tests can assert on the
// public seam only: the generated HTML under dist/.
const projectRoot = resolve(import.meta.dirname, '..');
const distDir = resolve(projectRoot, 'dist');

export default function setup() {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }
  execFileSync('npx', ['astro', 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}
