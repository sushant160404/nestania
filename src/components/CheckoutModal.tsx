import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, QrCode, Building, Banknote, Sparkles, ArrowLeft, ArrowRight, Download, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    user,
    setIsOrderTrackingOpen,
  } = useShop();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address form
  const [address, setAddress] = useState<Address>(() => {
    if (user && user.addresses.length > 0) {
      return user.addresses[0];
    }
    return {
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      street: '402, Lotus Grand Residences, 12th Main Road',
      apartment: 'Indiranagar 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
    };
  });

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('789');

  if (!isCheckoutOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8A5A36', '#D4AF37', '#EED8C4', '#2D2723'],
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await placeOrder(address, paymentMethod);
      setPlacedOrder(order);
      setStep('success');
      triggerConfetti();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('address');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#EAE3DA] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DE] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-[#8A5A36] font-normal">
              nestania
            </span>
            <span className="text-xs text-[#8C7B70] hidden sm:inline">| Secure Luxury Checkout</span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] rounded-full hover:bg-[#EDE5DA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (if not on success) */}
        {step !== 'success' && (
          <div className="bg-white border-b border-[#F0EAE2] px-6 py-3 flex items-center justify-center gap-8 text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-[#8A5A36]' : 'text-emerald-700'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'address' ? 'bg-[#8A5A36] text-white' : 'bg-emerald-700 text-white'
              }`}>
                {step === 'payment' ? <Check className="w-3 h-3" /> : '1'}
              </div>
              <span>1. Delivery Address</span>
            </div>

            <div className="w-8 h-[1px] bg-[#E3DCCE]" />

            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#8A5A36]' : 'text-[#A8988C]'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' ? 'bg-[#8A5A36] text-white' : 'bg-[#EAE3DA] text-[#6E5D53]'
              }`}>
                2
              </div>
              <span>2. Payment Method</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          
          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h3 className="font-serif text-xl text-[#2D2723] font-normal mb-1">
                Where should we deliver your order?
              </h3>
              <p className="text-xs text-[#7A6A5E] mb-4">
                All fragile ceramics are shipped with 4-layer reinforced shockproof cushions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Street Address / House No.</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Apartment, Landmark or Area</label>
                <input
                  type="text"
                  value={address.apartment || ''}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3E38] mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3C4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2723] focus:bg-white focus:outline-none focus:border-[#8A5A36]"
                  />
                </div>
              </div>

              {/* Order Summary Snapshot */}
              <div className="bg-[#FAF6F1] p-4 rounded-2xl border border-[#EDE2D5] mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#3D322B]">
                    Order Total: <span className="font-bold text-[#8A5A36]">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </p>
                  <p className="text-[11px] text-[#7E6E63]">{cart.length} item(s) in bag</p>
                </div>
                <button
                  type="submit"
                  className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-semibold py-2.5 px-6 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#2D2723] font-normal">
                  Select Payment Method
                </h3>
                <button
                  onClick={() => setStep('address')}
                  className="text-xs text-[#8A5A36] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              </div>

              {/* Payment Option Cards */}
              <div className="space-y-3">
                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#D5C6B7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#2D2723]">Instant UPI / QR Code</p>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-[#7A6A5E]">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C8BCB1]'
                    }`}>
                      {paymentMethod === 'upi' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-[#EDE5DB]">
                      <label className="block text-xs font-semibold text-[#4A3E38] mb-1">Enter UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full bg-white border border-[#DDD3C4] rounded-xl px-3 py-2 text-xs text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                  )}
                </div>

                {/* Cards */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#D5C6B7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2D2723]">Credit / Debit Card</p>
                        <p className="text-xs text-[#7A6A5E]">Visa, Mastercard, RuPay, Diners</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C8BCB1]'
                    }`}>
                      {paymentMethod === 'card' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-[#EDE5DB] space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A3E38]">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-[#DDD3C4] rounded-lg px-2.5 py-1.5 text-xs text-[#2D2723]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A3E38]">Valid Thru</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-[#DDD3C4] rounded-lg px-2.5 py-1.5 text-xs text-[#2D2723]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A3E38]">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white border border-[#DDD3C4] rounded-lg px-2.5 py-1.5 text-xs text-[#2D2723]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* NetBanking */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#D5C6B7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2D2723]">Net Banking</p>
                        <p className="text-xs text-[#7A6A5E]">HDFC, ICICI, SBI, Axis & all Indian banks</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'netbanking' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C8BCB1]'
                    }`}>
                      {paymentMethod === 'netbanking' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#D5C6B7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2D2723]">Cash on Delivery</p>
                        <p className="text-xs text-[#7A6A5E]">Pay at your doorstep with Cash or UPI QR</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C8BCB1]'
                    }`}>
                      {paymentMethod === 'cod' && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE2D5] space-y-1.5 text-xs text-[#594B42]">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D2723] pt-2 border-t border-[#E8DFC8]">
                  <span>Total Payable</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white font-semibold text-sm py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isProcessing ? 'Processing Secure Payment...' : `PAY ₹${cartTotal.toLocaleString('en-IN')} & PLACE ORDER`}</span>
              </button>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS CONFIRMATION */}
          {step === 'success' && placedOrder && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#8A5A36] font-bold">
                  Order Confirmed
                </span>
                <h2 className="font-serif text-3xl text-[#2D2723] font-normal mt-1">
                  Thank You for Your Order!
                </h2>
                <p className="text-xs text-[#7A6A5E] mt-1">
                  We've received your order and our artisan studio is preparing your handcrafted pieces.
                </p>
              </div>

              {/* Order ID Card */}
              <div className="bg-[#FAF6F1] p-4 rounded-2xl border border-[#ECE0D3] max-w-md mx-auto text-left space-y-2 text-xs text-[#4F4239]">
                <div className="flex justify-between items-center border-b border-[#EAE1D5] pb-2">
                  <span className="text-[#8A796E]">Order Number</span>
                  <span className="font-bold text-[#8A5A36] text-sm">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8A796E]">Estimated Delivery</span>
                  <span className="font-semibold text-emerald-800">{placedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8A796E]">Delivering to</span>
                  <span className="font-medium truncate max-w-[200px]">{placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.pincode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8A796E]">Total Amount Paid</span>
                  <span className="font-bold text-[#2D2723]">₹{placedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setIsOrderTrackingOpen(true);
                  }}
                  className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4" />
                  <span>TRACK LIVE ORDER</span>
                </button>

                <button
                  onClick={handleClose}
                  className="bg-white border border-[#D5C6B7] hover:bg-[#FAF8F5] text-[#4A3E38] text-xs font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
