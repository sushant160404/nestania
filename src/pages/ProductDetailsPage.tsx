import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Headphones, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Check, 
  Gift, 
  Plus, 
  Minus,
  Share2,
  Leaf,
  UtensilsCrossed,
  Recycle,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, Review } from '../types';
import { PRODUCTS } from '../data/products';

export const ProductDetailsPage: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    showToast,
    applyCouponCode,
  } = useShop();

  // Fallback to first product (Ivory Bloom Dinner Set) if none selected
  const currentProduct: Product = selectedProduct || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>('560038');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(true);
  const [deliveryMessage, setDeliveryMessage] = useState<string>('Delivery by Tomorrow, COD Available');
  const [checkingPincode, setCheckingPincode] = useState<boolean>(false);

  // Accordion states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    care: false,
    shipping: false,
    reviews: false,
  });

  // Image gallery modal / expanded view
  const [showAllGalleryModal, setShowAllGalleryModal] = useState<boolean>(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      productId: currentProduct.id,
      author: 'Ananya Roy',
      rating: 5,
      date: '14 Aug 2025',
      title: 'Stunning craftsmanship and heavy luxury feel',
      comment: 'The Ivory Bloom set is absolutely gorgeous! The subtle glaze and botanical detailing look breathtaking under warm dining lights. Packaged exceptionally well with zero damage.',
      verifiedPurchase: true,
      helpfulCount: 32,
    },
    {
      id: 'rev-2',
      productId: currentProduct.id,
      author: 'Vikram Mehta',
      rating: 5,
      date: '08 Aug 2025',
      title: 'Microwave friendly and perfect proportions',
      comment: 'The bowl depth and plate rim proportions are ergonomic. Dishwasher cleaned it without fading. Very impressed with the quality.',
      verifiedPurchase: true,
      helpfulCount: 19,
    },
    {
      id: 'rev-3',
      productId: currentProduct.id,
      author: 'Deepika S.',
      rating: 4,
      date: '29 Jul 2025',
      title: 'Beautiful addition to our festive dinnerware',
      comment: 'Got tons of compliments from our housewarming guests. Worth every rupee.',
      verifiedPurchase: true,
      helpfulCount: 14,
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Recommendation carousel ref for smooth horizontal scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setQuantity(1);
  }, [currentProduct.id]);

  const isFavorite = isInWishlist(currentProduct.id);

  const allImages = currentProduct.galleryImages && currentProduct.galleryImages.length > 0
    ? currentProduct.galleryImages
    : [currentProduct.image];

  // Specific 5 recommendation products matching the screenshot
  const recommendationIds = [
    'nest-dw-rec-01', // Blue Floral Dinner Set
    'nest-dw-02',     // Pastel Petal Dinner Set
    'nest-dw-04',     // Minimal White Dinner Set
    'nest-dw-rec-02', // Rustic Charm Dinner Set
    'nest-dw-rec-03', // Handpainted Heritage Set
  ];

  const recommendationProducts = PRODUCTS.filter(p => recommendationIds.includes(p.id))
    .sort((a, b) => recommendationIds.indexOf(a.id) - recommendationIds.indexOf(b.id));

  // Fallback if less than 5 items
  const fallbackRecommendations = recommendationProducts.length >= 4 
    ? recommendationProducts 
    : PRODUCTS.filter(p => p.id !== currentProduct.id && p.category === 'Dinnerware').slice(0, 5);

  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      showToast('Please enter a valid 6-digit Pincode', 'error');
      return;
    }
    setCheckingPincode(true);
    setTimeout(() => {
      setCheckingPincode(false);
      setPincodeChecked(true);
      setDeliveryMessage('Delivery by Tomorrow, COD Available');
      showToast(`Delivery available for ${pincode}!`, 'success');
    }, 350);
  };

  const handleApplyCoupon = () => {
    applyCouponCode('NEST10');
    navigator.clipboard?.writeText('NEST10');
    showToast('Coupon NEST10 applied! Extra 10% discount added.', 'success');
  };

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(currentProduct, quantity);
    navigateTo('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please enter your name and comments', 'error');
      return;
    }
    setIsSubmittingReview(true);
    setTimeout(() => {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        productId: currentProduct.id,
        author: newReviewAuthor.trim(),
        rating: newReviewRating,
        date: 'Just now',
        title: 'Verified Customer Review',
        comment: newReviewComment.trim(),
        verifiedPurchase: true,
        helpfulCount: 0,
      };
      setReviews([newRev, ...reviews]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setIsSubmittingReview(false);
      showToast('Thank you! Your review has been added.', 'success');
    }, 300);
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

  // Box Items list (with default ceramic dinner set pieces if not populated)
  const boxItems = currentProduct.boxItems || [
    { name: 'Dinner Plate', size: '(10.5 inch)', count: 4, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Side Plate', size: '(7.5 inch)', count: 4, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bowl', size: '(5 inch)', count: 4, image: 'https://images.unsplash.com/photo-1576020799627-aeac76d580dc?auto=format&fit=crop&w=400&q=80' },
    { name: 'Mug', size: '(300 ml)', count: 4, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80' },
  ];

  // Badges
  const safetyBadges = [
    { name: 'Lead Free', icon: <ShieldCheck className="w-5 h-5 text-[#8A5A36]" /> },
    { name: 'Cadmium Free', icon: <Leaf className="w-5 h-5 text-[#8A5A36]" /> },
    { name: 'Food Safe', icon: <UtensilsCrossed className="w-5 h-5 text-[#8A5A36]" /> },
    { name: 'Sustainable', icon: <Recycle className="w-5 h-5 text-[#8A5A36]" /> },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20 font-sans text-[#2D2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        
        {/* ================= BREADCRUMB NAVIGATION ================= */}
        <nav className="flex items-center gap-1.5 text-xs text-[#8C7B70] mb-6 flex-wrap font-medium">
          <button 
            onClick={() => navigateTo('home')}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <button 
            onClick={() => navigateTo('category', { category: currentProduct.category || 'Dinnerware' })}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            {currentProduct.category || 'Dinnerware'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <button 
            onClick={() => navigateTo('category', { category: currentProduct.category || 'Dinnerware' })}
            className="hover:text-[#8A5A36] transition-colors cursor-pointer"
          >
            {currentProduct.subcategory || 'Dinner Sets'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8AAA0]" />
          <span className="text-[#2D2723] font-semibold truncate max-w-[240px] sm:max-w-md">
            {currentProduct.name} {currentProduct.subtitle || ''}
          </span>
        </nav>

        {/* ================= TOP SECTION: 2-COLUMN PRODUCT OVERVIEW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10">
          
          {/* ----- LEFT COLUMN: IMAGE GALLERY (7 COLS) ----- */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            
            {/* Vertical Thumbnails Column */}
            <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto max-h-[560px] pb-2 sm:pb-0 shrink-0">
              {allImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#F5F1EB] shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#8A5A36] ring-2 ring-[#8A5A36]/20'
                      : 'border-[#EAE3DA] hover:border-[#8A5A36]/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}

              {/* +2 or More Badge Button */}
              {allImages.length > 5 && (
                <button
                  onClick={() => setShowAllGalleryModal(true)}
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl border-2 border-dashed border-[#8A5A36]/40 bg-[#FAF4ED] hover:bg-[#F5ECE0] text-[#8A5A36] font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <span>+{allImages.length - 5}</span>
                  <span className="text-[10px] font-medium text-[#8C7B70]">more</span>
                </button>
              )}
            </div>

            {/* Main Product Image */}
            <div className="relative flex-1 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF8F5] border border-[#EAE3DA] shadow-xs order-1 sm:order-2 group">
              <img
                src={allImages[activeImageIndex] || currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* NEW Pill Badge (Top Left) */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#8A5A36] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                  NEW
                </span>
              </div>

              {/* Wishlist Heart Button (Top Right) */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleWishlist(currentProduct)}
                  className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#52443C] shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-[#52443C]'}`} />
                </button>
              </div>

              {/* Left & Right Circular Arrow Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2D2723] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2D2723] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer opacity-80 hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

          </div>

          {/* ----- RIGHT COLUMN: PRODUCT INFO & PURCHASE PANEL (5 COLS) ----- */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Title & SKU */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2D2723] font-normal leading-tight">
                {currentProduct.name} {currentProduct.subtitle || ''}
              </h1>
              <div className="text-xs text-[#8C7B70] tracking-wide mt-1.5 font-medium">
                SKU: {currentProduct.sku || 'DIN-IB-16P'}
              </div>
            </div>

            {/* Rating Stars & Social Proof */}
            <div className="flex items-center gap-2 text-xs text-[#52443C]">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-[#2D2723]">{currentProduct.rating || 4.7}</span>
              <button 
                onClick={() => toggleAccordion('reviews')}
                className="text-[#8C7B70] hover:text-[#8A5A36] underline cursor-pointer"
              >
                ({currentProduct.reviewsCount || 470} reviews)
              </button>
              <span className="text-[#D3C7BD]">|</span>
              <span className="text-[#8A5A36] font-semibold">
                {currentProduct.soldCount || '25K+ sold'}
              </span>
            </div>

            {/* Price Block */}
            <div className="pt-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#2D2723] tracking-tight">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                  <span className="text-base text-[#9E9085] line-through">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="text-xs text-[#8C7B70] mt-0.5">
                Inclusive of all taxes
              </div>
            </div>

            {/* Offer / Coupon Tag Card */}
            <div className="bg-[#FAF4ED] border border-[#EAE0D3] rounded-2xl p-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#2D2723]">
                  Get it for ₹{Math.round(currentProduct.price * 0.9).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#EED8C4] hover:bg-[#E5CBAD] text-[#8A5A36] text-xs font-bold px-3 py-1 rounded-lg border border-[#DEC4A7] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Use Code</span>
                  <span className="underline">NEST10</span>
                </button>
              </div>
              <div className="text-xs text-[#7D6E63]">
                Extra 10% Off on prepaid orders
              </div>
            </div>

            {/* Quantity Stepper & Stock Status */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#52443C] mb-2">
                Select Quantity
              </div>
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="flex items-center justify-between border border-[#DDD3C7] rounded-xl bg-white w-32 h-11 px-2.5 shadow-2xs">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-1.5 text-[#52443C] hover:text-[#8A5A36] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-[#2D2723]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
                    className="p-1.5 text-[#52443C] hover:text-[#8A5A36] cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* In Stock & Ships In 24 Hours */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock
                  </span>
                  <span className="text-[#B8AAA0]">•</span>
                  <span className="text-[#8C7B70]">Ships in 24 hours</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: ADD TO CART & BUY NOW */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="border-2 border-[#8A5A36] bg-white hover:bg-[#FAF4ED] text-[#8A5A36] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#8A5A36]" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-[#8A5A36] hover:bg-[#6E4223] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                BUY NOW
              </button>
            </div>

            {/* Pincode Delivery Availability Checker */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#52443C] mb-1.5">
                Check delivery time & COD availability
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter Pincode"
                  className="flex-1 bg-white border border-[#DDD3C7] rounded-xl px-4 py-2.5 text-xs text-[#2D2723] placeholder-[#9E9085] focus:outline-none focus:border-[#8A5A36] transition-colors"
                />
                <button
                  type="submit"
                  disabled={checkingPincode}
                  className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                >
                  {checkingPincode ? 'Checking...' : 'CHECK'}
                </button>
              </form>

              {pincodeChecked && (
                <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{deliveryMessage}</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ================= 4-COLUMN TRUST ASSURANCE STRIP ================= */}
        <div className="bg-white rounded-2xl border border-[#EAE3DA] p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 my-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4ED] text-[#8A5A36] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2D2723]">Free Shipping</div>
              <div className="text-[11px] sm:text-xs text-[#8C7B70]">On orders above ₹999</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4ED] text-[#8A5A36] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2D2723]">Easy Returns</div>
              <div className="text-[11px] sm:text-xs text-[#8C7B70]">Within 7 days</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4ED] text-[#8A5A36] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2D2723]">Secure Payments</div>
              <div className="text-[11px] sm:text-xs text-[#8C7B70]">100% secure</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4ED] text-[#8A5A36] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2D2723]">Customer Support</div>
              <div className="text-[11px] sm:text-xs text-[#8C7B70]">We're here to help</div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT DETAILS & WHAT'S IN THE BOX (2 EQUAL COLUMNS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
          
          {/* ----- LEFT BOX: PRODUCT DETAILS & SPECIFICATIONS ----- */}
          <div className="bg-white rounded-3xl border border-[#EAE3DA] p-6 sm:p-7 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2D2723] mb-3">
                Product Details
              </h2>
              <p className="text-xs sm:text-sm text-[#63554C] leading-relaxed">
                {currentProduct.description || 
                  'Bring timeless elegance to your dining table with the Ivory Bloom Dinner Set. Crafted from high-quality ceramic, it features delicate floral patterns in soothing ivory tones – perfect for everyday meals and special occasions.'}
              </p>
            </div>

            {/* Bullet Specifications */}
            <div className="space-y-2 pt-1 border-t border-[#F2EDE6]">
              <div className="text-xs sm:text-sm text-[#4A3E38] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A36]"></span>
                <span><strong>Material:</strong> {currentProduct.details?.material || 'Premium Ceramic'}</span>
              </div>
              <div className="text-xs sm:text-sm text-[#4A3E38] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A36]"></span>
                <span><strong>Finish:</strong> {currentProduct.finish || 'Glossy'}</span>
              </div>
              <div className="text-xs sm:text-sm text-[#4A3E38] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A36]"></span>
                <span><strong>Microwave Safe:</strong> {currentProduct.microwaveSafe !== false ? 'Yes' : 'No'}</span>
              </div>
              <div className="text-xs sm:text-sm text-[#4A3E38] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A36]"></span>
                <span><strong>Dishwasher Safe:</strong> {currentProduct.dishwasherSafe !== false ? 'Yes' : 'No'}</span>
              </div>
              <div className="text-xs sm:text-sm text-[#4A3E38] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A36]"></span>
                <span><strong>Chip Resistant:</strong> {currentProduct.chipResistant !== false ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {/* Collapsible Accordions: Care, Shipping, Reviews */}
            <div className="divide-y divide-[#F2EDE6] pt-2">
              
              {/* Care Instructions Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2D2723] hover:text-[#8A5A36] transition-colors cursor-pointer"
                >
                  <span>Care Instructions</span>
                  {openAccordions.care ? <ChevronUp className="w-4 h-4 text-[#8A5A36]" /> : <Plus className="w-4 h-4 text-[#8C7B70]" />}
                </button>
                {openAccordions.care && (
                  <div className="mt-2.5 text-xs text-[#63554C] leading-relaxed space-y-1.5">
                    <p>• Wash with gentle dish soap and a soft non-abrasive sponge.</p>
                    <p>• Microwave & Dishwasher safe. Avoid extreme thermal shocks (e.g. freezer directly to hot oven).</p>
                    <p>• Dry thoroughly before stacking with soft separators to preserve the artisanal glaze.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2D2723] hover:text-[#8A5A36] transition-colors cursor-pointer"
                >
                  <span>Shipping & Returns</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4 text-[#8A5A36]" /> : <Plus className="w-4 h-4 text-[#8C7B70]" />}
                </button>
                {openAccordions.shipping && (
                  <div className="mt-2.5 text-xs text-[#63554C] leading-relaxed space-y-1.5">
                    <p>• <strong>Free standard shipping</strong> on all orders above ₹999 across India.</p>
                    <p>• Shipped in <strong>5-layer shockproof honeycomb packaging</strong> engineered for fragile ceramics.</p>
                    <p>• 7-day hassle-free doorstep replacement in case of transit breakage or defects.</p>
                  </div>
                )}
              </div>

              {/* Reviews Accordion */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('reviews')}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-[#2D2723] hover:text-[#8A5A36] transition-colors cursor-pointer"
                >
                  <span>Reviews ({currentProduct.reviewsCount || 470})</span>
                  {openAccordions.reviews ? <ChevronUp className="w-4 h-4 text-[#8A5A36]" /> : <Plus className="w-4 h-4 text-[#8C7B70]" />}
                </button>
                {openAccordions.reviews && (
                  <div className="mt-3 space-y-4">
                    {/* Review submission form */}
                    <form onSubmit={handleAddReview} className="bg-[#FAF6F0] p-3.5 rounded-2xl space-y-2.5 text-xs">
                      <div className="font-bold text-[#2D2723]">Write a Review</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="flex-1 bg-white border border-[#DDD3C7] rounded-lg px-3 py-2 text-xs"
                        />
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(Number(e.target.value))}
                          className="bg-white border border-[#DDD3C7] rounded-lg px-2 py-2 text-xs font-bold text-amber-600"
                        >
                          <option value={5}>5 Stars ★★★★★</option>
                          <option value={4}>4 Stars ★★★★</option>
                          <option value={3}>3 Stars ★★★</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Share your experience with this set..."
                        rows={2}
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-white border border-[#DDD3C7] rounded-lg p-2.5 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="bg-[#8A5A36] hover:bg-[#6E4223] text-white font-bold py-1.5 px-4 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-[#F0EAE1] pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between text-xs">
                            <div className="font-bold text-[#2D2723] flex items-center gap-1.5">
                              {rev.author}
                              {rev.verifiedPurchase && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-sm font-normal">
                                  Verified
                                </span>
                              )}
                            </div>
                            <span className="text-[#8C7B70] text-[11px]">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-400 text-xs my-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-[#52443C] mt-1">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ----- RIGHT BOX: WHAT'S IN THE BOX & SAFETY BADGES ----- */}
          <div className="bg-white rounded-3xl border border-[#EAE3DA] p-6 sm:p-7 shadow-2xs space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-[#2D2723]">
              What's in the Box ({currentProduct.subtitle ? currentProduct.subtitle.replace(/[()]/g, '') : '16 Pieces'})
            </h2>

            {/* 4-Item Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {boxItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#FAF8F5] border border-[#EAE3DA] rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs hover:border-[#8A5A36]/40 transition-colors"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2.5 bg-white border border-[#EBE3D7]">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs font-bold text-[#2D2723] leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8C7B70] mt-0.5">
                    {item.size} x {item.count}
                  </div>
                </div>
              ))}
            </div>

            {/* 4 Safety Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {safetyBadges.map((badge, idx) => (
                <div 
                  key={idx}
                  className="bg-[#FAF4ED] border border-[#EAE0D3] rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5"
                >
                  {badge.icon}
                  <span className="text-[11px] font-bold text-[#52443C]">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* ================= "YOU MAY ALSO LIKE" RECOMMENDATIONS ================= */}
        <div className="my-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2723]">
              You May Also Like
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C7] text-[#52443C] hover:bg-[#FAF4ED] hover:text-[#8A5A36] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                aria-label="Previous recommendations"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-9 h-9 rounded-full bg-white border border-[#DDD3C7] text-[#52443C] hover:bg-[#FAF4ED] hover:text-[#8A5A36] flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                aria-label="Next recommendations"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Product Grid */}
          <div 
            ref={carouselRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none snap-x"
          >
            {fallbackRecommendations.map((prod) => (
              <div
                key={prod.id}
                className="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-[#EAE3DA] overflow-hidden shrink-0 shadow-2xs hover:shadow-md transition-all group flex flex-col snap-start"
              >
                {/* Product Image */}
                <div 
                  onClick={() => setSelectedProduct(prod)}
                  className="relative aspect-square overflow-hidden bg-[#FAF8F5] cursor-pointer"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(prod);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#52443C] flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(prod.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div 
                    onClick={() => setSelectedProduct(prod)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-semibold text-xs sm:text-sm text-[#2D2723] line-clamp-1 group-hover:text-[#8A5A36] transition-colors">
                      {prod.name}
                    </h3>
                    <div className="text-[11px] text-[#8C7B70] mt-0.5">
                      {prod.subtitle || '(16 Pieces)'}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#52443C] mt-1.5">
                      <div className="flex text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="font-bold">{prod.rating}</span>
                      <span className="text-[#8C7B70]">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F2EDE6]">
                    <span className="font-bold text-sm sm:text-base text-[#2D2723]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, 1);
                      }}
                      className="w-8 h-8 rounded-full bg-[#FAF4ED] hover:bg-[#8A5A36] text-[#8A5A36] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PROMOTIONAL GIFTING BANNER STRIP ================= */}
        <div className="bg-[#FAF4ED] border border-[#EAE0D3] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 my-12 shadow-2xs">
          
          {/* Left gift image */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
              alt="Gift Hamper"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#2D2723]">
                Gift This Beautiful Set
              </h3>
              <p className="text-xs sm:text-sm text-[#7D6E63] mt-1 max-w-sm">
                Perfect for weddings, housewarmings & festive gifting.
              </p>
              <button
                onClick={() => navigateTo('category', { category: 'Gifting' })}
                className="mt-3 bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                EXPLORE GIFTING
              </button>
            </div>
          </div>

          {/* Right 4 value pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-[#EAE0D3]">
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white text-[#8A5A36] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#2D2723]">Premium Quality</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white text-[#8A5A36] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#2D2723]">Elegant Designs</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white text-[#8A5A36] flex items-center justify-center shadow-2xs">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#2D2723]">Everyday Use</span>
            </div>

            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-white text-[#8A5A36] flex items-center justify-center shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#2D2723]">Loved by Thousands</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= ALL GALLERY IMAGES MODAL ================= */}
      {showAllGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#EBE3D7] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D2723]">
                {currentProduct.name} - Photo Gallery ({allImages.length} Photos)
              </h3>
              <button
                onClick={() => setShowAllGalleryModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#2D2723] hover:bg-[#8A5A36] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allImages.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden aspect-square bg-[#FAF8F5] border border-[#EAE3DA]">
                  <img
                    src={img}
                    alt={`${currentProduct.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
