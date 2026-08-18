import mysql from 'mysql2/promise';
import { Order, Product, User, Review } from '../types';

export class DatabaseService {
  private pool: mysql.Pool | null = null;
  private enabled: boolean = false;

  constructor() {
    this.initializePool();
  }

  private initializePool() {
    try {
      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'nestania',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };

      this.pool = mysql.createPool(config);
      this.enabled = true;
      console.log('✅ MySQL connection pool created');
    } catch (error) {
      console.warn('MySQL initialization failed - using in-memory storage', error);
    }
  }

  private checkEnabled() {
    if (!this.enabled || !this.pool) {
      throw new Error('Database not initialized');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.checkEnabled();
      await this.pool!.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // ==================== ORDERS ====================

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    try {
      this.checkEnabled();
      const [result] = await this.pool!.query(
        `INSERT INTO orders (orderNumber, date, status, items, shippingAddress, paymentMethod, 
         paymentStatus, subtotal, discount, shipping, total, couponCode, estimatedDelivery, trackingSteps, userId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderData.orderNumber,
          orderData.date,
          orderData.status,
          JSON.stringify(orderData.items),
          JSON.stringify(orderData.shippingAddress),
          orderData.paymentMethod,
          orderData.paymentStatus,
          orderData.subtotal,
          orderData.discount,
          orderData.shipping,
          orderData.total,
          orderData.couponCode || null,
          orderData.estimatedDelivery || null,
          JSON.stringify(orderData.trackingSteps || []),
          (orderData as any).userId || null
        ]
      );

      const insertId = (result as any).insertId;
      return { id: insertId.toString(), ...orderData };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      const orders = rows as any[];
      if (orders.length === 0) return null;
      
      return this.parseOrder(orders[0]);
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM orders WHERE orderNumber = ? LIMIT 1',
        [orderNumber]
      );
      const orders = rows as any[];
      if (orders.length === 0) return null;
      
      return this.parseOrder(orders[0]);
    } catch (error) {
      console.error('Error getting order by number:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );
      return (rows as any[]).map(row => this.parseOrder(row));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM orders ORDER BY createdAt DESC'
      );
      return (rows as any[]).map(row => this.parseOrder(row));
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
      if (trackingSteps) {
        await this.pool!.query(
          'UPDATE orders SET status = ?, trackingSteps = ?, updatedAt = NOW() WHERE id = ?',
          [status, JSON.stringify(trackingSteps), orderId]
        );
      } else {
        await this.pool!.query(
          'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?',
          [status, orderId]
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // ==================== USERS ====================

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      this.checkEnabled();
      const [result] = await this.pool!.query(
        'INSERT INTO users (name, email, phone, addresses) VALUES (?, ?, ?, ?)',
        [
          userData.name,
          userData.email,
          userData.phone || null,
          JSON.stringify(userData.addresses || [])
        ]
      );
      const insertId = (result as any).insertId;
      return { id: insertId.toString(), ...userData };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      const users = rows as any[];
      if (users.length === 0) return null;
      
      return this.parseUser(users[0]);
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      const users = rows as any[];
      if (users.length === 0) return null;
      
      return this.parseUser(users[0]);
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      this.checkEnabled();
      const updates: string[] = [];
      const values: any[] = [];

      if (userData.name) {
        updates.push('name = ?');
        values.push(userData.name);
      }
      if (userData.email) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      if (userData.phone) {
        updates.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.addresses) {
        updates.push('addresses = ?');
        values.push(JSON.stringify(userData.addresses));
      }

      if (updates.length > 0) {
        updates.push('updatedAt = NOW()');
        values.push(userId);
        await this.pool!.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ==================== REVIEWS ====================

  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    try {
      this.checkEnabled();
      const [result] = await this.pool!.query(
        'INSERT INTO reviews (productId, author, rating, date, title, comment, verifiedPurchase, helpfulCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          reviewData.productId,
          reviewData.author,
          reviewData.rating,
          reviewData.date,
          reviewData.title || null,
          reviewData.comment,
          reviewData.verifiedPurchase ? 1 : 0,
          reviewData.helpfulCount || 0
        ]
      );
      const insertId = (result as any).insertId;
      return { id: insertId.toString(), ...reviewData };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC',
        [productId]
      );
      return (rows as any[]).map(row => this.parseReview(row));
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  }

  async updateReviewHelpfulCount(reviewId: string, count: number): Promise<void> {
    try {
      this.checkEnabled();
      await this.pool!.query(
        'UPDATE reviews SET helpfulCount = ? WHERE id = ?',
        [count, reviewId]
      );
    } catch (error) {
      console.error('Error updating review helpful count:', error);
      throw error;
    }
  }

  // ==================== NEWSLETTER ====================

  async addNewsletterSubscriber(email: string): Promise<void> {
    try {
      this.checkEnabled();
      await this.pool!.query(
        'INSERT INTO newsletter (email) VALUES (?) ON DUPLICATE KEY UPDATE subscribedAt = NOW()',
        [email.toLowerCase()]
      );
    } catch (error) {
      console.error('Error adding newsletter subscriber:', error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      this.checkEnabled();
      const [rows] = await this.pool!.query(
        'SELECT COUNT(*) as count FROM newsletter WHERE email = ?',
        [email.toLowerCase()]
      );
      return (rows as any)[0].count > 0;
    } catch (error) {
      console.error('Error checking email subscription:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  private parseOrder(row: any): Order {
    return {
      id: row.id.toString(),
      orderNumber: row.orderNumber,
      date: row.date,
      status: row.status,
      items: JSON.parse(row.items),
      shippingAddress: JSON.parse(row.shippingAddress),
      paymentMethod: row.paymentMethod,
      paymentStatus: row.paymentStatus,
      subtotal: row.subtotal,
      discount: row.discount,
      shipping: row.shipping,
      total: row.total,
      couponCode: row.couponCode,
      estimatedDelivery: row.estimatedDelivery,
      trackingSteps: JSON.parse(row.trackingSteps || '[]'),
    };
  }

  private parseUser(row: any): User {
    return {
      id: row.id.toString(),
      name: row.name,
      email: row.email,
      phone: row.phone,
      addresses: JSON.parse(row.addresses || '[]'),
    };
  }

  private parseReview(row: any): Review {
    return {
      id: row.id.toString(),
      productId: row.productId,
      author: row.author,
      rating: row.rating,
      date: row.date,
      title: row.title,
      comment: row.comment,
      verifiedPurchase: row.verifiedPurchase === 1,
      helpfulCount: row.helpfulCount,
    };
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

export const databaseService = new DatabaseService();
