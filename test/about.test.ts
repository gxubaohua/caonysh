// About page seam: placeholder company introduction for visitor trust
// (user story 33).
import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

describe('About page (built HTML seam)', () => {
  const html = readBuiltPage('about/index.html');

  test('renders a company introduction', () => {
    expect(html).toMatch(/<h1[^>]*>.*About/i);
    expect(html).toContain('Caonysh');
    expect(html).toMatch(/(sourcing|manufactur|supplier|partner)/i);
  });

  test('has a page-specific title and description', () => {
    expect(pageTitle(html)).toMatch(/About/);
    expect(metaDescription(html)).toBeTruthy();
  });
});

function pageTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null;
}

function metaDescription(html: string): string | null {
  return html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ?? null;
}
