'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderHistory } from '@/lib/orderHistory';
import { Order } from '@/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import { FiPackage, FiClock, FiArrowRight, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Order['status']>('ALL');

  useEffect(() => {
    loadOrders();
    // Refresh orders every 2 seconds to catch real-time status updates
    const interval = setInterval(loadOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const history = orderHistory.getAll().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(history);
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all order history?')) {
      orderHistory.clear();
      setOrders([]);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FiPackage className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order History</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            href="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const filtered = orders.filter((order) => {
    const matchesQuery =
      `${order.id}`.includes(query.trim()) ||
      (order.restaurantName || '').toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ? true : order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#f8fbff]">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Your Orders</h1>
            <p className="text-gray-600">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} · Showing {filtered.length} result{filtered.length === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 font-semibold transition-colors"
          >
            <FiTrash2 className="w-5 h-5" />
            Clear History
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] border border-orange-50 p-4 mb-6 grid gap-3 md:grid-cols-[2fr,1fr] md:items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-700">
              <FiSearch className="w-5 h-5" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order ID or Restaurant"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 font-semibold">
              <FiFilter className="w-4 h-4" />
              Status
            </div>
            {(['ALL','PLACED','CONFIRMED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status === 'ALL' ? 'ALL' : status)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-colors border ${
                  statusFilter === status
                    ? 'bg-orange-600 text-white border-orange-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {status === 'ALL' ? 'All' : status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold mb-2">No matching orders</p>
            <p className="text-gray-500 text-sm">Try a different status or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, index) => (
              <Link
                key={`${order.id}-${order.createdAt}-${index}`}
                href={`/order/${order.id}`}
                className="block bg-white rounded-2xl shadow-[0_16px_50px_-30px_rgba(0,0,0,0.35)] border border-gray-100 hover:shadow-[0_22px_60px_-28px_rgba(0,0,0,0.45)] transition-all p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    {order.restaurantName && (
                      <p className="text-gray-700 font-medium mb-1">{order.restaurantName}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      {order.totalAmount > 0 && (
                        <span className="font-semibold text-gray-800">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-700">
                    <FiArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

