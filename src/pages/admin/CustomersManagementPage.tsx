import React, { useState, useEffect, useMemo } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag, Eye, Download, Users, TrendingUp, ArrowUpDown } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: any[];
  firstOrderDate: string;
  orderCount: number;
  totalSpent: number;
}

type SortKey = 'name' | 'orderCount' | 'totalSpent' | 'firstOrderDate';
type SortDir = 'asc' | 'desc';

export const CustomersManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('totalSpent');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const orders = await res.json();
      setAllOrders(orders);

      const customerMap = new Map<string, Customer>();

      orders.forEach((order: any) => {
        const addr = order.shippingAddress || {};
        // email may be on shippingAddress or at order level
        const email = (addr.email || order.email || '').toLowerCase();
        const key = email || `${addr.fullName}-${addr.phone}`.toLowerCase();
        if (!key) return;

        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: key,
            name: addr.fullName || 'Unknown',
            email,
            phone: addr.phone || '',
            addresses: [],
            firstOrderDate: order.date,
            orderCount: 0,
            totalSpent: 0,
          });
        }

        const c = customerMap.get(key)!;
        c.orderCount += 1;
        c.totalSpent += order.total || 0;

        // Keep earliest order date
        if (order.date && order.date < c.firstOrderDate) {
          c.firstOrderDate = order.date;
        }

        // Deduplicate addresses by street+pincode
        const addrKey = `${addr.street || addr.addressLine1 || ''}-${addr.pincode || ''}`;
        if (addrKey !== '-' && !c.addresses.find((a: any) =>
          `${a.street || a.addressLine1 || ''}-${a.pincode || ''}` === addrKey
        )) {
          c.addresses.push(addr);
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (e) {
      console.error(e);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );

    result.sort((a, b) => {
      let diff = 0;
      if (sortKey === 'name') diff = a.name.localeCompare(b.name);
      else if (sortKey === 'orderCount') diff = a.orderCount - b.orderCount;
      else if (sortKey === 'totalSpent') diff = a.totalSpent - b.totalSpent;
      else if (sortKey === 'firstOrderDate') diff = a.firstOrderDate.localeCompare(b.firstOrderDate);
      return sortDir === 'asc' ? diff : -diff;
    });

    return result;
  }, [customers, searchQuery, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = customers.length;
    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { total, totalRevenue, totalOrders, avgOrderValue };
  }, [customers]);

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    const orders = allOrders.filter((o: any) => {
      const addr = o.shippingAddress || {};
      const email = (addr.email || o.email || '').toLowerCase();
      const key = email || `${addr.fullName}-${addr.phone}`.toLowerCase();
      return key === customer.id;
    });
    setCustomerOrders(orders.sort((a: any, b: any) => b.date.localeCompare(a.date)));
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Phone', 'Total Orders', 'Total Spent (₹)', 'Avg Order (₹)', 'First Order'],
      ...filteredAndSorted.map(c => [
        `"${c.name}"`,
        c.email,
        c.phone || 'N/A',
        c.orderCount,
        c.totalSpent.toFixed(2),
        c.orderCount > 0 ? (c.totalSpent / c.orderCount).toFixed(2) : '0',
        new Date(c.firstOrderDate).toLocaleDateString('en-IN'),
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      confirmed:        { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Confirmed' },
      shipped:          { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Shipped' },
      out_for_delivery: { bg: 'bg-cyan-100',   text: 'text-cyan-700',   label: 'Out for Delivery' },
      delivered:        { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Delivered' },
      cancelled:        { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled' },
    };
    const cfg = map[status] || { bg: 'bg-blue-100', text: 'text-blue-700', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
    );
  };

  const SortHeader: React.FC<{ label: string; sortK: SortKey }> = ({ label, sortK }) => (
    <th
      className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase cursor-pointer select-none hover:text-[#2D2723] transition-colors"
      onClick={() => handleSort(sortK)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === sortK ? 'text-[#8A5A36]' : 'opacity-40'}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2723]">Customers</h1>
          <p className="text-sm text-[#7A6A5E] mt-1">View and manage your customer base</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filteredAndSorted.length === 0}
          className="flex items-center gap-2 bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Customers',
            value: stats.total.toLocaleString('en-IN'),
            icon: <Users className="w-5 h-5 text-[#8A5A36]" />,
            bg: 'bg-[#8A5A36]/10',
          },
          {
            label: 'Total Orders',
            value: stats.totalOrders.toLocaleString('en-IN'),
            icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
            bg: 'bg-blue-100',
          },
          {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            icon: <span className="text-base font-bold text-green-600">₹</span>,
            bg: 'bg-green-100',
          },
          {
            label: 'Avg Order Value',
            value: `₹${Math.round(stats.avgOrderValue).toLocaleString('en-IN')}`,
            icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
            bg: 'bg-purple-100',
          },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E3DCCE] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#7A6A5E]">{s.label}</p>
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                {s.icon}
              </div>
            </div>
            <p className="text-xl font-bold text-[#2D2723]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8988B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E3DCCE] rounded-lg text-sm focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/20"
          />
        </div>
        {filteredAndSorted.length > 0 && (
          <p className="text-xs text-[#7A6A5E] mt-2">{filteredAndSorted.length} customer{filteredAndSorted.length !== 1 ? 's' : ''} found</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E3DCCE] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-[#7A6A5E]">
            <div className="w-8 h-8 border-2 border-[#8A5A36] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading customers...
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="p-16 text-center text-[#7A6A5E]">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No customers found</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-2 text-sm text-[#8A5A36] underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAF8F5]">
                <tr>
                  <SortHeader label="Customer" sortK="name" />
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Contact</th>
                  <SortHeader label="Orders" sortK="orderCount" />
                  <SortHeader label="Total Spent" sortK="totalSpent" />
                  <SortHeader label="Since" sortK="firstOrderDate" />
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#7A6A5E] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE9]">
                {filteredAndSorted.map(customer => (
                  <tr key={customer.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#8A5A36]/10 flex items-center justify-center text-[#8A5A36] font-semibold text-sm shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#2D2723] flex items-center gap-2">
                            {customer.name}
                            {customer.orderCount > 2 && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded">Loyal</span>
                            )}
                          </div>
                          {customer.email && (
                            <div className="text-xs text-[#7A6A5E] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {customer.phone ? (
                        <div className="flex items-center gap-1 text-sm text-[#7A6A5E]">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      ) : (
                        <span className="text-xs text-[#A8988B]">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-[#8A5A36]/10 text-[#8A5A36] rounded-full text-xs font-semibold">
                        {customer.orderCount} order{customer.orderCount !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-[#2D2723]">
                          ₹{customer.totalSpent.toLocaleString('en-IN')}
                        </p>
                        {customer.orderCount > 0 && (
                          <p className="text-xs text-[#7A6A5E]">
                            avg ₹{Math.round(customer.totalSpent / customer.orderCount).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#7A6A5E]">
                      {new Date(customer.firstOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewCustomerDetails(customer)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#8A5A36] border border-[#8A5A36]/30 hover:bg-[#8A5A36]/10 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#E3DCCE] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8A5A36]/10 flex items-center justify-center text-[#8A5A36] font-bold">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#2D2723]">{selectedCustomer.name}</h2>
                  <p className="text-xs text-[#7A6A5E]">Customer since {new Date(selectedCustomer.firstOrderDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-[#7A6A5E] hover:bg-[#FAF8F5] rounded-lg transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-[#7A6A5E] uppercase mb-3">Contact</h3>
                  <div className="space-y-2 text-sm">
                    {selectedCustomer.email && (
                      <div className="flex items-center gap-2 text-[#4A3E38]">
                        <Mail className="w-4 h-4 text-[#7A6A5E]" />
                        {selectedCustomer.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#4A3E38]">
                      <Phone className="w-4 h-4 text-[#7A6A5E]" />
                      {selectedCustomer.phone || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-[#7A6A5E] uppercase mb-3">Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5E]">Total Orders</span>
                      <span className="font-semibold text-[#2D2723]">{selectedCustomer.orderCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5E]">Total Spent</span>
                      <span className="font-semibold text-[#2D2723]">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6A5E]">Avg Order</span>
                      <span className="font-semibold text-[#2D2723]">
                        ₹{selectedCustomer.orderCount > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.orderCount).toLocaleString('en-IN') : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {selectedCustomer.addresses.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#2D2723] mb-3">Delivery Addresses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCustomer.addresses.map((addr: any, i: number) => (
                      <div key={i} className="bg-[#FAF8F5] rounded-xl p-4 text-sm flex gap-2">
                        <MapPin className="w-4 h-4 text-[#7A6A5E] mt-0.5 shrink-0" />
                        <div className="text-[#4A3E38]">
                          <p className="font-medium">{addr.fullName}</p>
                          <p>{addr.street || addr.addressLine1}</p>
                          {(addr.apartment || addr.addressLine2) && <p>{addr.apartment || addr.addressLine2}</p>}
                          <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History */}
              <div>
                <h3 className="text-sm font-semibold text-[#2D2723] mb-3">Order History ({customerOrders.length})</h3>
                {customerOrders.length === 0 ? (
                  <div className="text-center py-8 text-[#7A6A5E] text-sm bg-[#FAF8F5] rounded-xl">
                    No orders found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order: any) => (
                      <div key={order.id} className="bg-[#FAF8F5] rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#2D2723]">{order.orderNumber}</p>
                          <p className="text-xs text-[#7A6A5E] mt-0.5">
                            {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#2D2723]">₹{(order.total || 0).toLocaleString('en-IN')}</p>
                          <div className="mt-1">{getStatusBadge(order.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagementPage;
