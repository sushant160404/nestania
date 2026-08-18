import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface Slide {
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  categoryTarget: string;
  image: string;
}

export const HeroCarousel: React.FC = () => {
  const { setActiveCategory } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      tag: 'ELEVATE YOUR EVERYDAY',
      title: 'Timeless Pieces for Every Home',
      description: 'Beautifully crafted. Thoughtfully designed. Made for the moments that matter.',
      ctaText: 'SHOP NOW',
      categoryTarget: 'Dinnerware',
      image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1920&q=85',
    },
    {
      tag: 'ARTISANAL LUXURY',
      title: 'Handcrafted Amber & Ribbed Glassware',
      description: 'Refract warmth and golden hour hues across your festive evenings and celebrations.',
      ctaText: 'EXPLORE DRINKWARE',
      categoryTarget: 'Drinkware',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=85',
    },
    {
      tag: 'CURATED LIVING',
      title: 'Nordic Ceramic Vases & Accent Decor',
      description: 'Sculptural stoneware silhouettes and soothing organic earth tones for calm spaces.',
      ctaText: 'DISCOVER DECOR',
      categoryTarget: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1920&q=85',
    },
  ];

  // Auto rotate carousel every 6s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[16/9] md:aspect-[21/9] min-h-[380px] sm:min-h-[440px] md:min-h-[480px] bg-[#EFE8DF] group">
        
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out transform scale-100 group-hover:scale-102"
          style={{ backgroundImage: `url(${active.image})` }}
        >
          {/* Subtle Warm Vignette Overlay for Crisp Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1F18]/80 via-[#2A1F18]/45 to-transparent sm:w-2/3 lg:w-1/2" />
        </div>

        {/* Content Box */}
        <div className="relative h-full flex flex-col justify-center max-w-xl p-6 sm:p-10 md:p-14 z-10 text-white">
          
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#EAD0BA] bg-[#432A1C]/60 backdrop-blur-xs px-3 py-1 rounded-full border border-[#D5B295]/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {active.tag}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.15] text-white tracking-tight mb-4 drop-shadow-xs">
            {active.title}
          </h1>

          <p className="text-sm sm:text-base text-[#F4ECE5] font-light max-w-md mb-6 leading-relaxed">
            {active.description}
          </p>

          <div>
            <button
              onClick={() => {
                setActiveCategory(active.categoryTarget);
                const el = document.getElementById('new-arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#8A5A36] hover:bg-[#724523] text-white font-medium text-xs sm:text-sm tracking-widest uppercase py-3.5 px-8 rounded-full shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-[#AC7D54]/50"
            >
              {active.ctaText}
            </button>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#4A3E38] hover:text-[#8A5A36] shadow-md backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-[#4A3E38] hover:text-[#8A5A36] shadow-md backdrop-blur-xs flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/25 backdrop-blur-xs py-1.5 px-3 rounded-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
