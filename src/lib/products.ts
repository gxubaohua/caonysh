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
}

export const products: Product[] = rawProducts;

export function formatPrice(price: Price): string {
  const usd = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price.max !== undefined) {
    return `${usd(price.min)}–${usd(price.max)}`;
  }
  return usd(price.min);
}
