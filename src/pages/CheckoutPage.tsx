import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Landmark, 
  Wallet,
  Banknote, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  ShoppingBag, 
  Plus, 
  Check,
  Edit2,
  Trash2,
  Calendar,
  RotateCcw,
  Headphones,
  Heart,
  PackageCheck,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    user,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    applyCouponCode,
    placeOrder,
    navigateTo,
    setIsAuthOpen,
    showToast,
  } = useShop();

  const [isProcessing, setIsProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Address State
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [deliverToDifferentAddress, setDeliverToDifferentAddress] = useState(false);

  const [addressList, setAddressList] = useState<Address[]>(() => {
    if (user?.addresses && user.addresses.length > 0) {
      return user.addresses;
    }
    return [
      {
        fullName: 'Sushant Namurte',
        phone: '+91 87654 32100',
        street: '123, Triveni Nagar, Near ABC Chowk, Tathawade',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411033',
        isDefault: true,
      },
      {
        fullName: 'Office',
        phone: '+91 98765 43210',
        street: 'Gaffis Technologies Pvt. Ltd., Office No. 501, IT Park, Hinjewadi Phase 3',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411057',
        isDefault: false,
      }
    ];
  });

  const [addressForm, setAddressForm] = useState<Address>({
    fullName: '',
    phone: '',
    street: '',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '',
    isDefault: false,
  });

  // Shipping Method State
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'scheduled'>('standard');

  // Payment Method State
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking' | 'wallets' | 'cod'>('upi');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

  // Card Form
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // NetBanking Bank
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallets
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Coupon code input in sidebar
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Terms Agreement
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Calculated Shipping Cost based on selected option
  const selectedShippingCost = shippingMethod === 'standard' 
    ? (cartSubtotal >= 999 ? 0 : 99) 
    : shippingMethod === 'express' 
      ? 199 
      : 149;

  const totalCalculated = Math.max(0, cartSubtotal - discountAmount + selectedShippingCost);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handle Save / Edit Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.pincode) {
      showToast('Please fill all mandatory address fields', 'error');
      return;
    }

    if (editingAddressIndex !== null) {
      const updated = [...addressList];
      updated[editingAddressIndex] = addressForm;
      setAddressList(updated);
      setEditingAddressIndex(null);
      showToast('Address updated successfully', 'success');
    } else {
      const updated = [...addressList, addressForm];
      setAddressList(updated);
      setSelectedAddressIndex(updated.length - 1);
      setIsAddingNewAddress(false);
      showToast('New delivery address added', 'success');
    }

    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '',
      isDefault: false,
    });
  };

  const handleEditAddress = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressIndex(idx);
    setAddressForm(addressList[idx]);
    setIsAddingNewAddress(true);
  };

  const handleRemoveAddress = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addressList.length <= 1) {
      showToast('You must have at least one delivery address', 'error');
      return;
    }
    const updated = addressList.filter((_, i) => i !== idx);
    setAddressList(updated);
    if (selectedAddressIndex >= updated.length) {
      setSelectedAddressIndex(0);
    }
    showToast('Address removed', 'info');
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      showToast('Please enter a coupon code', 'error');
      return;
    }
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  const handleProceedToPay = async () => {
    if (!termsAgreed) {
      showToast('Please accept the Terms & Conditions and Privacy Policy', 'error');
      return;
    }

    const chosenAddress = addressList[selectedAddressIndex] || addressList[0];
    if (!chosenAddress) {
      showToast('Please select a delivery address', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const paymentMode = paymentTab === 'wallets' ? 'upi' : paymentTab;
      const order = await placeOrder(chosenAddress, paymentMode);
      setPlacedOrder(order);
    } catch (e) {
      console.error(e);
      showToast('Failed to complete order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // If order was just placed, show confirmation screen
  if (placedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2D2723]">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Confirmation Box */}
          <div className="bg-white rounded-3xl border border-[#EBE3D8] p-8 sm:p-12 text-center space-y-6 shadow-2xs">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A5A36]">
                Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2723]">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-[#7D6E63] max-w-md mx-auto">
                We’ve received your order. Our master potters and studio packaging team are now carefully inspecting and packing your ceramics.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#FAF6F1] border border-[#EAE0D3] rounded-2xl p-5 max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <span className="text-[11px] text-[#8C7B70] uppercase tracking-wider block font-medium">Order ID</span>
                <span className="font-mono font-bold text-base text-[#2D2723]">{placedOrder.orderNumber}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] text-[#8C7B70] uppercase tracking-wider block font-medium">Estimated Delivery</span>
                <span className="font-semibold text-sm text-emerald-800">{placedOrder.estimatedDelivery || 'In 3-5 Working Days'}</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('orders', { orderNumber: placedOrder.orderNumber })}
                className="w-full sm:w-auto bg-[#8A5A36] hover:bg-[#6E4223] text-white px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Track Your Shipment</span>
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="w-full sm:w-auto bg-[#FAF8F5] hover:bg-[#F3EDE6] text-[#52443C] border border-[#DDD3C7] px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Receipt Inclusions */}
          <div className="bg-white rounded-3xl border border-[#EBE3D8] p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg text-[#2D2723] border-b border-[#EBE3D8] pb-3">
              Order Receipt
            </h3>
            
            <div className="divide-y divide-[#F5EFEB]">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EC] border border-[#EAE3DA]"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#2D2723]">{item.product.name}</p>
                      <p className="text-[11px] text-[#8C7B70]">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#2D2723]">
                    ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EBE3D8] pt-4 space-y-1.5 text-xs text-[#52443C]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{placedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {placedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{placedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{placedOrder.shipping === 0 ? 'FREE' : `₹${placedOrder.shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#2D2723] pt-2 border-t border-[#EBE3D8]">
                <span>Total Paid</span>
                <span className="text-[#8A5A36]">₹{placedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty and no placed order
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-3xl border border-[#EBE3D8] shadow-2xs">
          <ShoppingBag className="w-12 h-12 mx-auto text-[#8A5A36]" />
          <h2 className="font-serif text-2xl text-[#2D2723]">Your Cart is Empty</h2>
          <p className="text-xs text-[#7D6E63]">
            Add items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigateTo('category', { category: 'Dinnerware' })}
            className="bg-[#8A5A36] text-white px-6 py-3 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Explore Dinnerware
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#2D2723] pb-24">
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
          <span className="text-[#2D2723] font-medium">Checkout</span>
        </nav>

        {/* ================= 2. PAGE TITLE ================= */}
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2723] font-normal tracking-tight mb-8">
          Checkout
        </h1>

        {/* ================= 3. STEPPER INDICATOR (Address - Shipping - Payment) ================= */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            
            {/* Connecting lines */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#EAE2D7] -z-0" />

            {/* Step 1: Address */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-[#8A5A36] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                1
              </div>
              <span className="text-xs font-semibold text-[#2D2723]">Address</span>
            </div>

            {/* Step 2: Shipping */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-[#DDD3C7] text-[#8C7B70] flex items-center justify-center text-xs font-semibold shadow-2xs">
                2
              </div>
              <span className="text-xs font-medium text-[#8C7B70]">Shipping</span>
            </div>

            {/* Step 3: Payment */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full bg-white border border-[#DDD3C7] text-[#8C7B70] flex items-center justify-center text-xs font-semibold shadow-2xs">
                3
              </div>
              <span className="text-xs font-medium text-[#8C7B70]">Payment</span>
            </div>

          </div>
        </div>

        {/* ================= 4. MAIN 2-COLUMN CHECKOUT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* ================= LEFT COLUMN: 3 ACCORDION CARDS (8 cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ================= CARD 1: DELIVERY ADDRESS ================= */}
            <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 shadow-2xs space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <h2 className="text-base font-semibold text-[#2D2723]">
                  1. Delivery Address
                </h2>
                <div className="text-xs text-[#8C7B70]">
                  Have an account?{' '}
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="text-[#8A5A36] font-semibold underline hover:text-[#6E4223] cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              </div>

              {/* Subheader */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2D2723]">
                  Select Address
                </span>
                <button
                  onClick={() => {
                    setEditingAddressIndex(null);
                    setAddressForm({
                      fullName: '',
                      phone: '',
                      street: '',
                      city: 'Pune',
                      state: 'Maharashtra',
                      pincode: '',
                      isDefault: false,
                    });
                    setIsAddingNewAddress(true);
                  }}
                  className="text-xs font-semibold text-[#8A5A36] hover:text-[#6E4223] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Address Cards List */}
              <div className="space-y-3">
                {addressList.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isSelected 
                          ? 'border-[#8A5A36] bg-[#FAF6F1]/60 ring-1 ring-[#8A5A36]' 
                          : 'border-[#EAE3DA] bg-white hover:border-[#DDD2C4]'
                      }`}
                    >
                      {/* Left: Radio + Address details */}
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Custom Radio */}
                        <div className="mt-0.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C4B7AA] bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#2D2723]">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="bg-[#EFE9DF] text-[#7A5B44] text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[#52443C] leading-relaxed">
                            {addr.street}
                          </p>
                          <p className="text-[#52443C]">
                            {addr.city} - {addr.pincode}, {addr.state}, India
                          </p>
                          <p className="text-[#2D2723] font-medium pt-0.5">
                            {addr.phone}
                          </p>
                        </div>
                      </div>

                      {/* Right: Edit & Remove Action Buttons */}
                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <button
                          onClick={(e) => handleEditAddress(idx, e)}
                          className="inline-flex items-center gap-1 text-[#8C7B70] hover:text-[#8A5A36] transition-colors cursor-pointer font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleRemoveAddress(idx, e)}
                          className="inline-flex items-center gap-1 text-[#8C7B70] hover:text-rose-600 transition-colors cursor-pointer font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Add / Edit Address Inline Form */}
              {isAddingNewAddress && (
                <form onSubmit={handleSaveAddress} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E5DCD0] space-y-3.5 mt-4">
                  <div className="flex items-center justify-between border-b border-[#EAE0D3] pb-2">
                    <h4 className="text-xs font-bold text-[#2D2723] uppercase tracking-wider">
                      {editingAddressIndex !== null ? 'Edit Address' : 'New Delivery Address'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(false);
                        setEditingAddressIndex(null);
                      }}
                      className="text-xs text-[#8C7B70] hover:text-[#2D2723] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Full Name / Label *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        placeholder="e.g. Sushant Namurte or Home"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="e.g. +91 87654 32100"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Street Address / House / Flat *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="e.g. 123, Triveni Nagar, Near ABC Chowk, Tathawade"
                      className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="e.g. 411033"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#52443C] block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="Pune"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#52443C] block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="Maharashtra"
                        className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(false);
                        setEditingAddressIndex(null);
                      }}
                      className="px-4 py-2 text-xs border border-[#DDD3C7] rounded-lg text-[#52443C] hover:bg-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold bg-[#8A5A36] text-white rounded-lg hover:bg-[#6E4223] transition-colors cursor-pointer shadow-3xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Deliver to different address Checkbox */}
              <div className="pt-1">
                <label className="inline-flex items-center gap-2.5 text-xs text-[#52443C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliverToDifferentAddress}
                    onChange={(e) => setDeliverToDifferentAddress(e.target.checked)}
                    className="w-4 h-4 rounded border-[#DDD3C7] text-[#8A5A36] focus:ring-[#8A5A36]"
                  />
                  <span>Deliver to a different address</span>
                </label>
              </div>

            </div>


            {/* ================= CARD 2: SHIPPING METHOD ================= */}
            <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 shadow-2xs space-y-4">
              
              {/* Header */}
              <div>
                <h2 className="text-base font-semibold text-[#2D2723]">
                  2. Shipping Method
                </h2>
                <p className="text-xs text-[#8C7B70] mt-0.5">
                  Choose a shipping option for your order
                </p>
              </div>

              {/* Shipping Options */}
              <div className="space-y-3 pt-1">
                
                {/* 1. Standard Delivery */}
                <div
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    shippingMethod === 'standard'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]/60 ring-1 ring-[#8A5A36]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#DDD2C4]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Radio */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      shippingMethod === 'standard' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C4B7AA] bg-white'
                    }`}>
                      {shippingMethod === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    {/* Truck Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#EAE3DA] flex items-center justify-center text-[#8A5A36] shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-[#2D2723]">Standard Delivery</h3>
                      <p className="text-[11px] text-[#8C7B70]">Deliver in 3-5 working days</p>
                    </div>
                  </div>

                  {/* Right side: FREE / on orders above 999 */}
                  <div className="text-right">
                    <span className="font-bold text-xs sm:text-sm text-emerald-700 block">
                      FREE
                    </span>
                    <span className="text-[10px] text-[#8C7B70]">
                      On orders above ₹999
                    </span>
                  </div>
                </div>

                {/* 2. Express Delivery */}
                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    shippingMethod === 'express'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]/60 ring-1 ring-[#8A5A36]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#DDD2C4]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Radio */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      shippingMethod === 'express' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C4B7AA] bg-white'
                    }`}>
                      {shippingMethod === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    {/* Truck Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#EAE3DA] flex items-center justify-center text-[#8A5A36] shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-[#2D2723]">Express Delivery</h3>
                      <p className="text-[11px] text-[#8C7B70]">Deliver in 1-2 working days</p>
                    </div>
                  </div>

                  {/* Right side: ₹199 */}
                  <div className="text-right">
                    <span className="font-semibold text-xs sm:text-sm text-[#2D2723]">
                      ₹199
                    </span>
                  </div>
                </div>

                {/* 3. Scheduled Delivery */}
                <div
                  onClick={() => setShippingMethod('scheduled')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    shippingMethod === 'scheduled'
                      ? 'border-[#8A5A36] bg-[#FAF6F1]/60 ring-1 ring-[#8A5A36]'
                      : 'border-[#EAE3DA] bg-white hover:border-[#DDD2C4]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Radio */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                      shippingMethod === 'scheduled' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C4B7AA] bg-white'
                    }`}>
                      {shippingMethod === 'scheduled' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    {/* Calendar Icon */}
                    <div className="w-9 h-9 rounded-lg bg-[#FAF6F1] border border-[#EAE3DA] flex items-center justify-center text-[#8A5A36] shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm text-[#2D2723]">Scheduled Delivery</h3>
                      <p className="text-[11px] text-[#8C7B70]">Choose a convenient date & time</p>
                    </div>
                  </div>

                  {/* Right side: ₹149 */}
                  <div className="text-right">
                    <span className="font-semibold text-xs sm:text-sm text-[#2D2723]">
                      ₹149
                    </span>
                  </div>
                </div>

              </div>

            </div>


            {/* ================= CARD 3: PAYMENT METHOD ================= */}
            <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 shadow-2xs space-y-4">
              
              {/* Header */}
              <div>
                <h2 className="text-base font-semibold text-[#2D2723]">
                  3. Payment Method
                </h2>
                <p className="text-xs text-[#8C7B70] mt-0.5">
                  Choose a payment method
                </p>
              </div>

              {/* Two Column Payment Box (Left Tabs, Right Panel) */}
              <div className="grid grid-cols-1 md:grid-cols-12 rounded-xl border border-[#EAE3DA] overflow-hidden">
                
                {/* Left Side: Payment Tabs (5 cols) */}
                <div className="md:col-span-5 bg-[#FAF8F5] border-b md:border-b-0 md:border-r border-[#EAE3DA] divide-y divide-[#EAE3DA]">
                  
                  {/* Tab 1: UPI / QR */}
                  <button
                    onClick={() => setPaymentTab('upi')}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      paymentTab === 'upi' ? 'bg-[#FAF6F1] ring-inset' : 'hover:bg-white/80'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full mt-0.5 flex items-center justify-center border shrink-0 ${
                      paymentTab === 'upi' ? 'border-[#8A5A36] bg-[#8A5A36]' : 'border-[#C4B7AA] bg-white'
                    }`}>
                      {paymentTab === 'upi' && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2D2723]">UPI / QR</h4>
                      <p className="text-[11px] text-[#8C7B70]">Pay using any UPI app</p>
                    </div>
                  </button>

                  {/* Tab 2: Credit / Debit Card */}
                  <button
                    onClick={() => setPaymentTab('card')}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      paymentTab === 'card' ? 'bg-[#FAF6F1]' : 'hover:bg-white/80'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#2D2723]">Credit / Debit Card</h4>
                      <p className="text-[11px] text-[#8C7B70]">Visa, Mastercard, Rupay</p>
                    </div>
                  </button>

                  {/* Tab 3: Net Banking */}
                  <button
                    onClick={() => setPaymentTab('netbanking')}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      paymentTab === 'netbanking' ? 'bg-[#FAF6F1]' : 'hover:bg-white/80'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#2D2723]">Net Banking</h4>
                      <p className="text-[11px] text-[#8C7B70]">All major banks</p>
                    </div>
                  </button>

                  {/* Tab 4: Wallets */}
                  <button
                    onClick={() => setPaymentTab('wallets')}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      paymentTab === 'wallets' ? 'bg-[#FAF6F1]' : 'hover:bg-white/80'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#2D2723]">Wallets</h4>
                      <p className="text-[11px] text-[#8C7B70]">Paytm, PhonePe, Amazon Pay</p>
                    </div>
                  </button>

                  {/* Tab 5: Cash on Delivery */}
                  <button
                    onClick={() => setPaymentTab('cod')}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      paymentTab === 'cod' ? 'bg-[#FAF6F1]' : 'hover:bg-white/80'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#8A5A36] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-[#2D2723]">Cash on Delivery</h4>
                      <p className="text-[11px] text-[#8C7B70]">Pay when you receive</p>
                    </div>
                  </button>

                </div>

                {/* Right Side: Payment Method Details (7 cols) */}
                <div className="md:col-span-7 p-6 bg-white flex flex-col justify-center">
                  
                  {/* TAB 1 CONTENT: UPI / QR */}
                  {paymentTab === 'upi' && (
                    <div className="space-y-4 text-center">
                      <div>
                        <h3 className="font-semibold text-sm text-[#2D2723]">
                          Pay using UPI
                        </h3>
                        <p className="text-[11px] text-[#8C7B70] mt-0.5">
                          Scan the QR code using any UPI app
                        </p>
                      </div>

                      {/* Stylized QR Code with Nestasia Emblem */}
                      <div className="mx-auto w-44 h-44 bg-white border border-[#E5DCD0] rounded-xl p-2.5 shadow-2xs flex flex-col items-center justify-center relative">
                        {/* Realistic SVG QR Pattern */}
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#2D2723]" fill="currentColor">
                          {/* Corner Markers */}
                          <rect x="5" y="5" width="26" height="26" fill="#2D2723" rx="2" />
                          <rect x="8" y="8" width="20" height="20" fill="white" rx="1" />
                          <rect x="12" y="12" width="12" height="12" fill="#2D2723" rx="1" />

                          <rect x="69" y="5" width="26" height="26" fill="#2D2723" rx="2" />
                          <rect x="72" y="8" width="20" height="20" fill="white" rx="1" />
                          <rect x="76" y="12" width="12" height="12" fill="#2D2723" rx="1" />

                          <rect x="5" y="69" width="26" height="26" fill="#2D2723" rx="2" />
                          <rect x="8" y="72" width="20" height="20" fill="white" rx="1" />
                          <rect x="12" y="76" width="12" height="12" fill="#2D2723" rx="1" />

                          {/* Data bits */}
                          <rect x="36" y="6" width="6" height="6" />
                          <rect x="46" y="6" width="6" height="6" />
                          <rect x="56" y="6" width="6" height="6" />
                          <rect x="36" y="16" width="6" height="6" />
                          <rect x="48" y="16" width="6" height="6" />
                          <rect x="36" y="26" width="6" height="6" />
                          <rect x="56" y="26" width="6" height="6" />

                          <rect x="6" y="36" width="6" height="6" />
                          <rect x="16" y="36" width="6" height="6" />
                          <rect x="26" y="36" width="6" height="6" />
                          <rect x="6" y="46" width="6" height="6" />
                          <rect x="26" y="46" width="6" height="6" />
                          <rect x="6" y="56" width="6" height="6" />
                          <rect x="16" y="56" width="6" height="6" />
                          <rect x="26" y="56" width="6" height="6" />

                          <rect x="68" y="36" width="6" height="6" />
                          <rect x="86" y="36" width="6" height="6" />
                          <rect x="76" y="46" width="6" height="6" />
                          <rect x="68" y="56" width="6" height="6" />
                          <rect x="86" y="56" width="6" height="6" />

                          <rect x="36" y="68" width="6" height="6" />
                          <rect x="48" y="68" width="6" height="6" />
                          <rect x="58" y="68" width="6" height="6" />
                          <rect x="36" y="78" width="6" height="6" />
                          <rect x="56" y="78" width="6" height="6" />
                          <rect x="46" y="88" width="6" height="6" />
                          <rect x="58" y="88" width="6" height="6" />

                          <rect x="68" y="68" width="8" height="8" />
                          <rect x="84" y="68" width="8" height="8" />
                          <rect x="68" y="84" width="8" height="8" />
                          <rect x="84" y="84" width="8" height="8" />
                        </svg>

                        {/* Centered Brand Tag */}
                        <div className="absolute inset-0 m-auto w-12 h-6 bg-white rounded border border-[#DDD3C7] shadow-3xs flex items-center justify-center">
                          <span className="font-serif italic font-bold text-[9px] text-[#8A5A36] tracking-tighter">nestasia</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-[#52443C]">
                        UPI ID: <span className="text-[#2D2723]">nestasia@icici</span>
                      </p>

                      {/* Divider */}
                      <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#EAE3DA]" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase">
                          <span className="bg-white px-3 text-[#8C7B70] font-semibold">OR</span>
                        </div>
                      </div>

                      {/* Enter UPI ID */}
                      <div className="space-y-2 text-left">
                        <label className="text-[11px] font-semibold text-[#52443C] block">
                          Enter UPI ID
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="example@upi"
                            className="flex-1 text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                          />
                          <button
                            onClick={() => {
                              if (!upiIdInput.trim()) {
                                showToast('Please enter your UPI ID', 'error');
                                return;
                              }
                              setIsVerifyingUpi(true);
                              setTimeout(() => {
                                setIsVerifyingUpi(false);
                                handleProceedToPay();
                              }, 600);
                            }}
                            disabled={isVerifyingUpi}
                            className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-3xs"
                          >
                            {isVerifyingUpi ? 'VERIFYING...' : 'VERIFY & PAY'}
                          </button>
                        </div>
                        <p className="text-[11px] text-[#8C7B70]">
                          You will be redirected to your UPI app to complete the payment.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2 CONTENT: CREDIT / DEBIT CARD */}
                  {paymentTab === 'card' && (
                    <div className="space-y-3.5 text-left">
                      <h3 className="font-semibold text-sm text-[#2D2723]">Enter Card Details</h3>
                      <div>
                        <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8842"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:border-[#8A5A36]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/28"
                            className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:border-[#8A5A36]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#52443C] block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:border-[#8A5A36]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#52443C] block mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Sushant Namurte"
                          className="w-full text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] focus:border-[#8A5A36]"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3 CONTENT: NET BANKING */}
                  {paymentTab === 'netbanking' && (
                    <div className="space-y-3 text-left">
                      <h3 className="font-semibold text-sm text-[#2D2723]">Select Popular Bank</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                              selectedBank === bank
                                ? 'border-[#8A5A36] bg-[#FAF6F1] text-[#8A5A36] font-semibold'
                                : 'border-[#EAE3DA] bg-white hover:border-[#DDD2C4]'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4 CONTENT: WALLETS */}
                  {paymentTab === 'wallets' && (
                    <div className="space-y-3 text-left">
                      <h3 className="font-semibold text-sm text-[#2D2723]">Choose Digital Wallet</h3>
                      <div className="space-y-2">
                        {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik'].map((wallet) => (
                          <label
                            key={wallet}
                            onClick={() => setSelectedWallet(wallet)}
                            className={`p-3 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                              selectedWallet === wallet
                                ? 'border-[#8A5A36] bg-[#FAF6F1]'
                                : 'border-[#EAE3DA] bg-white'
                            }`}
                          >
                            <span className="font-medium text-[#2D2723]">{wallet}</span>
                            <input
                              type="radio"
                              name="wallet"
                              checked={selectedWallet === wallet}
                              onChange={() => setSelectedWallet(wallet)}
                              className="text-[#8A5A36] focus:ring-[#8A5A36]"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5 CONTENT: CASH ON DELIVERY */}
                  {paymentTab === 'cod' && (
                    <div className="space-y-3 text-center py-2">
                      <div className="w-12 h-12 rounded-full bg-[#FAF6F1] border border-[#EAE3DA] text-[#8A5A36] flex items-center justify-center mx-auto">
                        <Banknote className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-sm text-[#2D2723]">Cash on Delivery</h3>
                      <p className="text-xs text-[#7D6E63] max-w-xs mx-auto">
                        Pay with cash or UPI to the courier upon delivery at your doorstep. No extra surcharge applied.
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="pt-1">
              <label className="inline-flex items-center gap-2.5 text-xs text-[#52443C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-[#DDD3C7] text-[#8A5A36] focus:ring-[#8A5A36]"
                />
                <span>
                  I have read and agree to the <span className="text-[#8A5A36] underline">Terms & Conditions</span> and <span className="text-[#8A5A36] underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Bottom Action Buttons: Back to Cart + Proceed to Pay */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                onClick={() => navigateTo('cart')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#DDD3C7] hover:border-[#8A5A36] text-[#52443C] hover:text-[#8A5A36] bg-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
              >
                <span>← BACK TO CART</span>
              </button>

              <button
                onClick={handleProceedToPay}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-[#8A5A36] hover:bg-[#6E4223] text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{isProcessing ? 'PROCESSING...' : 'PROCEED TO PAY →'}</span>
              </button>
            </div>

          </div>


          {/* ================= RIGHT COLUMN: ORDER SUMMARY SIDEBAR (4 cols) ================= */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#EAE3DA] p-6 shadow-2xs space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                <h2 className="font-serif text-2xl text-[#2D2723]">
                  Order Summary
                </h2>
                <span className="text-xs text-[#8C7B70] font-medium">
                  {totalCartCount} Items
                </span>
              </div>

              {/* Items List in Summary */}
              <div className="divide-y divide-[#F0EAE1] max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-[#F5F2EC] border border-[#EAE3DA] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-semibold text-xs text-[#2D2723] line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.product.subtitle && (
                          <p className="text-[11px] text-[#8C7B70]">
                            {item.product.subtitle}
                          </p>
                        )}
                        <p className="font-bold text-xs text-[#2D2723]">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-xs text-[#8C7B70] font-medium shrink-0">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Apply Coupon Box */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#2D2723] block mb-1.5">
                  Apply Coupon Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder={appliedCoupon ? `Applied: ${appliedCoupon.code}` : "Enter coupon code"}
                    className="flex-1 text-xs bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-[#2D2723] placeholder-[#A09388] focus:outline-none focus:border-[#8A5A36] shadow-3xs"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon}
                    className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-3xs shrink-0"
                  >
                    {isApplyingCoupon ? 'APPLYING...' : 'APPLY'}
                  </button>
                </div>
              </div>

              {/* Price Details Breakdown */}
              <div className="pt-3 border-t border-[#F0EAE1] space-y-3 text-xs sm:text-sm">
                
                {/* Subtotal */}
                <div className="flex items-center justify-between text-[#52443C]">
                  <span>Subtotal ({totalCartCount} Items)</span>
                  <span className="font-semibold text-[#2D2723]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Discount */}
                {discountAmount > 0 ? (
                  <div className="flex items-center justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon?.code || 'NEST10'})</span>
                    <span className="font-bold">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[#8C7B70]">
                    <span>Discount</span>
                    <span>₹0</span>
                  </div>
                )}

                {/* Shipping Charges */}
                <div className="flex items-center justify-between text-[#52443C]">
                  <span>Shipping Charges</span>
                  <span>
                    {selectedShippingCost === 0 ? (
                      <span className="font-semibold text-emerald-700">FREE</span>
                    ) : (
                      <span className="font-semibold text-[#2D2723]">₹{selectedShippingCost}</span>
                    )}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-[#F0EAE1] pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-base text-[#2D2723] block">Total Amount</span>
                    <span className="text-[11px] text-[#8C7B70] font-normal">(Inclusive of all taxes)</span>
                  </div>
                  <span className="font-bold text-2xl text-[#2D2723]">
                    ₹{totalCalculated.toLocaleString('en-IN')}
                  </span>
                </div>

              </div>

              {/* Trust Badges under Summary */}
              <div className="pt-4 border-t border-[#F0EAE1] space-y-3.5">
                
                {/* Secure Payments */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2D2723]">Secure Payments</h4>
                    <p className="text-[11px] text-[#8C7B70]">100% secure and encrypted</p>
                  </div>
                </div>

                {/* Easy Returns */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FAF6F1] flex items-center justify-center text-[#8A5A36] shrink-0 border border-[#EAE3DA]">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2D2723]">Easy Returns</h4>
                    <p className="text-[11px] text-[#8C7B70]">Within 7 days of delivery</p>
                  </div>
                </div>

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
