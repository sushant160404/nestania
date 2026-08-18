import { Product, Category, Coupon } from '../types';
import { PRODUCTS, CATEGORIES, COUPONS } from '../data/products';

export class ProductModel {
  private products: Product[] = PRODUCTS;
  private categories: Category[] = CATEGORIES;
  private coupons: Coupon[] = COUPONS;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    if (category === 'Home' || !category) return this.products;
    return this.products.filter(p => p.category === category);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return this.products;
    
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  getCouponByCode(code: string): Coupon | undefined {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  }

  validateCoupon(code: string, cartSubtotal: number): { valid: boolean; coupon?: Coupon; message: string } {
    const coupon = this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    if (cartSubtotal < coupon.minOrder) {
      return { 
        valid: false, 
        message: `Minimum order ₹${coupon.minOrder} required for this coupon` 
      };
    }

    return { 
      valid: true, 
      coupon, 
      message: `Coupon ${coupon.code} applied successfully!` 
    };
  }
}

export const productModel = new ProductModel();
