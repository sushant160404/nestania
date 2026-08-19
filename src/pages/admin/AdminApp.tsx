import React, { useState, useEffect } from 'react';
import { LoginPage } from './LoginPage';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './DashboardPage';
import { OrdersManagementPage } from './OrdersManagementPage';
import { ContactMessagesPage } from './ContactMessagesPage';
import { ProductsManagementPage } from './ProductsManagementPage';
import { ProductFormPage } from './ProductFormPage';
import { SettingsPage } from './SettingsPage';
import { ReviewsManagementPage } from './ReviewsManagementPage';
import { AnalyticsPage } from './AnalyticsPage';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [productFormId, setProductFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Parse URL path and return page info
  // URL format: /admin/products or /admin/products/edit/nest-dw-01
  const parseRoute = (): { page: string; productId: string | null } => {
    const pathname = window.location.pathname;
    // Remove /admin prefix and split
    const path = pathname.replace(/^\/admin\/?/, '');
    const parts = path.split('/').filter(Boolean);

    const page = parts[0] || 'dashboard';

    // Handle product form routes
    if (page === 'products') {
      if (parts[1] === 'add') {
        return { page: 'products-add', productId: null };
      } else if (parts[1] === 'edit' && parts[2]) {
        return { page: 'products-edit', productId: parts[2] };
      }
    }

    return { page, productId: null };
  };

  // Update URL path when navigating
  const updateURL = (page: string, productId?: string | null) => {
    let url = '/admin/dashboard';

    if (page === 'products-add') {
      url = '/admin/products/add';
    } else if (page === 'products-edit' && productId) {
      url = `/admin/products/edit/${productId}`;
    } else if (page === 'products') {
      url = '/admin/products';
    } else if (page !== 'dashboard') {
      url = `/admin/${page}`;
    }

    window.history.pushState(null, '', url);
  };

  // Initialize: check auth and parse initial route
  useEffect(() => {
    const authToken = localStorage.getItem('admin_auth');
    if (authToken) {
      setIsAuthenticated(true);
      const route = parseRoute();
      setCurrentPage(route.page);
      setProductFormId(route.productId);
    }
    setLoading(false);
  }, []);

  // Listen to browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      if (isAuthenticated) {
        const route = parseRoute();
        setCurrentPage(route.page);
        setProductFormId(route.productId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const handleLogin = (email: string, password: string) => {
    localStorage.setItem('admin_auth', 'authenticated');
    localStorage.setItem('admin_email', email);
    setIsAuthenticated(true);
    updateURL('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setProductFormId(null);
    window.location.href = '/';
  };

  const navigateTo = (page: string, productId?: string | null) => {
    setCurrentPage(page);
    setProductFormId(productId || null);
    updateURL(page, productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8A5A36] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7A6A5E]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'orders':
        return <OrdersManagementPage />;
      case 'contacts':
        return <ContactMessagesPage />;
      case 'products':
        return (
          <ProductsManagementPage
            onAdd={() => navigateTo('products-add')}
            onEdit={(id) => navigateTo('products-edit', id)}
          />
        );
      case 'products-add':
        return (
          <ProductFormPage
            productId={null}
            onBack={() => navigateTo('products')}
            onSaved={() => navigateTo('products')}
          />
        );
      case 'products-edit':
        return (
          <ProductFormPage
            productId={productFormId}
            onBack={() => navigateTo('products')}
            onSaved={() => navigateTo('products')}
          />
        );
      case 'customers':
        return <div className="text-center py-12 text-[#7A6A5E]">Customers Management - Coming Soon</div>;
      case 'reviews':
        return <ReviewsManagementPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={navigateTo}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;
