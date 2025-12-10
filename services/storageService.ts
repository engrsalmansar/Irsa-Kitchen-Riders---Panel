import { Rider, Order } from '../types';

const RIDERS_KEY = 'irsa_riders';
const ORDERS_KEY = 'irsa_orders';
const RIDER_SESSION_KEY = 'irsa_rider_session';

export const storageService = {
  getRiders: (): Rider[] => {
    const data = localStorage.getItem(RIDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRider: (rider: Rider) => {
    const riders = storageService.getRiders();
    riders.push(rider);
    localStorage.setItem(RIDERS_KEY, JSON.stringify(riders));
    // Trigger storage event manually for same-tab updates if needed, 
    // though React state usually handles this.
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveOrder: (order: Order) => {
    const orders = storageService.getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const orders = storageService.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  },

  // Session Management
  setRiderSession: (riderId: string) => {
    localStorage.setItem(RIDER_SESSION_KEY, riderId);
  },

  getRiderSession: (): string | null => {
    return localStorage.getItem(RIDER_SESSION_KEY);
  },

  clearRiderSession: () => {
    localStorage.removeItem(RIDER_SESSION_KEY);
  }
};