import axios from 'axios';
import { Restaurant, MenuItem, CreateOrderRequest, Order } from '@/types';

const RESTAURANT_API = 'http://localhost:8080';
const ORDER_API = 'http://localhost:8090';
const PARTNER_API = 'http://localhost:8084';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const restaurantApi = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>(`${RESTAURANT_API}/restaurants`);
    return response.data;
  },

  getById: async (id: number): Promise<Restaurant> => {
    const response = await api.get<Restaurant>(`${RESTAURANT_API}/restaurants/${id}`);
    return response.data;
  },

  getMenu: async (restaurantId: number): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>(`${RESTAURANT_API}/restaurants/${restaurantId}/menu`);
    return response.data;
  },

  create: async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
    const response = await api.post<Restaurant>(`${RESTAURANT_API}/restaurants`, restaurant);
    return response.data;
  },

  addMenuItem: async (restaurantId: number, menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const response = await api.post<MenuItem>(`${RESTAURANT_API}/restaurants/${restaurantId}/menu`, menuItem);
    return response.data;
  },
};

export const orderApi = {
  create: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(`${ORDER_API}/orders`, request);
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`${ORDER_API}/orders/${id}`);
    return response.data;
  },
};

export interface CreatePartnerRequest {
  name: string;
  currentLat: number;
  currentLon: number;
}

export interface UpdateLocationRequest {
  lat: number;
  lon: number;
}

export interface DeliveryPartner {
  id: number;
  name: string;
  status: 'AVAILABLE' | 'BUSY';
  currentLat: number;
  currentLon: number;
}

export const partnerApi = {
  create: async (request: CreatePartnerRequest): Promise<DeliveryPartner> => {
    const response = await api.post<DeliveryPartner>(`${PARTNER_API}/partners`, request);
    return response.data;
  },

  updateLocation: async (id: number, request: UpdateLocationRequest): Promise<DeliveryPartner> => {
    const response = await api.put<DeliveryPartner>(`${PARTNER_API}/partners/${id}/location`, request);
    return response.data;
  },

  markAvailable: async (id: number): Promise<DeliveryPartner> => {
    const response = await api.put<DeliveryPartner>(`${PARTNER_API}/partners/${id}/available`);
    return response.data;
  },

  markBusy: async (id: number): Promise<DeliveryPartner> => {
    const response = await api.put<DeliveryPartner>(`${PARTNER_API}/partners/${id}/busy`);
    return response.data;
  },
};

