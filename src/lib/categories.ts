// Category loading layer: reads the Category Config JSON array that is the
// source of truth for categories (ADR-0001). A Category owns a landing page
// at /products/<slug>/ with optional description copy (ADR-0004). Categories
// with no products are hidden at build time — no route, no filter entry
// (GLOSSARY: Category, ADR-0004). Config validation (including the reserved
// "p" slug guard for detail routes) lives in validate-config.ts and runs
// once at Product Config load; this module imports products.ts, which
// triggers it, and must not import validate-config itself (acyclic imports).
import rawCategories from '../content/categories.json';
import { products } from './products';

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

export const categories: Category[] = rawCategories;

// Categories visible on the site: exactly those with at least one Product.
// Array order is Category Config file order.
export const nonEmptyCategories: Category[] = categories.filter(
  (category) => products.some((product) => product.category === category.slug),
);

export function productsInCategory(slug: string) {
  // Product Config file order is preserved (display order, ADR-0004).
  return products.filter((product) => product.category === slug);
}

export function categoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
