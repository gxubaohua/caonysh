import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');

export { projectRoot };

export function readBuiltPage(relPath: string): string {
  return readFileSync(resolve(projectRoot, 'dist', relPath), 'utf8');
}
