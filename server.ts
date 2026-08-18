import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load .env before any other imports that need env vars
dotenv.config();

import { PRODUCTS, CATEGORIES, COUPONS } from './src/data/products.ts';
import { Order, Review } from './src/types.ts';
import { databaseService } from './src/services/DatabaseService.ts';

// In-memory persistent stores for server session
let ordersStore: Order[] = [
  {
    id: 'ord-88392',
    orderNumber: 'NST-2025-88392',
    date: '2025-05-12',
    status: 'delivered',
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1,
        price: PRODUCTS[0].price,
      },
      {
        product: PRODUCTS[2],
        quantity: 2,
        price: PRODUCTS[2].price,
      }
    ],
    shippingAddress: {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: '402, Lotus Grand Residences, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    subtotal: 4797,
    discount: 479,
    shipping: 0,
    total: 4318,
    couponCode: 'NEST10',
    estimatedDelivery: 'May 15, 2025',
    trackingSteps: [
      {
        status: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been received and verified',
        timestamp: '12 May, 10:30 AM',
        completed: true,
      },
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Artisan workshop started packaging your ceramics',
        timestamp: '12 May, 02:15 PM',
        completed: true,
      },
      {
        status: 'shipped',
        title: 'Shipped via Express Logistics',
        description: 'AWB: BLR-NST-993821 with fragile packaging care',
        timestamp: '13 May, 11:00 AM',
        completed: true,
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier partner is on the way to Indiranagar',
        timestamp: '15 May, 09:45 AM',
        completed: true,
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Handed over safely with OTP verification',
        timestamp: '15 May, 02:20 PM',
        completed: true,
      },
    ],
  }
];

let reviewsStore: Review[] = [
  {
    id: 'rev-1',
    productId: 'nest-101',
    author: 'Priya Mukherjee',
    rating: 5,
    date: '2025-05-02',
    title: 'Exceeded all expectations!',
    comment: 'The glaze finish on this Ivory Bloom set is so smooth and feels like heirloom stoneware. Came double-boxed with zero transit damage.',
    verifiedPurchase: true,
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    productId: 'nest-101',
    author: 'Rohan Deshmukh',
    rating: 5,
    date: '2025-04-20',
    title: 'Perfect for dinner parties',
    comment: 'All our guests complimented the floral plates. Microwave and dishwasher safe without color fading.',
    verifiedPurchase: true,
    helpfulCount: 15,
  },
  {
    id: 'rev-3',
    productId: 'nest-102',
    author: 'Sunita Mehra',
    rating: 5,
    date: '2025-04-29',
    title: 'Glows under warm lighting',
    comment: 'The amber fluting refracts afternoon light so beautifully. Very sturdy base and comfortable to hold.',
    verifiedPurchase: true,
    helpfulCount: 19,
  },
  {
    id: 'rev-4',
    productId: 'nest-105',
    author: 'Ananya Verma',
    rating: 5,
    date: '2025-05-10',
    title: 'Sculptural masterpiece for my coffee table',
    comment: 'Minimal, matte, neutral cream shade that matches any modern living room aesthetic.',
    verifiedPurchase: true,
    helpfulCount: 31,
  },
];

let newsletterSubscribers: string[] = ['vip@nestania.in'];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Test database connection
  const dbConnected = await databaseService.testConnection();
  if (dbConnected) {
    console.log('✅ MySQL database connected');
  } else {
    console.warn('⚠️  MySQL not available - using in-memory storage');
  }

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // GET /api/categories
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json(CATEGORIES);
  });

  // GET /api/products with search, category, sort, tag filters
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

    if (isNew === 'true') {
      result = result.filter(p => p.isNew);
    }

    if (isSale === 'true') {
      result = result.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    }

    if (isBestSeller === 'true') {
      result = result.filter(p => p.isBestSeller);
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    res.json(result);
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const reviews = reviewsStore.filter(r => r.productId === product.id);
    res.json({ product, related, reviews });
  });

  // POST /api/coupons/verify
  app.post('/api/coupons/verify', (req: Request, res: Response) => {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }
    const coupon = COUPONS.find(c => c.code.toUpperCase() === String(code).toUpperCase().trim());
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid promo code. Try NEST10 or PREPAID10' });
    }
    if (cartSubtotal < coupon.minOrder) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order of ₹${coupon.minOrder} required for code ${coupon.code}`,
      });
    }

    let discountAmount = Math.round((cartSubtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount,
      message: `Promo applied: ${coupon.discountPercent}% OFF! (Saved ₹${discountAmount})`,
    });
  });

  // POST /api/orders
  app.post('/api/orders', async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod, subtotal, discount, shipping, total, couponCode, userId } = req.body;
    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ error: 'Incomplete order payload' });
    }

    const orderNum = `NST-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const estDeliveryDate = new Date();
    estDeliveryDate.setDate(now.getDate() + 3);

    const newOrder: Omit<Order, 'id'> = {
      orderNumber: orderNum,
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
        {
          status: 'ordered',
          title: 'Order Received',
          description: 'Payment verified & artisan inventory reserved',
          timestamp: 'Just now',
          completed: true,
        },
        {
          status: 'confirmed',
          title: 'Processing in Studio',
          description: 'Ceramics inspected & packaged in reinforced bubble cushions',
          timestamp: 'Expected within 12 hours',
          completed: true,
        },
        {
          status: 'shipped',
          title: 'Dispatched via Premium Express',
          description: 'Fragile handling priority tracking',
          timestamp: 'Expected tomorrow',
          completed: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: `Courier will deliver to ${shippingAddress.city}`,
          timestamp: 'Expected in 2-3 days',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Safe arrival at your doorstep',
          timestamp: 'Pending delivery',
          completed: false,
        },
      ],
    };

    try {
      // Save to MySQL
      const createdOrder = await databaseService.createOrder(newOrder);
      
      // Also keep in memory for session (fallback)
      ordersStore.unshift(createdOrder);
      
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('MySQL order creation failed, using in-memory:', error);
      // Fallback to in-memory if Firebase fails
      const fallbackOrder: Order = {
        id: `ord-${Date.now()}`,
        ...newOrder,
      };
      ordersStore.unshift(fallbackOrder);
      res.status(201).json(fallbackOrder);
    }
  });

  // GET /api/orders
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      // Try to fetch from MySQL first
      const dbOrders = await databaseService.getAllOrders();
      if (dbOrders.length > 0) {
        return res.json(dbOrders);
      }
    } catch (error) {
      console.error('MySQL fetch failed, using in-memory orders:', error);
    }
    // Fallback to in-memory
    res.json(ordersStore);
  });

  // GET /api/orders/:orderNumber
  app.get('/api/orders/:orderNumber', async (req: Request, res: Response) => {
    try {
      // Try MySQL first
      const dbOrder = await databaseService.getOrderByNumber(req.params.orderNumber);
      if (dbOrder) {
        return res.json(dbOrder);
      }
    } catch (error) {
      console.error('MySQL order fetch failed:', error);
    }

    // Fallback to in-memory
    const order = ordersStore.find(
      o => o.orderNumber.toLowerCase() === req.params.orderNumber.toLowerCase() || o.id === req.params.orderNumber
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // POST /api/pincode/check
  app.post('/api/pincode/check', (req: Request, res: Response) => {
    const { pincode } = req.body;
    if (!pincode || String(pincode).length !== 6) {
      return res.status(400).json({ valid: false, message: 'Please enter a valid 6-digit PIN code' });
    }
    // Simulate express logistics availability
    const metroPincodes = ['110001', '400001', '560001', '600001', '700001', '500001'];
    const isMetro = metroPincodes.includes(pincode) || pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56');

    res.json({
      valid: true,
      serviceable: true,
      estimatedDays: isMetro ? '1-2 Days (Express)' : '2-4 Days (Standard)',
      freeDeliveryEligible: true,
      cashOnDeliveryAvailable: true,
      message: isMetro ? 'Fast Delivery available in your area! Order today for delivery by tomorrow.' : 'Standard courier delivery available with safe fragile packaging.',
    });
  });

  // POST /api/newsletter
  app.post('/api/newsletter', async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    try {
      // Check if already subscribed
      const isSubscribed = await databaseService.isEmailSubscribed(email);
      if (isSubscribed) {
        return res.json({
          success: true,
          message: 'You are already subscribed! Use coupon NEST10 for 10% off.',
          code: 'NEST10',
        });
      }

      // Add to MySQL
      await databaseService.addNewsletterSubscriber(email);
      
      // Also add to in-memory
      if (!newsletterSubscribers.includes(email.toLowerCase())) {
        newsletterSubscribers.push(email.toLowerCase());
      }

      res.json({
        success: true,
        message: 'Welcome to the Nestania Family! Use coupon NEST10 for 10% off your first order.',
        code: 'NEST10',
      });
    } catch (error) {
      console.error('MySQL newsletter subscription failed:', error);
      // Fallback to in-memory
      if (!newsletterSubscribers.includes(email.toLowerCase())) {
        newsletterSubscribers.push(email.toLowerCase());
      }
      res.json({
        success: true,
        message: 'Welcome to the Nestania Family! Use coupon NEST10 for 10% off your first order.',
        code: 'NEST10',
      });
    }
  });

  // POST /api/reviews
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

    try {
      // Save to MySQL
      const createdReview = await databaseService.createReview(newRev);
      reviewsStore.unshift(createdReview);

      // Update product review count and rating
      const prod = PRODUCTS.find(p => p.id === productId);
      if (prod) {
        prod.reviewsCount += 1;
        prod.rating = Number(((prod.rating * (prod.reviewsCount - 1) + Number(rating)) / prod.reviewsCount).toFixed(1));
      }

      res.status(201).json(createdReview);
    } catch (error) {
      console.error('MySQL review creation failed:', error);
      // Fallback to in-memory
      const fallbackReview: Review = {
        id: `rev-${Date.now()}`,
        ...newRev,
      };
      reviewsStore.unshift(fallbackReview);
      res.status(201).json(fallbackReview);
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nestania Server running on http://localhost:${PORT}`);
  });
}

startServer();
