'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { orderApi } from '@/lib/api';
import { FiTrash2, FiPlus, FiMinus, FiLoader, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { useAddresses } from '@/hooks/useAddresses';
import { useCoupons } from '@/hooks/useCoupons';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { addresses, selected, selectAddress, addAddress } = useAddresses();
  const { applied, apply, remove, discountAmount, available } = useCoupons();

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Group items by restaurant
    const restaurantGroups = items.reduce((acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = [];
      }
      acc[item.restaurantId].push(item);
      return acc;
    }, {} as Record<number, typeof items>);

    // For now, handle single restaurant orders
    const restaurantIds = Object.keys(restaurantGroups);
    if (restaurantIds.length > 1) {
      setError('Please order from one restaurant at a time. Multiple restaurant orders are not supported yet.');
      return;
    }

    if (restaurantIds.length === 0) {
      setError('No items in cart.');
      return;
    }

    const restaurantId = Number(restaurantIds[0]);
    const restaurantItems = restaurantGroups[restaurantId];

    try {
      setLoading(true);
      setError(null);

      const orderRequest = {
        restaurantId,
        items: restaurantItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      };

      const order = await orderApi.create(orderRequest);
      // Add restaurant name to order for history
      const restaurantName = restaurantItems[0]?.restaurantName || 'Restaurant';
      const orderWithRestaurant = {
        ...order,
        restaurantName: restaurantName,
      };
      
      // Save to order history
      const { orderHistory } = await import('@/lib/orderHistory');
      orderHistory.save(orderWithRestaurant);
      
      setOrderId(order.id);
      clearCart();
      remove();
      
      // Redirect to order tracking page after a short delay
      setTimeout(() => {
        router.push(`/order/${order.id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Order ID: #{orderId}</p>
          <p className="text-gray-500 mb-6">Redirecting to order tracking...</p>
          <Link
            href={`/order/${orderId}`}
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            View Order Status
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-12">
            <FiShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const discount = discountAmount(subtotal);
  const platformFee = 5;
  const toPay = Math.max(subtotal - discount + platformFee, 0);
  const restaurantName = items[0]?.restaurantName || 'Restaurant';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Review your order before checkout</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-4xl">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Delivery Address</h3>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => selectAddress(addr.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      selected?.id === addr.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{addr.label}</p>
                        <p className="text-sm text-gray-600">{addr.address}</p>
                      </div>
                      <span className="text-2xl">{selected?.id === addr.id ? '📍' : '📌'}</span>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setShowNewAddress((s) => !s)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-orange-400 text-orange-600 font-semibold flex items-center justify-center gap-2"
                >
                  <span className="text-xl">+</span> Add New Address
                </button>
                {showNewAddress && (
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <input
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      placeholder="Label (Home, Work)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    <textarea
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Full address with pincode"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (!newAddressLabel || !newAddress) return;
                          const a = addAddress(newAddressLabel, newAddress);
                          selectAddress(a.id);
                          setNewAddressLabel('');
                          setNewAddress('');
                          setShowNewAddress(false);
                        }}
                        className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowNewAddress(false)}
                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cart items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-2xl">
                  🍽️
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{restaurantName}</h2>
                  <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1 text-lg">{item.name}</h3>
                      <p className="text-orange-600 font-semibold text-lg">₹{item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 text-orange-600 transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-bold text-gray-800 text-lg w-24 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Apply Coupon</h3>
              {applied ? (
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-green-500 bg-green-50">
                  <div>
                    <p className="font-bold text-green-700">{applied.code}</p>
                    <p className="text-sm text-green-700/80">{applied.description}</p>
                  </div>
                  <button onClick={remove} className="text-red-600 font-semibold hover:underline">Remove</button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    <button
                      onClick={() => {
                        const res = apply(couponInput, subtotal);
                        if (!res.success) setError(res.message);
                      }}
                      className="px-6 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                    >
                      Apply
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAllCoupons((s) => !s)}
                    className="text-orange-600 font-semibold text-sm"
                  >
                    {showAllCoupons ? 'Hide' : 'View all'} available coupons
                  </button>
                  {showAllCoupons && (
                    <div className="mt-3 space-y-2">
                      {available.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCouponInput(c.code);
                            const res = apply(c.code, subtotal);
                            if (!res.success) setError(res.message);
                            setShowAllCoupons(false);
                          }}
                          className="w-full text-left p-3 border-2 border-dashed border-orange-300 rounded-lg hover:bg-orange-50"
                        >
                          <p className="font-bold text-orange-600">{c.code}</p>
                          <p className="text-sm text-gray-600">{c.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Bill Details</h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Item Total</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({applied?.code})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Platform Fee</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-800">
                  <span>To Pay</span>
                  <span className="text-orange-600">₹{toPay.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <p className="text-xs text-green-700 text-center">You saved ₹{discount.toFixed(2)} 🎉</p>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="ml-2">→</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

