import React from 'react';
import { Instagram, Facebook, Youtube, Phone, Mail, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const {
    setActiveCategory,
    navigateTo,
    showToast,
  } = useShop();

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#EBE3D7] pt-14 pb-8 text-[#574B42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 5 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#E8DFD3]">
          
          {/* Col 1: Brand & Tagline (4 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-serif text-3xl sm:text-4xl text-[#8A5A36] tracking-tight font-normal block">
              nestania
            </span>
            <p className="text-xs sm:text-sm text-[#7D6E63] leading-relaxed max-w-sm">
              Thoughtfully designed products for everyday living. Made for the moments that matter.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#E3DCCE] flex items-center justify-center text-[#6E5D53] hover:text-[#8A5A36] hover:border-[#8A5A36] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#E3DCCE] flex items-center justify-center text-[#6E5D53] hover:text-[#8A5A36] hover:border-[#8A5A36] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#E3DCCE] flex items-center justify-center text-[#6E5D53] hover:text-[#8A5A36] hover:border-[#8A5A36] transition-colors"
                aria-label="Pinterest"
              >
                <span className="font-serif font-bold text-sm leading-none">P</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#E3DCCE] flex items-center justify-center text-[#6E5D53] hover:text-[#8A5A36] hover:border-[#8A5A36] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Shop Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#2D2723] uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#6E5D53]">
              {[
                'New Arrivals',
                'Dinnerware',
                'Serveware',
                'Drinkware',
                'Home Decor',
                'Kitchen',
                'Gifting',
                'Collections',
                'Sale',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleCategoryNav(item)}
                    className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Help Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#2D2723] uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#6E5D53]">
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              {[
                'FAQs',
                'Shipping Policy',
                'Returns & Refunds',
                'Terms & Conditions',
                'Privacy Policy',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => showToast(`Opening ${item} documentation...`, 'info')}
                    className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: My Account (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-[#2D2723] uppercase tracking-wider">
              My Account
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#6E5D53]">
              <li>
                <button
                  onClick={() => navigateTo('orders')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                >
                  My Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                >
                  Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                >
                  Account Details
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('account')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer"
                >
                  Addresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('orders')}
                  className="hover:text-[#8A5A36] hover:underline transition-colors text-left cursor-pointer font-medium text-[#8A5A36]"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Customer Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-[#2D2723] uppercase tracking-wider">
              Customer Support
            </h4>
            <div className="space-y-3 text-xs sm:text-[13px] text-[#6E5D53]">
              
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+916363670100" className="font-semibold text-[#2D2723] hover:text-[#8A5A36]">
                    +91 6363 670100
                  </a>
                  <p className="text-[11px] text-[#8C7C70]">(Mon - Sat, 10 AM - 7 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:support@nestania.in" className="font-semibold text-[#2D2723] hover:text-[#8A5A36]">
                    support@nestania.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MessageSquare className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                <div>
                  <button
                    onClick={() => showToast('Connecting you to Nestania Luxury Concierge Live Chat...', 'info')}
                    className="font-medium text-[#8A5A36] hover:underline cursor-pointer"
                  >
                    Chat with us
                  </button>
                  <p className="text-[11px] text-[#8C7C70]">Mon - Sat, 10 AM - 7 PM</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7C70]">
          <div>
            © 2025 Nestania. All Rights Reserved.
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-white border border-[#E3DCCE] px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#1A1F71]">
              VISA
            </span>
            <span className="bg-white border border-[#E3DCCE] px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#EB001B]">
              Mastercard
            </span>
            <span className="bg-white border border-[#E3DCCE] px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#097939]">
              RuPay
            </span>
            <span className="bg-white border border-[#E3DCCE] px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#0F75BD]">
              UPI
            </span>
            <span className="bg-white border border-[#E3DCCE] px-2 py-0.5 rounded font-mono text-[10px] font-bold text-[#003087]">
              PayPal
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
