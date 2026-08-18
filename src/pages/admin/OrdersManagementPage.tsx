import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Truck, Package, CheckCircle } from 'lucide-react';

export const OrdersManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update order status via API
      console.log(`Updating order ${orderId} to ${newStatus}`);
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    
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
        <button className="flex items-center gap-2 bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] p-4">
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
    </div>
  );
};
