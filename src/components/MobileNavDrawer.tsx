import React from 'react';
import { X, Sparkles, Tag, Heart, ShoppingBag, User as UserIcon, Package, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeCategory,
    setActiveCategory,
    setSearchQuery,
    navigateTo,
  } = useShop();

  if (!isOpen) return null;

  const categories = [
    { name: 'New Arrivals', badge: 'Drops' },
    { name: 'Dinnerware', badge: 'Sets & Plates' },
    { name: 'Serveware', badge: 'Trays & Bowls' },
    { name: 'Drinkware', badge: 'Glassware' },
    { name: 'Home Decor', badge: 'Vases & Candles' },
    { name: 'Kitchen', badge: 'Storage & Jars' },
    { name: 'Gifting', badge: 'Hampers' },
    { name: 'Collections', badge: 'Curated' },
    { name: 'Sale', badge: 'Up to 40% Off', isSale: true },
  ];

  const handleSelect = (catName: string) => {
    setActiveCategory(catName);
    setSearchQuery('');
    onClose();
    navigateTo('category', { category: catName });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-start animate-in fade-in duration-200 lg:hidden">
      
      <div className="bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col justify-between border-r border-[#EBE3D7] animate-in slide-in-from-left duration-300">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[#EBE5DE] bg-[#FAF8F5] flex items-center justify-between">
          <span className="font-serif text-2xl text-[#8A5A36] font-normal">
            nestania
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] rounded-full hover:bg-[#EDE5DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#A8988B] px-3 py-2">
            Explore Catalog
          </div>

          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => handleSelect(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  cat.isSale
                    ? 'text-[#C0392B] bg-red-50/70 font-semibold'
                    : isSelected
                    ? 'bg-[#FAF6F1] text-[#8A5A36] font-bold'
                    : 'text-[#4A3E38] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{cat.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    cat.isSale ? 'bg-red-100 text-red-800' : 'bg-[#F2ECE3] text-[#78675C]'
                  }`}>
                    {cat.badge}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C4B7AC]" />
                </div>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-[#F0EAE2] space-y-1">
            <button
              onClick={() => {
                onClose();
                navigateTo('account');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#52443C] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#8A5A36]" />
              <span>Sign In / My Account</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigateTo('wishlist');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#52443C] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#A8422B]" />
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigateTo('orders');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#52443C] hover:bg-[#FAF8F5] rounded-xl cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#8A5A36]" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBE3D7] bg-[#FAF8F5] text-xs text-[#7A6A5E]">
          <p className="font-semibold text-[#8A5A36]">Helpline: +91 6363 670100</p>
          <p className="text-[11px] mt-0.5">Mon - Sat, 10 AM - 7 PM</p>
        </div>

      </div>

      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
