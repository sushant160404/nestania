import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Order, Product, User, Review } from '../types';

export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private enabled: boolean = false;

  // Collections
  private ordersCollection: Collection | null = null;
  private usersCollection: Collection | null = null;
  private reviewsCollection: Collection | null = null;
  private newsletterCollection: Collection | null = null;
  private productsCollection: Collection | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        console.warn('⚠️  MONGODB_URI not found - using in-memory storage');
        return;
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      
      this.db = this.client.db('nestania');
      
      // Initialize collections
      this.ordersCollection = this.db.collection('orders');
      this.usersCollection = this.db.collection('users');
      this.reviewsCollection = this.db.collection('reviews');
      this.newsletterCollection = this.db.collection('newsletter');
      this.productsCollection = this.db.collection('products');
      
      // Create indexes
      await this.createIndexes();
      
      this.enabled = true;
      console.log('✅ MongoDB Atlas connected');
    } catch (error) {
      console.warn('⚠️  MongoDB initialization failed - using in-memory storage', error);
    }
  }

  private async createIndexes() {
    try {
      if (!this.db) return;

      // Orders indexes
      await this.ordersCollection?.createIndex({ orderNumber: 1 }, { unique: true });
      await this.ordersCollection?.createIndex({ userId: 1 });
      await this.ordersCollection?.createIndex({ status: 1 });
      await this.ordersCollection?.createIndex({ createdAt: -1 });

      // Users indexes
      await this.usersCollection?.createIndex({ email: 1 }, { unique: true });

      // Reviews indexes
      await this.reviewsCollection?.createIndex({ productId: 1 });
      await this.reviewsCollection?.createIndex({ rating: 1 });

      // Newsletter indexes
      await this.newsletterCollection?.createIndex({ email: 1 }, { unique: true });
    } catch (error) {
      console.warn('Index creation warning:', error);
    }
  }

  private checkEnabled() {
    if (!this.enabled || !this.db) {
      throw new Error('Database not initialized');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      this.checkEnabled();
      await this.db!.admin().ping();
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
      const doc = {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await this.ordersCollection!.insertOne(doc);
      
      return {
        id: result.insertedId.toString(),
        ...orderData,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const doc = await this.ordersCollection!.findOne({ _id: new ObjectId(orderId) });
      
      if (!doc) return null;
      return this.parseOrder(doc);
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      this.checkEnabled();
      const doc = await this.ordersCollection!.findOne({ orderNumber });
      
      if (!doc) return null;
      return this.parseOrder(doc);
    } catch (error) {
      console.error('Error getting order by number:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      this.checkEnabled();
      const docs = await this.ordersCollection!
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return docs.map(doc => this.parseOrder(doc));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      this.checkEnabled();
      const docs = await this.ordersCollection!
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return docs.map(doc => this.parseOrder(doc));
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
      const update: any = {
        status,
        updatedAt: new Date(),
      };

      if (trackingSteps) {
        update.trackingSteps = trackingSteps;
      }

      await this.ordersCollection!.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: update }
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // ==================== USERS ====================

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      this.checkEnabled();
      const doc = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await this.usersCollection!.insertOne(doc);
      
      return {
        id: result.insertedId.toString(),
        ...userData,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const doc = await this.usersCollection!.findOne({ _id: new ObjectId(userId) });
      
      if (!doc) return null;
      return this.parseUser(doc);
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      this.checkEnabled();
      const doc = await this.usersCollection!.findOne({ email: email.toLowerCase() });
      
      if (!doc) return null;
      return this.parseUser(doc);
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      this.checkEnabled();
      await this.usersCollection!.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            ...userData,
            updatedAt: new Date()
          } 
        }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ==================== REVIEWS ====================

  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    try {
      this.checkEnabled();
      const doc = {
        ...reviewData,
        createdAt: new Date(),
      };
      
      const result = await this.reviewsCollection!.insertOne(doc);
      
      return {
        id: result.insertedId.toString(),
        ...reviewData,
      };
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      this.checkEnabled();
      const docs = await this.reviewsCollection!
        .find({ productId })
        .sort({ createdAt: -1 })
        .toArray();
      
      return docs.map(doc => this.parseReview(doc));
    } catch (error) {
      console.error('Error getting product reviews:', error);
      throw error;
    }
  }

  async updateReviewHelpfulCount(reviewId: string, count: number): Promise<void> {
    try {
      this.checkEnabled();
      await this.reviewsCollection!.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: { helpfulCount: count } }
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
      await this.newsletterCollection!.updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            email: email.toLowerCase(),
            subscribedAt: new Date()
          } 
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error adding newsletter subscriber:', error);
      throw error;
    }
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    try {
      this.checkEnabled();
      const doc = await this.newsletterCollection!.findOne({ 
        email: email.toLowerCase() 
      });
      return doc !== null;
    } catch (error) {
      console.error('Error checking email subscription:', error);
      throw error;
    }
  }

  // ==================== PRODUCTS (Optional) ====================

  async syncProductToDatabase(product: Product): Promise<void> {
    try {
      this.checkEnabled();
      await this.productsCollection!.updateOne(
        { id: product.id },
        { 
          $set: { 
            ...product,
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error syncing product:', error);
      throw error;
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      this.checkEnabled();
      const doc = await this.productsCollection!.findOne({ id: productId });
      
      if (!doc) return null;
      return doc as Product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  async updateProductStock(productId: string, stockCount: number): Promise<void> {
    try {
      this.checkEnabled();
      await this.productsCollection!.updateOne(
        { id: productId },
        { 
          $set: { 
            stockCount,
            inStock: stockCount > 0,
            updatedAt: new Date()
          } 
        }
      );
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  private parseOrder(doc: any): Order {
    return {
      id: doc._id.toString(),
      orderNumber: doc.orderNumber,
      date: doc.date,
      status: doc.status,
      items: doc.items,
      shippingAddress: doc.shippingAddress,
      paymentMethod: doc.paymentMethod,
      paymentStatus: doc.paymentStatus,
      subtotal: doc.subtotal,
      discount: doc.discount,
      shipping: doc.shipping,
      total: doc.total,
      couponCode: doc.couponCode,
      estimatedDelivery: doc.estimatedDelivery,
      trackingSteps: doc.trackingSteps || [],
    };
  }

  private parseUser(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      addresses: doc.addresses || [],
    };
  }

  private parseReview(doc: any): Review {
    return {
      id: doc._id.toString(),
      productId: doc.productId,
      author: doc.author,
      rating: doc.rating,
      date: doc.date,
      title: doc.title,
      comment: doc.comment,
      verifiedPurchase: doc.verifiedPurchase,
      helpfulCount: doc.helpfulCount,
    };
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB connection closed');
    }
  }
}

export const databaseService = new DatabaseService();
