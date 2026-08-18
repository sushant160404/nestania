import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Product, CartItem, User, Order, Coupon, Address, PageView } from '../types';
import { PRODUCTS, COUPONS } from '../data/products';
import { parseRouteFromLocation, formatRouteHash, updateDocumentTitle } from '../utils/router';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  navigateTo: (view: PageView, params?: { product?: Product | null; category?: string; searchQuery?: string; orderNumber?: string }) => void;
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  activeCategory: string;
  searchQuery: string;
  selectedProduct: Product | null;
  activeTrackedOrderNumber: string | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isAuthOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackingOpen: boolean;
  appliedCoupon: Coupon | null;
  orders: Order[];
  recentOrder: Order | null;
  toasts: Toast[];
  
  // Actions
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProduct: (p: Product | null) => void;
  setActiveTrackedOrderNumber: (num: string | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderTrackingOpen: (open: boolean) => void;
  
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  
  placeOrder: (shippingAddress: Address, paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod') => Promise<Order>;
  setUser: (user: User | null) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
  trackOrderById: (orderNum: string) => Promise<Order | null>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_MIN = 999;

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Parse initial route from browser URL hash/params
  const initialRoute = parseRouteFromLocation();

  const [currentView, setCurrentViewState] = useState<PageView>(() => {
    return initialRoute.view || 'category';
  });

  const [activeCategory, setActiveCategoryState] = useState<string>(() => {
    return initialRoute.category || 'Dinnerware';
  });

  const [searchQuery, setSearchQueryState] = useState<string>(() => {
    return initialRoute.searchQuery || '';
  });

  const [selectedProduct, setSelectedProductState] = useState<Product | null>(() => {
    if (initialRoute.productId) {
      const found = PRODUCTS.find(p => p.id === initialRoute.productId);
      if (found) return found;
    }
    return initialRoute.view === 'product' ? PRODUCTS[0] : null;
  });

  const [activeTrackedOrderNumber, setActiveTrackedOrderNumber] = useState<string | null>(() => {
    return initialRoute.orderNumber || null;
  });

  const isPopStateSyncRef = useRef<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nestania_cart') || localStorage.getItem('nestasia_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[1], quantity: 1 },
        { product: PRODUCTS.find(p => p.id === 'nest-dw-05') || PRODUCTS[4], quantity: 1 },
        { product: PRODUCTS.find(p => p.id === 'nest-dw-08') || PRODUCTS[6], quantity: 1 },
      ];
    } catch {
      return [
        { product: PRODUCTS[0], quantity: 1 },
        { product: PRODUCTS[1], quantity: 1 },
        { product: PRODUCTS.find(p => p.id === 'nest-dw-05') || PRODUCTS[4], quantity: 1 },
        { product: PRODUCTS.find(p => p.id === 'nest-dw-08') || PRODUCTS[6], quantity: 1 },
      ];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('nestania_wishlist') || localStorage.getItem('nestasia_wishlist');
      return saved ? JSON.parse(saved) : [PRODUCTS[1], PRODUCTS[4]];
    } catch {
      return [PRODUCTS[1]];
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nestania_user') || localStorage.getItem('nestasia_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-1',
        name: 'Sushant Namurte',
        email: 'sushantnamurte1604@gmail.com',
        phone: '+91 87654 32100',
        addresses: [
          {
            fullName: 'Sushant Namurte',
            phone: '+91 87654 32100',
            street: '123, Triveni Nagar, Near ABC Chowk, Tathawade',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411033',
            isDefault: true,
          },
          {
            fullName: 'Office',
            phone: '+91 98765 43210',
            street: 'Gaffis Technologies Pvt. Ltd., Office No. 501, IT Park, Hinjewadi Phase 3',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411057',
            isDefault: false,
          }
        ]
      };
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpenState] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpenState] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpenState] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpenState] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpenState] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(COUPONS[0]); // default welcome code NEST10
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-sample-1',
      orderNumber: 'NST-2025-8842',
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      status: 'shipped',
      items: [
        { product: PRODUCTS[0], quantity: 1, price: PRODUCTS[0].price },
        { product: PRODUCTS[3], quantity: 2, price: PRODUCTS[3].price },
      ],
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 98765 43210',
        street: '402, Lotus Grand Residences, 12th Main',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
      },
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      subtotal: PRODUCTS[0].price + (PRODUCTS[3].price * 2),
      discount: 349,
      shipping: 0,
      total: PRODUCTS[0].price + (PRODUCTS[3].price * 2) - 349,
      couponCode: 'NEST10',
      estimatedDelivery: 'Tomorrow, by 6:00 PM',
      trackingSteps: [
        { status: 'ordered', title: 'Order Confirmed', description: 'Order verified & payment received via UPI', timestamp: '2 days ago, 11:20 AM', completed: true },
        { status: 'confirmed', title: 'Packed at Studio', description: 'Artisan ceramic inspected & double-boxed in protective foam', timestamp: 'Yesterday, 3:45 PM', completed: true },
        { status: 'shipped', title: 'Dispatched via BlueDart Express', description: 'In transit to Bengaluru Central Logistics Hub (AWB: BLR98241029)', timestamp: 'Today, 8:15 AM', completed: true },
        { status: 'out_for_delivery', title: 'Out for Delivery', description: 'Courier partner out for doorstep delivery', timestamp: 'Tomorrow morning', completed: false },
        { status: 'delivered', title: 'Delivered', description: 'Delivered to recipient', timestamp: 'Tomorrow, by 6:00 PM', completed: false },
      ],
    }
  ]);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Calculate total items in cart for title
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Sync state changes to browser URL hash & document title
  useEffect(() => {
    if (isPopStateSyncRef.current) {
      isPopStateSyncRef.current = false;
      // Still update document title on popstate
      updateDocumentTitle(currentView, {
        product: selectedProduct,
        category: activeCategory,
        searchQuery,
        cartCount: totalCartItems,
        wishlistCount: wishlist.length,
        orderNumber: activeTrackedOrderNumber || undefined,
      });
      return;
    }

    const newPath = formatRouteHash({
      view: currentView,
      product: selectedProduct,
      category: activeCategory,
      searchQuery,
      orderNumber: activeTrackedOrderNumber || undefined,
    });

    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    updateDocumentTitle(currentView, {
      product: selectedProduct,
      category: activeCategory,
      searchQuery,
      cartCount: totalCartItems,
      wishlistCount: wishlist.length,
      orderNumber: activeTrackedOrderNumber || undefined,
    });
  }, [currentView, selectedProduct, activeCategory, searchQuery, activeTrackedOrderNumber, totalCartItems, wishlist.length]);

  // Handle browser Back / Forward navigation (popstate & hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const route = parseRouteFromLocation();
      isPopStateSyncRef.current = true;

      setCurrentViewState(route.view);

      if (route.category) {
        setActiveCategoryState(route.category);
      }

      if (route.searchQuery !== undefined) {
        setSearchQueryState(route.searchQuery);
      }

      if (route.productId) {
        const prod = PRODUCTS.find(p => p.id === route.productId);
        if (prod) setSelectedProductState(prod);
      } else if (route.view !== 'product') {
        setSelectedProductState(null);
      }

      if (route.orderNumber) {
        setActiveTrackedOrderNumber(route.orderNumber);
      } else {
        setActiveTrackedOrderNumber(null);
      }
    };

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const setCurrentView = (view: PageView) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main navigation helper
  const navigateTo = (
    view: PageView, 
    params?: { 
      product?: Product | null; 
      category?: string; 
      searchQuery?: string; 
      orderNumber?: string 
    }
  ) => {
    if (params?.product !== undefined) {
      setSelectedProductState(params.product);
    }
    if (params?.category) {
      setActiveCategoryState(params.category);
    }
    if (params?.searchQuery !== undefined) {
      setSearchQueryState(params.searchQuery);
    }
    if (params?.orderNumber !== undefined) {
      setActiveTrackedOrderNumber(params.orderNumber);
    } else if (view !== 'orders') {
      setActiveTrackedOrderNumber(null);
    }
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSelectedProduct = (p: Product | null) => {
    setSelectedProductState(p);
    if (p) {
      setCurrentViewState('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setActiveCategory = (cat: string) => {
    setActiveCategoryState(cat);
    setSearchQueryState('');
    if (cat === 'Home') {
      setCurrentViewState('home');
    } else {
      setCurrentViewState('category');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    if (query.trim() && currentView !== 'category') {
      setCurrentViewState('category');
    }
  };

  // Convert popup triggers into full page navigation
  const setIsCartOpen = (open: boolean) => {
    setIsCartOpenState(open);
    if (open) {
      navigateTo('cart');
    }
  };

  const setIsWishlistOpen = (open: boolean) => {
    setIsWishlistOpenState(open);
    if (open) {
      navigateTo('wishlist');
    }
  };

  const setIsAuthOpen = (open: boolean) => {
    setIsAuthOpenState(open);
    if (open) {
      navigateTo('account');
    }
  };

  const setIsCheckoutOpen = (open: boolean) => {
    setIsCheckoutOpenState(open);
    if (open) {
      navigateTo('checkout');
    }
  };

  const setIsOrderTrackingOpen = (open: boolean) => {
    setIsOrderTrackingOpenState(open);
    if (open) {
      navigateTo('orders');
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('nestania_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nestania_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('nestania_user', JSON.stringify(user));
      else localStorage.removeItem('nestania_user');
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Load orders on start
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          if (data.length > 0) setRecentOrder(data[0]);
        }
      })
      .catch(err => console.warn('Using client orders fallback', err));
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: color }];
    });
    showToast(`Added "${product.name}" to your shopping bag!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from Wishlist`, 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to Wishlist ❤️`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    const rawDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    discountAmount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
  }

  const shippingFee = cartSubtotal >= FREE_SHIPPING_MIN || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_MIN - cartSubtotal);

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid coupon code', 'error');
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Fallback local check
      const found = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
      if (found) {
        if (cartSubtotal >= found.minOrder) {
          setAppliedCoupon(found);
          showToast(`Coupon ${found.code} applied successfully!`, 'success');
          return { success: true, message: `Applied ${found.code}` };
        } else {
          showToast(`Minimum order ₹${found.minOrder} required for this coupon`, 'error');
          return { success: false, message: `Minimum ₹${found.minOrder} required` };
        }
      }
      showToast('Coupon code not found', 'error');
      return { success: false, message: 'Invalid code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  const placeOrder = async (shippingAddress: Address, paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod') => {
    const orderPayload = {
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
      paymentMethod,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const createdOrder: Order = await res.json();
        setOrders(prev => [createdOrder, ...prev]);
        setRecentOrder(createdOrder);
        clearCart();
        showToast(`Order #${createdOrder.orderNumber} placed successfully! 🎉`, 'success');
        navigateTo('orders', { orderNumber: createdOrder.orderNumber });
        return createdOrder;
      }
    } catch (e) {
      console.warn('API error placing order, generating client fallback order', e);
    }

    // Client fallback order
    const orderNum = `NST-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      estimatedDelivery: '3 Days from today',
      trackingSteps: [
        { status: 'ordered', title: 'Order Placed', description: 'Payment confirmed & inventory reserved', timestamp: 'Just now', completed: true },
        { status: 'confirmed', title: 'Quality Check & Studio Packing', description: 'Ceramics cushioned in eco-friendly bubble foam', timestamp: 'In progress', completed: true },
        { status: 'shipped', title: 'Shipped with Express Fragile Logistics', description: 'Air express dispatch', timestamp: 'Tomorrow', completed: false },
        { status: 'out_for_delivery', title: 'Out for Delivery', description: `Delivery to ${shippingAddress.city}`, timestamp: 'In 2 days', completed: false },
        { status: 'delivered', title: 'Delivered', description: 'Safe arrival at doorstep', timestamp: 'In 3 days', completed: false },
      ],
    };

    setOrders(prev => [fallbackOrder, ...prev]);
    setRecentOrder(fallbackOrder);
    clearCart();
    showToast(`Order #${fallbackOrder.orderNumber} placed successfully! 🎉`, 'success');
    navigateTo('orders', { orderNumber: fallbackOrder.orderNumber });
    return fallbackOrder;
  };

  const trackOrderById = async (orderNum: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${orderNum.trim()}`);
      if (res.ok) {
        const order = await res.json();
        return order;
      }
    } catch {
      // check local state
    }
    const found = orders.find(
      o => o.orderNumber.toLowerCase() === orderNum.trim().toLowerCase() || o.id === orderNum.trim()
    );
    return found || null;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        navigateTo,
        cart,
        wishlist,
        user,
        activeCategory,
        searchQuery,
        selectedProduct,
        activeTrackedOrderNumber,
        isCartOpen,
        isWishlistOpen,
        isAuthOpen,
        isCheckoutOpen,
        isOrderTrackingOpen,
        appliedCoupon,
        orders,
        recentOrder,
        toasts,
        setActiveCategory,
        setSearchQuery,
        setSelectedProduct,
        setActiveTrackedOrderNumber,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsAuthOpen,
        setIsCheckoutOpen,
        setIsOrderTrackingOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCouponCode,
        removeCoupon,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        freeShippingThreshold: FREE_SHIPPING_MIN,
        amountNeededForFreeShipping,
        placeOrder,
        setUser,
        showToast,
        dismissToast,
        trackOrderById,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

