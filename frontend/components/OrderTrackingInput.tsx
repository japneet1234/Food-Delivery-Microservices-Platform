'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPackage } from 'react-icons/fi';

export default function OrderTrackingInput() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/order/${orderId.trim()}`);
    }
  };

  return (
    <form onSubmit={handleTrack} className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiPackage className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID to track"
          className="block w-full pl-12 pr-24 py-4 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm bg-white"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-2 flex items-center"
        >
          <span className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors font-medium text-sm">
            Track
          </span>
        </button>
      </div>
    </form>
  );
}

