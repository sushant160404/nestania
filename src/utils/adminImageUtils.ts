/**
 * Admin utilities for managing local product images.
 * 
 * When images are uploaded through the admin panel, they should be automatically
 * registered so they're served locally instead of falling back to remote URLs.
 */

import { LOCAL_PRODUCT_IMAGES, LOCAL_GALLERY_IMAGES, LOCAL_CATEGORY_IMAGES } from './imageUtils';

/**
 * Extract product ID from uploaded filename or URL
 */
function extractProductId(filenameOrUrl: string): string | null {
  // Handle both "/product_images/nest-dw-01-123456.jpg" and "nest-dw-01-123456.jpg"
  const filename = filenameOrUrl.split('/').pop() || filenameOrUrl;
  
  // Match pattern like "nest-dw-01-123456.jpg" -> "nest-dw-01"
  const match = filename.match(/^(.+?)-\d+\./);
  return match ? match[1] : null;
}

/**
 * Auto-register a main product image when uploaded
 */
export function registerProductImage(productId: string, filename: string): void {
  LOCAL_PRODUCT_IMAGES.add(productId);
  console.log(`✅ Registered local product image: ${productId} -> ${filename}`);
}

/**
 * Auto-register a gallery image when uploaded
 */
export function registerGalleryImage(productId: string, index: number, filename: string): void {
  const key = `${productId}-${index}`;
  LOCAL_GALLERY_IMAGES.add(key);
  console.log(`✅ Registered local gallery image: ${key} -> ${filename}`);
}

/**
 * Auto-register a category image when uploaded
 */
export function registerCategoryImage(slug: string, filename: string): void {
  LOCAL_CATEGORY_IMAGES.add(slug);
  console.log(`✅ Registered local category image: ${slug} -> ${filename}`);
}

/**
 * Automatically detect and register uploaded images based on their usage context.
 * Call this when a product is saved with new image URLs.
 */
export function autoRegisterImages(productId: string, mainImage: string, galleryImages: string[] = []): void {
  // Register main image if it's a local path
  if (mainImage.startsWith('/product_images/')) {
    registerProductImage(productId, mainImage);
  }

  // Register gallery images if they're local paths
  galleryImages.forEach((imageUrl, index) => {
    if (imageUrl.startsWith('/product_images/')) {
      registerGalleryImage(productId, index, imageUrl);
    }
  });
}

/**
 * Get current registration status for debugging
 */
export function getRegistrationStats() {
  return {
    productImages: LOCAL_PRODUCT_IMAGES.size,
    galleryImages: LOCAL_GALLERY_IMAGES.size,
    categoryImages: LOCAL_CATEGORY_IMAGES.size,
    registeredProducts: Array.from(LOCAL_PRODUCT_IMAGES),
    registeredGalleries: Array.from(LOCAL_GALLERY_IMAGES),
    registeredCategories: Array.from(LOCAL_CATEGORY_IMAGES)
  };
}