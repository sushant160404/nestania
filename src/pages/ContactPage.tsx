import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { showToast, navigateTo } = useShop();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '', agreed: false,
  });
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      showToast('Please agree to the Privacy Policy and Terms & Conditions.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      showToast("Message sent! We'll get back to you within 24 hours.", 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '', agreed: false });
    } catch (err: any) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5]">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs text-[#8C7C70]">
          <button onClick={() => navigateTo('home')} className="hover:text-[#8A5A36] transition-colors">
            Home
          </button>
          <span>›</span>
          <span className="text-[#2D2723]">Contact Us</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="grid lg:grid-cols-2 min-h-[280px]">
        <div className="bg-white px-6 md:px-12 lg:px-16 py-12 flex flex-col justify-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2D2723] mb-3 leading-tight">
            Contact Us
          </h1>
          <div className="w-10 h-0.5 bg-[#8A5A36] mb-5" />
          <p className="text-[#6B5D54] text-sm sm:text-base leading-relaxed max-w-sm">
            We're here to help! Whether you have a question about our products, orders, or anything else,
            our team is just a message away.
          </p>
        </div>
        <div className="hidden lg:block overflow-hidden max-h-[340px]">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=400&fit=crop"
            alt="Elegant tableware"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left: Form */}
          <div className="bg-white border border-[#EBE3D7] rounded-sm p-8">
            <h2 className="font-serif text-2xl text-[#2D2723] mb-1">Get in Touch</h2>
            <p className="text-xs text-[#8C7C70] mb-7">Fill out the form and our team will get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2723] mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your Name"
                    className="w-full border border-[#D4C4B0] px-3.5 py-2.5 text-sm text-[#2D2723] placeholder:text-[#B8A99A] focus:outline-none focus:border-[#8A5A36] rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2D2723] mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="Email Address"
                    className="w-full border border-[#D4C4B0] px-3.5 py-2.5 text-sm text-[#2D2723] placeholder:text-[#B8A99A] focus:outline-none focus:border-[#8A5A36] rounded-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D2723] mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="Phone Number"
                    className="w-full border border-[#D4C4B0] px-3.5 py-2.5 text-sm text-[#2D2723] placeholder:text-[#B8A99A] focus:outline-none focus:border-[#8A5A36] rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2D2723] mb-1.5">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={form.subject}
                    onChange={e => set('subject', e.target.value)}
                    className="w-full border border-[#D4C4B0] px-3.5 py-2.5 text-sm text-[#2D2723] focus:outline-none focus:border-[#8A5A36] rounded-sm bg-white"
                  >
                    <option value="">Subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="shipping">Shipping</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D2723] mb-1.5">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="How can we help you?"
                  className="w-full border border-[#D4C4B0] px-3.5 py-2.5 text-sm text-[#2D2723] placeholder:text-[#B8A99A] focus:outline-none focus:border-[#8A5A36] rounded-sm bg-white resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={form.agreed}
                  onChange={e => set('agreed', e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#8A5A36] shrink-0"
                />
                <label htmlFor="agree" className="text-xs text-[#6B5D54] leading-relaxed">
                  I agree to the{' '}
                  <button type="button" onClick={() => showToast('Opening Privacy Policy...', 'info')} className="text-[#8A5A36] hover:underline">
                    Privacy Policy
                  </button>
                  {' '}and{' '}
                  <button type="button" onClick={() => showToast('Opening Terms & Conditions...', 'info')} className="text-[#8A5A36] hover:underline">
                    Terms & Conditions
                  </button>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#5C3A1E] hover:bg-[#4A2E17] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-7 py-3 transition-colors"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    SENDING...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    SEND MESSAGE
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="bg-white border border-[#EBE3D7] rounded-sm p-8">
            <h2 className="font-serif text-2xl text-[#2D2723] mb-1">Contact Information</h2>
            <p className="text-xs text-[#8C7C70] mb-7">Reach out to us through any of these channels.</p>

            <div className="space-y-6">
              {/* Call */}
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5EDE4] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#8A5A36]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2723] mb-0.5">Call Us</p>
                  <a href="tel:+919876543210" className="text-sm text-[#8A5A36] hover:underline font-medium">+91 98765 43210</a>
                  <p className="text-xs text-[#8C7C70] mt-0.5">(Mon – Sat, 10 AM – 7 PM)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5EDE4] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#8A5A36]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2723] mb-0.5">Email Us</p>
                  <a href="mailto:support@nestasia.in" className="text-sm text-[#8A5A36] hover:underline font-medium">support@nestasia.in</a>
                  <p className="text-xs text-[#8C7C70] mt-0.5">We reply within 24 hrs</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5EDE4] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#8A5A36]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2723] mb-0.5">WhatsApp Us</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-sm text-[#8A5A36] hover:underline font-medium">+91 98765 43210</a>
                  <p className="text-xs text-[#8C7C70] mt-0.5">(Mon – Sat, 10 AM – 7 PM)</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5EDE4] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#8A5A36]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D2723] mb-0.5">Our Office</p>
                  <p className="text-sm text-[#574B42] leading-relaxed">
                    Nestasia Home Pvt. Ltd.<br />
                    123, Triveni Nagar, Near ABC Chowk,<br />
                    Tathawade, Pune – 411033,<br />
                    Maharashtra, India
                  </p>
                  <button
                    onClick={() => window.open('https://maps.google.com/?q=Tathawade,Pune', '_blank')}
                    className="text-xs text-[#8A5A36] hover:underline mt-1.5 inline-block font-medium"
                  >
                    Get Directions →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="w-full h-80 border-t border-b border-[#EBE3D7]">
        <iframe
          title="Nestasia Office Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8!2d73.7667!3d18.6187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b973b6a3c36b%3A0x76c00ef56a74ce7b!2sTathawade%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* ── Value Props Bar ── */}
      <section className="bg-white border-b border-[#EBE3D7] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Truck className="w-7 h-7" />, label: 'Free Shipping', sub: 'On orders above ₹999' },
            { icon: <RotateCcw className="w-7 h-7" />, label: 'Easy Returns', sub: 'Within 7 days' },
            { icon: <ShieldCheck className="w-7 h-7" />, label: 'Secure Payments', sub: '100% secure' },
            { icon: <Headphones className="w-7 h-7" />, label: 'Customer Support', sub: "We're here to help" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="text-[#8A5A36]">{item.icon}</div>
              <p className="text-sm font-semibold text-[#2D2723]">{item.label}</p>
              <p className="text-xs text-[#8C7C70]">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
