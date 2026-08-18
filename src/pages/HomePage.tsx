import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { ValueProps } from '../components/ValueProps';
import { CategorySlider } from '../components/CategorySlider';
import { ProductGrid } from '../components/ProductGrid';
import { PromoBanners } from '../components/PromoBanners';
import { InstagramGrid } from '../components/InstagramGrid';
import { Newsletter } from '../components/Newsletter';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-[#FAF8F5]">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Value Proposition Assurance */}
      <ValueProps />

      {/* 3. Shop by Category Carousel */}
      <CategorySlider />

      {/* 4. New Arrivals & Best Sellers Grid */}
      <ProductGrid />

      {/* 5. 3-Column Promo Lifestyle Cards */}
      <PromoBanners />

      {/* 6. Instagram Visual Feed */}
      <InstagramGrid />

      {/* 7. Newsletter Subscription Box */}
      <Newsletter />
    </div>
  );
};
