import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Button } from '../components/Button';
import { audioService, requestNotificationPermission, sendNotification } from '../services/audioService';
import { LogOut, Map, Bell, User, CheckCircle, PackageCheck, History, Navigation } from 'lucide-react';
import { Order } from '../types';

const KITCHEN_COORDS = { lat: 29.3968656, lng: 71.7067116 };

const RiderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentRider, logoutRider, orders, updateOrderStatus } = useApp();
  
  const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<Order | null>(null);

  useEffect(() => {
    if (!currentRider) return;

    // 1. Check if I have an active delivery (Accepted by ME and NOT delivered yet)
    const myActive = orders.find(o => o.assignedRiderId === currentRider.id && o.status === 'accepted');
    setActiveDelivery(myActive || null);

    // 2. Check for NEW pending orders
    if (!myActive) {
      const pending = orders.find(o => o.status === 'pending');
      if (pending) {
        setIncomingOrder(pending);
        audioService.playRing();
        sendNotification("New Order!", `Delivery for ${pending.customerName}`);
      } else {
        setIncomingOrder(null);
        audioService.stopRing();
      }
    } else {
      // If I have an active order, silence the ring for pending ones
      setIncomingOrder(null);
      audioService.stopRing();
    }

  }, [orders, currentRider]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleLogout = () => {
    audioService.stopRing();
    logoutRider();
    navigate('/');
  };

  const openMaps = (coords: string) => {
    const cleanCoords = coords.replace(/\s/g, '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${cleanCoords}`, '_blank');
  };

  const handleAccept = () => {
    if (incomingOrder && currentRider) {
      audioService.stopRing();
      updateOrderStatus(incomingOrder.id, 'accepted', currentRider.id);
      setIncomingOrder(null);
    }
  };

  const handleDecline = () => {
    if (incomingOrder) {
      audioService.stopRing();
      setIncomingOrder(null); 
    }
  };

  const handleCompleteDelivery = () => {
    if (activeDelivery) {
      updateOrderStatus(activeDelivery.id, 'delivered');
      setActiveDelivery(null);
    }
  };

  // Haversine formula to calculate distance in km
  const calculateDistance = (targetCoords: string): string => {
    try {
      const parts = targetCoords.split(',').map(s => parseFloat(s.trim()));
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return "N/A";

      const lat1 = KITCHEN_COORDS.lat;
      const lon1 = KITCHEN_COORDS.lng;
      const lat2 = parts[0];
      const lon2 = parts[1];

      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
      const d = R * c; // Distance in km
      return d.toFixed(1);
    } catch (e) {
      return "N/A";
    }
  };

  if (!currentRider) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden pb-10">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-brand-600 rounded-b-[40px] shadow-lg z-0"></div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <User size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">{currentRider.name}</h1>
            <p className="text-brand-100 text-xs">ID: {currentRider.id}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-white/20 p-2 rounded-lg backdrop-blur-sm hover:bg-white/30 transition">
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 px-4 flex flex-col gap-6">
        
        {/* SCENARIO 1: ACTIVE DELIVERY (Accepted by me) */}
        {activeDelivery && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-200 mt-4">
             <div className="bg-green-600 text-white text-center py-3 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                <PackageCheck size={18} /> Delivery In Progress
              </div>
              <div className="p-6">
                <div className="mb-6 border-b pb-4">
                   <p className="text-xs text-gray-400 uppercase font-bold mb-1">Customer</p>
                   <h3 className="text-2xl font-bold text-gray-800">{activeDelivery.customerName}</h3>
                   <p className="text-lg text-brand-600 font-medium">{activeDelivery.customerNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-400">Collect Amount</p>
                      <p className="font-bold text-gray-800">PKR {activeDelivery.itemsValue}</p>
                   </div>
                   <div className="bg-brand-50 p-3 rounded-xl">
                      <p className="text-xs text-brand-400">Your Fee</p>
                      <p className="font-bold text-brand-700">PKR {activeDelivery.deliveryCharges}</p>
                   </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl mb-4 flex justify-between items-center border border-blue-100">
                    <div>
                        <p className="text-xs text-blue-500 font-bold uppercase">Est. Distance</p>
                        <p className="text-blue-900 font-bold">{calculateDistance(activeDelivery.coordinates)} km</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-blue-400">From Kitchen</p>
                    </div>
                </div>

                <button 
                  onClick={() => openMaps(activeDelivery.coordinates)}
                  className="w-full bg-blue-100 text-blue-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:bg-blue-200 transition"
                >
                  <Map size={20} /> Open Google Maps
                </button>

                <Button variant="success" fullWidth onClick={handleCompleteDelivery} className="py-4 text-lg shadow-green-500/30">
                  <CheckCircle size={20}/> Mark Delivered
                </Button>
              </div>
          </div>
        )}

        {/* SCENARIO 2: INCOMING ORDER (Pending) - Only if no active delivery */}
        {!activeDelivery && incomingOrder && (
          <div className="w-full animate-pulse-fast-border mt-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-brand-500 relative">
              <div className="bg-brand-500 text-white text-center py-2 font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 animate-pulse">
                <Bell size={16} fill="white" /> Incoming Request
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{incomingOrder.customerName}</h3>
                <p className="text-gray-500 text-lg mb-6">{incomingOrder.customerNumber}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-1">Items ({incomingOrder.itemsQuantity})</p>
                    <p className="text-gray-800 font-bold text-lg">PKR {incomingOrder.itemsValue}</p>
                  </div>
                  <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                    <p className="text-brand-600 text-xs uppercase font-bold mb-1">You Earn</p>
                    <p className="text-brand-700 font-bold text-lg">PKR {incomingOrder.deliveryCharges}</p>
                  </div>
                </div>

                {/* Distance and Map Check for Incoming Order */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 bg-indigo-50 p-3 rounded-xl border border-indigo-100 flex flex-col justify-center">
                         <p className="text-xs text-indigo-400 uppercase font-bold">Distance</p>
                         <div className="flex items-baseline gap-1">
                             <span className="text-indigo-800 font-bold text-xl">{calculateDistance(incomingOrder.coordinates)}</span>
                             <span className="text-indigo-600 text-xs font-bold">km</span>
                         </div>
                    </div>
                    <button 
                        onClick={() => openMaps(incomingOrder.coordinates)}
                        className="flex-1 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-indigo-50 transition p-2"
                    >
                        <Map size={20} /> 
                        <span className="text-xs">Check Map</span>
                    </button>
                </div>

                <div className="flex gap-4">
                  <Button variant="danger" fullWidth className="py-4 text-lg" onClick={handleDecline}>Decline</Button>
                  <Button variant="success" fullWidth className="py-4 text-lg animate-bounce-subtle" onClick={handleAccept}>Accept</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO 3: IDLE / WAITING */}
        {!activeDelivery && !incomingOrder && (
           <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm text-center mt-4">
              <p className="text-gray-500 font-medium">No new orders right now.</p>
              <p className="text-xs text-gray-400 mt-1">Status: Online & Waiting</p>
           </div>
        )}

        {/* HISTORY SECTION */}
        <div className="mt-4">
          <h3 className="text-gray-600 font-bold mb-3 flex items-center gap-2 px-2">
            <History size={18} /> Recent Activity
          </h3>
          <div className="space-y-3 pb-8">
            {orders.slice().reverse().map(order => {
              // Logic for display status
              let statusText = order.status;
              let statusColor = "text-gray-500";
              let statusBg = "bg-gray-100";

              if (order.status === 'accepted') {
                if (order.assignedRiderId === currentRider.id) {
                   statusText = "In Progress (You)";
                   statusColor = "text-green-700";
                   statusBg = "bg-green-100";
                } else {
                   statusText = "Accepted by other";
                   statusColor = "text-orange-700";
                   statusBg = "bg-orange-100";
                }
              } else if (order.status === 'delivered') {
                 if (order.assignedRiderId === currentRider.id) {
                    statusText = "Delivered by You";
                    statusColor = "text-brand-700";
                    statusBg = "bg-brand-100";
                 } else {
                    statusText = "Delivered by other";
                    statusColor = "text-gray-500";
                 }
              }

              if (order.status === 'pending') return null; // Don't show pending in history

              return (
                <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-90">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-400">Order #{order.shortId}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${statusBg} ${statusColor}`}>
                        {statusText}
                      </span>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-bold text-gray-800">PKR {order.deliveryCharges}</p>
                        <p className="text-xs text-gray-400">Earning</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                   </div>
                </div>
              )
            })}
             {orders.filter(o => o.status !== 'pending').length === 0 && (
               <p className="text-center text-gray-400 text-sm">History is empty.</p>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiderDashboard;