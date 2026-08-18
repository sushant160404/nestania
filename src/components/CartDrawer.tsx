import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag, Check, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { COUPONS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);
    await applyCouponCode(couponInput);
    setLoadingCoupon(false);
    setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EBE3D7] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DE] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8A5A36]" />
            <h2 className="font-serif text-xl text-[#2D2723] font-normal">
              Your Shopping Bag ({totalItemsCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] hover:bg-[#EDE5DA] rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-[#FAF3EB] p-3.5 border-b border-[#EDE2D5]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {amountNeededForFreeShipping > 0 ? (
              <span className="text-[#6D594C]">
                Add <strong className="text-[#8A5A36] font-bold">₹{amountNeededForFreeShipping}</strong> more to get <strong className="text-emerald-700 font-bold">FREE Delivery</strong>
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Congratulations! You have unlocked FREE Delivery 🎉
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#8A5A36]">
              {freeShippingProgress}%
            </span>
          </div>

          <div className="w-full bg-[#E5D8CA] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                freeShippingProgress >= 100 ? 'bg-emerald-600' : 'bg-[#8A5A36]'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F2ECE5]">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F5EFEB] shrink-0 border border-[#ECE5DC]"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-sm font-medium text-[#2D2723] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#9F8E82] hover:text-[#C0392B] p-1 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#8C7C70] mt-0.5">
                      {item.product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#D5C8B9] rounded-lg overflow-hidden bg-[#FAF8F5]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 px-2 text-xs text-[#52443C] hover:bg-[#EDE5DA] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-semibold text-[#2D2723]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 px-2 text-xs text-[#52443C] hover:bg-[#EDE5DA] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#2D2723]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <ShoppingBag className="w-12 h-12 text-[#C9BEB2] mx-auto mb-3" />
              <p className="font-serif text-lg text-[#3A2F28]">Your bag is currently empty</p>
              <p className="text-xs text-[#8F7F74] mt-1">Explore our artisanal dinner sets & home decor</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-[#8A5A36] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#724523] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EBE3D7] bg-[#FAF8F5] space-y-4">
            
            {/* Promo Code Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% off)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#C0392B] hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. NEST10)"
                    className="flex-1 bg-white border border-[#DDD2C2] rounded-xl px-3 py-2 text-xs uppercase text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                  />
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="bg-[#8A5A36] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#6E4223] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="flex gap-2 mt-2">
                  {COUPONS.slice(0, 2).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => applyCouponCode(c.code)}
                      className="text-[11px] bg-white border border-[#E3DCCE] hover:border-[#8A5A36] text-[#6E5D53] px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-[#8A5A36]" />
                      <span>{c.code} ({c.discountPercent}% OFF)</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-[#635349] pt-2 border-t border-[#EDE5DA]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-semibold">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#2D2723] pt-2 border-t border-[#EAE2D5]">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7B70]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout with 256-Bit SSL</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
