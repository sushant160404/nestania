import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Download, 
  ChevronRight, 
  ShoppingBag, 
  RotateCcw,
  ShieldCheck,
  Phone,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const {
    orders,
    recentOrder,
    activeTrackedOrderNumber,
    setActiveTrackedOrderNumber,
    trackOrderById,
    addToCart,
    navigateTo,
    showToast,
  } = useShop();

  const defaultOrder = recentOrder || orders[0] || null;
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (activeTrackedOrderNumber) {
      const match = orders.find(
        o => o.orderNumber.toLowerCase() === activeTrackedOrderNumber.toLowerCase() || o.id === activeTrackedOrderNumber
      );
      if (match) return match;
    }
    return defaultOrder;
  });
  const [searchOrderInput, setSearchOrderInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Sync with route orderNumber
  useEffect(() => {
    if (activeTrackedOrderNumber) {
      trackOrderById(activeTrackedOrderNumber).then(found => {
        if (found) {
          setActiveOrder(found);
        }
      });
    }
  }, [activeTrackedOrderNumber]);

  const handleSelectOrder = (order: Order) => {
    setActiveOrder(order);
    setActiveTrackedOrderNumber(order.orderNumber);
  };

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderInput.trim()) {
      showToast('Please enter an Order ID or Phone number', 'error');
      return;
    }
    setIsSearching(true);
    const found = await trackOrderById(searchOrderInput.trim());
    setIsSearching(false);
    if (found) {
      setActiveOrder(found);
      setActiveTrackedOrderNumber(found.orderNumber);
      showToast(`Found Order #${found.orderNumber}`, 'success');
    } else {
      showToast(`No order found matching "${searchOrderInput}"`, 'error');
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    showToast(`Downloading Tax Invoice for Order #${order.orderNumber}...`, 'info');
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    showToast(`Re-added ${order.items.length} items to your shopping bag!`, 'success');
    navigateTo('cart');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-[#8C7B70] mb-6">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <span className="text-[#2D2723] font-medium">Order Tracking & History</span>
        </nav>

        {/* Top Header & Search Bar */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 mb-8 shadow-xs">
          <div className="max-w-2xl">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2723]">
              Track Your Nestania Orders
            </h1>
            <p className="text-xs sm:text-sm text-[#7D6E63] mt-1 mb-5">
              Enter your Order Reference ID (e.g. NST-2025-8842) or mobile number to track live transit milestones.
            </p>

            <form onSubmit={handleSearchOrder} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchOrderInput}
                  onChange={(e) => setSearchOrderInput(e.target.value)}
                  placeholder="e.g. NST-2025-8842 or 9876543210"
                  className="w-full text-xs sm:text-sm border border-[#DDD3C7] rounded-2xl pl-10 pr-4 py-3 bg-[#FAF8F5] text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-[#8C7B70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                {isSearching ? 'Searching...' : 'Track Order'}
              </button>
            </form>
          </div>
        </div>

        {/* If Active Order Exists */}
        {activeOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            
            {/* ================= LEFT COLUMN: TRACKING MILESTONES (8 cols) ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active Order Card */}
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
                
                {/* Order Meta Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE3D8]">
                  <div>
                    <span className="text-[11px] font-bold text-[#8A5A36] uppercase tracking-wider">
                      Live Shipment Tracker
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl text-[#2D2723] mt-0.5">
                      Order #{activeOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-[#8C7B70] mt-0.5">
                      Placed on {activeOrder.date} • {activeOrder.items.length} {activeOrder.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      {activeOrder.status === 'delivered' ? 'Delivered' : 'In Express Transit'}
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(activeOrder)}
                      className="p-2 text-[#52443C] hover:text-[#8A5A36] rounded-xl border border-[#DDD3C7] bg-[#FAF8F5] hover:bg-white transition-colors cursor-pointer"
                      title="Download Tax Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Estimated Delivery Highlight */}
                <div className="bg-[#FAF6F1] border border-[#EAE0D3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[#8C7B70]">Estimated Doorstep Arrival</span>
                    <p className="font-bold text-sm sm:text-base text-[#2D2723]">
                      {activeOrder.estimatedDelivery || 'Tomorrow, by 6:00 PM'}
                    </p>
                  </div>
                  <div className="text-xs text-[#52443C] sm:text-right">
                    <span className="text-[#8C7B70]">Logistics Partner</span>
                    <p className="font-semibold text-[#2D2723]">BlueDart Express (AWB: BLR98241029)</p>
                  </div>
                </div>

                {/* Step-by-Step Vertical Timeline */}
                <div className="space-y-6 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2723]">
                    Delivery Journey & Milestones
                  </h3>

                  <div className="space-y-6 pl-2 border-l-2 border-[#EBE3D8] ml-3">
                    {(activeOrder.trackingSteps || [
                      { status: 'ordered', title: 'Order Confirmed', description: 'Order verified & payment received', timestamp: '2 days ago', completed: true },
                      { status: 'confirmed', title: 'Packed at Artisan Studio', description: 'Ceramic pieces cushioned in eco-friendly bubble wrap', timestamp: 'Yesterday', completed: true },
                      { status: 'shipped', title: 'Dispatched via BlueDart Express', description: 'Air express logistics to regional hub', timestamp: 'Today', completed: true },
                      { status: 'out_for_delivery', title: 'Out for Delivery', description: 'Delivery agent assigned for doorstep delivery', timestamp: 'Tomorrow', completed: false },
                      { status: 'delivered', title: 'Delivered', description: 'Handed over at doorstep', timestamp: 'Pending', completed: false },
                    ]).map((step, idx) => (
                      <div key={idx} className="relative pl-6 space-y-1">
                        {/* Dot on line */}
                        <div
                          className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                            step.completed
                              ? 'bg-[#8A5A36] border-white text-white shadow-xs'
                              : 'bg-white border-[#DDD3C7] text-[#B8AAA0]'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className={`text-xs sm:text-sm font-semibold ${step.completed ? 'text-[#2D2723]' : 'text-[#8C7B70]'}`}>
                            {step.title}
                          </h4>
                          <span className="text-[11px] text-[#8C7B70] font-medium">{step.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#7D6E63]">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="pt-6 border-t border-[#EBE3D8] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2723]">
                    Items in This Shipment ({activeOrder.items.length})
                  </h3>

                  <div className="divide-y divide-[#F5EFEB]">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-xl object-cover bg-[#F5F2EC] border border-[#EAE3DA]"
                          />
                          <div>
                            <h5 className="font-medium text-xs sm:text-sm text-[#2D2723]">{item.product.name}</h5>
                            <p className="text-xs text-[#8C7B70]">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-[#2D2723]">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleReorder(activeOrder)}
                      className="bg-[#FAF8F5] hover:bg-[#FAF6F1] text-[#8A5A36] border border-[#DDD3C7] px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>


            {/* ================= RIGHT COLUMN: SHIPPING & PAYMENT DETAILS (4 cols) ================= */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Delivery Address Details */}
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 space-y-3 shadow-xs">
                <h3 className="font-serif text-base text-[#2D2723] flex items-center gap-2 border-b border-[#EBE3D8] pb-3">
                  <MapPin className="w-4 h-4 text-[#8A5A36]" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs text-[#52443C] space-y-1">
                  <p className="font-bold text-[#2D2723]">{activeOrder.shippingAddress.fullName}</p>
                  <p className="leading-relaxed">{activeOrder.shippingAddress.street}</p>
                  <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</p>
                  <p className="pt-1 text-[#8C7B70]">Phone: {activeOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 space-y-3 shadow-xs">
                <h3 className="font-serif text-base text-[#2D2723] border-b border-[#EBE3D8] pb-3">
                  Payment Breakdown
                </h3>
                <div className="space-y-2 text-xs text-[#52443C]">
                  <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="font-bold uppercase text-[#2D2723]">{activeOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <span className="text-emerald-700 font-bold uppercase">{activeOrder.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount</span>
                      <span>-₹{activeOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700">{activeOrder.shipping === 0 ? 'FREE' : `₹${activeOrder.shipping}`}</span>
                  </div>
                  <div className="border-t border-[#EBE3D8] pt-2 flex justify-between font-bold text-sm text-[#2D2723]">
                    <span>Total Amount</span>
                    <span className="text-[#8A5A36]">₹{activeOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Customer Support Card */}
              <div className="bg-[#FAF6F1] rounded-3xl border border-[#EAE0D3] p-6 space-y-3">
                <h4 className="font-semibold text-xs text-[#2D2723] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8A5A36]" />
                  Need Help with This Order?
                </h4>
                <p className="text-xs text-[#7D6E63] leading-relaxed">
                  Our concierge customer support is available 7 days a week (9 AM - 8 PM).
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-[#8A5A36]">
                  <Phone className="w-3.5 h-3.5" />
                  <span>support@nestania.in • 1800-419-NEST</span>
                </div>
              </div>

            </div>

          </div>
        ) : null}

        {/* Recent Orders History Table/Cards */}
        {orders.length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-serif text-xl sm:text-2xl text-[#2D2723]">
              Your Order History ({orders.length})
            </h3>

            <div className="space-y-4 divide-y divide-[#EBE3D8]">
              {orders.map((ord) => (
                <div key={ord.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF6F1] border border-[#E8DFD3] flex items-center justify-center text-[#8A5A36] shrink-0 font-bold text-xs">
                      #{ord.orderNumber.split('-').pop()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#2D2723]">
                        Order #{ord.orderNumber}
                      </h4>
                      <p className="text-xs text-[#8C7B70]">
                        Placed on {ord.date} • Total: ₹{ord.total.toLocaleString('en-IN')} ({ord.items.length} items)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        handleSelectOrder(ord);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Track Shipment
                    </button>
                    <button
                      onClick={() => handleReorder(ord)}
                      className="bg-[#FAF8F5] hover:bg-[#FAF6F1] text-[#52443C] border border-[#DDD3C7] px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
