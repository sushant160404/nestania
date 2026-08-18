import { Product, CartItem, User, Order, Coupon, Address, PageView } from '../types';
import { productModel } from '../models/ProductModel';
import { cartModel } from '../models/CartModel';
import { wishlistModel } from '../models/WishlistModel';
import { orderModel } from '../models/OrderModel';
import { userModel } from '../models/UserModel';

export class ShopController {
  // Product Operations
  getAllProducts(): Product[] {
    return productModel.getAllProducts();
  }

  getProductById(id: string): Product | undefined {
    return productModel.getProductById(id);
  }

  getProductsByCategory(category: string): Product[] {
    return productModel.getProductsByCategory(category);
  }

  searchProducts(query: string): Product[] {
    return productModel.searchProducts(query);
  }

  // Cart Operations
  loadCart(): CartItem[] {
    return cartModel.loadCart();
  }

  addToCart(cart: CartItem[], product: Product, quantity: number = 1, color?: string): CartItem[] {
    const updatedCart = cartModel.addItem(cart, product, quantity, color);
    cartModel.saveCart(updatedCart);
    return updatedCart;
  }

  removeFromCart(cart: CartItem[], productId: string): CartItem[] {
    const updatedCart = cartModel.removeItem(cart, productId);
    cartModel.saveCart(updatedCart);
    return updatedCart;
  }

  updateCartQuantity(cart: CartItem[], productId: string, quantity: number): CartItem[] {
    const updatedCart = cartModel.updateQuantity(cart, productId, quantity);
    cartModel.saveCart(updatedCart);
    return updatedCart;
  }

  clearCart(): CartItem[] {
    const emptyCart = cartModel.clearCart();
    cartModel.saveCart(emptyCart);
    return emptyCart;
  }

  calculateCartTotals(cart: CartItem[], appliedCoupon: Coupon | null) {
    const subtotal = cartModel.calculateSubtotal(cart);
    const discount = cartModel.calculateDiscount(subtotal, appliedCoupon);
    const shipping = cartModel.calculateShipping(subtotal);
    const total = cartModel.calculateTotal(subtotal, discount, shipping);
    const freeShippingThreshold = cartModel.getFreeShippingThreshold();
    const amountNeededForFreeShipping = cartModel.getAmountForFreeShipping(subtotal);

    return {
      subtotal,
      discount,
      shipping,
      total,
      freeShippingThreshold,
      amountNeededForFreeShipping,
    };
  }

  // Wishlist Operations
  loadWishlist(): Product[] {
    return wishlistModel.loadWishlist();
  }

  toggleWishlist(wishlist: Product[], product: Product): { wishlist: Product[]; added: boolean } {
    const result = wishlistModel.toggleItem(wishlist, product);
    wishlistModel.saveWishlist(result.wishlist);
    return result;
  }

  isInWishlist(wishlist: Product[], productId: string): boolean {
    return wishlistModel.isInWishlist(wishlist, productId);
  }

  // Coupon Operations
  async validateCoupon(code: string, cartSubtotal: number): Promise<{ success: boolean; coupon?: Coupon; message: string }> {
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal }),
      });
      
      const data = await res.json();
      
      if (data.valid && data.coupon) {
        return { success: true, coupon: data.coupon, message: data.message };
      }
      
      return { success: false, message: data.message || 'Invalid coupon code' };
    } catch (e) {
      // Fallback to local validation
      const result = productModel.validateCoupon(code, cartSubtotal);
      return { 
        success: result.valid, 
        coupon: result.coupon, 
        message: result.message 
      };
    }
  }

  // Order Operations
  async fetchOrders(): Promise<Order[]> {
    return orderModel.fetchOrders();
  }

  async placeOrder(
    cart: CartItem[],
    shippingAddress: Address,
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod',
    totals: { subtotal: number; discount: number; shipping: number; total: number },
    couponCode?: string
  ): Promise<Order> {
    return orderModel.createOrder({
      items: cart,
      shippingAddress,
      paymentMethod,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      couponCode,
    });
  }

  async trackOrder(orderNumber: string, localOrders: Order[]): Promise<Order | null> {
    return orderModel.trackOrderByNumber(orderNumber, localOrders);
  }

  // User Operations
  loadUser(): User | null {
    return userModel.loadUser();
  }

  updateUser(user: User): User {
    return userModel.updateUser(user);
  }

  setUser(user: User | null): void {
    userModel.saveUser(user);
  }

  logoutUser(): void {
    userModel.logout();
  }
}

export const shopController = new ShopController();
