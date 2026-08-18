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
      <AnnouncementBar />

      {/* Main Header with Search & Navigation */}
      <Header onOpenMobileNav={() => setMobileNavOpen(true)} />

      {/* Categories Navigation Bar */}
      <Navbar />

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
      </main>

      {/* Global E-Commerce Footer */}
      <Footer />

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
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
