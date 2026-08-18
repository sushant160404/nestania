import React, { useState, useEffect } from 'react';
import { LoginPage } from './LoginPage';
import { AdminLayout } from './AdminLayout';
import { DashboardPage } from './DashboardPage';
import { OrdersManagementPage } from './OrdersManagementPage';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const authToken = localStorage.getItem('admin_auth');
    if (authToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Store auth token
    localStorage.setItem('admin_auth', 'authenticated');
    localStorage.setItem('admin_email', email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
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
        return <DashboardPage />;
      case 'orders':
        return <OrdersManagementPage />;
      case 'products':
        return <div className="text-center py-12 text-[#7A6A5E]">Products Management - Coming Soon</div>;
      case 'customers':
        return <div className="text-center py-12 text-[#7A6A5E]">Customers Management - Coming Soon</div>;
      case 'reviews':
        return <div className="text-center py-12 text-[#7A6A5E]">Reviews Management - Coming Soon</div>;
      case 'analytics':
        return <div className="text-center py-12 text-[#7A6A5E]">Analytics - Coming Soon</div>;
      case 'settings':
        return <div className="text-center py-12 text-[#7A6A5E]">Settings - Coming Soon</div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;
