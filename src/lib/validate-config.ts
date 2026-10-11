// Build-time validation of Product Config against Category Config and the
// committed image files (ADR-0004: bad config must never reach production;
// errors name the offending product/category). This is the single shared
// validation entry point — the reading layer (products.ts) invokes it once
// at module load, before any page renders, so every rule added here fails
// the build with a labelled error.
//
// Module-import rule: this module reads the raw JSON configs directly and
// the resolved image map from lib/images.ts — it must not import the
// products.ts / categories.ts reading layers, so the import graph stays
// acyclic (categories.ts and products.ts import this module, never the
// reverse at runtime).
import rawProducts from '../content/products.json';
import rawCategories from '../content/categories.json';
import { productImages } from './images';
import type { Product, Category } from './products';

// The "p" path segment is reserved for product detail routes
// (/products/p/<slug>/); a Category slug of "p" would collide with it.
const DETAIL_ROUTE_SEGMENT = 'p';

/**
 * Validate the committed Product Config and Category Config. Throws an
 * Error naming the offending product or category when:
 * - a Product has no images, or an image path that resolves to no committed
 *   file under src/assets/;
 * - a Product has no category, or references a category slug that Category
 *   Config does not define;
 * - a Category slug collides with the reserved detail-route segment;
 * - a Product declares `bullets` that is not an array of non-empty strings.
 * A missing price key is *not* an error: the Price Strategy is two-state
 * and an absent key means "Contact for price", same as null (ADR-0004).
 */
export function validateProductConfig(): void {
  const problems: string[] = [];
  const products = rawProducts as Product[];
  const categories = rawCategories as Category[];

  const definedCategorySlugs = new Set(categories.map((category) => category.slug));

  for (const category of categories) {
    if (category.slug === DETAIL_ROUTE_SEGMENT) {
      problems.push(
        `Category "${category.name}" uses slug "${DETAIL_ROUTE_SEGMENT}", which is reserved for product detail routes (/products/${DETAIL_ROUTE_SEGMENT}/<slug>/) — pick another slug.`,
      );
    }
  }

  for (const product of products) {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      problems.push(`Product '${product.name}' is missing images`);
    } else {
      for (const imagePath of product.images) {
        if (!productImages[imagePath]) {
          problems.push(
            `Product '${product.name}' references image "${imagePath}", which does not exist under src/assets/ (check the path spelling).`,
          );
        }
      }
    }
    if (typeof product.category !== 'string' || product.category.trim() === '') {
      problems.push(`Product '${product.name}' is missing a category`);
    } else if (!definedCategorySlugs.has(product.category)) {
      problems.push(
        `Product "${product.name}" references category "${product.category}", which is not defined in Category Config (src/content/categories.json).`,
      );
    }
    if (
      product.bullets !== undefined &&
      (!Array.isArray(product.bullets) ||
        product.bullets.some((bullet) => typeof bullet !== 'string' || bullet.trim() === ''))
    ) {
      problems.push(
        `Product '${product.name}' declares bullets that is not an array of non-empty strings.`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Invalid Product Config (src/content/products.json):\n${problems.join('\n')}`,
    );
  }
}
