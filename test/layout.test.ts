// Layout shell seam: every built page wraps in BaseLayout. Tests assert the
// visitor-visible furniture the spec pins down: responsive nav (hamburger
// toggle input + links), footer with Site Config company name and contact
// email, per-page title/meta description, and unique titles/descriptions
// across pages (user stories 11, 13, 19; GLOSSARY: Site Config).
import { describe, expect, test } from 'vitest';
import { readBuiltPage } from './helpers';

const home = readBuiltPage('index.html');
const products = readBuiltPage('products/index.html');
const about = readBuiltPage('about/index.html');
const pages: Record<string, string> = { home, products, about };

function pageTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1] ?? null;
}

function metaDescription(html: string): string | null {
  return html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1] ?? null;
}

describe('site-wide layout shell (built HTML seam)', () => {
  for (const [pageName, html] of Object.entries(pages)) {
    test(`${pageName}: navigates to Home, Products, About and Contact`, () => {
      expect(html).toMatch(/<a[^>]+href="\/"/);
      expect(html).toMatch(/<a[^>]+href="\/products\/"/);
      expect(html).toMatch(/<a[^>]+href="\/about\/"/);
      expect(html).toMatch(/<a[^>]+href="\/contact\/"/);
    });

    test(`${pageName}: nav is expandable on mobile (hamburger toggle)`, () => {
      expect(html).toMatch(/<input[^>]+type="checkbox"[^>]*>/);
    });

    test(`${pageName}: footer shows company name and contact email from Site Config`, () => {
      expect(html).toMatch(/<footer[^>]*>[\s\S]*Caonysh[\s\S]*service@caonysh\.com[\s\S]*<\/footer>/);
    });

    test(`${pageName}: has a non-empty title`, () => {
      const title = pageTitle(html);
      expect(title).toBeTruthy();
      expect(title!.trim().length).toBeGreaterThan(0);
    });

    test(`${pageName}: has a non-empty meta description`, () => {
      const description = metaDescription(html);
      expect(description).toBeTruthy();
      expect(description!.trim().length).toBeGreaterThan(0);
    });
  }

  test('every page title is distinct', () => {
    const titles = Object.values(pages).map(pageTitle);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test('every page meta description is distinct', () => {
    const descriptions = Object.values(pages).map(metaDescription);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});
