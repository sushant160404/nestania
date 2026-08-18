import React from 'react';
import { useShop } from '../context/ShopContext';
import { Package, Palette, Heart, Gift, Leaf, Users } from 'lucide-react';

const values = [
  {
    icon: Palette,
    title: 'Artisan Craftsmanship',
    description: 'Every piece is handcrafted by skilled artisans using age-old techniques passed down through generations.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    description: 'We use responsibly sourced materials and eco-friendly processes to reduce our environmental footprint.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each product carries the warmth and intention of the hands that shaped it, bringing soul into your home.',
  },
  {
    icon: Package,
    title: 'Premium Packaging',
    description: "Your orders arrive in protective, beautifully designed packaging that is as special as what's inside.",
  },
  {
    icon: Gift,
    title: 'Gifting Excellence',
    description: 'Curated gift sets and personalised wrapping to make every occasion memorable.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We support local artisan communities across India, ensuring fair wages and sustainable livelihoods.',
  },
];

const team = [
  {
    name: 'Aanya Mehta',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  },
  {
    name: 'Rohan Iyer',
    role: 'Head of Product Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Priya Sharma',
    role: 'Lead Ceramics Artisan',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
];

export function AboutPage() {
  const { navigateTo } = useShop();

  return (
    <div className="bg-[#FAF8F5]">

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-0 items-center min-h-[580px]">
        {/* Left Content */}
        <div className="px-6 md:px-12 lg:px-20 py-16 lg:py-24">
          <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-4">
            Our Story
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2D2723] leading-tight mb-6">
            Crafting Homes,<br />One Piece at a Time
          </h1>
          <p className="text-[#6B5D54] text-lg leading-relaxed mb-6">
            Nestania was born from a simple belief — that the objects we surround ourselves with shape the quality of our everyday moments. We create luxury tableware and home décor that brings warmth, beauty, and intention to your living spaces.
          </p>
          <p className="text-[#6B5D54] leading-relaxed mb-8">
            Founded in 2021, we work directly with master artisans across Jaipur, Khurja, and Moradabad to bring you pieces that are as functional as they are beautiful.
          </p>
          <button
            onClick={() => navigateTo('category', { category: 'Collections' })}
            className="bg-[#2D2723] text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-[#8A5A36] transition-colors duration-300"
          >
            Explore Collections
          </button>
        </div>

        {/* Right Image */}
        <div className="h-[400px] lg:h-[580px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1604761483270-66e8e4af9f8b?w=900&h=700&fit=crop"
            alt="Nestania artisan crafting ceramics"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#2D2723] py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '200+', label: 'Artisan Products' },
            { value: '15,000+', label: 'Happy Customers' },
            { value: '50+', label: 'Artisan Partners' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-serif text-[#D4A87A] mb-1">{stat.value}</p>
              <p className="text-sm text-[#C4B5A8] uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-3">What We Stand For</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D2723]">Our Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-white p-8 rounded-sm border border-[#EDE8E0] hover:border-[#8A5A36] transition-colors duration-300">
              <div className="w-11 h-11 bg-[#FAF0E6] rounded-full flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-[#8A5A36]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2D2723] mb-2">{title}</h3>
              <p className="text-[#6B5D54] text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#F5EFE6] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-3">How It's Made</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2D2723]">From Clay to Your Table</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Source', desc: 'Premium raw materials ethically sourced from trusted suppliers.' },
              { step: '02', title: 'Shape', desc: 'Master artisans hand-throw or mould each piece with care.' },
              { step: '03', title: 'Fire', desc: 'Kiln-fired at precise temperatures for durability and finish.' },
              { step: '04', title: 'Deliver', desc: 'Wrapped in protective packaging and shipped to your door.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <p className="text-5xl font-serif text-[#D4B896] mb-3">{step}</p>
                <h4 className="text-lg font-semibold text-[#2D2723] mb-2">{title}</h4>
                <p className="text-sm text-[#6B5D54] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-[#8A5A36] font-medium mb-3">The People Behind Nestania</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D2723]">Meet Our Team</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-10">
          {team.map(({ name, role, image }) => (
            <div key={name} className="text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#EDE8E0]">
                <img src={image} alt={name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-semibold text-[#2D2723]">{name}</h4>
              <p className="text-sm text-[#8A5A36]">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2D2723] py-20 text-center px-6">
        <p className="text-sm uppercase tracking-widest text-[#D4A87A] font-medium mb-4">Start Your Journey</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
          Bring Nestania Home
        </h2>
        <p className="text-[#C4B5A8] mb-10 max-w-xl mx-auto leading-relaxed">
          Browse our curated collections of handcrafted tableware, serveware, and home décor — made to elevate every moment.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="bg-[#D4A87A] text-[#2D2723] px-10 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-[#C49060] transition-colors duration-300"
        >
          Shop Now
        </button>
      </section>

    </div>
  );
}
