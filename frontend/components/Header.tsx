'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { FiShoppingCart, FiHome, FiPackage, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold text-orange-600">🍔 Foodie</div>
            <span className="hidden sm:inline text-sm text-gray-500">Food Delivery</span>
            
          </Link>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <FiHome className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>
            
            <Link
              href="/orders"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <FiPackage className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Orders</span>
            </Link>
            
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              <FiSettings className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

