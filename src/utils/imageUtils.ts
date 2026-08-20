/**
 * Product image utilities for local image storage.
 *
 * Local images live in /public/product_images/ and are served at /product_images/{name}.
 *
 * Naming convention:
 *   - Main product image:    /product_images/{productId}.jpg
 *   - Gallery image:         /product_images/{productId}-{index}.jpg  (0-based)
 *   - Category image:        /product_images/cat-{slug}.jpg
 *
 * HOW TO ADD A LOCAL IMAGE:
 * 1. Use the admin panel to upload images (automatic integration)
 * 2. Or manually drop files in public/product_images/ using the naming convention above.
 * 3. The app will serve local images with automatic fallback to remote URLs.
 */

// Register product IDs that have a local main image in /public/product_images/
export const LOCAL_PRODUCT_IMAGES = new Set<string>([
  // Example: 'nest-dw-01' would look for /product_images/nest-dw-01.jpg
]);

// key: "{productId}-{galleryIndex}" (0-based)
export const LOCAL_GALLERY_IMAGES = new Set<string>([
  // Example: 'nest-dw-01-0' would look for /product_images/nest-dw-01-0.jpg
]);

// Register category slugs that have a local image
export const LOCAL_CATEGORY_IMAGES = new Set<string>([
  // Example: 'dinnerware' would look for /product_images/cat-dinnerware.jpg
]);

/** 
 * Returns the src for a product's main image. 
 * If the value starts with /product_images/, it's already local - use it directly.
 * Otherwise check if registered, then fallback to remote URL.
 */
export function getProductImage(productId: string, fallbackUrl: string): string {
  if (fallbackUrl.startsWith('/product_images/')) {
    return fallbackUrl; // Already a local path from admin upload
  }
  if (LOCAL_PRODUCT_IMAGES.has(productId)) {
    return `/product_images/${productId}.jpg`;
  }
  return fallbackUrl;
}

/** Returns the src for a gallery image at a specific index (0-based). */
export function getProductGalleryImage(productId: string, index: number, fallbackUrl: string): string {
  if (fallbackUrl.startsWith('/product_images/')) {
    return fallbackUrl; // Already a local path from admin upload
  }
  if (LOCAL_GALLERY_IMAGES.has(`${productId}-${index}`)) {
    return `/product_images/${productId}-${index}.jpg`;
  }
  return fallbackUrl;
}

/** Returns the src for a category image. */
export function getCategoryImage(slug: string, fallbackUrl: string): string {
  if (fallbackUrl.startsWith('/product_images/')) {
    return fallbackUrl; // Already a local path from admin upload
  }
  if (LOCAL_CATEGORY_IMAGES.has(slug)) {
    return `/product_images/cat-${slug}.jpg`;
  }
  return fallbackUrl;
}

/** Resolves a full gallery array, applying local overrides where registered. */
export function resolveGalleryImages(productId: string, galleryUrls: string[]): string[] {
  return galleryUrls.map((url, index) => getProductGalleryImage(productId, index, url));
}

/**
 * onError handler for <img> elements.
 * When a local image 404s, swaps src to the data-fallback attribute.
 * Usage: <img src={localSrc} data-fallback={remoteUrl} onError={handleImageError} />
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  const fallback = img.getAttribute('data-fallback');
  if (fallback && img.src !== fallback) {
    img.src = fallback;
  }
}
