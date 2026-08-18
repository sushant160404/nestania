import { CartItem, Product, Coupon } from '../types';

export class CartModel {
  private static STORAGE_KEY = 'nestania_cart';
  private static FREE_SHIPPING_MIN = 999;

  loadCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(CartModel.STORAGE_KEY) || 
                    localStorage.getItem('nestasia_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
    return [];
  }

  saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(CartModel.STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  addItem(cart: CartItem[], product: Product, quantity: number = 1, color?: string): CartItem[] {
    const existing = cart.find(item => item.product.id === product.id);
    
    if (existing) {
      return cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    }
    
    return [...cart, { product, quantity, selectedColor: color }];
  }

  removeItem(cart: CartItem[], productId: string): CartItem[] {
    return cart.filter(item => item.product.id !== productId);
  }

  updateQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(cart, productId);
    }
    
    return cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  }

  clearCart(): CartItem[] {
    return [];
  }

  calculateSubtotal(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  calculateDiscount(subtotal: number, coupon: Coupon | null): number {
    if (!coupon || subtotal < coupon.minOrder) return 0;
    
    const rawDiscount = Math.round((subtotal * coupon.discountPercent) / 100);
    return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
  }

  calculateShipping(subtotal: number): number {
    return subtotal >= CartModel.FREE_SHIPPING_MIN || subtotal === 0 ? 0 : 99;
  }

  calculateTotal(subtotal: number, discount: number, shipping: number): number {
    return Math.max(0, subtotal - discount + shipping);
  }

  getFreeShippingThreshold(): number {
    return CartModel.FREE_SHIPPING_MIN;
  }

  getAmountForFreeShipping(subtotal: number): number {
    return Math.max(0, CartModel.FREE_SHIPPING_MIN - subtotal);
  }
}

export const cartModel = new CartModel();
