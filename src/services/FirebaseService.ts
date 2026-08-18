import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  Database,
} from 'firebase/database';
import { database } from '../config/firebase';
import { Order, Product, User, Review } from '../types';

export class FirebaseService {
  private enabled: boolean = false;
  private db: Database | null = null;

  constructor() {
    if (database) {
      this.db = database;
      this.enabled = true;
    } else {
      console.warn('FirebaseService: Database not initialized - Firebase features disabled');
    }
  }

  private checkEnabled() {
    if (!this.enabled || !this.db) {
      throw new Error('Firebase not initialized');
    }
  }

  // ==================== ORDERS ====================

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    try {
      this.checkEnabled();
      const ordersRef = ref(this.db!, 'orders');
      const newOrderRef = push(ordersRef);
      const order: Order = {
        id: newOrderRef.key!,
        ...orderData,
      };
      
      await set(newOrderRef, {
        ...order,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const orderRef = ref(this.db!, `orders/${orderId}`);
      const snapshot = await get(orderRef);

      if (snapshot.exists()) {
        return snapshot.val() as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const ordersRef = ref(this.db!, 'orders');
      const q = query(ordersRef, orderByChild('orderNumber'), equalTo(orderNumber), limitToFirst(1));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const orders = snapshot.val();
        const orderId = Object.keys(orders)[0];
        return orders[orderId] as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order by number:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      this.checkEnabled();
      const ordersRef = ref(this.db!, 'orders');
      const q = query(ordersRef, orderByChild('userId'), equalTo(userId));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const ordersObj = snapshot.val();
        return Object.values(ordersObj) as Order[];
      }
      return [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      this.checkEnabled();
      const ordersRef = ref(this.db!, 'orders');
      const snapshot = await get(ordersRef);

      if (snapshot.exists()) {
        const ordersObj = snapshot.val();
        return Object.values(ordersObj) as Order[];
      }
      return [];
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingSteps?: Order['trackingSteps']
  ): Promise<void> {
    try {
      this.checkEnabled();
      const orderRef = ref(this.db!, `orders/${orderId}`);
      const updateData: any = {
        status,
        updatedAt: Date.now(),
      };

      if (trackingSteps) {
        updateData.trackingSteps = trackingSteps;
      }

      await update(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // ==================== USERS ====================

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      this.checkEnabled();
      const usersRef = ref(this.db!, 'users');
      const newUserRef = push(usersRef);
      const user: User = {
        id: newUserRef.key!,
        ...userData,
      };

      await set(newUserRef, {
        ...user,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const userRef = ref(this.db!, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const usersRef = ref(this.db!, 'users');
      const q = query(usersRef, orderByChild('email'), equalTo(email), limitToFirst(1));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userId = Object.keys(users)[0];
        return users[userId] as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      this.checkEnabled();
      const userRef = ref(this.db!, `users/${userId}`);
      await update(userRef, {
        ...userData,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ==================== REVIEWS ====================

  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    try {
      this.checkEnabled();
      const reviewsRef = ref(this.db!, 'reviews');
      const newReviewRef = push(reviewsRef);
      const review: Review = {
        id: newReviewRef.key!,
        ...reviewData,
      };

      await set(newReviewRef, {
        ...review,
        createdAt: Date.now(),
      });

      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      this.checkEnabled();
      const reviewsRef = ref(this.db!, 'reviews');
      const q = query(reviewsRef, orderByChild('productId'), equalTo(productId));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const reviewsObj = snapshot.val();
        return Object.values(reviewsObj) as Review[];
      }
      return [];
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  }

  async updateReviewHelpfulCount(reviewId: string, count: number): Promise<void> {
    try {
      this.checkEnabled();
      const reviewRef = ref(this.db!, `reviews/${reviewId}`);
      await update(reviewRef, { helpfulCount: count });
    } catch (error) {
      console.error('Error updating review helpful count:', error);
      throw error;
    }
  }

  // ==================== NEWSLETTER ====================

  async addNewsletterSubscriber(email: string): Promise<void> {
    try {
      this.checkEnabled();
      const newsletterRef = ref(this.db!, 'newsletter');
      const newSubscriberRef = push(newsletterRef);
      
      await set(newSubscriberRef, {
        email: email.toLowerCase(),
        subscribedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error adding newsletter subscriber:', error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      this.checkEnabled();
      const newsletterRef = ref(this.db!, 'newsletter');
      const q = query(newsletterRef, orderByChild('email'), equalTo(email.toLowerCase()), limitToFirst(1));
      const snapshot = await get(q);
      
      return snapshot.exists();
    } catch (error) {
      console.error('Error checking email subscription:', error);
      throw error;
    }
  }

  // ==================== PRODUCTS (Optional - if you want to manage products in Firebase) ====================

  async syncProductToFirebase(product: Product): Promise<void> {
    try {
      this.checkEnabled();
      const productRef = ref(this.db!, `products/${product.id}`);
      await set(productRef, {
        ...product,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error syncing product:', error);
      throw error;
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      this.checkEnabled();
      const productRef = ref(this.db!, `products/${productId}`);
      const snapshot = await get(productRef);

      if (snapshot.exists()) {
        return snapshot.val() as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  async updateProductStock(productId: string, stockCount: number): Promise<void> {
    try {
      this.checkEnabled();
      const productRef = ref(this.db!, `products/${productId}`);
      await update(productRef, {
        stockCount,
        inStock: stockCount > 0,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }
}

export const firebaseService = new FirebaseService();
