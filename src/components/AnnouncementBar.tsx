import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Package, HelpCircle, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="bg-[#8A5A36] text-[#FDFBF7] text-xs font-normal py-2 px-4 tracking-wide relative z-30 border-b border-[#784E2E]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Left assurances */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap text-[11px] sm:text-xs text-[#FAF4ED]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#F5DECD]" />
            Free Shipping on Orders Above ₹999
          </span>
          <span className="text-[#BFA188] hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            Easy 7 Days Returns
          </span>
          <span className="text-[#BFA188] hidden md:inline">|</span>
          <span className="flex items-center gap-1.5 hidden md:flex">
            Secure Payments
          </span>
        </div>

        {/* Right utility links */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs text-[#FAF4ED]">
          <button 
            onClick={() => navigateTo('orders')} 
            className="flex items-center gap-1 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            <Package className="w-3 h-3 text-[#F5DECD]" />
            <span>Track Order</span>
          </button>
          <span className="text-[#BFA188]">|</span>
          <button 
            onClick={() => navigateTo('account')} 
            className="flex items-center gap-1 hover:text-white hover:underline cursor-pointer transition-colors"
          >
            <HelpCircle className="w-3 h-3 text-[#F5DECD]" />
            <span>Help & Support</span>
          </button>
          <span className="text-[#BFA188] hidden lg:inline">|</span>
          <a 
            href="tel:+919876543210" 
            className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-[#F5DECD]" />
            <span>+91 98765 43210</span>
          </a>
        </div>
      </div>
    </div>
  );
};
