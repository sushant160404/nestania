import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Order, Product, User, Review, WishlistItem } from '../types';
import dotenv from 'dotenv';
dotenv.config();

export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private enabled: boolean = false;

  private ordersCollection: Collection | null = null;
  private usersCollection: Collection | null = null;
  private reviewsCollection: Collection | null = null;
  private newsletterCollection: Collection | null = null;
  private productsCollection: Collection | null = null;
  private wishlistCollection: Collection | null = null;
  private adminUsersCollection: Collection | null = null;
  private contactMessagesCollection: Collection | null = null;

  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  async waitForInit(): Promise<void> {
    if (this.initPromise) await this.initPromise;
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
      this.ordersCollection     = this.db.collection('orders');
      this.usersCollection      = this.db.collection('users');
      this.reviewsCollection    = this.db.collection('reviews');
      this.newsletterCollection = this.db.collection('newsletter');
      this.productsCollection   = this.db.collection('products');
      this.wishlistCollection   = this.db.collection('wishlists');
      this.adminUsersCollection = this.db.collection('adminUsers');
      this.contactMessagesCollection = this.db.collection('contactMessages');
      await this.createIndexes();
      this.enabled = true;
      console.log('✅ MongoDB Atlas connected');
    } catch (error) {
      console.warn('⚠️  MongoDB initialization failed - using in-memory storage', error);
    }
  }

  private async createIndexes() {
    try {
      await this.ordersCollection?.createIndex({ orderNumber: 1 }, { unique: true });
      await this.ordersCollection?.createIndex({ userId: 1 });
      await this.ordersCollection?.createIndex({ status: 1 });
      await this.ordersCollection?.createIndex({ createdAt: -1 });
      await this.usersCollection?.createIndex({ email: 1 }, { unique: true });
      await this.reviewsCollection?.createIndex({ productId: 1 });
      await this.newsletterCollection?.createIndex({ email: 1 }, { unique: true });
      await this.wishlistCollection?.createIndex({ userId: 1 }, { unique: true });
      await this.adminUsersCollection?.createIndex({ email: 1 }, { unique: true });
      await this.contactMessagesCollection?.createIndex({ createdAt: -1 });
    } catch (error) {
      console.warn('Index creation warning:', error);
    }
  }

  private checkEnabled() {
    if (!this.enabled || !this.db) throw new Error('Database not initialized');
  }

  async testConnection(): Promise<boolean> {
    try {
      this.checkEnabled();
      await this.db!.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  // ── Count helpers (for seeding) ───────────────────────────────────────────

  async getOrdersCount(): Promise<number> {
    try { this.checkEnabled(); return await this.ordersCollection!.countDocuments(); } catch { return 0; }
  }

  async getReviewsCount(): Promise<number> {
    try { this.checkEnabled(); return await this.reviewsCollection!.countDocuments(); } catch { return 0; }
  }

  async getNewsletterCount(): Promise<number> {
    try { this.checkEnabled(); return await this.newsletterCollection!.countDocuments(); } catch { return 0; }
  }

  async getAdminUsersCount(): Promise<number> {
    try { this.checkEnabled(); return await this.adminUsersCollection!.countDocuments(); } catch { return 0; }
  }

  // ── ORDERS ────────────────────────────────────────────────────────────────

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    this.checkEnabled();
    const result = await this.ordersCollection!.insertOne({ ...orderData, createdAt: new Date(), updatedAt: new Date() });
    return { id: result.insertedId.toString(), ...orderData };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    this.checkEnabled();
    const doc = await this.ordersCollection!.findOne({ _id: new ObjectId(orderId) });
    return doc ? this.parseOrder(doc) : null;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    this.checkEnabled();
    const doc = await this.ordersCollection!.findOne({ orderNumber });
    return doc ? this.parseOrder(doc) : null;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    this.checkEnabled();
    const docs = await this.ordersCollection!.find({ userId }).sort({ createdAt: -1 }).toArray();
    return docs.map(d => this.parseOrder(d));
  }

  async getAllOrders(): Promise<Order[]> {
    this.checkEnabled();
    const docs = await this.ordersCollection!.find({}).sort({ createdAt: -1 }).toArray();
    return docs.map(d => this.parseOrder(d));
  }

  async updateOrderStatus(orderId: string, status: Order['status'], trackingSteps?: Order['trackingSteps']): Promise<void> {
    this.checkEnabled();
    const update: any = { status, updatedAt: new Date() };
    if (trackingSteps) update.trackingSteps = trackingSteps;
    await this.ordersCollection!.updateOne({ _id: new ObjectId(orderId) }, { $set: update });
  }

  // ── USERS ─────────────────────────────────────────────────────────────────

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    this.checkEnabled();
    const result = await this.usersCollection!.insertOne({ ...userData, createdAt: new Date(), updatedAt: new Date() });
    return { id: result.insertedId.toString(), ...userData };
  }

  async getUserById(userId: string): Promise<User | null> {
    this.checkEnabled();
    const doc = await this.usersCollection!.findOne({ _id: new ObjectId(userId) });
    return doc ? this.parseUser(doc) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    this.checkEnabled();
    const doc = await this.usersCollection!.findOne({ email: email.toLowerCase() });
    return doc ? this.parseUser(doc) : null;
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    this.checkEnabled();
    await this.usersCollection!.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...userData, updatedAt: new Date() } }
    );
  }

  async validateUserLogin(email: string, password: string): Promise<{ valid: boolean; user?: User }> {
    try {
      this.checkEnabled();
      const doc = await this.usersCollection!.findOne({ email: email.toLowerCase() });
      if (!doc) return { valid: false };
      // In production: use bcrypt.compare(password, doc.password)
      if (doc.password === password) {
        return { valid: true, user: this.parseUser(doc) };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  async registerUser(email: string, password: string, name: string, phone?: string): Promise<User> {
    this.checkEnabled();
    const existing = await this.getUserByEmail(email);
    if (existing) throw new Error('Email already registered');

    const userData = {
      email: email.toLowerCase(),
      password, // In production: bcrypt.hash(password, 10)
      name,
      phone: phone || '',
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.usersCollection!.insertOne(userData);
    return {
      id: result.insertedId.toString(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      addresses: [],
    };
  }

  // ── REVIEWS ───────────────────────────────────────────────────────────────

  async createReview(reviewData: Omit<Review, 'id'>): Promise<Review> {
    this.checkEnabled();
    const result = await this.reviewsCollection!.insertOne({ ...reviewData, createdAt: new Date() });
    return { id: result.insertedId.toString(), ...reviewData };
  }

  async getProductReviews(productId: string): Promise<Review[]> {
    this.checkEnabled();
    const docs = await this.reviewsCollection!.find({ productId }).sort({ createdAt: -1 }).toArray();
    return docs.map(d => this.parseReview(d));
  }

  async updateReviewHelpfulCount(reviewId: string, count: number): Promise<void> {
    this.checkEnabled();
    await this.reviewsCollection!.updateOne({ _id: new ObjectId(reviewId) }, { $set: { helpfulCount: count } });
  }

  // ── WISHLISTS ─────────────────────────────────────────────────────────────

  async getWishlist(userId: string): Promise<Product[]> {
    this.checkEnabled();
    const doc = await this.wishlistCollection!.findOne({ userId });
    return doc ? (doc.products as Product[]) : [];
  }

  async saveWishlist(userId: string, products: Product[]): Promise<void> {
    this.checkEnabled();
    await this.wishlistCollection!.updateOne(
      { userId },
      { $set: { userId, products, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  // ── ADMIN USERS ───────────────────────────────────────────────────────────

  async createAdminUser(email: string, password: string, name: string): Promise<void> {
    this.checkEnabled();
    await this.adminUsersCollection!.insertOne({
      email: email.toLowerCase(),
      password, // In production, use bcrypt.hash(password, 10)
      name,
      createdAt: new Date(),
    });
  }

  async validateAdminLogin(email: string, password: string): Promise<{ valid: boolean; admin?: { email: string; name: string } }> {
    try {
      this.checkEnabled();
      const doc = await this.adminUsersCollection!.findOne({ email: email.toLowerCase() });
      if (!doc) return { valid: false };
      // In production: use bcrypt.compare(password, doc.password)
      if (doc.password === password) {
        return { valid: true, admin: { email: doc.email, name: doc.name } };
      }
      return { valid: false };
    } catch (error) {
      // Fallback to hardcoded credentials when DB is not available
      if (email.toLowerCase() === 'admin@nestania.com' && password === 'admin123') {
        return { valid: true, admin: { email: 'admin@nestania.com', name: 'Admin User' } };
      }
      return { valid: false };
    }
  }

  // ── NEWSLETTER ────────────────────────────────────────────────────────────

  async addNewsletterSubscriber(email: string): Promise<void> {
    this.checkEnabled();
    await this.newsletterCollection!.updateOne(
      { email: email.toLowerCase() },
      { $set: { email: email.toLowerCase(), subscribedAt: new Date() } },
      { upsert: true }
    );
  }

  async isEmailSubscribed(email: string): Promise<boolean> {
    this.checkEnabled();
    const doc = await this.newsletterCollection!.findOne({ email: email.toLowerCase() });
    return doc !== null;
  }

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  async syncProductToDatabase(product: Product): Promise<void> {
    this.checkEnabled();
    await this.productsCollection!.updateOne(
      { id: product.id },
      { $set: { ...product, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  async getProductById(productId: string): Promise<Product | null> {
    this.checkEnabled();
    const doc = await this.productsCollection!.findOne({ id: productId });
    return doc ? (doc as unknown as Product) : null;
  }

  async updateProductStock(productId: string, stockCount: number): Promise<void> {
    this.checkEnabled();
    await this.productsCollection!.updateOne(
      { id: productId },
      { $set: { stockCount, inStock: stockCount > 0, updatedAt: new Date() } }
    );
  }

  // ── CONTACT MESSAGES ─────────────────────────────────────────────────────

  async saveContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ id: string }> {
    this.checkEnabled();
    const result = await this.contactMessagesCollection!.insertOne({
      ...data,
      status: 'unread',
      createdAt: new Date(),
    });
    return { id: result.insertedId.toString() };
  }

  async getAllContactMessages(): Promise<any[]> {
    this.checkEnabled();
    const docs = await this.contactMessagesCollection!.find({}).sort({ createdAt: -1 }).toArray();
    return docs.map(d => ({ id: d._id.toString(), ...d, _id: undefined }));
  }

  async getContactMessagesCount(): Promise<number> {
    try { this.checkEnabled(); return await this.contactMessagesCollection!.countDocuments(); } catch { return 0; }
  }

  async updateContactMessageStatus(id: string, status: string): Promise<void> {
    this.checkEnabled();
    await this.contactMessagesCollection!.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  // ── Parsers ───────────────────────────────────────────────────────────────

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
