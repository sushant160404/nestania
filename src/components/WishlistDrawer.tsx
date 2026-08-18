import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
  } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div className="flex-1" onClick={() => setIsWishlistOpen(false)} />

      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#EBE3D7] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE5DE] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#A8422B] fill-current" />
            <h2 className="font-serif text-xl text-[#2D2723] font-normal">
              My Wishlist ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-[#6E5D53] hover:text-[#2D2723] hover:bg-[#EDE5DA] rounded-full transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Wishlist items */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F2ECE5]">
          {wishlist.length > 0 ? (
            wishlist.map((prod) => (
              <div key={prod.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-center">
                <img
                  src={prod.image}
                  alt={prod.name}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsWishlistOpen(false);
                  }}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F5EFEB] shrink-0 border border-[#ECE5DC] cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      setSelectedProduct(prod);
                      setIsWishlistOpen(false);
                    }}
                    className="text-sm font-medium text-[#2D2723] line-clamp-1 hover:text-[#8A5A36] cursor-pointer"
                  >
                    {prod.name}
                  </h4>
                  <p className="text-xs text-[#8C7C70] mt-0.5">{prod.category}</p>
                  
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-sm font-bold text-[#2D2723]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-[#A8988C] line-through">
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        addToCart(prod, 1);
                        toggleWishlist(prod);
                      }}
                      className="bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="text-[#9F8E82] hover:text-[#C0392B] p-1.5 rounded-md transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <Heart className="w-12 h-12 text-[#D3C7BC] mx-auto mb-3" />
              <p className="font-serif text-lg text-[#3A2F28]">Your wishlist is empty</p>
              <p className="text-xs text-[#8F7F74] mt-1">Tap the heart icon on any product to save it for later</p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-4 bg-[#8A5A36] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#724523] transition-colors"
              >
                Explore Products
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-4 border-t border-[#EBE3D7] bg-[#FAF8F5] flex gap-3">
            <button
              onClick={() => {
                wishlist.forEach((p) => addToCart(p, 1));
                setIsWishlistOpen(false);
              }}
              className="w-full bg-[#8A5A36] hover:bg-[#6E4223] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD ALL TO BAG</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
