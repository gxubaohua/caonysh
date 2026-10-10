import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

describe('Home page (built HTML seam)', () => {
  test('renders the site name from Site Config', () => {
    const html = readBuiltPage('index.html');
    expect(html).toContain('Caonysh');
  });
});
