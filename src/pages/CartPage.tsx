import React, { useState, useRef } from 'react';
import { 
  Trash2, 
  ChevronRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Headphones,
  Heart,
  ChevronLeft,
  ShoppingBag,
  RotateCw,
  Info,
  Lock,
  Star,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, COUPONS } from '../data/products';
import { Product } from '../types';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    navigateTo,
    setSelectedProduct,
    addToCart,
    showToast,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Recommendations matching the screenshot:
  // 1. Pastel Ceramic Mug (Set of 2) - ₹449 - (215)
  // 2. Handpainted Dinner Plate (Set of 2) - ₹699 - (176)
  // 3. Speckle Stoneware Bowl (Set of 2) - ₹649 - (123)
  // 4. Wave Serving Bowl (Medium) - ₹799 - (122)
  // 5. Minimal White Platter (Large) - ₹899 - (88)
  const recommendationIds = [
    'nest-dw-09', // Pastel Ceramic Mug
    'nest-dw-06', // Handpainted Dinner Plate
    'nest-dw-07', // Speckle Stoneware Bowl
    'nest-dw-14', // Wave Serving Bowl
    'nest-dw-15', // Minimal White Platter
  ];

  const recommendations: Product[] = recommendationIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // If some couldn't be found by ID, fill from general PRODUCTS
  if (recommendations.length < 5) {
    PRODUCTS.forEach(p => {
      if (!recommendations.some(r => r.id === p.id) && recommendations.length < 5) {
        recommendations.push(p);
      }
    });
  }

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }
    setIsApplyingCoupon(true);
    await applyCouponCode(code.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  const handleUpdateCart = () => {
    setIsUpdatingCart(true);
    setTimeout(() => {
      setIsUpdatingCart(false);
      showToast('Shopping bag updated with current stock and prices', 'success');
    }, 400);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#2D2723] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* ================= 1. BREADCRUMBS ================= */}
        <nav className="flex items-center gap-2 text-xs text-[#8C7B70] mb-6">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <span className="text-[#2D2723] font-medium">Your Cart</span>
        </nav>

        {/* ================= 2. PAGE HEADER & FREE SHIPPING PROGRESS ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-3 flex-1 max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2723] font-normal tracking-tight">
              Your Cart <span className="text-[#8C7B70] text-2xl sm:text-3xl font-serif">({totalCartCount} Items)</span>
            </h1>

            {/* Progress Bar & Amount remaining */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-normal text-[#52443C]">
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    You are <strong className="font-semibold text-[#2D2723]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> away from <span className="text-emerald-700 font-semibold">FREE shipping!</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    You have unlocked FREE Shipping on this order!
                  </span>
                )}
              </div>

              {/* Styled Progress Bar with dynamic indicator */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#EBE4D8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#8A5A36] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#8C7B70] font-medium shrink-0">
                  {amountNeededForFreeShipping > 0 
                    ? `₹${amountNeededForFreeShipping.toLocaleString('en-IN')} to go` 
                    : 'Free Shipping unlocked'}
                </span>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => navigateTo('category', { category: 'Dinnerware' })}
            className="inline-flex items-center gap-2 border border-[#DDD3C7] hover:border-[#8A5A36] text-[#52443C] hover:text-[#8A5A36] bg-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-2xs self-start md:self-auto"
          >
            <span>← CONTINUE SHOPPING</span>
          </button>
        </div>

        {/* ================= 3. EMPTY STATE OR 2-COLUMN LAYOUT ================= */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EBE3D8] p-12 text-center max-w-xl mx-auto shadow-2xs space-y-6 my-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF6F1] border border-[#E8DED1] flex items-center justify-center text-[#8A5A36]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723]">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#7D6E63] max-w-sm mx-auto">
                Explore our handcrafted dinnerware, artisanal serveware, and table decor collections.
              </p>
            </div>
            <button
              onClick={() => navigateTo('category', { category: 'Dinnerware' })}
              className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              Explore Dinnerware Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
            
            {/* ================= LEFT COLUMN: CART TABLE & ACTIONS (8 cols) ================= */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Cart Table Container */}
              <div className="bg-white rounded-2xl border border-[#EAE3DA] shadow-2xs overflow-hidden">
                
                {/* Table Header */}
                <div className="hidden sm:grid sm:grid-cols-12 px-6 py-4 border-b border-[#F0EAE1] text-xs font-semibold text-[#8C7B70]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right pr-6">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#F0EAE1]">
                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-5 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4 transition-colors hover:bg-[#FDFCFB]"
                    >
                      {/* Product Thumbnail & Details (Col 1-6) */}
                      <div className="sm:col-span-6 flex items-center gap-4 min-w-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          onClick={() => {
                            setSelectedProduct(item.product);
                            navigateTo('product', { product: item.product });
                          }}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-[#F5F2EC] shrink-0 cursor-pointer border border-[#EAE3DA] hover:opacity-90 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 space-y-1">
                          <h3 
                            onClick={() => {
                              setSelectedProduct(item.product);
                              navigateTo('product', { product: item.product });
                            }}
                            className="font-semibold text-sm sm:text-base text-[#2D2723] hover:text-[#8A5A36] transition-colors cursor-pointer line-clamp-1"
                          >
                            {item.product.name}
                          </h3>
                          {item.product.subtitle && (
                            <p className="text-xs text-[#8C7B70]">
                              {item.product.subtitle}
                            </p>
                          )}
                          <div className="pt-0.5 space-y-0.5">
                            <span className="text-xs font-medium text-emerald-700 block">
                              In Stock
                            </span>
                            <span className="text-[11px] text-[#8C7B70] flex items-center gap-1">
                              <Truck className="w-3 h-3 text-[#8A5A36]" />
                              Eligible for FREE Shipping
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Row for Price / Stepper / Total / Delete */}
                      <div className="sm:col-span-6 flex items-center justify-between sm:grid sm:grid-cols-6 sm:items-center w-full pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFEB]">
                        
                        {/* Price (Col 1-2 of subgrid) */}
                        <div className="sm:col-span-2 sm:text-center text-sm font-semibold text-[#2D2723]">
                          <span className="sm:hidden text-xs text-[#8C7B70] font-normal mr-2">Price:</span>
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </div>

                        {/* Stepper (Col 3-4 of subgrid) */}
                        <div className="sm:col-span-2 flex sm:justify-center">
                          <div className="inline-flex items-center border border-[#DDD3C7] rounded-lg bg-white overflow-hidden shadow-3xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#52443C] hover:bg-[#FAF6F1] transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-[#2D2723]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#52443C] hover:bg-[#FAF6F1] transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total & Delete (Col 5-6 of subgrid) */}
                        <div className="sm:col-span-2 flex items-center justify-end gap-3 sm:gap-4">
                          <span className="font-bold text-sm sm:text-base text-[#2D2723]">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#B8AAA0] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Actions: Coupon Code Input + Update Cart Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                
                {/* Coupon Code Input */}
                <div className="flex items-center gap-2 max-w-md w-full">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7B70]">
                      <Tag className="w-4 h-4 text-[#8A5A36]" />
                    </div>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder={appliedCoupon ? `Applied: ${appliedCoupon.code}` : "Enter Coupon Code"}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#DDD3C7] rounded-lg text-xs text-[#2D2723] placeholder-[#A09388] focus:outline-none focus:border-[#8A5A36] shadow-3xs"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon}
                    className="bg-[#FAF6F1] hover:bg-[#EBE2D5] border border-[#DDD3C7] text-[#52443C] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-3xs shrink-0"
                  >
                    {isApplyingCoupon ? 'APPLYING...' : 'APPLY'}
                  </button>
                </div>

                {/* Update Cart Button */}
                <button
                  onClick={handleUpdateCart}
                  disabled={isUpdatingCart}
                  className="inline-flex items-center justify-center gap-2 border border-[#DDD3C7] hover:border-[#8A5A36] text-[#52443C] hover:text-[#8A5A36] bg-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-3xs shrink-0 self-end sm:self-auto"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isUpdatingCart ? 'animate-spin' : ''}`} />
                  <span>UPDATE CART</span>
                </button>

              </div>

            </div>


            {/* ================= RIGHT COLUMN: ORDER SUMMARY CARD (4 cols) ================= */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 shadow-2xs space-y-6">
                
                {/* Header */}
                <h2 className="font-serif text-2xl text-[#2D2723] pb-3 border-b border-[#F0EAE1]">
                  Order Summary
                </h2>

                {/* Price Details */}
                <div className="space-y-4">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#2D2723] block">
                    Price Details
                  </span>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-[#52443C]">
                      <span>Subtotal ({totalCartCount} Items)</span>
                      <span className="font-semibold text-[#2D2723]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Discount */}
                    {discountAmount > 0 ? (
                      <div className="flex items-center justify-between text-emerald-700">
                        <span>Discount ({appliedCoupon?.code || 'COUPON'})</span>
                        <span className="font-bold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[#8C7B70]">
                        <span>Discount (Coupon)</span>
                        <span className="text-xs">₹0</span>
                      </div>
                    )}

                    {/* Shipping Charges */}
                    <div className="flex items-center justify-between text-[#52443C]">
                      <span className="flex items-center gap-1">
                        Shipping Charges
                        <Info className="w-3.5 h-3.5 text-[#A09388]" title="Free shipping on orders above ₹999" />
                      </span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="font-semibold text-emerald-700">FREE</span>
                        ) : (
                          <span className="font-semibold text-[#2D2723]">₹{shippingFee}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#F0EAE1] pt-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="font-bold text-base text-[#2D2723] block">Total Amount</span>
                        <span className="text-[11px] text-[#8C7B70] font-normal">(Inclusive of all taxes)</span>
                      </div>
                      <span className="font-bold text-2xl text-[#2D2723]">
                        ₹{cartTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout Button */}
                  <button
                    onClick={() => navigateTo('checkout')}
                    className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>PROCEED TO CHECKOUT</span>
                  </button>

                  {/* We Accept Payment Logos Row */}
                  <div className="pt-2">
                    <span className="text-xs text-[#8C7B70] font-medium mb-2.5 block">
                      We Accept
                    </span>
                    <div className="flex items-center gap-2">
                      {/* VISA */}
                      <div className="bg-white border border-[#E5DCD0] rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-3xs">
                        <span className="font-extrabold text-xs italic tracking-tighter text-[#1A1F71]">VISA</span>
                      </div>
                      {/* Mastercard */}
                      <div className="bg-white border border-[#E5DCD0] rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-3xs">
                        <div className="flex -space-x-1.5 items-center">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
                        </div>
                      </div>
                      {/* RuPay */}
                      <div className="bg-white border border-[#E5DCD0] rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-3xs">
                        <span className="font-bold text-[11px] text-[#097939]">RuPay<span className="text-[#E05A1F]">▸</span></span>
                      </div>
                      {/* UPI */}
                      <div className="bg-white border border-[#E5DCD0] rounded-md px-2.5 py-1.5 flex items-center justify-center shadow-3xs">
                        <span className="font-bold text-[11px] text-[#2D2723]">UPI</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Pillars in Summary Card */}
                  <div className="pt-4 border-t border-[#F0EAE1] space-y-3.5">
                    {/* Free Shipping */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#2D2723]">Free Shipping</h4>
                        <p className="text-[11px] text-[#8C7B70]">On orders above ₹999</p>
                      </div>
                    </div>

                    {/* Easy Returns */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#2D2723]">Easy Returns</h4>
                        <p className="text-[11px] text-[#8C7B70]">Within 7 days</p>
                      </div>
                    </div>

                    {/* Secure Payments */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#2D2723]">Secure Payments</h4>
                        <p className="text-[11px] text-[#8C7B70]">100% secure</p>
                      </div>
                    </div>

                    {/* Customer Support */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#2D2723]">Customer Support</h4>
                        <p className="text-[11px] text-[#8C7B70]">We're here to help</p>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= 4. "YOU MAY ALSO LIKE" CAROUSEL ================= */}
        <div className="mt-16 mb-16 relative">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal">
              You May Also Like
            </h2>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C7] hover:border-[#8A5A36] flex items-center justify-center text-[#52443C] hover:text-[#8A5A36] transition-colors cursor-pointer shadow-3xs"
                title="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C7] hover:border-[#8A5A36] flex items-center justify-center text-[#52443C] hover:text-[#8A5A36] transition-colors cursor-pointer shadow-3xs"
                title="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {recommendations.map((prod) => (
              <div 
                key={prod.id}
                className="w-[230px] sm:w-[245px] shrink-0 bg-white rounded-2xl border border-[#EAE3DA] overflow-hidden shadow-2xs group flex flex-col justify-between"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-4/3 bg-[#F5F2EC] overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(prod);
                    navigateTo('product', { product: prod });
                  }}
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1">
                    <h3 
                      onClick={() => {
                        setSelectedProduct(prod);
                        navigateTo('product', { product: prod });
                      }}
                      className="font-medium text-sm text-[#2D2723] hover:text-[#8A5A36] transition-colors cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    {prod.subtitle && (
                      <p className="text-[11px] text-[#8C7B70]">
                        {prod.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-[#2D2723]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-[#8C7B70]">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span>({prod.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Quick Add to Cart button */}
                    <button
                      onClick={() => {
                        addToCart(prod, 1);
                        showToast(`Added ${prod.name} to your cart`, 'success');
                      }}
                      className="w-8 h-8 rounded-lg bg-[#8A5A36] hover:bg-[#6E4223] text-white flex items-center justify-center transition-colors cursor-pointer shadow-3xs"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ================= 5. BOTTOM 4-PILLAR FEATURE STRIP ================= */}
        <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 sm:p-8 mb-12 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Free Shipping */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2D2723]">Free Shipping</h4>
                <p className="text-xs text-[#8C7B70]">On orders above ₹999</p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2D2723]">Easy Returns</h4>
                <p className="text-xs text-[#8C7B70]">Within 7 days</p>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2D2723]">Secure Payments</h4>
                <p className="text-xs text-[#8C7B70]">100% secure</p>
              </div>
            </div>

            {/* Loved by Thousands */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#2D2723]">Loved by Thousands</h4>
                <p className="text-xs text-[#8C7B70]">Happy customers</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
