import React from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
  } = useShop();

  const isFavorite = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#ECE5DD] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col isolate">
      
      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#F7F3EE] overflow-hidden group/image">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-106"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#594231] text-[#FDFBF7] text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#A8422B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-[#8A5A36] text-white text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-xs ${
            isFavorite
              ? 'bg-white text-[#A8422B] scale-110'
              : 'bg-white/80 hover:bg-white text-[#6E5D53] hover:text-[#A8422B] hover:scale-110'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover/image:opacity-100 group-hover/image:translate-y-0 transition-all duration-200 z-10 pointer-events-none group-hover/image:pointer-events-auto">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex-1 bg-white/95 hover:bg-white text-[#3D322B] text-xs font-semibold py-2.5 px-3 rounded-xl shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#E3DCCE]"
          >
            <Eye className="w-3.5 h-3.5 text-[#8A5A36]" />
            <span>View Details</span>
          </button>
          
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-[#8A5A36] hover:bg-[#6E4223] text-white p-2.5 rounded-xl shadow-md flex items-center justify-center transition-colors cursor-pointer"
            title="Add to Cart"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div
        className="p-4 flex-1 flex flex-col justify-between cursor-pointer"
        onClick={() => setSelectedProduct(product)}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#8F7F74] mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[#A3948A]">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-normal text-sm sm:text-[15px] text-[#2D2723] hover:text-[#8A5A36] transition-colors line-clamp-2 leading-snug cursor-pointer">
            {product.name}
          </h3>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2 border-t border-[#F5EFE9] flex items-baseline gap-2">
          <span className="font-semibold text-base sm:text-lg text-[#2D2723]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#A8988C] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
