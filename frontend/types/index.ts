export interface Restaurant {
  id: number;
  name: string;
  locationLat: number;
  locationLong: number;
  rating: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
}

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  restaurantId: number;
  restaurantName: string;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  restaurantId: number;
  items: OrderItem[];
}

export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PAID' 
  | 'ASSIGNED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface Order {
  id: number;
  restaurantId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveryPartnerId?: number;
  items?: OrderItem[];
  restaurantName?: string; // Added for order history
}

export interface DeliveryPartner {
  id: number;
  name: string;
  status: 'AVAILABLE' | 'BUSY';
  currentLat: number;
  currentLon: number;
}

