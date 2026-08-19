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

export function parseRouteFromLocation(): RouteInfo {
  if (typeof window === 'undefined') return { view: 'home' };

  const searchParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.replace(/^\/+/, '').trim();

  if (searchParams.get('q')) {
    return { view: 'category', searchQuery: searchParams.get('q') || '' };
  }

  if (!pathname || pathname === '/' || pathname === 'home') {
    return { view: 'home' };
  }

  const parts = pathname.split('/').map(p => decodeURIComponent(p.trim())).filter(Boolean);
  const root = parts[0]?.toLowerCase();

  switch (root) {
    case 'home':
      return { view: 'home' };
    case 'category':
      return { view: 'category', category: parts[1] || 'Dinnerware' };
    case 'product':
      return { view: 'product', productId: parts[1] };
    case 'cart':
      return { view: 'cart' };
    case 'wishlist':
      return { view: 'wishlist' };
    case 'checkout':
      return { view: 'checkout' };
    case 'orders':
      return { view: 'orders', orderNumber: parts[1] };
    case 'account':
      return { view: 'account' };
    case 'contact':
      return { view: 'contact' };
    case 'search':
      return { view: 'category', searchQuery: parts[1] || '' };
    default: {
      const directProduct = PRODUCTS.find(p => p.id.toLowerCase() === root);
      if (directProduct) return { view: 'product', productId: directProduct.id };
      return { view: 'home' };
    }
  }
}

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
      if (state.searchQuery?.trim()) return `/search/${encodeURIComponent(state.searchQuery.trim())}`;
      if (state.category && state.category !== 'All' && state.category !== 'Home') {
        return `/category/${encodeURIComponent(state.category)}`;
      }
      return '/category/Dinnerware';
    case 'product': {
      const prod = state.product || (state.productId ? PRODUCTS.find(p => p.id === state.productId) : null);
      if (prod) return `/product/${prod.id}/${slugify(prod.name)}`;
      return state.productId ? `/product/${state.productId}` : '/product/nest-dw-01';
    }
    case 'cart':
      return '/cart';
    case 'wishlist':
      return '/wishlist';
    case 'checkout':
      return '/checkout';
    case 'orders':
      return state.orderNumber ? `/orders/${encodeURIComponent(state.orderNumber)}` : '/orders';
    case 'account':
      return '/account';
    case 'contact':
      return '/contact';
    default:
      return '/';
  }
}

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
      document.title = `${brand} | Elevate Your Everyday Dining & Living`; break;
    case 'category':
      document.title = options?.searchQuery
        ? `Search: "${options.searchQuery}" | ${brand}`
        : options?.category
        ? `${options.category} Collection | ${brand}`
        : `Dinnerware & Tableware | ${brand}`;
      break;
    case 'product':
      document.title = options?.product
        ? `${options.product.name} ${options.product.subtitle || ''} | ${brand}`
        : `Product Details | ${brand}`;
      break;
    case 'cart':
      document.title = `Shopping Bag${options?.cartCount ? ` (${options.cartCount})` : ''} | ${brand}`; break;
    case 'wishlist':
      document.title = `Wishlist${options?.wishlistCount ? ` (${options.wishlistCount})` : ''} | ${brand}`; break;
    case 'checkout':
      document.title = `Secure Checkout | ${brand}`; break;
    case 'orders':
      document.title = options?.orderNumber
        ? `Track Order #${options.orderNumber} | ${brand}`
        : `Track Your Orders | ${brand}`;
      break;
    case 'account':
      document.title = `My Account & Profile | ${brand}`; break;
    case 'contact':
      document.title = `Contact Us | ${brand}`; break;
    default:
      document.title = `${brand} | Luxury Tableware & Home Living`;
  }
}
