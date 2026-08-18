import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, Home, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    recentOrder,
    trackOrderById,
    showToast,
  } = useShop();

  const [orderQuery, setOrderQuery] = useState(recentOrder?.orderNumber || 'NST-2025-88392');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(recentOrder || null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setIsSearching(true);
    const order = await trackOrderById(orderQuery.trim());
    setIsSearching(false);
    if (order) {
      setTrackedOrder(order);
    } else {
      showToast(`Order #${orderQuery} not found. Try NST-2025-88392`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#EAE3DA] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DE] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#8A5A36]" />
            <h2 className="font-serif text-xl text-[#2D2723] font-normal">
              Track Your Nestania Shipment
            </h2>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] rounded-full hover:bg-[#EDE5DA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A5A36] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order # (e.g. NST-2025-88392)"
                className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Tracking...' : 'TRACK'}
            </button>
          </form>

          {/* Tracked Order Details */}
          {trackedOrder ? (
            <div className="space-y-6">
              
              {/* Summary Header */}
              <div className="bg-[#FAF6F1] p-4 rounded-2xl border border-[#EDE1D3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="text-[11px] text-[#8C7B70]">Order Number</p>
                  <p className="font-bold text-sm text-[#8A5A36]">{trackedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B70]">Order Date</p>
                  <p className="font-semibold text-[#2D2723]">{trackedOrder.date}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B70]">Estimated Arrival</p>
                  <p className="font-semibold text-emerald-800">{trackedOrder.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#8C7B70]">Status</p>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                    {trackedOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Step Timeline */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A36] mb-4">
                  Shipment Progress Timeline
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2D6C8]">
                  {trackedOrder.trackingSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          step.completed
                            ? 'bg-[#8A5A36] border-[#8A5A36] text-white'
                            : 'bg-white border-[#C4B4A4] text-transparent'
                        }`}
                      >
                        {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${step.completed ? 'text-[#2D2723]' : 'text-[#8E7E73]'}`}>
                            {step.title}
                          </p>
                          <span className="text-[11px] text-[#9C8C80]">{step.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#6F6055] mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this shipment */}
              <div className="pt-4 border-t border-[#EDE4D8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8A5A36] mb-3">
                  Items in Shipment ({trackedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {trackedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-[#FAF8F5] rounded-xl border border-[#EDE5DB]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-[#2D2723] truncate">{item.product.name}</p>
                        <p className="text-[#8C7B70]">Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE5DB] text-xs text-[#52443C] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#2D2723]">{trackedOrder.shippingAddress.fullName}</p>
                  <p>{trackedOrder.shippingAddress.street}, {trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} - {trackedOrder.shippingAddress.pincode}</p>
                  <p className="text-[#8C7B70] mt-0.5">Phone: {trackedOrder.shippingAddress.phone}</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#8E7E73]">
              No order tracking information loaded. Please enter your order number above.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
