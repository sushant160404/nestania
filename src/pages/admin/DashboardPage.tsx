import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  pendingOrders: number;
  pendingChange: number;
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    pendingOrders: 0,
    pendingChange: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await fetch('/api/orders');
      const orders = await ordersRes.json();

      // Calculate stats
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o: any) => o.status === 'ordered' || o.status === 'confirmed').length;

      setStats({
        totalRevenue,
        revenueChange: 12.5,
        totalOrders,
        ordersChange: 8.2,
        totalCustomers: 1247,
        customersChange: 5.4,
        pendingOrders,
        pendingChange: -3.1,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-sm text-[#7A6A5E] mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[#2D2723]">{value}</p>
    </div>
  );

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
      <div>
        <h1 className="text-2xl font-bold text-[#2D2723] mb-2">Dashboard Overview</h1>
        <p className="text-sm text-[#7A6A5E]">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          change={stats.revenueChange}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change={stats.customersChange}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          change={stats.pendingChange}
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          color="bg-amber-100"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] overflow-hidden">
        <div className="p-6 border-b border-[#E3DCCE]">
          <h2 className="text-lg font-semibold text-[#2D2723]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF8F5]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE9]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2D2723]">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7A6A5E]">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2723]">
                    {order.shippingAddress?.fullName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#2D2723]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 hover:shadow-md transition-shadow cursor-pointer">
          <Package className="w-8 h-8 text-[#8A5A36] mb-3" />
          <h3 className="font-semibold text-[#2D2723] mb-1">Manage Products</h3>
          <p className="text-sm text-[#7A6A5E]">Add, edit, or remove products</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 hover:shadow-md transition-shadow cursor-pointer">
          <ShoppingBag className="w-8 h-8 text-[#8A5A36] mb-3" />
          <h3 className="font-semibold text-[#2D2723] mb-1">Process Orders</h3>
          <p className="text-sm text-[#7A6A5E]">View and update order status</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E3DCCE] p-6 hover:shadow-md transition-shadow cursor-pointer">
          <BarChart3 className="w-8 h-8 text-[#8A5A36] mb-3" />
          <h3 className="font-semibold text-[#2D2723] mb-1">View Analytics</h3>
          <p className="text-sm text-[#7A6A5E]">Track sales and performance</p>
        </div>
      </div>
    </div>
  );
};
