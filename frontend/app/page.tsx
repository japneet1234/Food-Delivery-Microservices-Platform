'use client';

import { useEffect, useState, useMemo } from 'react';
import { restaurantApi } from '@/lib/api';
import { Restaurant } from '@/types';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import { RestaurantCardSkeleton } from '@/components/LoadingSkeleton';
import { FiLoader, FiShoppingBag, FiStar, FiSun, FiFeather } from 'react-icons/fi';
import OrderTrackingInput from '@/components/OrderTrackingInput';

type SortOption = 'rating-desc' | 'rating-asc' | 'name-asc' | 'name-desc';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantApi.getAll();
      setRestaurants(data);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurants. Please make sure the backend is running.');
      console.error('Error loading restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [restaurants, searchQuery, sortBy]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadRestaurants}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#f8fbff] relative overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-red-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white py-16 mb-10 relative overflow-hidden rounded-b-3xl shadow-[0_25px_60px_-25px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm shadow-inner shadow-white/10">
              <FiStar className="w-4 h-4 text-amber-200" />
              Premium curated bites, lightning delivery
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-sm">
              🍔 Foodie
            </h1>
            <p className="text-lg md:text-2xl text-orange-50/90">
              Crave. Click. Delivered from top-rated kitchens near you.
            </p>
            <div className="grid gap-4 md:grid-cols-[2fr,1fr] items-center">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 text-left shadow-lg">
                <p className="text-white/90 text-xs font-semibold mb-2">Track your order</p>
                <OrderTrackingInput />
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2 text-sm text-white/90">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-2">
                <FiSun className="w-4 h-4" /> Fresh picks
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-2">
                <FiFeather className="w-4 h-4" /> Light & quick
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 flex items-center gap-2">
                <FiStar className="w-4 h-4 text-amber-200" /> Top rated
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Filters and Results Count */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {loading ? 'Loading...' : `${filteredAndSortedRestaurants.length} Restaurants`}
            </h2>
            {searchQuery && (
              <p className="text-gray-600 text-sm">
                Showing results for "{searchQuery}"
              </p>
            )}
          </div>
          {restaurants.length > 0 && <FilterBar sortBy={sortBy} onSortChange={setSortBy} />}
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedRestaurants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {searchQuery ? 'No restaurants found matching your search.' : 'No restaurants available at the moment.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
