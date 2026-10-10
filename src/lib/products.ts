// Product Config loading layer: reads the single JSON array that is the
// source of truth for products (ADR-0001). Array order is display order;
// price is a two-state strategy: an object with min (and optional max) USD
// values, or null meaning "Contact for price" (ADR-0004).
import rawProducts from '../content/products.json';

export interface Price {
  min: number;
  max?: number;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  images: string[];
  description: string;
  price: Price | null;
  moq?: number | null;
  featured?: boolean;
  specs?: Record<string, string>;
}

// Build-time validation (ADR-0004): a Product missing images or a category
// fails the build here, in the reading layer, naming the offending product so
// bad Product Config never reaches production. Array order is display order;
// no re-sorting happens below.
function validateProducts(productsToCheck: Product[]): void {
  const problems: string[] = [];
  for (const product of productsToCheck) {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      problems.push(`Product '${product.name}' is missing images`);
    }
    if (typeof product.category !== 'string' || product.category.trim() === '') {
      problems.push(`Product '${product.name}' is missing a category`);
    }
  }
  if (problems.length > 0) {
    throw new Error(
      `Invalid Product Config (src/content/products.json):\n${problems.join('\n')}`
    );
  }
}

validateProducts(rawProducts);

export const products: Product[] = rawProducts;

export function formatPrice(price: Price): string {
  const usd = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price.max !== undefined) {
    return `${usd(price.min)}–${usd(price.max)}`;
  }
  return usd(price.min);
}
