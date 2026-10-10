// Category loading layer: reads the Category Config JSON array that is the
// source of truth for categories (ADR-0001). A Category owns a landing page
// at /products/<slug>/ with optional description copy (ADR-0004). Categories
// with no products are hidden at build time — no route, no filter entry
// (GLOSSARY: Category, ADR-0004).
import rawCategories from '../content/categories.json';
import { products } from './products';
import { validateProductConfig } from './validate-config';

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

export const categories: Category[] = rawCategories;

// Build-time guard (ADR-0004): a Product whose category references a slug
// that Category Config does not define fails the build, naming the product.
// Runs once at module load, before any page renders.
validateProductConfig();

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
