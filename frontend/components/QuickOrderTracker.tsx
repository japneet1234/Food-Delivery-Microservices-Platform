'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderHistory } from '@/lib/orderHistory';
import { Order } from '@/types';
import OrderStatusBadge from './OrderStatusBadge';
import { FiPackage, FiArrowRight, FiClock } from 'react-icons/fi';

export default function QuickOrderTracker() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const orders = orderHistory.getAll();
      // Get active orders (not delivered or cancelled)
      const activeOrders = orders.filter(
        (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
      );
      setRecentOrders(activeOrders.slice(0, 3));
    };

    loadOrders();
    // Refresh every 3 seconds to show updated status
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  if (recentOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FiPackage className="w-6 h-6 text-orange-600" />
          Track Your Orders
        </h2>
        <Link
          href="/orders"
          className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
        >
          View All <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/order/${order.id}`}
            className="block p-4 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors border border-gray-200 hover:border-orange-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-800">Order #{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                {order.restaurantName && (
                  <p className="text-sm text-gray-600 mb-1">{order.restaurantName}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiClock className="w-3 h-3" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

