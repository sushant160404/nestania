import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, User } from '../types';

export const AccountPage: React.FC = () => {
  const {
    user,
    setUser,
    orders,
    wishlist,
    navigateTo,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'security'>('profile');

  // Auth Form State (for guest users)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  // Profile Edit State
  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@nestania.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  // Address Manager State
  const [addresses, setAddresses] = useState<Address[]>(
    user?.addresses || [
      {
        fullName: 'Aarav Sharma',
        phone: '+91 98765 43210',
        street: '402, Lotus Grand Residences, 12th Main Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        isDefault: true,
      }
    ]
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    isDefault: false,
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: authEmail.split('@')[0] || 'Artisan Collector',
      email: authEmail || 'user@nestania.in',
      phone: '+91 98765 43210',
      addresses: [
        {
          fullName: authEmail.split('@')[0] || 'Artisan Collector',
          phone: '+91 98765 43210',
          street: '402, Lotus Grand Residences, 12th Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        }
      ]
    };
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: authName.trim(),
      email: authEmail || 'collector@nestania.in',
      phone: authPhone || '+91 98765 43210',
      addresses: []
    };
    setUser(newUser);
    showToast(`Welcome to Nestania, ${newUser.name}!`, 'success');
  };

  const handleDemoSignIn = () => {
    const demoUser: User = {
      id: 'usr-demo-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@nestania.in',
      phone: '+91 98765 43210',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          phone: '+91 98765 43210',
          street: '402, Lotus Grand Residences, 12th Main Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        }
      ]
    };
    setUser(demoUser);
    showToast('Signed in as Aarav Sharma', 'success');
  };

  const handleSignOut = () => {
    setUser(null);
    showToast('Signed out of your Nestania account', 'info');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        name,
        email,
        phone,
      });
      showToast('Profile details updated successfully!', 'success');
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street || !newAddr.pincode) {
      showToast('Please fill all mandatory address fields', 'error');
      return;
    }
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    if (user) {
      setUser({ ...user, addresses: updated });
    }
    setIsAddingAddress(false);
    setNewAddr({ fullName: '', phone: '', street: '', city: '', state: 'Karnataka', pincode: '', isDefault: false });
    showToast('Delivery address saved!', 'success');
  };

  const handleDeleteAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    if (user) {
      setUser({ ...user, addresses: updated });
    }
    showToast('Address deleted', 'info');
  };

  const handleSetDefaultAddress = (index: number) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    setAddresses(updated);
    if (user) {
      setUser({ ...user, addresses: updated });
    }
    showToast('Default delivery address updated!', 'success');
  };

  // ================= GUEST AUTH VIEW =================
  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <span className="font-serif text-3xl text-[#8A5A36] tracking-tight">nestania</span>
            <h1 className="font-serif text-2xl text-[#2D2723]">
              {authMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-[#7D6E63]">
              {authMode === 'signin'
                ? 'Sign in to access your orders, saved wishlist, and member discounts.'
                : 'Join our community of artisanal tableware and interior decor lovers.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
            
            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA]">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-[#8A5A36] shadow-2xs'
                    : 'text-[#7D6E63] hover:text-[#2D2723]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-[#8A5A36] shadow-2xs'
                    : 'text-[#7D6E63] hover:text-[#2D2723]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Sign In Form */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#52443C] block mb-1">Email Address / Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. aarav.sharma@nestania.in"
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#52443C]">Password</label>
                    <button type="button" className="text-[11px] text-[#8A5A36] hover:underline">Forgot password?</button>
                  </div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Sign In to Nestania
                </button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#52443C] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Maya Iyer"
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#52443C] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#52443C] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:outline-none focus:border-[#8A5A36] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Quick Demo Sign In */}
            <div className="pt-4 border-t border-[#EBE3D8] text-center space-y-2">
              <span className="text-[11px] text-[#8C7B70] block">Or quickly test the experience</span>
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full bg-[#FAF6F1] hover:bg-[#EBE2D5] text-[#52443C] border border-[#DDD3C7] py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                1-Click Demo Account Sign In (Aarav Sharma)
              </button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ================= SIGNED-IN PROFILE CENTER =================
  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-[#8C7B70] mb-6">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <span className="text-[#2D2723] font-medium">My Account & Profile</span>
        </nav>

        {/* User Welcome Banner */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF6F1] border-2 border-[#8A5A36] flex items-center justify-center text-[#8A5A36] text-xl font-serif font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl text-[#2D2723]">
                  {user.name}
                </h1>
                <span className="text-[10px] bg-[#FAF6F1] border border-[#EAE0D3] text-[#8A5A36] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Nestania Connoisseur
                </span>
              </div>
              <p className="text-xs text-[#7D6E63]">{user.email} • {user.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="bg-[#FAF8F5] hover:bg-rose-50 text-[#52443C] hover:text-rose-600 border border-[#DDD3C7] hover:border-rose-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 2-Column Profile Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT: ACCOUNT SIDEBAR (4 cols) ================= */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E8DFD3] p-4 sm:p-5 space-y-2 shadow-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#FAF6F1] text-[#8A5A36] border border-[#EAE0D3] shadow-2xs'
                  : 'text-[#52443C] hover:bg-[#FAF8F5]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Personal Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#FAF6F1] text-[#8A5A36] border border-[#EAE0D3] shadow-2xs'
                  : 'text-[#52443C] hover:bg-[#FAF8F5]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => navigateTo('orders')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-[#52443C] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#8A5A36]" />
                <span>My Orders & Tracking</span>
              </div>
              <span className="text-[11px] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EAE3DA] font-bold text-[#8A5A36]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => navigateTo('wishlist')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-[#52443C] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>My Wishlist</span>
              </div>
              <span className="text-[11px] bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#EAE3DA] font-bold text-rose-600">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => navigateTo('cart')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-[#52443C] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#8A5A36]" />
                <span>Shopping Bag</span>
              </div>
            </button>
          </div>


          {/* ================= RIGHT: ACTIVE TAB CONTENT (8 cols) ================= */}
          <div className="lg:col-span-8">
            
            {/* TAB 1: PERSONAL PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="font-serif text-xl sm:text-2xl text-[#2D2723] border-b border-[#EBE3D8] pb-4">
                  Profile Information
                </h2>

                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="text-xs font-semibold text-[#52443C] block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:border-[#8A5A36] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#52443C] block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:border-[#8A5A36] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#52443C] block mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#DDD3C7] rounded-xl px-3.5 py-2.5 text-[#2D2723] focus:border-[#8A5A36] focus:bg-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EBE3D8] pb-4">
                  <h2 className="font-serif text-xl sm:text-2xl text-[#2D2723]">
                    Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                {/* List of saved addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                        addr.isDefault ? 'border-[#8A5A36] bg-[#FAF6F1]' : 'border-[#EAE3DA] bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-[#2D2723]">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-[#8A5A36] text-white px-2 py-0.5 rounded-full font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#52443C] leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-[#8C7B70]">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(idx)}
                            className="text-[#8A5A36] font-semibold hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-[#8C7B70] hover:text-rose-600 ml-auto p-1 cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleAddAddress} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE3DA] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2723]">Add New Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-[#52443C] block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          placeholder="e.g. Maya Iyer"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#52443C] block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#52443C] block mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        placeholder="Flat 102, Residency, 8th Main"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-[#52443C] block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          placeholder="Bengaluru"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#52443C] block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#52443C] block mb-1">PIN Code</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                          placeholder="560038"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-xl px-3 py-2 text-[#2D2723]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 text-xs font-semibold text-[#7D6E63] hover:bg-white rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#8A5A36] text-white px-5 py-2 text-xs font-semibold rounded-xl"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
