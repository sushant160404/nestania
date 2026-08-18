import React from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  Sparkles,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo,
    setSelectedProduct,
    showToast,
  } = useShop();

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    showToast(`Moved all ${wishlist.length} items to your shopping bag!`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-[#EBE3D8] shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF6F1] border border-[#E8DED1] flex items-center justify-center text-rose-500">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723]">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6E63] max-w-sm mx-auto">
              Save your favorite artisanal ceramics, glassware, and home decor pieces to revisit and purchase anytime.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigateTo('category', { category: 'Dinnerware' })}
              className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-8 py-3.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Explore Collections
            </button>
          </div>

          <div className="pt-6 border-t border-[#EBE3D8]">
            <span className="text-[11px] font-semibold text-[#8C7B70] uppercase tracking-wider block mb-3">
              Explore Popular Categories
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Dinnerware', 'Serveware', 'Drinkware', 'Home Decor', 'Gifting'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigateTo('category', { category: cat })}
                  className="text-xs bg-[#FAF8F5] hover:bg-[#FAF6F1] text-[#52443C] px-3.5 py-1.5 rounded-full border border-[#E5DCD0] transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <span className="text-[#2D2723] font-medium">My Wishlist ({wishlist.length} Items)</span>
        </nav>

        {/* Wishlist Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#EBE3D8]">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2D2723]">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#7D6E63] mt-1">
              You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for your home & dining.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMoveAllToCart}
              className="bg-[#8A5A36] hover:bg-[#6E4223] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
            <button
              onClick={() => navigateTo('category', { category: 'Dinnerware' })}
              className="bg-white hover:bg-[#FAF6F1] text-[#52443C] border border-[#DDD3C7] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const discount = product.originalPrice && product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-[#EBE3D8] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all duration-300"
              >
                {/* Image & Badges */}
                <div 
                  className="relative aspect-square bg-[#F5F2EC] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Discount or Bestseller Tag */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {discount > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="bg-[#8A5A36] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                        Best Seller
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#7D6E63] hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content & Actions */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A36]">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-medium text-sm text-[#2D2723] hover:text-[#8A5A36] transition-colors truncate cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#DDA15E]">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#8C7B70]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1 border-t border-[#F5EFEB]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base text-[#2D2723]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-[#9E8E82] line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, 1);
                      }}
                      className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
