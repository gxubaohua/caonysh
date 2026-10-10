// Resolves Product Config image paths (relative to src/content/products.json)
// to the ESM-imported image objects Astro's asset pipeline optimizes into
// WebP at build time. Files live in src/assets/ (committed to the repo).
//
// This module must import through Vite (it uses import.meta.glob), so tests
// exercise it only through the built HTML seam, never directly.
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/*.{png,jpg,jpeg,webp}', { eager: true });

const resolved: Record<string, ImageMetadata> = {};
for (const [importerPath, mod] of Object.entries(images)) {
  resolved[importerPath] = mod.default;
}

// Map from Product Config image path (relative to src/content/) to image object.
const imageMap: Record<string, ImageMetadata> = {};
for (const [importerPath, image] of Object.entries(resolved)) {
  // importerPath like '../assets/foo.png' (relative to this file in src/lib/)
  // Product Config stores paths relative to src/content/products.json,
  // i.e. '../assets/foo.png'. Both resolve to the same project-relative file.
  imageMap[importerPath] = image;
}

export const productImages: Record<string, ImageMetadata> = imageMap;
