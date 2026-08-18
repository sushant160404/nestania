import { PageView, Product } from '../types';
import { PRODUCTS } from '../data/products';

export interface RouteInfo {
  view: PageView;
  productId?: string;
  category?: string;
  searchQuery?: string;
  orderNumber?: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Parses the current browser URL pathname into a structured RouteInfo object.
 */
export function parseRouteFromLocation(): RouteInfo {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.replace(/^\/+/, '').trim();

  // If search query in query string, handle it
  if (searchParams.get('q')) {
    return {
      view: 'category',
      searchQuery: searchParams.get('q') || '',
    };
  }

  if (!pathname || pathname === '/' || pathname === 'home') {
    return { view: 'home' };
  }

  const parts = pathname.split('/').map(p => decodeURIComponent(p.trim())).filter(Boolean);
  const root = parts[0]?.toLowerCase();

  switch (root) {
    case 'home':
      return { view: 'home' };

    case 'category': {
      const categoryName = parts[1] || 'Dinnerware';
      return {
        view: 'category',
        category: categoryName,
      };
    }

    case 'product': {
      const productId = parts[1];
      return {
        view: 'product',
        productId,
      };
    }

    case 'cart':
      return { view: 'cart' };

    case 'wishlist':
      return { view: 'wishlist' };

    case 'checkout':
      return { view: 'checkout' };

    case 'orders': {
      const orderNumber = parts[1];
      return {
        view: 'orders',
        orderNumber,
      };
    }

    case 'account':
      return { view: 'account' };

    case 'search': {
      const query = parts[1] || '';
      return {
        view: 'category',
        searchQuery: query,
      };
    }

    default: {
      // Check if root matches a known product ID
      const directProduct = PRODUCTS.find(p => p.id.toLowerCase() === root);
      if (directProduct) {
        return { view: 'product', productId: directProduct.id };
      }
      return { view: 'home' };
    }
  }
}

/**
 * Builds the canonical URL path string for a given state.
 */
export function formatRouteHash(state: {
  view: PageView;
  product?: Product | null;
  productId?: string;
  category?: string;
  searchQuery?: string;
  orderNumber?: string;
}): string {
  switch (state.view) {
    case 'home':
      return '/';

    case 'category':
      if (state.searchQuery && state.searchQuery.trim()) {
        return `/search/${encodeURIComponent(state.searchQuery.trim())}`;
      }
      if (state.category && state.category !== 'All' && state.category !== 'Home') {
        return `/category/${encodeURIComponent(state.category)}`;
      }
      return '/category/Dinnerware';

    case 'product': {
      const prod = state.product || (state.productId ? PRODUCTS.find(p => p.id === state.productId) : null);
      if (prod) {
        const slug = slugify(prod.name);
        return `/product/${prod.id}/${slug}`;
      }
      return state.productId ? `/product/${state.productId}` : '/product/nest-dw-01';
    }

    case 'cart':
      return '/cart';

    case 'wishlist':
      return '/wishlist';

    case 'checkout':
      return '/checkout';

    case 'orders':
      if (state.orderNumber) {
        return `/orders/${encodeURIComponent(state.orderNumber)}`;
      }
      return '/orders';

    case 'account':
      return '/account';

    default:
      return '/';
  }
}

/**
 * Updates the document title based on the active page and parameters.
 */
export function updateDocumentTitle(
  view: PageView,
  options?: {
    product?: Product | null;
    category?: string;
    searchQuery?: string;
    cartCount?: number;
    wishlistCount?: number;
    orderNumber?: string;
  }
) {
  if (typeof document === 'undefined') return;

  const brand = 'Nestania';

  switch (view) {
    case 'home':
      document.title = `${brand} | Elevate Your Everyday Dining & Living`;
      break;

    case 'category':
      if (options?.searchQuery) {
        document.title = `Search: "${options.searchQuery}" | ${brand}`;
      } else if (options?.category) {
        document.title = `${options.category} Collection | ${brand}`;
      } else {
        document.title = `Dinnerware & Tableware | ${brand}`;
      }
      break;

    case 'product':
      if (options?.product) {
        document.title = `${options.product.name} ${options.product.subtitle || ''} | ${brand}`;
      } else {
        document.title = `Product Details | ${brand}`;
      }
      break;

    case 'cart':
      document.title = `Shopping Bag ${options?.cartCount ? `(${options.cartCount})` : ''} | ${brand}`;
      break;

    case 'wishlist':
      document.title = `Wishlist ${options?.wishlistCount ? `(${options.wishlistCount})` : ''} | ${brand}`;
      break;

    case 'checkout':
      document.title = `Secure Checkout | ${brand}`;
      break;

    case 'orders':
      document.title = options?.orderNumber
        ? `Track Order #${options.orderNumber} | ${brand}`
        : `Track Your Orders | ${brand}`;
      break;

    case 'account':
      document.title = `My Account & Profile | ${brand}`;
      break;

    default:
      document.title = `${brand} | Luxury Tableware & Home Living`;
  }
}
