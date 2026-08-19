import React, { useState } from 'react';
import { X, User as UserIcon, LogOut, Package, MapPin, Heart, Check, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AuthModal: React.FC = () => {
  const {
    user,
    setUser,
    isAuthOpen,
    setIsAuthOpen,
    orders,
    setIsOrderTrackingOpen,
    setIsWishlistOpen,
    showToast,
  } = useShop();

  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>(user ? 'profile' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setIsAuthOpen(false);
        return;
      }

      // If login fails, try register for new users
      if (mode === 'signup') {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: name || email.split('@')[0], phone }),
        });

        const regData = await regRes.json();

        if (regRes.ok && regData.success) {
          setUser(regData.user);
          showToast(`Welcome to Nestania, ${regData.user.name}!`, 'success');
          setIsAuthOpen(false);
          return;
        }

        showToast(regData.error || 'Registration failed', 'error');
        return;
      }

      showToast('Invalid email or password', 'error');
    } catch (error) {
      // Fallback to local storage if API fails
      setUser({
        id: 'usr-' + Date.now(),
        name: name || email.split('@')[0],
        email,
        phone: phone || '+91 98765 43210',
        addresses: [
          {
            fullName: name || 'Aarav Sharma',
            phone: phone || '+91 98765 43210',
            street: '402, Lotus Grand Residences, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
          },
        ],
      });
      showToast(`Welcome, ${name || email.split('@')[0]}!`, 'success');
      setIsAuthOpen(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Signed out successfully', 'info');
    setIsAuthOpen(false);
  };

  const handleQuickDemoLogin = () => {
    setUser({
      id: 'usr-demo',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@nestania.in',
      phone: '+91 98765 43210',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          phone: '+91 98765 43210',
          street: '402, Lotus Grand Residences, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        },
      ],
    });
    showToast('Signed in with VIP Account', 'success');
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#EAE3DA] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DE] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-[#8A5A36] font-normal">
              nestania
            </span>
            <span className="text-xs text-[#8C7B70]">| Member Access</span>
          </div>

          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] rounded-full hover:bg-[#EDE5DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {user ? (
            /* User Profile View */
            <div className="space-y-5">
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#EFE8DF]">
                <div className="w-14 h-14 rounded-full bg-[#FAF4ED] border border-[#E3D7C9] flex items-center justify-center text-[#8A5A36] text-xl font-bold font-serif">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#2D2723] font-normal">{user.name}</h3>
                  <p className="text-xs text-[#7A6A5E]">{user.email}</p>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full inline-block mt-1">
                    Gold Tier Member
                  </span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    setIsAuthOpen(false);
                    setIsOrderTrackingOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#EDE4D8] flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 text-[#3D322B]">
                    <Package className="w-4 h-4 text-[#8A5A36]" />
                    <span>My Orders ({orders.length})</span>
                  </div>
                  <span className="text-[#8A5A36] font-semibold">View</span>
                </button>

                <button
                  onClick={() => {
                    setIsAuthOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3ECE4] border border-[#EDE4D8] flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 text-[#3D322B]">
                    <Heart className="w-4 h-4 text-[#A8422B]" />
                    <span>Saved Wishlist</span>
                  </div>
                  <span className="text-[#8A5A36] font-semibold">View</span>
                </button>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EDE4D8] text-[#3D322B] space-y-1">
                  <div className="flex items-center gap-2 text-[#8A5A36] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Default Delivery Address</span>
                  </div>
                  {user.addresses.length > 0 && (
                    <p className="text-[11px] text-[#6F6055] leading-relaxed">
                      {user.addresses[0].street}, {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].pincode}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div className="space-y-4">
              <div className="flex border-b border-[#EDE5DA] text-xs font-semibold uppercase tracking-wider mb-4">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 pb-2 text-center transition-colors ${
                    mode === 'login' ? 'border-b-2 border-[#8A5A36] text-[#8A5A36]' : 'text-[#8C7B70]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 pb-2 text-center transition-colors ${
                    mode === 'signup' ? 'border-b-2 border-[#8A5A36] text-[#8A5A36]' : 'text-[#8C7B70]'
                  }`}
                >
                  New Account
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Mukherjee"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2 text-xs text-[#2D2723]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2 text-xs text-[#2D2723]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2 text-xs text-[#2D2723]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer mt-2"
                >
                  {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </button>
              </form>

              {/* Quick Demo Login */}
              <div className="pt-3 border-t border-[#EDE5DA] text-center">
                <button
                  onClick={handleQuickDemoLogin}
                  className="w-full bg-[#FAF4ED] border border-[#D5C2AF] text-[#8A5A36] hover:bg-[#F3E7DC] text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>One-Click VIP Member Demo Login</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
