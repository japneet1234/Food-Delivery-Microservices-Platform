import Link from 'next/link';
import { Restaurant } from '@/types';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const restaurantEmojis = ['🍕', '🍔', '🍜', '🍱', '🍛', '🍲', '🥘', '🍝', '🌮', '🌯', '🥗', '🍣', '🍤', '🥟', '🍙'];

const getRestaurantEmoji = (id: number) => restaurantEmojis[id % restaurantEmojis.length];

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const deliveryTime = Math.floor(Math.random() * 20) + 20; // 20-40 minutes
  const isTopRated = (restaurant.rating || 0) >= 4.2;

  return (
    <Link href={`/restaurant/${restaurant.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_70px_-30px_rgba(0,0,0,0.35)] transition-all duration-300 overflow-hidden transform group-hover:-translate-y-1 border border-orange-50">
        <div className="relative h-48 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 flex items-center justify-center overflow-hidden">
          <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
            {getRestaurantEmoji(restaurant.id)}
          </span>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-orange-100">
            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-gray-800 text-sm">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-black/30 backdrop-blur-sm border border-white/20">
              {isTopRated ? 'Top Rated' : 'Chef\'s pick'}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs">
                {restaurant.locationLat?.toFixed(2)}, {restaurant.locationLong?.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-600 font-semibold">
              <FiClock className="w-4 h-4" />
              <span>{deliveryTime} min</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-2 rounded-full border border-orange-100">
              View menu
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

