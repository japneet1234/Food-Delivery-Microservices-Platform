'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { orderHistory } from '@/lib/orderHistory';
import { Order, OrderStatus } from '@/types';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import OrderTimeline from '@/components/OrderTimeline';
import PaymentStatus from '@/components/PaymentStatus';
import { FiLoader, FiCheckCircle, FiClock, FiTruck, FiPackage, FiMapPin, FiRefreshCw, FiHome, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (orderId) {
      simulateOrderTracking();
    }
  }, [orderId]);

  // Auto-refresh order status every 2 seconds from local history
  useEffect(() => {
    if (!autoRefresh || !order || order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return;
    }

    const interval = setInterval(() => {
      const savedOrder = orderHistory.getById(orderId);
      if (savedOrder && savedOrder.status !== order.status) {
        setOrder(savedOrder);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, order, autoRefresh]);

  const simulateOrderTracking = async () => {
    // Check local history (and simulate if needed)
    let currentOrder = orderHistory.getById(orderId);
    if (currentOrder) {
      setOrder(currentOrder);
      setLoading(false);
      if (currentOrder.status === 'DELIVERED' || currentOrder.status === 'CANCELLED') {
        return;
      }
    } else {
      // If nothing found, surface error instead of silent mock
      setError('Order not found. Please check the ID or place an order first.');
      setLoading(false);
      return;
    }

    // Simulate status updates based on backend event flow:
    // PLACED -> CONFIRMED (after payment success) OR CANCELLED (after payment failure)
    // -> OUT_FOR_DELIVERY (after partner assignment) -> DELIVERED
    const statuses: OrderStatus[] = ['PLACED', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    let currentStatusIndex = statuses.indexOf(currentOrder.status || 'PLACED');
    
    const intervals: NodeJS.Timeout[] = [];
    
    // Simulate payment processing - randomly succeed or fail (like backend)
    // On failure we hard-stop the flow and mark order as CANCELLED.
    if (currentStatusIndex < 1) {
      intervals.push(setTimeout(() => {
        // Random payment success/failure (50% chance each, matching backend)
        const paymentSuccess = Math.random() > 0.5;
        
        if (paymentSuccess) {
          // Payment successful -> CONFIRMED
          const updatedOrder = { ...currentOrder, status: 'CONFIRMED' as OrderStatus };
          setOrder(updatedOrder);
          orderHistory.save(updatedOrder);
          
          // Then move to OUT_FOR_DELIVERY after 5 more seconds
          intervals.push(setTimeout(() => {
            const deliveryOrder = {
              ...updatedOrder,
              status: 'OUT_FOR_DELIVERY' as OrderStatus,
              deliveryPartnerId: Math.floor(Math.random() * 100) + 1,
            };
            setOrder(deliveryOrder);
            orderHistory.save(deliveryOrder);
            
            // Finally move to DELIVERED after 10 more seconds
            intervals.push(setTimeout(() => {
              const finalOrder = { ...deliveryOrder, status: 'DELIVERED' as OrderStatus };
              setOrder(finalOrder);
              orderHistory.save(finalOrder);
            }, 10000));
          }, 5000));
        } else {
          // Payment failed -> CANCELLED
          const cancelledOrder = { ...currentOrder, status: 'CANCELLED' as OrderStatus };
          setOrder(cancelledOrder);
          orderHistory.save(cancelledOrder);
          // Stop any further timers since the flow should end here
          intervals.forEach(clearTimeout);
        }
      }, 3000));
    } else if (currentStatusIndex === 1) {
      // Already confirmed, continue with delivery flow
      intervals.push(setTimeout(() => {
        const updatedOrder = {
          ...currentOrder,
          status: 'OUT_FOR_DELIVERY' as OrderStatus,
          deliveryPartnerId: Math.floor(Math.random() * 100) + 1,
        };
        setOrder(updatedOrder);
        orderHistory.save(updatedOrder);
        
        intervals.push(setTimeout(() => {
          const finalOrder = { ...updatedOrder, status: 'DELIVERED' as OrderStatus };
          setOrder(finalOrder);
          orderHistory.save(finalOrder);
        }, 10000));
      }, 2000));
    } else if (currentStatusIndex === 2) {
      // Already out for delivery, just complete it
      intervals.push(setTimeout(() => {
        const finalOrder = { ...currentOrder, status: 'DELIVERED' as OrderStatus };
        setOrder(finalOrder);
        orderHistory.save(finalOrder);
      }, 10000));
    }

    return () => {
      intervals.forEach(clearTimeout);
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FiLoader className="w-12 h-12 text-orange-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-red-800 font-bold mb-2">Error</h2>
          <p className="text-red-600">{error || 'Order not found'}</p>
          <Link
            href="/"
            className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return <FiClock className="w-6 h-6" />;
      case 'CONFIRMED':
        return <FiCheckCircle className="w-6 h-6" />;
      case 'OUT_FOR_DELIVERY':
        return <FiTruck className="w-6 h-6" />;
      case 'DELIVERED':
        return <FiPackage className="w-6 h-6" />;
      default:
        return <FiClock className="w-6 h-6" />;
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED':
        return 'Your order has been placed and is being processed.';
      case 'CONFIRMED':
        return 'Your order has been confirmed. Payment is being processed.';
      case 'OUT_FOR_DELIVERY':
        return 'Your order is out for delivery. It should arrive soon!';
      case 'DELIVERED':
        return 'Your order has been delivered. Enjoy your meal!';
      case 'CANCELLED':
        return 'Your order has been cancelled.';
      default:
        return 'Tracking your order...';
    }
  };

  const statusProgress: Record<OrderStatus, { percent: number; eta: string }> = {
    PLACED: { percent: 10, eta: 'Confirming your order' },
    CONFIRMED: { percent: 35, eta: 'Preparing your food' },
    PAID: { percent: 45, eta: 'Payment confirmed' },
    ASSIGNED: { percent: 55, eta: 'Assigning delivery partner' },
    OUT_FOR_DELIVERY: { percent: 75, eta: 'Partner en route' },
    DELIVERED: { percent: 100, eta: 'Delivered' },
    CANCELLED: { percent: 0, eta: 'Cancelled' },
  };

  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  return (
     <div className="min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#f8fbff]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-2 text-sm"
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <h1 className="text-4xl font-bold text-gray-800">Track Your Order</h1>
              <p className="text-gray-600 mt-1">Order #{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4"
                />
                Auto-refresh
              </label>
              <button
                onClick={() => {
                  const savedOrder = orderHistory.getById(orderId);
                  if (savedOrder) {
                    setOrder(savedOrder);
                  }
                }}
                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                title="Refresh status"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border border-gray-100">
            <OrderTimeline status={order.status} />
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <PaymentStatus orderStatus={order.status} />
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Order #{order.id}</h2>
                <p className="text-gray-600 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{statusProgress[order.status].eta}</span>
                <span className="font-semibold text-gray-800">{statusProgress[order.status].percent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${order.status === 'CANCELLED' ? 'bg-red-400' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                  style={{ width: `${statusProgress[order.status].percent}%` }}
                />
              </div>
            </div>

            {order.restaurantName && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-600 mb-1">Restaurant</p>
                <p className="text-lg font-semibold text-gray-800">{order.restaurantName}</p>
              </div>
            )}

            {order.totalAmount > 0 && (
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-orange-600">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Status Details & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg">
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-2">Current Status</h3>
                  <p className="text-gray-600 text-sm">{getStatusMessage(order.status)}</p>
                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <div className="mt-3 p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-700 font-medium">
                        🚚 Your order is on the way! Estimated arrival: 15-20 minutes
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2 text-sm">
                    <button
                      onClick={() => setAutoRefresh((p) => !p)}
                      className="px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-400 text-gray-700 font-semibold"
                    >
                      {autoRefresh ? 'Pause Auto-Refresh' : 'Resume Auto-Refresh'}
                    </button>
                    <button
                      onClick={() => alert('We have logged your issue. Our support will reach out shortly.')}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-semibold"
                    >
                      Report an Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Partner Info */}
            {order.deliveryPartnerId && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FiTruck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">Delivery Partner</h3>
                    <p className="text-gray-600 text-sm mb-2">Partner #{order.deliveryPartnerId}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FiMapPin className="w-3 h-3" />
                      <span>Tracking location...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isDelivered && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-green-500 rounded-full">
                  <FiCheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Order Delivered! 🎉</h3>
                  <p className="text-green-700 mb-3">
                    Your order has been successfully delivered. We hope you enjoy your meal!
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Link
                      href="/"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Order Again
                    </Link>
                    <button className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                      Rate Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-8 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-red-500 rounded-full">
                  <FiXCircle className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-800 mb-2">Order Cancelled ❌</h3>
                  <p className="text-red-700 mb-3">
                    Your order has been cancelled due to payment failure. If you were charged, you will receive a refund within 5-7 business days.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium mt-2"
                  >
                    Try Ordering Again
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all text-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Order More Food
            </Link>
            {!isDelivered && !isCancelled && (
              <button
                onClick={() => {
                  const savedOrder = orderHistory.getById(orderId);
                  if (savedOrder) {
                    setOrder(savedOrder);
                  }
                }}
                className="flex-1 bg-white text-orange-600 border-2 border-orange-600 py-4 px-6 rounded-xl font-bold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                Refresh Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

