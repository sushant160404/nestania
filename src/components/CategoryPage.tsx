import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, 
  Heart, 
  ShoppingBag, 
  Star, 
  SlidersHorizontal, 
  X, 
  Check, 
  Grid3X3, 
  LayoutGrid,
  Gift,
  RotateCcw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface CategoryPageProps {
  onBackToHome?: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onBackToHome }) => {
  const { 
    activeCategory, 
    setActiveCategory, 
    setSelectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    showToast,
    searchQuery,
    setSearchQuery 
  } = useShop();

  // Filters State
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(6999);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'4col' | 'compact'>('4col');
  const [showMoreSubcategories, setShowMoreSubcategories] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Subcategory list definitions
  const allSubcategories = [
    { name: 'Dinner Plates', count: 45 },
    { name: 'Side Plates', count: 38 },
    { name: 'Bowls', count: 52 },
    { name: 'Mugs & Cups', count: 41 },
    { name: 'Dinner Sets', count: 30 },
    { name: 'Serving Bowls', count: 28 },
    { name: 'Platters & Trays', count: 24 },
    { name: 'Vases & Accent Decor', count: 18 },
    { name: 'Glassware & Highballs', count: 22 },
  ];

  const materialOptions = [
    { name: 'Porcelain', count: 62 },
    { name: 'Ceramic', count: 58 },
    { name: 'Stoneware', count: 34 },
    { name: 'Bone China', count: 29 },
    { name: 'Glass', count: 18 },
  ];

  const colorOptions = [
    { name: 'Beige', label: 'Beige / Cream', hex: '#EBE4D8' },
    { name: 'Pink', label: 'Peach / Blush', hex: '#E6B8A2' },
    { name: 'Green', label: 'Sage / Olive', hex: '#B5C99A' },
    { name: 'Blue', label: 'Dusty Blue', hex: '#98C1D9' },
    { name: 'Tan', label: 'Warm Tan', hex: '#DDA15E' },
    { name: 'Black', label: 'Charcoal Black', hex: '#2B2D42' },
    { name: 'White', label: 'Pure White', hex: '#FFFFFF' },
  ];

  const patternOptions = [
    { name: 'Floral', count: 48 },
    { name: 'Solid', count: 36 },
    { name: 'Geometric', count: 22 },
    { name: 'Abstract', count: 18 },
    { name: 'Vintage', count: 14 },
  ];

  const occasionOptions = [
    { name: 'Everyday Use', count: 65 },
    { name: 'Special Occasions', count: 32 },
    { name: 'Festive', count: 27 },
    { name: 'Gifting', count: 26 },
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory, 
    selectedSubcategories, 
    selectedMaterials, 
    priceRange, 
    selectedColors, 
    selectedPatterns, 
    selectedOccasions, 
    sortBy, 
    searchQuery
  ]);

  const clearAllFilters = () => {
    setSelectedSubcategories([]);
    setSelectedMaterials([]);
    setPriceRange(6999);
    setSelectedColors([]);
    setSelectedPatterns([]);
    setSelectedOccasions([]);
    setSearchQuery('');
  };

  const hasActiveFilters = 
    selectedSubcategories.length > 0 ||
    selectedMaterials.length > 0 ||
    priceRange < 6999 ||
    selectedColors.length > 0 ||
    selectedPatterns.length > 0 ||
    selectedOccasions.length > 0 ||
    searchQuery.trim().length > 0;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category check (if activeCategory is not 'All')
      if (activeCategory && activeCategory !== 'All' && activeCategory !== 'New Arrivals' && activeCategory !== 'Collections' && activeCategory !== 'Sale') {
        if (item.category !== activeCategory) return false;
      }

      if (activeCategory === 'Sale' && !item.isSale && (!item.originalPrice || item.originalPrice <= item.price)) {
        return false;
      }

      if (activeCategory === 'New Arrivals' && !item.isNew && !item.isBestSeller) {
        return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesSub = item.subcategory?.toLowerCase().includes(query);
        const matchesTag = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesSub && !matchesTag) return false;
      }

      // Subcategory check
      if (selectedSubcategories.length > 0) {
        if (!item.subcategory || !selectedSubcategories.includes(item.subcategory)) return false;
      }

      // Material check
      if (selectedMaterials.length > 0) {
        if (!item.materialCategory || !selectedMaterials.includes(item.materialCategory)) return false;
      }

      // Price check
      if (item.price > priceRange) return false;

      // Color check
      if (selectedColors.length > 0) {
        if (!item.colorFamily || !selectedColors.includes(item.colorFamily)) return false;
      }

      // Pattern check
      if (selectedPatterns.length > 0) {
        if (!item.patternType || !selectedPatterns.includes(item.patternType)) return false;
      }

      // Occasion check
      if (selectedOccasions.length > 0) {
        if (!item.occasionType || !selectedOccasions.includes(item.occasionType)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // default: popular
      return b.reviewsCount - a.reviewsCount;
    });
  }, [
    activeCategory, 
    selectedSubcategories, 
    selectedMaterials, 
    priceRange, 
    selectedColors, 
    selectedPatterns, 
    selectedOccasions, 
    sortBy, 
    searchQuery
  ]);

  // Pagination calculations (16 items per page matching design)
  const itemsPerPage = 16;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const startItemIdx = filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItemIdx = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const displayedSubcategories = showMoreSubcategories 
    ? allSubcategories 
    : allSubcategories.slice(0, 7);

  // Category banner title & subtitle based on active category
  const categoryTitle = activeCategory === 'All' || !activeCategory ? 'Dinnerware' : activeCategory;
  const categorySubtitle = categoryTitle === 'Dinnerware'
    ? { line1: 'Beautiful tableware for every meal.', line2: 'Crafted to add elegance to your everyday.' }
    : categoryTitle === 'Serveware'
    ? { line1: 'Handcrafted trays, bowls & platters.', line2: 'Curated for stylish hosting and gatherings.' }
    : categoryTitle === 'Drinkware'
    ? { line1: 'Artisan glassware, highballs & mugs.', line2: 'Designed to elevate every sip from morning to evening.' }
    : categoryTitle === 'Home Decor'
    ? { line1: 'Sculptural vases, candles & centerpieces.', line2: 'Infuse mindful warmth and harmony into your living sanctuary.' }
    : { line1: 'Thoughtfully designed products for everyday living.', line2: 'Made for the moments that matter.' };

  const handleToggleSubcategory = (sub: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleToggleMaterial = (mat: string) => {
    setSelectedMaterials(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleToggleColor = (col: string) => {
    setSelectedColors(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleTogglePattern = (pat: string) => {
    setSelectedPatterns(prev => 
      prev.includes(pat) ? prev.filter(p => p !== pat) : [...prev, pat]
    );
  };

  const handleToggleOccasion = (occ: string) => {
    setSelectedOccasions(prev => 
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const scrollToGridTop = () => {
    const el = document.getElementById('category-products-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6" id="category-products-anchor">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#8C7B70] mb-6">
          <button 
            onClick={() => {
              if (onBackToHome) onBackToHome();
              else setActiveCategory('All');
            }}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <button
            onClick={() => {
              clearAllFilters();
              setActiveCategory(categoryTitle);
            }}
            className="font-semibold text-[#2D2723] hover:text-[#8A5A36] transition-colors"
          >
            {categoryTitle}
          </button>
          {selectedSubcategories.length === 1 && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
              <span className="text-[#8A5A36] font-medium">{selectedSubcategories[0]}</span>
            </>
          )}
        </nav>

        {/* Category Header with Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10">
          {/* Left Title & Description (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-normal text-[#2D2723] tracking-tight leading-tight">
              {categoryTitle}
            </h1>
            <div className="text-[#7A6A5E] text-sm sm:text-base leading-relaxed">
              <p>{categorySubtitle.line1}</p>
              <p>{categorySubtitle.line2}</p>
            </div>
          </div>

          {/* Right Hero Banner (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#DDCDBE] via-[#EAE1D5] to-[#D5C6B5] border border-[#DDD3C7] shadow-xs min-h-[160px] sm:min-h-[180px] flex items-center justify-between p-6 sm:p-8">
              {/* Text side */}
              <div className="relative z-10 max-w-[62%] sm:max-w-[55%]">
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal leading-snug">
                  Timeless Pieces for Every Home
                </h2>
                <p className="text-xs sm:text-sm text-[#635348] mt-2 font-normal">
                  Make every meal special with Nestania.
                </p>
              </div>

              {/* Banner Image cutout */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%] sm:w-[50%] overflow-hidden flex items-center justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80" 
                  alt="Timeless dinnerware" 
                  className="h-full w-full object-cover object-center scale-105 filter saturate-[0.95]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#DDCDBE] via-transparent to-transparent opacity-90 sm:opacity-75" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-[#EBE5DE] shadow-xs">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-[#2D2723] hover:text-[#8A5A36] cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#8A5A36]" />
            <span>Filter By {hasActiveFilters && `(${selectedSubcategories.length + selectedMaterials.length + (priceRange < 6999 ? 1 : 0) + selectedColors.length + selectedPatterns.length + selectedOccasions.length})`}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8C7B70]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-[#FAF8F5] border border-[#E3DCCE] rounded-lg px-2.5 py-1.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Content Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-7 sticky top-24">
            
            {/* Header: Filter By & Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5DE]">
              <h3 className="font-semibold text-base text-[#2D2723] tracking-tight">
                Filter By
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#8A5A36] hover:text-[#5E3B20] underline transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Group 1: Categories */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <h4 className="text-sm font-semibold text-[#2D2723]">
                Categories
              </h4>
              <div className="space-y-2.5">
                {displayedSubcategories.map((sub) => {
                  const isChecked = selectedSubcategories.includes(sub.name);
                  return (
                    <label
                      key={sub.name}
                      onClick={() => handleToggleSubcategory(sub.name)}
                      className="flex items-center justify-between text-xs text-[#52443C] hover:text-[#2D2723] cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-xs border transition-colors flex items-center justify-center ${
                          isChecked 
                            ? 'bg-[#8A5A36] border-[#8A5A36] text-white' 
                            : 'border-[#CCC2B8] bg-white group-hover:border-[#8A5A36]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-[13px] ${isChecked ? 'font-semibold text-[#2D2723]' : ''}`}>
                          {sub.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#9E8E82]">
                        ({sub.count})
                      </span>
                    </label>
                  );
                })}
              </div>

              {allSubcategories.length > 7 && (
                <button
                  onClick={() => setShowMoreSubcategories(!showMoreSubcategories)}
                  className="text-xs font-semibold text-[#8A5A36] hover:underline pt-1 block cursor-pointer"
                >
                  {showMoreSubcategories ? '- Show Less' : '+ Show More'}
                </button>
              )}
            </div>

            {/* Filter Group 2: Material */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <h4 className="text-sm font-semibold text-[#2D2723]">
                Material
              </h4>
              <div className="space-y-2.5">
                {materialOptions.map((mat) => {
                  const isChecked = selectedMaterials.includes(mat.name);
                  return (
                    <label
                      key={mat.name}
                      onClick={() => handleToggleMaterial(mat.name)}
                      className="flex items-center justify-between text-xs text-[#52443C] hover:text-[#2D2723] cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-xs border transition-colors flex items-center justify-center ${
                          isChecked 
                            ? 'bg-[#8A5A36] border-[#8A5A36] text-white' 
                            : 'border-[#CCC2B8] bg-white group-hover:border-[#8A5A36]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-[13px] ${isChecked ? 'font-semibold text-[#2D2723]' : ''}`}>
                          {mat.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#9E8E82]">
                        ({mat.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 3: Price Slider */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#2D2723]">
                  Price
                </h4>
                {priceRange < 6999 && (
                  <span className="text-xs font-semibold text-[#8A5A36]">
                    Up to ₹{priceRange.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              
              {/* Range input */}
              <div className="pt-2 px-1">
                <input
                  type="range"
                  min="199"
                  max="6999"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#E2D8CC] rounded-lg appearance-none cursor-pointer accent-[#8A5A36]"
                />
                <div className="flex items-center justify-between text-xs font-medium text-[#7D6E63] mt-2">
                  <span>₹199</span>
                  <span>₹6,999</span>
                </div>
              </div>
            </div>

            {/* Filter Group 4: Color Swatches */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <h4 className="text-sm font-semibold text-[#2D2723]">
                Color
              </h4>
              <div className="flex items-center gap-2.5 flex-wrap">
                {colorOptions.map((color) => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleToggleColor(color.name)}
                      title={color.label}
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer shadow-2xs ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-[#8A5A36] scale-110' 
                          : 'border-black/15 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${color.name === 'White' || color.name === 'Beige' ? 'text-[#2D2723]' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setSelectedColors([])}
                className="text-xs text-[#8A5A36] hover:underline block pt-1 cursor-pointer"
              >
                + More
              </button>
            </div>

            {/* Filter Group 5: Pattern */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <h4 className="text-sm font-semibold text-[#2D2723]">
                Pattern
              </h4>
              <div className="space-y-2.5">
                {patternOptions.map((pat) => {
                  const isChecked = selectedPatterns.includes(pat.name);
                  return (
                    <label
                      key={pat.name}
                      onClick={() => handleTogglePattern(pat.name)}
                      className="flex items-center justify-between text-xs text-[#52443C] hover:text-[#2D2723] cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-xs border transition-colors flex items-center justify-center ${
                          isChecked 
                            ? 'bg-[#8A5A36] border-[#8A5A36] text-white' 
                            : 'border-[#CCC2B8] bg-white group-hover:border-[#8A5A36]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-[13px] ${isChecked ? 'font-semibold text-[#2D2723]' : ''}`}>
                          {pat.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#9E8E82]">
                        ({pat.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Group 6: Occasion */}
            <div className="space-y-3 pb-6 border-b border-[#EBE5DE]">
              <h4 className="text-sm font-semibold text-[#2D2723]">
                Occasion
              </h4>
              <div className="space-y-2.5">
                {occasionOptions.map((occ) => {
                  const isChecked = selectedOccasions.includes(occ.name);
                  return (
                    <label
                      key={occ.name}
                      onClick={() => handleToggleOccasion(occ.name)}
                      className="flex items-center justify-between text-xs text-[#52443C] hover:text-[#2D2723] cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-xs border transition-colors flex items-center justify-center ${
                          isChecked 
                            ? 'bg-[#8A5A36] border-[#8A5A36] text-white' 
                            : 'border-[#CCC2B8] bg-white group-hover:border-[#8A5A36]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-[13px] ${isChecked ? 'font-semibold text-[#2D2723]' : ''}`}>
                          {occ.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#9E8E82]">
                        ({occ.count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Promo Box: Gifting Made Special */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F3ECE1] border border-[#E3D9CC] p-5 pt-6 shadow-xs flex flex-col justify-between min-h-[260px]">
              <div className="relative z-10 space-y-2">
                <h4 className="font-serif text-2xl text-[#3A2F28] font-normal leading-tight">
                  Gifting Made Special
                </h4>
                <p className="text-xs text-[#7A6B60] leading-relaxed max-w-[85%]">
                  Explore our curated gifting collection.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setActiveCategory('Gifting');
                      showToast('Viewing luxury gift hampers & curated festive boxes', 'info');
                    }}
                    className="inline-flex items-center justify-center bg-[#8A5A36] hover:bg-[#6E4223] text-white text-[11px] font-bold tracking-wider px-4 py-2.5 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer uppercase"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Bottom decorative plate graphic */}
              <div className="relative -mb-10 -mr-6 self-end opacity-90">
                <img 
                  src="https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?auto=format&fit=crop&w=400&q=80" 
                  alt="Gifting plate"
                  className="w-36 h-36 object-cover rounded-full shadow-md border-4 border-white/80"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </aside>


          {/* ================= RIGHT PRODUCT GRID ================= */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Controls Bar: Showing count, Sort By, View toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBE5DE]">
              
              {/* Product Count */}
              <div className="text-xs sm:text-sm text-[#7D6E63]">
                {filteredProducts.length === 0 ? (
                  <span>No products found matching your active filters.</span>
                ) : (
                  <span>
                    Showing {startItemIdx} – {endItemIdx} of {filteredProducts.length} products
                  </span>
                )}
              </div>

              {/* Sort & Grid Toggle Controls */}
              <div className="hidden sm:flex items-center gap-5">
                
                {/* Sort By Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7D6E63]">Sort By:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-xs font-semibold bg-white border border-[#DDD3C7] rounded-lg px-3 py-1.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] cursor-pointer shadow-2xs"
                    >
                      <option value="popular">Popular</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1.5 text-xs text-[#7D6E63]">
                  <span>View:</span>
                  <div className="flex items-center bg-white border border-[#DDD3C7] rounded-lg p-0.5 shadow-2xs">
                    <button
                      onClick={() => setViewMode('4col')}
                      title="4-Column Grid View"
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        viewMode === '4col' ? 'bg-[#FAF6F1] text-[#8A5A36]' : 'text-[#A8988B] hover:text-[#2D2723]'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      title="Compact Grid View"
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        viewMode === 'compact' ? 'bg-[#FAF6F1] text-[#8A5A36]' : 'text-[#A8988B] hover:text-[#2D2723]'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Active Filters Pills (if any) */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap pb-2">
                <span className="text-xs text-[#8C7B70] mr-1">Active Filters:</span>
                
                {selectedSubcategories.map(sub => (
                  <span key={sub} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    {sub}
                    <button onClick={() => handleToggleSubcategory(sub)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedMaterials.map(mat => (
                  <span key={mat} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    Material: {mat}
                    <button onClick={() => handleToggleMaterial(mat)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {priceRange < 6999 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    Under ₹{priceRange}
                    <button onClick={() => setPriceRange(6999)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedColors.map(col => (
                  <span key={col} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    Color: {col}
                    <button onClick={() => handleToggleColor(col)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedPatterns.map(pat => (
                  <span key={pat} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    Pattern: {pat}
                    <button onClick={() => handleTogglePattern(pat)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {selectedOccasions.map(occ => (
                  <span key={occ} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E3DACF] text-[#4A3E38] px-2.5 py-1 rounded-full shadow-2xs">
                    Occasion: {occ}
                    <button onClick={() => handleToggleOccasion(occ)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8A5A36] font-semibold hover:underline ml-2 cursor-pointer"
                >
                  Reset all
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EBE5DE] p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F1] flex items-center justify-center mx-auto text-[#8A5A36]">
                  <RotateCcw className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-[#2D2723] font-normal">
                  No matching dining pieces found
                </h3>
                <p className="text-xs sm:text-sm text-[#7D6E63] max-w-md mx-auto">
                  Try clearing your active filters or adjusting the price range to explore more of our luxury collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 bg-[#8A5A36] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs hover:bg-[#6E4223] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-5 ${
                viewMode === '4col' 
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
              }`}>
                {displayedProducts.map((product) => {
                  const wishlisted = isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white rounded-2xl border border-[#ECE5DD] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-square w-full bg-[#F5F2EC] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        {/* Top Right Heart Wishlist Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                            wishlisted
                              ? 'bg-white text-rose-600'
                              : 'bg-white/80 hover:bg-white text-[#635348] hover:text-rose-600'
                          }`}
                          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Product Content Details */}
                      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                        
                        {/* Title and Subtitle */}
                        <div>
                          <h3 className="font-medium text-xs sm:text-sm text-[#2D2723] group-hover:text-[#8A5A36] transition-colors line-clamp-1 leading-snug">
                            {product.name}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#8C7B70] mt-0.5">
                            {product.subtitle || (product.subcategory ? `(${product.subcategory})` : '')}
                          </p>
                        </div>

                        {/* Price, Star Rating & Cart Action Button */}
                        <div className="flex items-end justify-between pt-1">
                          
                          {/* Price & Rating */}
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-sm sm:text-base text-[#2D2723]">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[11px] text-[#A39284] line-through">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            {/* Gold Star Ratings */}
                            <div className="flex items-center gap-1">
                              <div className="flex items-center text-[#DDA15E]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                ))}
                              </div>
                              <span className="text-[10px] sm:text-[11px] text-[#8C7B70] font-normal">
                                ({product.reviewsCount})
                              </span>
                            </div>
                          </div>

                          {/* Quick Add To Cart Button */}
                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-[#8A5A36] hover:bg-[#6E4223] text-white rounded-lg flex items-center justify-center shadow-xs hover:shadow transition-all duration-200 cursor-pointer shrink-0"
                            title="Add to Shopping Bag"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls matching design: < 1 2 3 4 5 > */}
            {totalPages > 1 && (
              <div className="pt-10 flex items-center justify-center gap-1.5 sm:gap-2">
                
                {/* Previous Button */}
                <button
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                      scrollToGridTop();
                    }
                  }}
                  disabled={currentPage === 1}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#DDD3C7] bg-white text-xs font-semibold text-[#52443C] hover:border-[#8A5A36] hover:text-[#8A5A36] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  &lt;
                </button>

                {/* Page Number Buttons */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        scrollToGridTop();
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#8A5A36] text-white shadow-xs'
                          : 'bg-white border border-[#DDD3C7] text-[#52443C] hover:border-[#8A5A36] hover:text-[#8A5A36]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                      scrollToGridTop();
                    }
                  }}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#DDD3C7] bg-white text-xs font-semibold text-[#52443C] hover:border-[#8A5A36] hover:text-[#8A5A36] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* ================= MOBILE FILTER SLIDE-OVER DRAWER ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            
            {/* Drawer Top */}
            <div className="p-4 border-b border-[#EBE5DE] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8A5A36]" />
                <h3 className="font-semibold text-base text-[#2D2723]">Filters & Sort</h3>
              </div>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-[#FAF8F5] text-[#7D6E63]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Sort By on Mobile */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A5A36]">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-[#DDD3C7] rounded-lg p-2.5 text-[#2D2723]"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Subcategories */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A5A36]">Categories</h4>
                <div className="space-y-2">
                  {allSubcategories.map((sub) => {
                    const isChecked = selectedSubcategories.includes(sub.name);
                    return (
                      <label 
                        key={sub.name}
                        onClick={() => handleToggleSubcategory(sub.name)}
                        className="flex items-center justify-between text-xs text-[#52443C] py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                            isChecked ? 'bg-[#8A5A36] border-[#8A5A36] text-white' : 'border-[#CCC2B8] bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{sub.name}</span>
                        </div>
                        <span className="text-[#A39284]">({sub.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A5A36]">Material</h4>
                <div className="space-y-2">
                  {materialOptions.map((mat) => {
                    const isChecked = selectedMaterials.includes(mat.name);
                    return (
                      <label 
                        key={mat.name}
                        onClick={() => handleToggleMaterial(mat.name)}
                        className="flex items-center justify-between text-xs text-[#52443C] py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                            isChecked ? 'bg-[#8A5A36] border-[#8A5A36] text-white' : 'border-[#CCC2B8] bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{mat.name}</span>
                        </div>
                        <span className="text-[#A39284]">({mat.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A5A36]">Price</h4>
                  <span className="text-xs font-semibold text-[#2D2723]">Up to ₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="199"
                  max="6999"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#8A5A36]"
                />
              </div>

              {/* Colors */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A5A36]">Color</h4>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleToggleColor(c.name)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[#8A5A36]' : 'border-black/15'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2D2723]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#EBE5DE] bg-white flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 text-xs font-semibold text-[#8A5A36] border border-[#8A5A36] rounded-xl hover:bg-[#FAF6F1]"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#8A5A36] rounded-xl hover:bg-[#6E4223] shadow-xs"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
