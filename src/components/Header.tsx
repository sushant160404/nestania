import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, X, Sparkles, ChevronRight, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const {
    cart,
    wishlist,
    user,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    setSelectedProduct,
    navigateTo,
  } = useShop();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const trendingSearches = [
    'Dinner Sets',
    'Amber Glassware',
    'Ceramic Mugs',
    'Minimal Vases',
    'Rattan Trays',
    'Festive Gifts',
  ];

  return (
    <header className="bg-white border-b border-[#EBE5DE] transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 text-[#4A3E38] hover:text-[#8A5A36] rounded-md focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Nestania Logo */}
            <button
              onClick={() => {
                setActiveCategory('Home');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-serif text-3xl sm:text-4xl tracking-tight text-[#8A5A36] font-normal transition-colors group-hover:text-[#6E4223]">
                  nestania
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#A8988B] -mt-1 font-medium hidden sm:block">
                  Elevate Your Everyday
                </span>
              </div>
            </button>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for products, categories..."
                className="w-full bg-[#FAF8F5] border border-[#E3DCCE] text-[#332C27] placeholder-[#9E9085] rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-[#8A5A36] focus:bg-white focus:ring-2 focus:ring-[#8A5A36]/15 transition-all shadow-xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-[#9E9085] hover:text-[#332C27] rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchFocused(true)}
                  className="p-1.5 text-[#8A5A36] hover:bg-[#F3EFEA] rounded-full transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#EBE5DE] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {searchQuery.trim() ? (
                  <div className="p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#9E9085] px-3 py-1.5">
                      Products Matching "{searchQuery}" ({searchResults.length})
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-[#F5EFEB]">
                        {searchResults.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setSelectedProduct(prod);
                              setIsSearchFocused(false);
                            }}
                            className="flex items-center gap-3 p-2.5 hover:bg-[#FAF8F5] rounded-xl cursor-pointer transition-colors"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover bg-[#F5EFEB]"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2D2723] truncate">
                                {prod.name}
                              </p>
                              <p className="text-xs text-[#8E7E73]">
                                {prod.category} • <span className="font-semibold text-[#8A5A36]">₹{prod.price.toLocaleString('en-IN')}</span>
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#A8988B]" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-sm text-[#8E7E73]">
                        No matching products found. Try searching "Vase", "Dinnerware", or "Mug".
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9E9085]">
                      <Sparkles className="w-3.5 h-3.5 text-[#8A5A36]" />
                      Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                          }}
                          className="text-xs bg-[#FAF8F5] hover:bg-[#F3EDE6] text-[#554A42] border border-[#EAE3DA] rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                const query = prompt('Search Nestania products:');
                if (query) setSearchQuery(query);
              }}
              className="md:hidden p-2 text-[#4A3E38] hover:text-[#8A5A36]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Sign In / Account */}
            <button
              onClick={() => navigateTo('account')}
              className="flex items-center gap-2 text-sm font-medium text-[#4A3E38] hover:text-[#8A5A36] transition-colors py-1 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E3DCCE] flex items-center justify-center text-[#8A5A36]">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="hidden lg:inline text-xs font-medium">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative flex items-center gap-2 text-sm font-medium text-[#4A3E38] hover:text-[#8A5A36] transition-colors py-1 cursor-pointer"
              title="View Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 transition-transform hover:scale-110" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#A8422B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-medium">Wishlist</span>
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative flex items-center gap-2 text-sm font-medium text-[#4A3E38] hover:text-[#8A5A36] transition-colors py-1 cursor-pointer"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 transition-transform hover:scale-110" />
                <span className="absolute -top-1.5 -right-2 bg-[#8A5A36] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              </div>
              <span className="hidden lg:inline text-xs font-medium">Cart</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
