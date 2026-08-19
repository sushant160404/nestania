import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { ToastContainer } from './components/ToastContainer';

// Full Dedicated Pages (No Popup Pages)
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './components/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { ContactPage } from './pages/ContactPage';

// Admin Panel
import AdminApp from './pages/admin/AdminApp';

function MainApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { currentView, navigateTo } = useShop();

  // Scroll to top on page view switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D2723] flex flex-col font-sans selection:bg-[#8A5A36] selection:text-white">
      {/* Top Announcement Strip */}
      <div className="sticky top-0 z-30 flex flex-col">
        <AnnouncementBar />

        {/* Main Header with Search & Navigation */}
        <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

        {/* Categories Navigation Bar */}
        <Navbar />
      </div>

      {/* Dedicated Full Page Routing (No Popup Pages) */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'category' && <CategoryPage onBackToHome={() => navigateTo('home')} />}
        {currentView === 'product' && <ProductDetailsPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'orders' && <OrderTrackingPage />}
        {currentView === 'account' && <AccountPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Global E-Commerce Footer */}
      <Footer />

      {/* Admin Access Link */}
      <a
        href="/admin"
        className="fixed bottom-4 right-4 w-12 h-12 bg-[#8A5A36] hover:bg-[#6E4223] text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        title="Admin Panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </a>

      {/* Mobile Responsive Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  // Check admin route before initialising the shop context at all
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }

  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
