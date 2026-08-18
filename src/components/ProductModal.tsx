import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, Check, MapPin, Sparkles, MessageSquare } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Review } from '../types';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setQuantity(1);
      setPincodeResult(null);

      // Fetch reviews
      fetch(`/api/products/${selectedProduct.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.reviews) setReviews(data.reviews);
        })
        .catch(err => console.warn(err));
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isFavorite = isInWishlist(selectedProduct.id);
  const allImages = selectedProduct.galleryImages && selectedProduct.galleryImages.length > 0
    ? selectedProduct.galleryImages
    : [selectedProduct.image];

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      showToast('Please enter a valid 6-digit PIN code', 'error');
      return;
    }
    setCheckingPincode(true);
    try {
      const res = await fetch('/api/pincode/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setPincodeResult(data);
    } catch {
      setPincodeResult({
        serviceable: true,
        estimatedDays: '2-3 Days (Standard)',
        message: 'Delivery available in your area with fragile packaging safety.',
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide your name and review', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          author: newReviewAuthor,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });
      if (res.ok) {
        const createdRev = await res.json();
        setReviews(prev => [createdRev, ...prev]);
        setNewReviewAuthor('');
        setNewReviewComment('');
        showToast('Review submitted successfully! Thank you.', 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#EAE3DA] my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#4A3E38] hover:text-black shadow-md flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F3EE] border border-[#EBE3D7]">
              <img
                src={allImages[activeImageIndex] || selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <button
                onClick={() => toggleWishlist(selectedProduct)}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${
                  isFavorite ? 'bg-white text-[#A8422B]' : 'bg-white/80 hover:bg-white text-[#6E5D53]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#8A5A36] scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F2ECE4] text-center text-[11px] text-[#7A6A5E]">
              <div className="p-2 bg-[#FAF8F5] rounded-xl flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#8A5A36]" />
                <span>Fragile-Safe Packaging</span>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#8A5A36]" />
                <span>100% Genuine Ceramic</span>
              </div>
              <div className="p-2 bg-[#FAF8F5] rounded-xl flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#8A5A36]" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8A796E] mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#8A5A36]">
                  {selectedProduct.category}
                </span>
                <span>•</span>
                <span>{selectedProduct.subcategory || 'Artisanal Collection'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-[#FAF6F1] px-2.5 py-1 rounded-md border border-[#ECE2D5] text-amber-700 font-semibold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
                <span className="text-xs text-[#8C7B70]">
                  ({selectedProduct.reviewsCount} verified customer ratings)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-serif text-3xl text-[#2D2723] font-normal">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <>
                    <span className="text-sm text-[#A8988C] line-through">
                      ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-[#A8422B] bg-[#FAECE8] px-2 py-0.5 rounded-full">
                      {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#96867B] mt-0.5">
                Inclusive of all taxes. Free shipping on orders above ₹999.
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5C4D44] mt-4 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold text-[#3D322B] uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#DCD3C6] rounded-xl overflow-hidden bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-sm text-[#52443C] hover:bg-[#EDE5DA] transition-colors cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-[#2D2723]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1.5 text-sm text-[#52443C] hover:bg-[#EDE5DA] transition-colors cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stockCount} left)
                </span>
              </div>

              {/* PIN Code Delivery Checker */}
              <div className="mt-5 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EBE3D7]">
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="w-4 h-4 text-[#8A5A36] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit PIN code"
                      className="w-full bg-white border border-[#DDD3C4] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2723] focus:outline-none focus:border-[#8A5A36]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={checkingPincode}
                    className="bg-[#8A5A36] hover:bg-[#6F4425] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {checkingPincode ? 'Checking...' : 'Check'}
                  </button>
                </form>

                {pincodeResult && (
                  <div className="mt-2 text-xs text-[#4A3E38] space-y-0.5">
                    <p className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {pincodeResult.estimatedDays}
                    </p>
                    <p className="text-[11px] text-[#7A6A5E]">{pincodeResult.message}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => addToCart(selectedProduct, quantity)}
                  className="bg-white border-2 border-[#8A5A36] text-[#8A5A36] hover:bg-[#FAF6F1] font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-[#8A5A36] hover:bg-[#6E4223] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Tabs for specs & reviews */}
              <div className="mt-6 pt-4 border-t border-[#EAE3DA]">
                <div className="flex border-b border-[#EAE3DA] gap-6 text-xs font-semibold uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-b-2 border-[#8A5A36] text-[#8A5A36]'
                        : 'text-[#8C7B70] hover:text-[#2D2723]'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 transition-colors cursor-pointer ${
                      activeTab === 'care'
                        ? 'border-b-2 border-[#8A5A36] text-[#8A5A36]'
                        : 'text-[#8C7B70] hover:text-[#2D2723]'
                    }`}
                  >
                    Care Guide
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-colors cursor-pointer flex items-center gap-1 ${
                      activeTab === 'reviews'
                        ? 'border-b-2 border-[#8A5A36] text-[#8A5A36]'
                        : 'text-[#8C7B70] hover:text-[#2D2723]'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    Reviews ({reviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-[#52443C] leading-relaxed">
                  {activeTab === 'details' && (
                    <div className="space-y-1.5">
                      <p><strong className="text-[#2D2723]">Material:</strong> {selectedProduct.details.material}</p>
                      <p><strong className="text-[#2D2723]">Dimensions:</strong> {selectedProduct.details.dimensions}</p>
                      {selectedProduct.details.volume && <p><strong className="text-[#2D2723]">Capacity:</strong> {selectedProduct.details.volume}</p>}
                      {selectedProduct.details.setIncludes && <p><strong className="text-[#2D2723]">Includes:</strong> {selectedProduct.details.setIncludes}</p>}
                    </div>
                  )}

                  {activeTab === 'care' && (
                    <p className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE5DB]">
                      {selectedProduct.details.care}
                    </p>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                      {/* Add review form */}
                      <form onSubmit={handleAddReview} className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE4DB] space-y-2">
                        <span className="font-semibold text-[11px] uppercase tracking-wider text-[#8A5A36] block">
                          Write a Review
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={newReviewAuthor}
                            onChange={(e) => setNewReviewAuthor(e.target.value)}
                            className="bg-white border border-[#DDD3C4] rounded-lg px-2.5 py-1 text-xs flex-1"
                            required
                          />
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="bg-white border border-[#DDD3C4] rounded-lg px-2 py-1 text-xs"
                          >
                            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value="4">⭐⭐⭐⭐ (4/5)</option>
                            <option value="3">⭐⭐⭐ (3/5)</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="What did you love about this piece?"
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-white border border-[#DDD3C4] rounded-lg p-2 text-xs"
                          rows={2}
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="bg-[#8A5A36] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#6F4425] transition-colors"
                        >
                          {isSubmittingReview ? 'Posting...' : 'Post Review'}
                        </button>
                      </form>

                      {/* List */}
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border-b border-[#F0EAE2] pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#2D2723]">{rev.author}</span>
                            <div className="flex text-amber-500 text-[10px]">
                              {'★'.repeat(rev.rating)}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#6E5D53] mt-1">{rev.comment}</p>
                          <span className="text-[10px] text-[#A8988C] mt-0.5 block">{rev.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
