import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  Star
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate,
  onLogout 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E3DCCE] transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[#E3DCCE]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl text-[#8A5A36]">nestania</h1>
                <p className="text-xs text-[#7A6A5E]">Admin Panel</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-[#7A6A5E] hover:text-[#2D2723]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#8A5A36] text-white'
                          : 'text-[#4A3E38] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#E3DCCE]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E3DCCE] px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#4A3E38] hover:bg-[#FAF8F5] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              {/* Admin Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[#2D2723]">Admin User</p>
                  <p className="text-xs text-[#7A6A5E]">admin@nestania.com</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#8A5A36] flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
