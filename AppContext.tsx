import React, { createContext, useContext, useEffect, useState } from 'react';
import { Rider, Order } from './types';
import { storageService } from './services/storageService';

interface AppContextType {
  riders: Rider[];
  orders: Order[];
  refreshData: () => void;
  addRider: (rider: Rider) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], riderId?: string) => void;
  currentRider: Rider | null;
  loginRider: (phoneNumber: string) => boolean;
  logoutRider: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentRider, setCurrentRider] = useState<Rider | null>(null);

  const refreshData = () => {
    setRiders(storageService.getRiders());
    setOrders(storageService.getOrders());
  };

  useEffect(() => {
    // Initial Load
    refreshData();

    // Check for persistent rider login
    const savedRiderId = storageService.getRiderSession();
    if (savedRiderId) {
      const allRiders = storageService.getRiders();
      const found = allRiders.find(r => r.id === savedRiderId);
      if (found) setCurrentRider(found);
    }

    // Listen for storage changes (cross-tab sync)
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addRider = (rider: Rider) => {
    storageService.saveRider(rider);
    refreshData();
  };

  const addOrder = (order: Order) => {
    storageService.saveOrder(order);
    refreshData();
    // Dispatch a custom event for the current tab to update immediately
    window.dispatchEvent(new Event('storage'));
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], riderId?: string) => {
    const updates: Partial<Order> = { status };
    
    if (status === 'accepted' && riderId) {
      updates.assignedRiderId = riderId;
      updates.acceptedAt = Date.now();
    }
    
    if (status === 'delivered') {
      updates.completedAt = Date.now();
    }

    storageService.updateOrder(orderId, updates);
    refreshData();
    window.dispatchEvent(new Event('storage'));
  };

  const loginRider = (phoneNumber: string): boolean => {
    // Refresh data first to ensure we have latest riders
    const currentRiders = storageService.getRiders(); 
    const found = currentRiders.find(r => r.phoneNumber === phoneNumber);
    if (found) {
      setCurrentRider(found);
      storageService.setRiderSession(found.id);
      return true;
    }
    return false;
  };

  const logoutRider = () => {
    setCurrentRider(null);
    storageService.clearRiderSession();
  };

  return (
    <AppContext.Provider value={{ 
      riders, 
      orders, 
      refreshData, 
      addRider, 
      addOrder, 
      updateOrderStatus, 
      currentRider,
      loginRider,
      logoutRider
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};