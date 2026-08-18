import { Product } from '../types';

export class WishlistModel {
  private static STORAGE_KEY = 'nestania_wishlist';

  loadWishlist(): Product[] {
    try {
      const saved = localStorage.getItem(WishlistModel.STORAGE_KEY) || 
                    localStorage.getItem('nestasia_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist:', e);
      return [];
    }
  }

  saveWishlist(wishlist: Product[]): void {
    try {
      localStorage.setItem(WishlistModel.STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }

  addItem(wishlist: Product[], product: Product): Product[] {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) return wishlist;
    return [...wishlist, product];
  }

  removeItem(wishlist: Product[], productId: string): Product[] {
    return wishlist.filter(p => p.id !== productId);
  }

  toggleItem(wishlist: Product[], product: Product): { wishlist: Product[]; added: boolean } {
    const exists = wishlist.some(p => p.id === product.id);
    
    if (exists) {
      return {
        wishlist: this.removeItem(wishlist, product.id),
        added: false
      };
    }
    
    return {
      wishlist: this.addItem(wishlist, product),
      added: true
    };
  }

  isInWishlist(wishlist: Product[], productId: string): boolean {
    return wishlist.some(p => p.id === productId);
  }
}

export const wishlistModel = new WishlistModel();
