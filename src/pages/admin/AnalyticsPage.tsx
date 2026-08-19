import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Star, Eye } from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
    data: { month: string; revenue: number }[];
  };
  orders: {
    current: number;
    previous: number;
    change: number;
    data: { month: string; orders: number }[];
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  categoryPerformance: {
    category: string;
    orders: number;
    revenue: number;
    percentage: number;
  }[];
}

export const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock analytics data - in production, this would be an API call
      const mockData: AnalyticsData = {
        revenue: {
          current: 125000,
          previous: 98000,
          change: 27.5,
          data: [
            { month: 'Jan', revenue: 45000 },
            { month: 'Feb', revenue: 52000 },
            { month: 'Mar', revenue: 48000 },
            { month: 'Apr', revenue: 61000 },
            { month: 'May', revenue: 58000 },
            { month: 'Jun', revenue: 72000 }
          ]
        },
        orders: {
          current: 342,
          previous: 284,
          change: 20.4,
          data: [
            { month: 'Jan', orders: 45 },
            { month: 'Feb', orders: 52 },
            { month: 'Mar', orders: 48 },
            { month: 'Apr', orders: 61 },
            { month: 'May', orders: 58 },
            { month: 'Jun', orders: 78 }
          ]
        },
        customers: {
          current: 1247,
          previous: 1089,
          change: 14.5
        },
        topProducts: [
          { id: '1', name: 'Rustic Clay Coffee Mug', sales: 89, revenue: 26700 },
          { id: '2', name: 'Handcrafted Ceramic Bowl Set', sales: 67, revenue: 46900 },
          { id: '3', name: 'Minimalist Ceramic Vase', sales: 45, revenue: 31500 },
          { id: '4', name: 'Artisan Dinner Plate Set', sales: 34, revenue: 23800 },
          { id: '5', name: 'Terra Cotta Planter', sales: 28, revenue: 16800 }
        ],
        categoryPerformance: [
          { category: 'Mugs & Cups', orders: 156, revenue: 46800, percentage: 35.2 },
          { category: 'Bowls', orders: 89, revenue: 62300, percentage: 26.0 },
          { category: 'Vases', orders: 67, revenue: 47000, percentage: 19.6 },
          { category: 'Plates', orders: 45, revenue: 31500, percentage: 13.2 },
          { category: 'Planters', orders: 23, revenue: 13800, percentage: 6.0 }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8A5A36] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7A6A5E]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-[#8A5A36]" />
            Analytics Dashboard
          </h1>
          <p className="text-[#7A6A5E] mt-1">Track your store's performance and insights</p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 border border-[#E5DDD5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#8A5A36] bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#8A5A36]" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              analyticsData.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.revenue.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(analyticsData.revenue.change)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#2C1810]">{formatCurrency(analyticsData.revenue.current)}</h3>
          <p className="text-[#7A6A5E] text-sm">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              analyticsData.orders.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.orders.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(analyticsData.orders.change)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#2C1810]">{analyticsData.orders.current.toLocaleString()}</h3>
          <p className="text-[#7A6A5E] text-sm">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              analyticsData.customers.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analyticsData.customers.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(analyticsData.customers.change)}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#2C1810]">{analyticsData.customers.current.toLocaleString()}</h3>
          <p className="text-[#7A6A5E] text-sm">Total Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center gap-1 text-sm text-[#7A6A5E]">
              <TrendingUp className="w-4 h-4" />
              AOV
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#2C1810]">
            {formatCurrency(Math.round(analyticsData.revenue.current / analyticsData.orders.current))}
          </h3>
          <p className="text-[#7A6A5E] text-sm">Average Order Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD5]">
          <div className="p-6 border-b border-[#E5DDD5]">
            <h2 className="font-semibold text-[#2C1810] flex items-center gap-2">
              <Star className="w-5 h-5 text-[#8A5A36]" />
              Top Selling Products
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FAF8F5] rounded-lg flex items-center justify-center text-sm font-medium text-[#8A5A36]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-[#2C1810]">{product.name}</p>
                      <p className="text-sm text-[#7A6A5E]">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2C1810]">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD5]">
          <div className="p-6 border-b border-[#E5DDD5]">
            <h2 className="font-semibold text-[#2C1810] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8A5A36]" />
              Category Performance
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#2C1810]">{category.category}</span>
                    <span className="text-sm text-[#7A6A5E]">{category.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#8A5A36] h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-[#7A6A5E] min-w-0">
                      {formatCurrency(category.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD5]">
        <div className="p-6 border-b border-[#E5DDD5]">
          <h2 className="font-semibold text-[#2C1810] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8A5A36]" />
            Revenue Trend
          </h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-center justify-center bg-[#FAF8F5] rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[#8A5A36] mx-auto mb-3" />
              <p className="text-[#7A6A5E]">Chart visualization would be implemented here</p>
              <p className="text-sm text-[#7A6A5E] mt-1">Integration with Chart.js, D3, or similar library recommended</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;