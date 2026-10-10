// Build-time validation of Product Config against Category Config (ADR-0004:
// bad config must never reach production; errors name the offending product).
// Kept in src/lib/ as the single shared validation entry point so validation
// rules added by other tickets (e.g. missing images) can live in one place.
import { products } from './products';
import { categories } from './categories';

export function validateProductConfig(): void {
  const definedCategorySlugs = new Set(categories.map((category) => category.slug));

  for (const product of products) {
    if (!definedCategorySlugs.has(product.category)) {
      throw new Error(
        `Product "${product.name}" references category "${product.category}", which is not defined in Category Config (src/content/categories.json).`,
      );
    }
  }
}
