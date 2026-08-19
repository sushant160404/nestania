import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Truck, Package, CheckCircle } from 'lucide-react';

export const OrdersManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Refresh orders after successful update
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order status');
    }
  };

  const exportOrders = () => {
    // Create CSV content
    const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Payment Method'];
    const csvRows = [headers.join(',')];
    
    filteredOrders.forEach(order => {
      const row = [
        order.orderNumber,
        order.date,
        order.shippingAddress?.fullName || 'N/A',
        order.shippingAddress?.email || 'N/A',
        order.shippingAddress?.phone || 'N/A',
        order.total,
        order.status,
        order.paymentMethod
      ];
      csvRows.push(row.join(','));
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      ordered: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ordered' },
      confirmed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Confirmed' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Shipped' },
      out_for_delivery: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Out for Delivery' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.ordered;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2723] mb-2">Orders Management</h1>
          <p className="text-sm text-[#7A6A5E]">Manage and track all customer orders</p>
        </div>
        <button 
          onClick={exportOrders}
          disabled={filteredOrders.length === 0}
          className="flex items-center gap-2 bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8988B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or customer name..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DCCE] rounded-lg text-sm focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/20"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#FAF8F5] border border-[#E3DCCE] rounded-lg text-sm focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/20"
          >
            <option value="all">All Status</option>
            <option value="ordered">Ordered</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7A6A5E]">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#7A6A5E]">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F5]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE9]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2D2723]">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7A6A5E]">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#2D2723]">
                          {order.shippingAddress?.fullName || 'N/A'}
                        </div>
                        <div className="text-xs text-[#7A6A5E]">
                          {order.shippingAddress?.city || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7A6A5E]">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2D2723]">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-[#8A5A36] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as Shipped"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Delivered"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-[#E3DCCE] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#2D2723]">Order Details</h2>
                  <p className="text-sm text-[#7A6A5E] mt-1">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-[#7A6A5E] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#7A6A5E] mb-1">Order Date</p>
                  <p className="text-sm font-medium text-[#2D2723]">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A6A5E] mb-1">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-xs text-[#7A6A5E] mb-1">Payment Method</p>
                  <p className="text-sm font-medium text-[#2D2723] uppercase">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A6A5E] mb-1">Payment Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-[#2D2723] mb-2">Shipping Address</h3>
                <div className="bg-[#FAF8F5] rounded-lg p-4 text-sm text-[#4A3E38]">
                  <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                  <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                  {selectedOrder.shippingAddress?.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}</p>
                  <p className="mt-2">Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-[#2D2723] mb-2">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-3 bg-[#FAF8F5] rounded-lg p-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#2D2723]">{item.name}</p>
                        <p className="text-xs text-[#7A6A5E]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#2D2723]">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-[#E3DCCE] pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#7A6A5E]">Subtotal</span>
                    <span className="font-medium">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#7A6A5E]">Shipping</span>
                    <span className="font-medium">₹{selectedOrder.shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#2D2723] pt-2 border-t border-[#E3DCCE]">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="flex gap-3">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#E3DCCE] rounded-lg text-sm focus:outline-none focus:border-[#8A5A36]"
                >
                  <option value="ordered">Ordered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
