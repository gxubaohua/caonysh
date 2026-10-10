import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { SITE_BASE } from './site-base';

describe('Home page (built HTML seam)', () => {
  const html = readBuiltPage('index.html');

  test('renders the site name from Site Config', () => {
    expect(html).toContain('Caonysh');
  });

  test('links to the Products grid page', () => {
    // Internal links carry the GitHub Pages deploy base (GLOSSARY: Deploy).
    expect(html).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/?"`));
  });
});
