# Product Images

Place product images in this folder using the naming convention:

**Products:** `{productId}.jpg` (main image) and `{productId}-{index}.jpg` (gallery images)
- Example: `nest-dw-01.jpg`, `nest-dw-01-1.jpg`, `nest-dw-01-2.jpg`

**Categories:** `cat-{slug}.jpg`
- Example: `cat-dinnerware.jpg`, `cat-serveware.jpg`

When a local image exists, it will be used automatically.
When no local image is found, the app falls back to the remote URL defined in `src/data/products.ts`.

Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
