export type PageView = 
  | 'home'
  | 'category'
  | 'product'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'order-success'
  | 'orders'
  | 'account'
  | 'contact';

export interface BoxItem {
  name: string;
  size: string;
  count: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  sku?: string;
  soldCount?: string;
  category: 'Dinnerware' | 'Serveware' | 'Drinkware' | 'Home Decor' | 'Kitchen' | 'Gifting' | 'Collections' | string;
  subcategory?: string;
  materialCategory?: 'Porcelain' | 'Ceramic' | 'Stoneware' | 'Bone China' | 'Glass' | string;
  colorFamily?: 'Beige' | 'Pink' | 'Green' | 'Blue' | 'Tan' | 'Black' | 'White' | string;
  colorHex?: string;
  patternType?: 'Floral' | 'Solid' | 'Geometric' | 'Abstract' | 'Vintage' | string;
  occasionType?: 'Everyday Use' | 'Special Occasions' | 'Festive' | 'Gifting' | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  image: string;
  galleryImages: string[];
  description: string;
  finish?: string;
  microwaveSafe?: boolean;
  dishwasherSafe?: boolean;
  chipResistant?: boolean;
  boxItems?: BoxItem[];
  features?: string[];
  details: {
    material: string;
    dimensions: string;
    volume?: string;
    care: string;
    setIncludes?: string;
  };
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Address {
  fullName: string;
  phone: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  street: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface TrackingStep {
  status: 'ordered' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending';
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}
