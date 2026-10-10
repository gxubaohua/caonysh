import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectRoot } from './helpers';

const productsHtml = readBuiltPage('products/index.html');

describe('Products page category filter (built HTML seam)', () => {
  test('renders an entry linking to each non-empty category landing page', () => {
    expect(productsHtml).toMatch(/<a[^>]+href="\/products\/bearings\/"/);
    expect(productsHtml).toMatch(/<a[^>]+href="\/products\/fasteners\/"/);
    expect(productsHtml).toMatch(/<a[^>]+href="\/products\/gaskets\/"/);
  });

  test('labels filter entries with the category name from Category Config', () => {
    expect(productsHtml).toContain('Bearings');
    expect(productsHtml).toContain('Fasteners');
    expect(productsHtml).toContain('Gaskets');
  });
});

describe('Empty category hiding (built HTML seam)', () => {
  const emptyCategorySlug = 'rotary-seals';

  test('generates no route for the empty category', () => {
    const emptyDir = resolve(projectRoot, 'dist', 'products', emptyCategorySlug);
    expect(existsSync(emptyDir)).toBe(false);
  });

  test('keeps the empty category out of the Products page filter', () => {
    expect(productsHtml).not.toContain(emptyCategorySlug);
    expect(productsHtml).not.toContain('Rotary Seals');
  });
});
