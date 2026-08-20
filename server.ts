import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';

dotenv.config();

import { PRODUCTS, CATEGORIES, COUPONS } from './src/data/products.ts';
import { Order, Review, Product } from './src/types.ts';
import { databaseService } from './src/services/DatabaseService.ts';
import { autoRegisterImages } from './src/utils/adminImageUtils.ts';

// ── Seed function ─────────────────────────────────────────────────────────────
async function seedDatabase() {
  try {
    const adminCount = await databaseService.getAdminUsersCount();
    if (adminCount === 0) {
      await databaseService.createAdminUser('admin@nestania.com', 'admin123', 'Admin User');
      console.log('✅ Seeded default admin user (admin@nestania.com / admin123)');
    }
  } catch (error) {
    console.error('Admin seed error:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  // Ensure product_images directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'product_images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-]/g, '-');
      cb(null, `${basename}-${timestamp}${ext}`);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  app.use(express.json());

  // Wait for MongoDB to finish initializing
  await databaseService.waitForInit();

  const dbConnected = await databaseService.testConnection();
  if (dbConnected) {
    console.log('✅ MongoDB Atlas connected successfully');
    await seedDatabase();
  } else {
    console.log('⚠️  MongoDB unavailable - running with in-memory storage');
  }

  // ── Health ────────────────────────────────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', db: dbConnected ? 'mongodb' : 'memory', serverTime: new Date().toISOString() });
  });

  // ── Categories ────────────────────────────────────────────────────────────
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json(CATEGORIES);
  });

  // ── Products ──────────────────────────────────────────────────────────────
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...PRODUCTS];
    const { category, search, sort, isNew, isSale, isBestSeller, minPrice, maxPrice } = req.query;

    if (category && category !== 'All' && category !== 'Collections') {
      result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (isNew === 'true')        result = result.filter(p => p.isNew);
    if (isSale === 'true')       result = result.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    if (isBestSeller === 'true') result = result.filter(p => p.isBestSeller);
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));

    if (sort === 'price-low')  result.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest')     result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    res.json(result);
  });

  app.get('/api/products/:id', async (req: Request, res: Response) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const reviews = await databaseService.getProductReviews(product.id);
    res.json({ product, related, reviews });
  });

  // ── Coupons ───────────────────────────────────────────────────────────────
  app.post('/api/coupons/verify', (req: Request, res: Response) => {
    const { code, cartSubtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });

    const coupon = COUPONS.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim());
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid promo code. Try NEST10 or PREPAID10' });
    if (cartSubtotal < coupon.minOrder) {
      return res.status(400).json({ valid: false, message: `Minimum order of ₹${coupon.minOrder} required for code ${coupon.code}` });
    }

    let discountAmount = Math.round((cartSubtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) discountAmount = coupon.maxDiscount;

    res.json({ valid: true, coupon, discountAmount, message: `Promo applied: ${coupon.discountPercent}% OFF! (Saved ₹${discountAmount})` });
  });

  // ── Orders ────────────────────────────────────────────────────────────────
  app.post('/api/orders', async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod, subtotal, discount, shipping, total, couponCode } = req.body;
    if (!items?.length || !shippingAddress) return res.status(400).json({ error: 'Incomplete order payload' });

    const now = new Date();
    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(now.getDate() + 3);

    const newOrder: Omit<Order, 'id'> = {
      orderNumber: `NST-2025-${Math.floor(10000 + Math.random() * 90000)}`,
      date: now.toISOString().split('T')[0],
      status: 'confirmed',
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
      couponCode,
      estimatedDelivery: estDeliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      trackingSteps: [
        { status: 'ordered',          title: 'Order Received',              description: 'Payment verified & artisan inventory reserved',               timestamp: 'Just now',                completed: true  },
        { status: 'confirmed',        title: 'Processing in Studio',        description: 'Ceramics inspected & packaged in reinforced bubble cushions',  timestamp: 'Expected within 12 hours', completed: true  },
        { status: 'shipped',          title: 'Dispatched via Premium Express', description: 'Fragile handling priority tracking',                        timestamp: 'Expected tomorrow',        completed: false },
        { status: 'out_for_delivery', title: 'Out for Delivery',            description: `Courier will deliver to ${shippingAddress.city}`,              timestamp: 'Expected in 2-3 days',     completed: false },
        { status: 'delivered',        title: 'Delivered',                   description: 'Safe arrival at your doorstep',                                timestamp: 'Pending delivery',         completed: false },
      ],
    };

    const createdOrder = await databaseService.createOrder(newOrder);
    res.status(201).json(createdOrder);
  });

  app.get('/api/orders', async (_req: Request, res: Response) => {
    const orders = await databaseService.getAllOrders();
    res.json(orders);
  });

  app.get('/api/orders/:orderNumber', async (req: Request, res: Response) => {
    const order = await databaseService.getOrderByNumber(req.params.orderNumber);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  // ── Admin Dashboard Stats ──────────────────────────────────────────────────
  app.get('/api/admin/dashboard/stats', async (_req: Request, res: Response) => {
    try {
      const orders = await databaseService.getAllOrders();
      const contacts = await databaseService.getAllContactMessages();

      // Calculate stats from real data
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const totalCustomers = new Set(orders.map(o => o.shippingAddress?.email).filter(Boolean)).size;
      const pendingOrders = orders.filter(o => 
        o.status === 'confirmed' || o.status === 'processing'
      ).length;

      // Calculate trends (simplified - comparing last 30 days vs previous 30)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentOrders = orders.filter(o => new Date(o.date) >= thirtyDaysAgo);
      const previousOrders = orders.filter(o => {
        const orderDate = new Date(o.date);
        return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
      });

      const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
      const previousRevenue = previousOrders.reduce((sum, o) => sum + o.total, 0);

      const revenueChange = previousRevenue > 0 
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const ordersChange = previousOrders.length > 0 
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100 
        : 0;

      res.json({
        totalRevenue,
        revenueChange: Math.round(revenueChange * 10) / 10,
        totalOrders,
        ordersChange: Math.round(ordersChange * 10) / 10,
        totalCustomers,
        customersChange: 5.4, // Keep as placeholder for now
        pendingOrders,
        pendingChange: -3.1,  // Keep as placeholder for now
        recentOrders: orders.slice(0, 5),
        unreadMessages: contacts.filter(c => c.status === 'unread').length
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });
  app.patch('/api/admin/orders/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status required' });
    
    try {
      const updatedOrder = await databaseService.updateOrderStatus(req.params.id, status);
      if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
      res.json(updatedOrder);
    } catch (error) {
      console.error('Order update error:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // ── Pincode ───────────────────────────────────────────────────────────────
  // ── Wishlist ──────────────────────────────────────────────────────────────

  app.get('/api/wishlist/:userId', async (req: Request, res: Response) => {
    try {
      const products = await databaseService.getWishlist(req.params.userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  });

  app.put('/api/wishlist/:userId', async (req: Request, res: Response) => {
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: 'products array required' });
    try {
      await databaseService.saveWishlist(req.params.userId, products);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save wishlist' });
    }
  });

  // ── Admin Auth ────────────────────────────────────────────────────────────

  app.post('/api/admin/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
      const result = await databaseService.validateAdminLogin(email, password);
      if (result.valid) {
        return res.json({ success: true, admin: result.admin });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      // Fallback: check hardcoded credentials directly if DB fails
      if (email.toLowerCase() === 'admin@nestania.com' && password === 'admin123') {
        return res.json({ success: true, admin: { email: 'admin@nestania.com', name: 'Admin User' } });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // ── User Auth ─────────────────────────────────────────────────────────────

  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    try {
      const user = await databaseService.registerUser(email, password, name, phone);
      res.status(201).json({ success: true, user });
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: 'Email already registered' });
      }
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
      const result = await databaseService.validateUserLogin(email, password);
      if (result.valid && result.user) {
        return res.json({ success: true, user: result.user });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
      return res.status(500).json({ error: 'Login failed' });
    }
  });

  app.get('/api/users/:userId', async (req: Request, res: Response) => {
    try {
      const user = await databaseService.getUserById(req.params.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.put('/api/users/:userId', async (req: Request, res: Response) => {
    const { name, email, phone, addresses } = req.body;
    try {
      await databaseService.updateUser(req.params.userId, { name, email, phone, addresses });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.post('/api/pincode/check', (req: Request, res: Response) => {
    const { pincode } = req.body;
    if (!pincode || String(pincode).length !== 6) {
      return res.status(400).json({ valid: false, message: 'Please enter a valid 6-digit PIN code' });
    }
    const isMetro = ['110001','400001','560001','600001','700001','500001'].includes(pincode)
      || pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56');

    res.json({
      valid: true,
      serviceable: true,
      estimatedDays: isMetro ? '1-2 Days (Express)' : '2-4 Days (Standard)',
      freeDeliveryEligible: true,
      cashOnDeliveryAvailable: true,
      message: isMetro
        ? 'Fast Delivery available in your area! Order today for delivery by tomorrow.'
        : 'Standard courier delivery available with safe fragile packaging.',
    });
  });

  // ── Newsletter ────────────────────────────────────────────────────────────
  app.post('/api/newsletter', async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email address required' });

    const isSubscribed = await databaseService.isEmailSubscribed(email);
    if (isSubscribed) {
      return res.json({ success: true, message: 'You are already subscribed! Use coupon NEST10 for 10% off.', code: 'NEST10' });
    }

    await databaseService.addNewsletterSubscriber(email);
    res.json({ success: true, message: 'Welcome to the Nestania Family! Use coupon NEST10 for 10% off your first order.', code: 'NEST10' });
  });

  // ── Contact Messages ──────────────────────────────────────────────────────
  app.post('/api/contact', async (req: Request, res: Response) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required' });
    }
    try {
      const result = await databaseService.saveContactMessage({ name, email, phone: phone || '', subject: subject || 'General', message });
      res.status(201).json({ success: true, id: result.id, message: "We've received your message and will reply within 24 hours." });
    } catch (error) {
      console.error('Contact save error:', error);
      res.status(500).json({ error: 'Failed to save message. Please try again.' });
    }
  });

  app.get('/api/contact', async (_req: Request, res: Response) => {
    try {
      const messages = await databaseService.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contact messages' });
    }
  });

  app.patch('/api/contact/:id/status', async (req: Request, res: Response) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    try {
      await databaseService.updateContactMessageStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });

  // ── Reviews ───────────────────────────────────────────────────────────────
  app.post('/api/reviews', async (req: Request, res: Response) => {
    const { productId, author, rating, title, comment } = req.body;
    if (!productId || !author || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const newRev: Omit<Review, 'id'> = {
      productId,
      author,
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      title: title || 'Thoughtfully crafted product',
      comment,
      verifiedPurchase: true,
      helpfulCount: 1,
    };

    const createdReview = await databaseService.createReview(newRev);

    // Update in-memory product rating
    const prod = PRODUCTS.find(p => p.id === productId);
    if (prod) {
      prod.reviewsCount += 1;
      prod.rating = Number(((prod.rating * (prod.reviewsCount - 1) + Number(rating)) / prod.reviewsCount).toFixed(1));
    }

    res.status(201).json(createdReview);
  });

  // ── Admin Products CRUD ───────────────────────────────────────────────────

  app.get('/api/admin/products', (_req: Request, res: Response) => {
    res.json(PRODUCTS);
  });

  app.get('/api/admin/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/admin/products', (req: Request, res: Response) => {
    const product: Product = req.body;
    if (!product.name || !product.price || !product.category) {
      return res.status(400).json({ error: 'name, price and category are required' });
    }
    if (!product.id) {
      product.id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    if (PRODUCTS.find(p => p.id === product.id)) {
      return res.status(409).json({ error: 'Product with this ID already exists' });
    }
    
    // Auto-register local images
    autoRegisterImages(product.id, product.image, product.galleryImages);
    
    PRODUCTS.push(product);
    res.status(201).json(product);
  });

  app.put('/api/admin/products/:id', (req: Request, res: Response) => {
    const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    
    const updatedProduct = { ...PRODUCTS[idx], ...req.body, id: req.params.id };
    
    // Auto-register local images
    autoRegisterImages(updatedProduct.id, updatedProduct.image, updatedProduct.galleryImages);
    
    PRODUCTS[idx] = updatedProduct;
    res.json(PRODUCTS[idx]);
  });

  app.delete('/api/admin/products/:id', (req: Request, res: Response) => {
    const idx = PRODUCTS.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    PRODUCTS.splice(idx, 1);
    res.json({ success: true });
  });

  // ── Admin File Upload ─────────────────────────────────────────────────────
  app.post('/api/admin/upload', upload.single('file'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Return the local path for use in the app
      const localPath = `/product_images/${req.file.filename}`;
      
      res.json({
        success: true,
        url: localPath,
        path: localPath,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // ── Vite / Static ─────────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // ── Global error handler ──────────────────────────────────────────────────
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nestania Server running on http://localhost:${PORT}`);
  });
}

startServer();
