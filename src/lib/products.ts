// Product Config loading layer: reads the single JSON array that is the
// source of truth for products (ADR-0001). Array order is display order.
// Price is the two-state Price Strategy (ADR-0004): a filled object with
// min (and optional max) USD values, or empty — null *or a missing key* —
// both meaning "Contact for price". Validation of the config lives in
// validate-config.ts and runs once at module load, before any page renders.
import rawProducts from '../content/products.json';
import { validateProductConfig } from './validate-config';

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
  // Bullet Points (GLOSSARY): verbatim selling points rendered as a list on
  // the detail page only. Optional; absent key renders no list.
  bullets?: string[];
  // Two-state Price Strategy (ADR-0004). Optional at runtime: a missing key
  // in Product Config means the same as null — "Contact for price".
  price?: Price | null;
  moq?: number | null;
  featured?: boolean;
  specs?: Record<string, string>;
}

// Build-time validation (ADR-0004): missing images, unresolvable image
// paths, or missing/undefined categories fail the build here, in the
// reading layer, naming the offending product so bad Product Config never
// reaches production. Array order is display order; no re-sorting happens
// below. Invoked at module load — every page imports this module.
validateProductConfig();

export const products: Product[] = rawProducts;

/**
 * Render a Price Strategy value for display (ADR-0004). A filled price
 * renders as an exact USD value or a range; empty input — null or a
 * missing key (undefined) — renders "Contact for price".
 */
export function formatPrice(price: Price | null | undefined): string {
  if (price == null) {
    return 'Contact for price';
  }
  const usd = (value: number) =>
    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price.max !== undefined) {
    return `${usd(price.min)}–${usd(price.max)}`;
  }
  return usd(price.min);
}
