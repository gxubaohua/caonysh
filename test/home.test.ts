import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

describe('Home page (built HTML seam)', () => {
  const html = readBuiltPage('index.html');

  test('renders the site name from Site Config', () => {
    expect(html).toContain('Caonysh');
  });

  test('links to the Products grid page', () => {
    expect(html).toMatch(/<a[^>]+href="\/products\/?"/);
  });
});
