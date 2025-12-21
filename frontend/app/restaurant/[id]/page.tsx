"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { restaurantApi } from "@/lib/api";
import { Restaurant, MenuItem } from "@/types";
import MenuItemCard from "@/components/MenuItemCard";
import { FiLoader, FiArrowLeft, FiStar, FiMapPin } from "react-icons/fi";
import Link from "next/link";
import RatingReview from "@/components/RatingReview";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function RestaurantPage() {
  const { authorized, checking } = useAuthGuard();
  const params = useParams();
  const router = useRouter();
  const restaurantId = Number(params.id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (restaurantId && authorized) {
      loadRestaurantData();
    }
  }, [restaurantId, authorized]);

  const loadRestaurantData = async () => {
    try {
      setLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        restaurantApi.getById(restaurantId),
        restaurantApi.getMenu(restaurantId),
      ]);
      setRestaurant(restaurantData);
      setMenuItems(menuData);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurant data. Please make sure the backend is running.');
      console.error('Error loading restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiLoader className="w-12 h-12 text-orange-600 animate-spin mb-4" />
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiLoader className="w-12 h-12 text-orange-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-600">{error || 'Restaurant not found'}</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const availableItems = menuItems.filter((item) => item.available);
  const unavailableItems = menuItems.filter((item) => !item.available);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#f8fbff]">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors font-medium"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Restaurants</span>
        </Link>

        {/* Restaurant Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{restaurant.name}</h1>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <FiStar className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-bold">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5" />
              <span className="text-sm">
                {restaurant.locationLat?.toFixed(4)}, {restaurant.locationLong?.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Menu</h2>
            <span className="text-gray-600">
              {availableItems.length} {availableItems.length === 1 ? 'item' : 'items'} available
            </span>
          </div>
          
          {availableItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {availableItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  menuItem={item}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          )}

          {unavailableItems.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gray-300"></span>
                Currently Unavailable
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unavailableItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    menuItem={item}
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                  />
                ))}
              </div>
            </div>
          )}

          {menuItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <p className="text-gray-500 text-lg">No menu items available for this restaurant.</p>
              <p className="text-gray-400 text-sm mt-2">Check back later or contact the restaurant.</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <RatingReview restaurantName={restaurant.name} rating={restaurant.rating || 0} />
        </div>
      </div>
    </div>
  );
}

