import React, { useState } from 'react';
import { ChevronDown, Sparkles, Tag, Flame, Gift, Wine, Utensils, Home, Coffee } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavItem {
  name: string;
  categoryValue: string;
  isSale?: boolean;
  subcategories?: string[];
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { activeCategory, setActiveCategory, setSearchQuery } = useShop();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      name: 'New Arrivals',
      categoryValue: 'New Arrivals',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
      subcategories: ['This Week’s Drops', 'Spring Collection', 'Handcrafted Ceramics', 'Amber Glass Range'],
    },
    {
      name: 'Dinnerware',
      categoryValue: 'Dinnerware',
      icon: <Utensils className="w-3.5 h-3.5" />,
      subcategories: ['Dinner Sets (16 & 24 pcs)', 'Salad & Soup Bowls', 'Quarter Plates', 'Dessert Plates', 'Pasta Bowls'],
    },
    {
      name: 'Serveware',
      categoryValue: 'Serveware',
      icon: <Flame className="w-3.5 h-3.5" />,
      subcategories: ['Handwoven Rattan Trays', 'Acacia Wood Platters', 'Cake Stands with Cloche', 'Dip & Chip Bowls', 'Cheese Boards'],
    },
    {
      name: 'Drinkware',
      categoryValue: 'Drinkware',
      icon: <Wine className="w-3.5 h-3.5" />,
      subcategories: ['Amber Glass Tumblers', 'Floral Ceramic Mugs', 'Ribbed Glass Pitchers', 'Stemware & Highballs', 'Coffee Cups & Saucers'],
    },
    {
      name: 'Home Decor',
      categoryValue: 'Home Decor',
      icon: <Home className="w-3.5 h-3.5" />,
      subcategories: ['Minimalist Ceramic Vases', 'Stoneware Candle Holders', 'Sculptural Urns', 'Soy Wax Candles', 'Accent Mirrors'],
    },
    {
      name: 'Kitchen',
      categoryValue: 'Kitchen',
      icon: <Coffee className="w-3.5 h-3.5" />,
      subcategories: ['Ceramic Canisters & Jars', 'Teapots with Infusers', 'Oil Cruets & Dispensers', 'Spice Cellars & Salt Pots', 'Utensil Holders'],
    },
    {
      name: 'Gifting',
      categoryValue: 'Gifting',
      icon: <Gift className="w-3.5 h-3.5 text-amber-700" />,
      subcategories: ['Curated Festive Hampers', 'Wedding Gift Sets', 'Housewarming Essentials', 'Luxury Gift Boxes', 'Corporate Gifts'],
    },
    {
      name: 'Collections',
      categoryValue: 'Collections',
      subcategories: ['Ivory Bloom Heritage', 'Nordic Earth Tones', 'Golden Blossom Luxe', 'Boho Rattan Living', 'Mediterranean Sun'],
    },
    {
      name: 'Sale',
      categoryValue: 'Sale',
      isSale: true,
      icon: <Tag className="w-3.5 h-3.5 text-[#C0392B]" />,
      subcategories: ['Flat 40% Off', 'Under ₹999 Specials', 'Clearance Tableware', 'Bundle Deals (Buy 2 Get 1)'],
    },
  ];

  const handleCategoryClick = (catVal: string) => {
    setActiveCategory(catVal);
    setSearchQuery('');
    setHoveredMenu(null);
  };

  return (
    <nav className="bg-white border-b border-[#EAE3DA] hidden lg:block relative z-10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center gap-1 xl:gap-3 py-1">
          {navItems.map((item) => {
            const isActive = activeCategory === item.categoryValue;
            const isHovered = hoveredMenu === item.name;

            return (
              <li
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.name)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  onClick={() => handleCategoryClick(item.categoryValue)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-[13.5px] font-medium transition-all rounded-md cursor-pointer ${
                    item.isSale
                      ? 'text-[#C0392B] font-semibold hover:text-[#96261A]'
                      : isActive
                      ? 'text-[#8A5A36] font-semibold bg-[#FAF6F1]'
                      : 'text-[#4A3E38] hover:text-[#8A5A36] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {item.name}
                  {item.subcategories && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-[#8A5A36]' : 'text-[#A8988B]'
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Mega Menu */}
                {item.subcategories && isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-xl shadow-xl border border-[#EBE5DE] py-3 px-4 w-64">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#A8988B] mb-2 px-2 flex items-center gap-1.5">
                        {item.icon}
                        {item.name} Categories
                      </div>
                      <div className="space-y-1">
                        {item.subcategories.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleCategoryClick(item.categoryValue);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-xs text-[#52443C] hover:text-[#8A5A36] hover:bg-[#FAF6F1] rounded-lg transition-colors cursor-pointer"
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#F2EDE8]">
                        <button
                          onClick={() => handleCategoryClick(item.categoryValue)}
                          className="text-[11px] font-semibold text-[#8A5A36] hover:underline px-2 flex items-center justify-between w-full"
                        >
                          <span>Explore All {item.name}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
