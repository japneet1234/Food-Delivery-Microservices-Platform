'use client';

import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface MenuItemCardProps {
  menuItem: MenuItem;
  restaurantId: number;
  restaurantName: string;
}

export default function MenuItemCard({ menuItem, restaurantId, restaurantName }: MenuItemCardProps) {
  const { addItem, removeItem, items, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.menuItemId === menuItem.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      restaurantId,
      restaurantName,
    });
  };

  const handleRemove = () => {
    if (quantity === 1) {
      removeItem(menuItem.id);
    } else {
      updateQuantity(menuItem.id, quantity - 1);
    }
  };

  if (!menuItem.available) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 opacity-60">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-700">{menuItem.name}</h4>
          <span className="text-gray-500 font-bold">₹{menuItem.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500">Currently unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-2 text-lg">{menuItem.name}</h4>
          <p className="text-2xl font-bold text-orange-600">₹{menuItem.price.toFixed(2)}</p>
        </div>
      </div>
      
      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <FiPlus className="w-5 h-5" />
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border-2 border-orange-200">
          <button
            onClick={handleRemove}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all shadow-sm hover:shadow-md"
          >
            <FiMinus className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-800 text-lg px-4">{quantity}</span>
          <button
            onClick={handleAdd}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 transition-all shadow-sm hover:shadow-md"
          >
            <FiPlus className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

