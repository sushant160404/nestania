import React from 'react';
import { useShop } from '../context/ShopContext';
import { Package, Palette, Heart, Gift, Leaf, Users, Award, Shield, Clock, Star, Truck, CheckCircle } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Premium Quality',
    description: 'We use the finest materials and time-honored techniques to create products that last.',
  },
  {
    icon: Palette,
    title: 'Thoughtful Design',
    description: 'Every piece is thoughtfully designed to bring beauty and functionality to your home.',
  },
  {
    icon: Leaf,
    title: 'Made for Everyday',
    description: 'From casual dinners to special occasions, our pieces are designed for every moment.',
  },
  {
    icon: Gift,
    title: 'Perfect for Gifting',
    description: 'Elegant packaging and timeless appeal make every gift special.',
  },
  {
    icon: Package,
    title: 'Sustainable Choices',
    description: 'We are committed to environment-friendly practices.',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Collections' },
  { value: '4.8★', label: 'Customer Rating' },
  { value: '100%', label: 'Secure Shopping' },
];

const team = [
  {
    name: 'Aanya Mehta',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    description: 'Passionate about bringing beautiful, functional design into everyday life.',
  },
  {
    name: 'Rohan Iyer',
    role: 'Head of Product Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    description: 'Expert in ceramic design with over 15 years of experience in artisan crafts.',
  },
  {
    name: 'Priya Sharma',
    role: 'Lead Ceramics Artisan',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    description: 'Master potter whose family has been creating beautiful ceramics for generations.',
  },
  {
    name: 'Vikram Singh',
    role: 'Quality Assurance Head',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    description: 'Ensures every piece meets our high standards before reaching your home.',
  },
];

const brandLogos = [
  { name: 'Amazon', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=amazon' },
  { name: 'Home Centre', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=HOME' },
  { name: 'Good Homes', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=GOOD+HOMES' },
  { name: 'Design Studio', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=DESIGN' },
  { name: 'Westside', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=WESTSIDE' },
  { name: 'FabIndia', src: 'https://via.placeholder.com/120x40/8A5A36/FFFFFF?text=LBB' },
];

export function AboutPage() {
  const { navigateTo } = useShop();

  return (
    <div className="bg-[#FAF8F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-[#7A6A5E]">
            <button onClick={() => navigateTo('home')} className="hover:text-[#8A5A36] transition-colors">
              Home
            </button>
            <span>•</span>
            <span className="text-[#2C1810]">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-0 items-center">
        {/* Left Content */}
        <div className="px-6 md:px-12 lg:px-20 py-16 lg:py-24 order-2 lg:order-1">
          <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-4">
            ABOUT NESTANIA
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2C1810] leading-tight mb-6">
            Thoughtfully designed products for everyday living.
          </h1>
          <p className="text-[#7A6A5E] text-lg leading-relaxed mb-8 max-w-md">
            At Nestania, we believe that the little things you see every day should bring you joy. Our mission is to create beautiful, high-quality products that enhance your daily rituals and make life more beautiful.
          </p>
          <button
            onClick={() => navigateTo('category', { category: 'Collections' })}
            className="bg-[#8A5A36] text-white px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-[#6D4228] transition-colors duration-300 rounded-sm"
          >
            OUR STORY
          </button>
        </div>

        {/* Right Image */}
        <div className="h-[500px] lg:h-[700px] overflow-hidden order-1 lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=700&fit=crop&crop=center"
            alt="Beautiful ceramic tableware arranged on a warm wooden surface"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium">
                OUR STORY
              </p>
              <h2 className="text-4xl lg:text-5xl font-light text-[#2C1810] leading-tight">
                Inspired by beauty. Rooted in purpose.
              </h2>
              <p className="text-[#7A6A5E] text-lg leading-relaxed">
                Nestania began with a simple idea—to make beautiful, high-quality products accessible to every home.
              </p>
              <p className="text-[#7A6A5E] leading-relaxed">
                What started as a small passion project has grown into a brand loved by thousands of customers serving land. Each object in our collection is carefully curated and crafted with love, so you can create special moments that last a lifetime.
              </p>
              <p className="text-[#7A6A5E] leading-relaxed">
                From our design studio to your dining table, we ensure every detail is refined with love, so you can create special moments that last a lifetime.
              </p>
              <button className="text-[#8A5A36] font-medium hover:underline">
                Learn More About Our Journey →
              </button>
            </div>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=500&fit=crop&crop=center"
                alt="Artisan crafting ceramic pottery"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  {index === 0 && <Users className="w-8 h-8 text-[#8A5A36]" />}
                  {index === 1 && <Package className="w-8 h-8 text-[#8A5A36]" />}
                  {index === 2 && <Heart className="w-8 h-8 text-[#8A5A36]" />}
                  {index === 3 && <Star className="w-8 h-8 text-[#8A5A36]" />}
                  {index === 4 && <Shield className="w-8 h-8 text-[#8A5A36]" />}
                </div>
                <p className="text-3xl font-light text-[#2C1810] mb-1">{stat.value}</p>
                <p className="text-sm text-[#7A6A5E] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-4">WHAT WE STAND FOR</p>
            <h2 className="text-4xl font-light text-[#2C1810] mb-4">Our Values</h2>
            <p className="text-[#7A6A5E] text-lg max-w-2xl mx-auto">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-[#8A5A36] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#8A5A36] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-medium text-[#2C1810] mb-3">{title}</h3>
                <p className="text-[#7A6A5E] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-4">THE PEOPLE BEHIND NESTANIA</p>
            <h2 className="text-4xl font-light text-[#2C1810] mb-4">Passionate people, beautiful products.</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div className="space-y-6">
              <p className="text-[#7A6A5E] leading-relaxed">
                Behind every beautiful piece at Nestania is a team of passionate individuals dedicated to bringing you reflections and life from around India. Each person brings their expertise and love for craftsmanship to create something truly special.
              </p>
              <button className="bg-[#8A5A36] text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#6D4228] transition-colors duration-300 rounded-sm">
                MEET THE TEAM
              </button>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&crop=center"
                alt="Nestania team working together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(({ name, role, image, description }) => (
              <div key={name} className="text-center bg-white p-6 rounded-lg">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                  <img src={image} alt={name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-medium text-[#2C1810] mb-1">{name}</h4>
                <p className="text-sm text-[#8A5A36] mb-3">{role}</p>
                <p className="text-xs text-[#7A6A5E] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-4">AS SEEN ON</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {brandLogos.map((brand, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
                <img src={brand.src} alt={brand.name} className="h-8 md:h-10 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#2C1810] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Join our nest!</h2>
          <p className="text-[#C4B5A8] mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-sm text-white placeholder-[#C4B5A8] focus:outline-none focus:border-[#D4A87A]"
            />
            <button className="bg-[#8A5A36] text-white px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#6D4228] transition-colors duration-300 rounded-sm">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* Features Footer */}
      <section className="py-12 bg-[#FAF8F5] border-t border-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#8A5A36] rounded-full flex items-center justify-center mb-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-[#2C1810] mb-1">Free Shipping</h4>
              <p className="text-sm text-[#7A6A5E]">On orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#8A5A36] rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-[#2C1810] mb-1">Easy Returns</h4>
              <p className="text-sm text-[#7A6A5E]">Within 7 days</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#8A5A36] rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-[#2C1810] mb-1">Secure Payments</h4>
              <p className="text-sm text-[#7A6A5E]">100% secure</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#8A5A36] rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-[#2C1810] mb-1">Customer Support</h4>
              <p className="text-sm text-[#7A6A5E]">Here to help 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}