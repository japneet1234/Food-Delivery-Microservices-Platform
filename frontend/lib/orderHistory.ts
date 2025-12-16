import { Order } from '@/types';

const ORDER_HISTORY_KEY = 'foodie_order_history';

export const orderHistory = {
  save: (order: Order) => {
    if (typeof window === 'undefined') return;
    const history = orderHistory.getAll();
    const existingIndex = history.findIndex((o) => o.id === order.id);
    if (existingIndex >= 0) {
      history[existingIndex] = order;
    } else {
      history.unshift(order);
    }
    // Keep only last 50 orders
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(limitedHistory));
  },

  getAll: (): Order[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(ORDER_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById: (id: number): Order | undefined => {
    const history = orderHistory.getAll();
    return history.find((o) => o.id === id);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ORDER_HISTORY_KEY);
  },
};

