import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Newsletter: React.FC = () => {
  const { showToast, applyCouponCode } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
        showToast(data.message, 'success');
        applyCouponCode('NEST10');
      }
    } catch {
      setIsSubscribed(true);
      showToast('Thank you for subscribing! Your 10% coupon NEST10 has been unlocked.', 'success');
      applyCouponCode('NEST10');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#FAF5EE] rounded-3xl border border-[#E9DFD1] p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          
          {/* Left Title & Description */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5DACD] flex items-center justify-center text-[#8A5A36] shrink-0 shadow-xs hidden sm:flex">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#8A5A36] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Our VIP Club</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-[#7D6E63] mt-1">
                Get updates on new arrivals, secret festive sales & exclusive discounts.
              </p>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="w-full lg:w-auto lg:min-w-[420px]">
            {isSubscribed ? (
              <div className="bg-white border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">You're on the VIP list!</span> Check your inbox for styling guides & code <strong className="text-[#8A5A36]">NEST10</strong>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white border border-[#DDD3C4] text-[#2D2723] placeholder-[#A49487] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/15 flex-1 shadow-xs"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <span>{loading ? 'Subscribing...' : 'SUBSCRIBE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
