import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { getCategoryImage, handleImageError } from '../utils/imageUtils';

export const CategorySlider: React.FC = () => {
  const { activeCategory, setActiveCategory, setSearchQuery } = useShop();
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

  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName);
    setSearchQuery('');
    const el = document.getElementById('new-arrivals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#8A796E] mt-0.5">
            Artisanal collections curated for every room and table
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveCategory('All');
              const el = document.getElementById('new-arrivals');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-semibold text-[#8A5A36] hover:text-[#663E20] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Relative container with arrows */}
      <div className="relative group">
        
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#4A3E38] shadow-md border border-[#EAE3DA] flex items-center justify-center transition-all z-10 hover:scale-110 hover:bg-white hover:text-[#8A5A36] cursor-pointer"
          aria-label="Previous Category"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Categories Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                className="flex-shrink-0 w-36 sm:w-44 md:w-48 group/card cursor-pointer"
              >
                <div
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-[#F3ECE4] border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-[#8A5A36] shadow-md scale-102 ring-2 ring-[#8A5A36]/20'
                      : 'border-transparent hover:border-[#D5C2B0] hover:shadow-md'
                  }`}
                >
                  <img
                    src={getCategoryImage(cat.slug, cat.image)}
                    data-fallback={cat.image}
                    onError={handleImageError}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>

                <div className="mt-3 text-center">
                  <h3
                    className={`text-sm sm:text-base font-medium transition-colors ${
                      isSelected ? 'text-[#8A5A36] font-semibold' : 'text-[#2D2723] group-hover/card:text-[#8A5A36]'
                    }`}
                  >
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#918176]">
                    {cat.itemCount} items
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 text-[#4A3E38] shadow-md border border-[#EAE3DA] flex items-center justify-center transition-all z-10 hover:scale-110 hover:bg-white hover:text-[#8A5A36] cursor-pointer"
          aria-label="Next Category"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>
    </section>
  );
};
