import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Calendar, Package, Eye, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export const ReviewsManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mock data for reviews - in production, this would be an API call
      const mockReviews: Review[] = [
        {
          id: '1',
          productId: 'nest-mug-01',
          productName: 'Rustic Clay Coffee Mug',
          author: 'Priya Sharma',
          rating: 5,
          title: 'Perfect for my morning coffee',
          comment: 'Beautiful craftsmanship! The mug feels perfect in my hands and keeps my coffee warm. The earthy texture adds such a nice touch to my morning routine.',
          date: '2025-01-15',
          verifiedPurchase: true,
          helpfulCount: 12
        },
        {
          id: '2',
          productId: 'nest-bowl-03',
          productName: 'Handcrafted Ceramic Bowl Set',
          author: 'Rajesh Kumar',
          rating: 4,
          title: 'Great quality, slight color variation',
          comment: 'The bowls are beautifully made and perfect for serving. There was a slight color variation from the photos, but still very happy with the purchase.',
          date: '2025-01-12',
          verifiedPurchase: true,
          helpfulCount: 8
        },
        {
          id: '3',
          productId: 'nest-vase-02',
          productName: 'Minimalist Ceramic Vase',
          author: 'Anita Das',
          rating: 5,
          title: 'Stunning centerpiece',
          comment: 'This vase is absolutely gorgeous! It arrived safely packed and looks even better in person. Perfect size for my dining table.',
          date: '2025-01-10',
          verifiedPurchase: true,
          helpfulCount: 15
        },
        {
          id: '4',
          productId: 'nest-plate-01',
          productName: 'Artisan Dinner Plate Set',
          author: 'Mohit Singh',
          rating: 3,
          title: 'Good but had minor chips',
          comment: 'The plates are nice overall, but one arrived with a small chip on the edge. Customer service was helpful though.',
          date: '2025-01-08',
          verifiedPurchase: true,
          helpfulCount: 5
        },
        {
          id: '5',
          productId: 'nest-mug-01',
          productName: 'Rustic Clay Coffee Mug',
          author: 'Sneha Patel',
          rating: 5,
          title: 'Love the texture and feel',
          comment: 'Exactly what I was looking for! The mug has a wonderful rustic feel and the perfect capacity for my morning chai.',
          date: '2025-01-05',
          verifiedPurchase: true,
          helpfulCount: 9
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(review => review.id !== reviewId));
      setSelectedReview(null);
    }
  };

  const filteredReviews = filterRating 
    ? reviews.filter(review => review.rating === filterRating)
    : reviews;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8A5A36] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7A6A5E]">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] flex items-center gap-3">
            <Star className="w-6 h-6 text-[#8A5A36]" />
            Reviews Management
          </h1>
          <p className="text-[#7A6A5E] mt-1">Manage customer reviews and feedback</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#8A5A36] bg-opacity-10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#8A5A36]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2C1810]">{reviews.length}</h3>
              <p className="text-[#7A6A5E]">Total Reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2C1810]">{averageRating.toFixed(1)}</h3>
              <p className="text-[#7A6A5E]">Average Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#2C1810]">
                {reviews.filter(r => r.verifiedPurchase).length}
              </h3>
              <p className="text-[#7A6A5E]">Verified Purchases</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5DDD5]">
            <div className="p-6 border-b border-[#E5DDD5]">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#2C1810]">All Reviews</h2>
                <select
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                  className="px-3 py-1.5 border border-[#E5DDD5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5A36]"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-[#E5DDD5]">
              {filteredReviews.map(review => (
                <div 
                  key={review.id}
                  className={`p-6 cursor-pointer hover:bg-[#FAF8F5] transition-colors ${
                    selectedReview?.id === review.id ? 'bg-[#FAF8F5]' : ''
                  }`}
                  onClick={() => setSelectedReview(review)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.verifiedPurchase && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#7A6A5E]">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="font-medium text-[#2C1810] mb-1">{review.title}</h3>
                  <p className="text-[#7A6A5E] text-sm mb-2 line-clamp-2">{review.comment}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#7A6A5E]">
                      <User className="w-4 h-4" />
                      {review.author}
                    </div>
                    <div className="flex items-center gap-2 text-[#7A6A5E]">
                      <Package className="w-4 h-4" />
                      {review.productName}
                    </div>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-[#7A6A5E]">
                  No reviews found for the selected rating.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Details & Rating Distribution */}
        <div className="space-y-6">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
            <h3 className="font-semibold text-[#2C1810] mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-[#7A6A5E]">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#8A5A36] h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-[#7A6A5E] w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Review Details */}
          {selectedReview && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DDD5]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#2C1810]">Review Details</h3>
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">Product</label>
                  <p className="text-[#7A6A5E]">{selectedReview.productName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">Customer</label>
                  <p className="text-[#7A6A5E]">{selectedReview.author}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-[#7A6A5E]">({selectedReview.rating}/5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">Title</label>
                  <p className="text-[#7A6A5E]">{selectedReview.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">Comment</label>
                  <p className="text-[#7A6A5E] leading-relaxed">{selectedReview.comment}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-[#7A6A5E]">
                  <div>
                    <strong>Helpful:</strong> {selectedReview.helpfulCount} people
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(selectedReview.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagementPage;