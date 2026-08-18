import React from 'react';
import { Gift, Home, Sparkles, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PromoBanners: React.FC = () => {
  const { setActiveCategory, applyCouponCode } = useShop();
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (code: string) => {
    applyCouponCode(code);
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Promo Card 1: Gifting Made Special */}
        <div className="relative bg-[#F7F2EB] rounded-2xl border border-[#E8DFC8] p-6 sm:p-7 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 min-h-[220px]">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="font-serif text-2xl text-[#3A2F28] font-normal leading-tight">
              Gifting Made Special
            </h3>
            <p className="text-xs text-[#7D6E63] mt-2 mb-5">
              Explore our curated picks
            </p>
            <button
              onClick={() => {
                setActiveCategory('Gifting');
                const el = document.getElementById('new-arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#8A5A36] hover:bg-[#6F4425] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              SHOP GIFTS
            </button>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-44 flex items-center justify-end pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
              alt="Gifting"
              className="h-36 w-36 object-contain rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Promo Card 2: Beautiful Homes Begin with Nestania */}
        <div className="relative bg-[#F4EFE6] rounded-2xl border border-[#E5DACD] p-6 sm:p-7 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 min-h-[220px]">
          <div className="relative z-10 max-w-[70%]">
            <h3 className="font-serif text-2xl text-[#3A2F28] font-normal leading-tight">
              Beautiful Homes Begin with Nestania
            </h3>
            <p className="text-xs text-[#7D6E63] mt-2 mb-5">
              Explore Now!
            </p>
            <button
              onClick={() => {
                setActiveCategory('Collections');
                const el = document.getElementById('new-arrivals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#8A5A36] hover:bg-[#6F4425] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-5 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              SHOP COLLECTIONS
            </button>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-44 flex items-center justify-end pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=400&q=80"
              alt="Decor"
              className="h-36 w-36 object-contain rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Promo Card 3: New Here? Get 10% Off */}
        <div className="relative bg-[#F5EEE4] rounded-2xl border border-[#E7DDD0] p-6 sm:p-7 overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 min-h-[220px]">
          <div className="relative z-10 max-w-[65%]">
            <h3 className="font-serif text-2xl text-[#3A2F28] font-normal leading-tight">
              New Here? <br />Get 10% Off
            </h3>
            <p className="text-xs text-[#7D6E63] mt-2 mb-5">
              On your first order
            </p>
            <button
              onClick={() => handleCopyCode('NEST10')}
              className="bg-[#8A5A36] hover:bg-[#6F4425] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-md shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  <span>APPLIED: NEST10</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>USE CODE: NEST10</span>
                </>
              )}
            </button>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-40 flex items-center justify-end pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80"
              alt="Vase floral"
              className="h-36 w-36 object-contain rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
