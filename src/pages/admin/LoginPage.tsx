import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShoppingBag } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          onLogin(email, password);
          return;
        }
      }

      setError('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F0EB] to-[#EBE4DA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8A5A36] rounded-2xl mb-4 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl text-[#2D2723] mb-2">Nestania Admin</h1>
          <p className="text-sm text-[#7A6A5E]">Manage your e-commerce platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E3DCCE] p-8">
          <h2 className="text-xl font-semibold text-[#2D2723] mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#4A3E38] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8988B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nestania.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#E3DCCE] rounded-xl text-[#2D2723] placeholder-[#A8988B] focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#4A3E38] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8988B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-[#FAF8F5] border border-[#E3DCCE] rounded-xl text-[#2D2723] placeholder-[#A8988B] focus:outline-none focus:border-[#8A5A36] focus:ring-2 focus:ring-[#8A5A36]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8988B] hover:text-[#8A5A36] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#CCC2B8] text-[#8A5A36] focus:ring-[#8A5A36]"
                />
                <span className="text-[#7A6A5E]">Remember me</span>
              </label>
              <button
                type="button"
                className="text-[#8A5A36] hover:text-[#6E4223] font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white font-semibold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 mb-1">Demo Credentials:</p>
            <p className="text-xs text-amber-700">Email: admin@nestania.com</p>
            <p className="text-xs text-amber-700">Password: admin123</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#8C7B70] mt-6">
          © 2025 Nestania. All rights reserved.
        </p>
      </div>
    </div>
  );
};
