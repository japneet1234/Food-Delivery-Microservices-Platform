'use client';

import React, { useState, useEffect } from 'react';
import { restaurantApi, partnerApi, type DeliveryPartner } from '@/lib/api';
import { Restaurant, MenuItem } from '@/types';
import { FiPlus, FiMapPin, FiCheck, FiX, FiLoader, FiShoppingBag, FiTruck } from 'react-icons/fi';

type Tab = 'restaurants' | 'partners';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('restaurants');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7f1] via-white to-[#f8fbff]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600 mb-8">Manage restaurants and delivery partners</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'restaurants'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiShoppingBag className="w-5 h-5" />
              Restaurants
            </span>
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'partners'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FiTruck className="w-5 h-5" />
              Delivery Partners
            </span>
          </button>
        </div>

        {activeTab === 'restaurants' && (
          <RestaurantManagement
            onSuccess={showSuccess}
            onError={showError}
            loading={loading}
            setLoading={setLoading}
            onRefresh={() => setRefreshKey((k) => k + 1)}
            refreshKey={refreshKey}
          />
        )}

        {activeTab === 'partners' && (
          <PartnerManagement
            onSuccess={showSuccess}
            onError={showError}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </div>
  );
}

function RestaurantManagement({
  onSuccess,
  onError,
  loading,
  setLoading,
  onRefresh,
  refreshKey,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
  onRefresh: () => void;
  refreshKey: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    locationLat: '',
    locationLong: '',
    rating: '',
  });
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    price: '',
    available: true,
  });

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantApi.create({
        name: formData.name,
        locationLat: parseFloat(formData.locationLat),
        locationLong: parseFloat(formData.locationLong),
        rating: parseFloat(formData.rating) || 0,
      });
      onSuccess('Restaurant created successfully!');
      setFormData({ name: '', locationLat: '', locationLong: '', rating: '' });
      setShowForm(false);
      onRefresh();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent, restaurantId: number) => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantApi.addMenuItem(restaurantId, {
        name: menuFormData.name,
        price: parseFloat(menuFormData.price),
        available: menuFormData.available,
      });
      onSuccess('Menu item added successfully!');
      setMenuFormData({ name: '', price: '', available: true });
      setShowMenuForm(null);
      onRefresh();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Restaurant
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Restaurant</h3>
          <form onSubmit={handleCreateRestaurant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.locationLat}
                  onChange={(e) => setFormData({ ...formData, locationLat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.locationLong}
                  onChange={(e) => setFormData({ ...formData, locationLong: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiCheck className="w-5 h-5" />}
                Create Restaurant
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <RestaurantList
        onAddMenu={(id) => setShowMenuForm(id)}
        showMenuForm={showMenuForm}
        menuFormData={menuFormData}
        setMenuFormData={setMenuFormData}
        onAddMenuItem={handleAddMenuItem}
        loading={loading}
      />
    </div>
  );
}

function RestaurantList({
  onAddMenu,
  showMenuForm,
  menuFormData,
  setMenuFormData,
  onAddMenuItem,
  loading,
  refreshKey,
}: {
  onAddMenu: (id: number | null) => void;
  showMenuForm: number | null;
  menuFormData: { name: string; price: string; available: boolean };
  setMenuFormData: (data: { name: string; price: string; available: boolean }) => void;
  onAddMenuItem: (e: React.FormEvent, id: number) => void;
  loading: boolean;
  refreshKey: number;
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menus, setMenus] = useState<Record<number, MenuItem[]>>({});
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [expandedRestaurant, setExpandedRestaurant] = useState<number | null>(null);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (err) {
      console.error('Error loading restaurants:', err);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const loadMenu = async (restaurantId: number) => {
    try {
      const menu = await restaurantApi.getMenu(restaurantId);
      setMenus({ ...menus, [restaurantId]: menu });
    } catch (err) {
      console.error('Error loading menu:', err);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [refreshKey]);

  if (loadingRestaurants) {
    return <div className="text-center py-8">Loading restaurants...</div>;
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{restaurant.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⭐ {restaurant.rating?.toFixed(1) || 'N/A'}</span>
                <span className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  {restaurant.locationLat?.toFixed(4)}, {restaurant.locationLong?.toFixed(4)}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                if (expandedRestaurant === restaurant.id) {
                  setExpandedRestaurant(null);
                } else {
                  setExpandedRestaurant(restaurant.id);
                  loadMenu(restaurant.id);
                }
              }}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {expandedRestaurant === restaurant.id ? 'Hide Menu' : 'View Menu'}
            </button>
          </div>

          {expandedRestaurant === restaurant.id && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">Menu Items</h4>
                <button
                  onClick={() => onAddMenu(restaurant.id)}
                  className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {showMenuForm === restaurant.id && (
                <form
                  onSubmit={(e) => onAddMenuItem(e, restaurant.id)}
                  className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Item name"
                    required
                    value={menuFormData.name}
                    onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      required
                      value={menuFormData.price}
                      onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={menuFormData.available}
                        onChange={(e) => setMenuFormData({ ...menuFormData, available: e.target.checked })}
                      />
                      Available
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddMenu(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {menus[restaurant.id]?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                ))}
                {(!menus[restaurant.id] || menus[restaurant.id].length === 0) && (
                  <p className="text-gray-500 text-sm">No menu items yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {restaurants.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No restaurants found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}

function PartnerManagement({
  onSuccess,
  onError,
  loading,
  setLoading,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  loading: boolean;
  setLoading: (val: boolean) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    currentLat: '',
    currentLon: '',
  });
  const [locationUpdate, setLocationUpdate] = useState<Record<number, { lat: string; lon: string }>>({});

  // Seed partners list from local cache (optional) to provide immediate UI feedback
  useEffect(() => {
    const cached = localStorage.getItem('partner_cache');
    if (cached) {
      try {
        setPartners(JSON.parse(cached));
      } catch {
        setPartners([]);
      }
    }
  }, []);

  const persistPartners = (list: DeliveryPartner[]) => {
    setPartners(list);
    localStorage.setItem('partner_cache', JSON.stringify(list));
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newPartner = await partnerApi.create({
        name: formData.name,
        currentLat: parseFloat(formData.currentLat),
        currentLon: parseFloat(formData.currentLon),
      });
      onSuccess('Delivery partner created successfully!');
      persistPartners([...partners, newPartner]);
      setFormData({ name: '', currentLat: '', currentLon: '' });
      setShowForm(false);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to create delivery partner');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAvailable = async (id: number) => {
    try {
      setLoading(true);
      const updated = await partnerApi.markAvailable(id);
      persistPartners(partners.map(p => p.id === id ? updated : p));
      onSuccess(`Partner #${id} marked as available!`);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to update partner status');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkBusy = async (id: number) => {
    try {
      setLoading(true);
      const updated = await partnerApi.markBusy(id);
      persistPartners(partners.map(p => p.id === id ? updated : p));
      onSuccess(`Partner #${id} marked as busy!`);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to update partner status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (id: number) => {
    const location = locationUpdate[id];
    if (!location || !location.lat || !location.lon) {
      onError('Please enter both latitude and longitude');
      return;
    }
    try {
      setLoading(true);
      const updated = await partnerApi.updateLocation(id, {
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
      });
      persistPartners(partners.map(p => p.id === id ? updated : p));
      setLocationUpdate({ ...locationUpdate, [id]: { lat: '', lon: '' } });
      onSuccess(`Partner #${id} location updated!`);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Delivery Partner Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-2.5 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
        >
          <FiPlus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Register New Delivery Driver</h3>
          <form onSubmit={handleCreatePartner} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter driver name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.currentLat}
                  onChange={(e) => setFormData({ ...formData, currentLat: e.target.value })}
                  placeholder="12.9716"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.currentLon}
                  onChange={(e) => setFormData({ ...formData, currentLon: e.target.value })}
                  placeholder="77.5946"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiCheck className="w-5 h-5" />}
                Register Driver
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partners List */}
      {partners.length > 0 ? (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{partner.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        partner.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      {partner.currentLat?.toFixed(4)}, {partner.currentLon?.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Update Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationUpdate[partner.id]?.lat || ''}
                    onChange={(e) =>
                      setLocationUpdate({
                        ...locationUpdate,
                        [partner.id]: { ...locationUpdate[partner.id], lat: e.target.value, lon: locationUpdate[partner.id]?.lon || '' },
                      })
                    }
                    placeholder={partner.currentLat?.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Update Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={locationUpdate[partner.id]?.lon || ''}
                    onChange={(e) =>
                      setLocationUpdate({
                        ...locationUpdate,
                        [partner.id]: { ...locationUpdate[partner.id], lon: e.target.value, lat: locationUpdate[partner.id]?.lat || '' },
                      })
                    }
                    placeholder={partner.currentLon?.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMarkAvailable(partner.id)}
                  disabled={loading || partner.status === 'AVAILABLE'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  Mark Available
                </button>
                <button
                  onClick={() => handleMarkBusy(partner.id)}
                  disabled={loading || partner.status === 'BUSY'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <FiX className="w-4 h-4" />
                  Mark Busy
                </button>
                <button
                  onClick={() => handleUpdateLocation(partner.id)}
                  disabled={loading || !locationUpdate[partner.id]?.lat || !locationUpdate[partner.id]?.lon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <FiMapPin className="w-4 h-4" />
                  Update Location
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FiTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No delivery drivers registered yet.</p>
          <p className="text-gray-500 text-sm">Add a driver to get started!</p>
        </div>
      )}
    </div>
  );
}

