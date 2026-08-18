import React, { useState } from 'react';
import { Instagram, Heart } from 'lucide-react';
import { INSTAGRAM_POSTS } from '../data/products';
import { useShop } from '../context/ShopContext';

export const InstagramGrid: React.FC = () => {
  const { showToast } = useShop();
  const [likes, setLikes] = useState<{ [key: string]: number }>(
    INSTAGRAM_POSTS.reduce((acc, p) => ({ ...acc, [p.id]: p.likes }), {})
  );
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => {
      const isCurrentlyLiked = !!prev[postId];
      setLikes((currLikes) => ({
        ...currLikes,
        [postId]: isCurrentlyLiked ? currLikes[postId] - 1 : currLikes[postId] + 1,
      }));
      if (!isCurrentlyLiked) {
        showToast('Liked Instagram post! Follow @nestania.official for daily inspiration.', 'info');
      }
      return { ...prev, [postId]: !isCurrentlyLiked };
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2D2723] font-normal">
            Follow Us On Instagram
          </h2>
          <p className="text-xs sm:text-sm text-[#87776C] mt-0.5">
            Tag #NestaniaHome on Instagram to get featured on our gallery
          </p>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A5A36] hover:text-[#643D20] bg-white border border-[#E3DCCE] px-4 py-2 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer w-fit"
        >
          <Instagram className="w-4 h-4 text-[#C13584]" />
          <span>@nestania.official</span>
        </a>
      </div>

      {/* 6 Column Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {INSTAGRAM_POSTS.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const count = likes[post.id];

          return (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F3ECE4] border border-[#ECE4DB] cursor-pointer"
              onClick={() => showToast(`Opening post: "${post.caption}" on Instagram!`, 'info')}
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#2C1F17]/65 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3 text-white">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-white/80" />
                </div>
                
                <div>
                  <p className="text-[11px] text-[#F3EBE3] line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-white/20 text-[11px]">
                    <button
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center gap-1 hover:text-red-300 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
                      <span>{count.toLocaleString()}</span>
                    </button>
                    <span className="text-[10px] text-white/70">View</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
