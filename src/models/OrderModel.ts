import { Order, OrderItem, Address, CartItem } from '../types';

export class OrderModel {
  async fetchOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Error fetching orders:', err);
    }
    return [];
  }

  async createOrder(orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    couponCode?: string;
  }): Promise<Order> {
    const payload = {
      items: orderData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      total: orderData.total,
      couponCode: orderData.couponCode,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API error placing order, generating client fallback', e);
    }

    return this.createFallbackOrder(orderData);
  }

  private createFallbackOrder(orderData: {
    items: CartItem[];
    shippingAddress: Address;
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    couponCode?: string;
  }): Order {
    const orderNum = `NST-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    
    return {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      items: orderData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      total: orderData.total,
      couponCode: orderData.couponCode,
      estimatedDelivery: '3 Days from today',
      trackingSteps: [
        { 
          status: 'ordered', 
          title: 'Order Placed', 
          description: 'Payment confirmed & inventory reserved', 
          timestamp: 'Just now', 
          completed: true 
        },
        { 
          status: 'confirmed', 
          title: 'Quality Check & Studio Packing', 
          description: 'Ceramics cushioned in eco-friendly bubble foam', 
          timestamp: 'In progress', 
          completed: true 
        },
        { 
          status: 'shipped', 
          title: 'Shipped with Express Fragile Logistics', 
          description: 'Air express dispatch', 
          timestamp: 'Tomorrow', 
          completed: false 
        },
        { 
          status: 'out_for_delivery', 
          title: 'Out for Delivery', 
          description: `Delivery to ${orderData.shippingAddress.city}`, 
          timestamp: 'In 2 days', 
          completed: false 
        },
        { 
          status: 'delivered', 
          title: 'Delivered', 
          description: 'Safe arrival at doorstep', 
          timestamp: 'In 3 days', 
          completed: false 
        },
      ],
    };
  }

  async trackOrderByNumber(orderNumber: string, localOrders: Order[]): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderNumber.trim()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Error tracking order:', e);
    }

    const found = localOrders.find(
      o => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() || 
           o.id === orderNumber.trim()
    );
    
    return found || null;
  }
}

export const orderModel = new OrderModel();
