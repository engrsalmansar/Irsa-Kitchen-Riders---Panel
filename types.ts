export interface Rider {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'declined' | 'delivered';

export interface Order {
  id: string;
  shortId: string; // For display like "Order #1234"
  customerName: string;
  customerNumber: string;
  coordinates: string; // Stored as "lat,lng" string for simplicity in input
  deliveryCharges: number;
  itemsValue: number;
  itemsQuantity: number;
  status: OrderStatus;
  createdAt: number;
  assignedRiderId?: string; 
  acceptedAt?: number;
  completedAt?: number;
}

export interface AppState {
  riders: Rider[];
  orders: Order[];
}