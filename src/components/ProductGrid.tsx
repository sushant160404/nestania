import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const ProductGrid: React.FC = () => {
  const { activeCategory, setActiveCategory, searchQuery } = useShop();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Filter products based on active category and search
  let filteredProducts = PRODUCTS;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    );
  } else if (activeCategory && activeCategory !== 'All' && activeCategory !== 'Collections') {
    if (activeCategory === 'Sale') {
      filteredProducts = filteredProducts.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    } else if (activeCategory === 'New Arrivals') {
      filteredProducts = filteredProducts.filter(p => p.isNew);
    } else {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
  }

  return (
    <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-[#8A5A36] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Handcrafted With Love
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal">
            {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory === 'All' ? 'New Arrivals' : activeCategory}
          </h2>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Dinnerware', 'Drinkware', 'Serveware', 'Home Decor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#8A5A36] text-white font-medium shadow-xs'
                  : 'bg-white border border-[#EAE3DA] text-[#635349] hover:bg-[#FAF6F1]'
              }`}
            >
              {cat}
            </button>
          ))}
          
          <button
            onClick={() => setActiveCategory('All')}
            className="text-xs font-semibold text-[#8A5A36] hover:text-[#663E20] flex items-center gap-1 ml-2 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {filteredProducts.length > 0 ? (
        <div className="relative group">
          {/* Scroll Navigation Arrows (visible on larger screens) */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#4A3E38] shadow-lg border border-[#EAE3DA] items-center justify-center transition-all z-10 hover:scale-110 hover:bg-white hover:text-[#8A5A36] cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Previous Products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#4A3E38] shadow-lg border border-[#EAE3DA] items-center justify-center transition-all z-10 hover:scale-110 hover:bg-white hover:text-[#8A5A36] cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Next Products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE3DA] p-12 text-center my-6">
          <p className="text-base text-[#5C4D44] font-medium">No products match your current filters</p>
          <p className="text-xs text-[#99877B] mt-1">Try resetting the category filter or search keywords</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-4 bg-[#8A5A36] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#704627] transition-colors"
          >
            View All Products
          </button>
        </div>
      )}

    </section>
  );
};
