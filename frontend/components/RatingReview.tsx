'use client';

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import ReviewCard from './ReviewCard';

interface RatingReviewProps {
  restaurantName: string;
  rating: number;
}

const mockReviews = [
  {
    author: 'Priya Kumar',
    rating: 5,
    text: 'Absolutely amazing food! The biryani was perfectly cooked and arrived hot. Highly recommended! 🌟',
    date: '2 days ago',
  },
  {
    author: 'Rahul Singh',
    rating: 4,
    text: 'Great quality and fast delivery. Only issue was slight delay but overall excellent service.',
    date: '1 week ago',
  },
  {
    author: 'Sneha Patel',
    rating: 5,
    text: 'Perfect for late night cravings! Food was fresh and packaging was excellent. Will order again soon.',
    date: '2 weeks ago',
  },
  {
    author: 'Arjun Desai',
    rating: 4,
    text: 'Good portion sizes and taste. Delivery could have been faster but the food quality makes up for it.',
    date: '3 weeks ago',
  },
];

export default function RatingReview({ restaurantName, rating }: RatingReviewProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (selectedRating === 0 || !reviewText.trim()) return;
    setSubmitted(true);
    setSelectedRating(0);
    setReviewText('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl">
      {/* Rating Overview */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Reviews & Ratings</h2>
        <p className="text-gray-600 mb-6">Share your experience with others!</p>

        <div className="bg-white rounded-2xl p-6 inline-block shadow-lg border-2 border-orange-100">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-5xl font-black bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">
                {rating.toFixed(1)}
              </div>
              <p className="text-gray-600 text-sm font-semibold">out of 5</p>
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rate This Restaurant */}
      <div className="mb-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Rate {restaurantName}</h3>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-green-700 font-bold text-lg mb-2">Thank you for your review!</p>
            <p className="text-gray-600">Your feedback helps us serve you better.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Star Rating */}
            <div>
              <p className="font-semibold text-gray-800 mb-3">Your Rating</p>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <FiStar
                      className={`w-10 h-10 ${
                        star <= (hoverRating || selectedRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You rated: <span className="font-bold text-orange-600">{selectedRating} stars</span>
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label className="block font-semibold text-gray-800 mb-3">
                Share Your Experience
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience with the food and service..."
                className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-2">
                {reviewText.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitReview}
              disabled={selectedRating === 0 || !reviewText.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockReviews.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
