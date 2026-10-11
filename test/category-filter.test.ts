import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';
import { SITE_BASE } from './site-base';

describe('Products page category filter (built HTML seam)', () => {
  const productsHtml = readBuiltPage('products/index.html');

  test('renders an entry linking to each non-empty category landing page', () => {
    // Internal links carry the GitHub Pages deploy base (GLOSSARY: Deploy).
    expect(productsHtml).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/tablecloths/"`));
    expect(productsHtml).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/gift-packaging/"`));
    expect(productsHtml).toMatch(new RegExp(`<a[^>]+href="${SITE_BASE}products/garden-supplies/"`));
  });

  test('labels filter entries with the category name from Category Config', () => {
    expect(productsHtml).toContain('Tablecloths');
    expect(productsHtml).toContain('Gift Packaging');
    expect(productsHtml).toContain('Garden Supplies');
  });
});
