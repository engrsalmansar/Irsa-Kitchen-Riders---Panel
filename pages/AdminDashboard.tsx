import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useApp } from '../AppContext';
import { UserPlus, PackagePlus, LogOut, Users, List, MapPin, History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addRider, addOrder, riders, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'riders' | 'history'>('orders');

  // Rider Form State
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderId, setRiderId] = useState('');

  // Order Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [coords, setCoords] = useState('');
  const [delCharges, setDelCharges] = useState('');
  const [itemsVal, setItemsVal] = useState('');
  const [qty, setQty] = useState('');

  const handleAddRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderName || !riderPhone || !riderId) return;
    
    addRider({
      id: riderId,
      name: riderName,
      phoneNumber: riderPhone,
      createdAt: Date.now()
    });
    setRiderName('');
    setRiderPhone('');
    setRiderId('');
    alert('Rider added successfully!');
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !coords) return;

    // Generate a simple 4-digit ID for display
    const shortId = Math.floor(1000 + Math.random() * 9000).toString();

    addOrder({
      id: uuidv4(),
      shortId: shortId,
      customerName: custName,
      customerNumber: custPhone,
      coordinates: coords,
      deliveryCharges: Number(delCharges),
      itemsValue: Number(itemsVal),
      itemsQuantity: Number(qty),
      status: 'pending',
      createdAt: Date.now()
    });

    // Reset Form
    setCustName('');
    setCustPhone('');
    setCoords('');
    setDelCharges('');
    setItemsVal('');
    setQty('');
    alert('Delivery Request Broadcasted!');
  };

  const getRiderDetails = (riderId?: string) => {
    if (!riderId) return null;
    return riders.find(r => r.id === riderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Irsa Admin</h1>
          <p className="text-xs text-gray-400">Control Center</p>
        </div>
        <button onClick={() => navigate('/')} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
          <LogOut size={20} />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex p-4 gap-2 md:gap-4 max-w-4xl mx-auto overflow-x-auto">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-brand-600 text-white shadow-brand-500/30 shadow-lg' : 'bg-white text-gray-600 border'}`}
        >
          <PackagePlus size={18} /> New Order
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-brand-600 text-white shadow-brand-500/30 shadow-lg' : 'bg-white text-gray-600 border'}`}
        >
          <History size={18} /> History
        </button>
        <button 
          onClick={() => setActiveTab('riders')}
          className={`flex-1 flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl font-semibold transition-all whitespace-nowrap ${activeTab === 'riders' ? 'bg-brand-600 text-white shadow-brand-500/30 shadow-lg' : 'bg-white text-gray-600 border'}`}
        >
          <Users size={18} /> Manage Riders
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        
        {/* CREATE ORDER TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-600">
              <PackagePlus size={24} /> 
              Broadcast Delivery
            </h3>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Customer Name" value={custName} onChange={e => setCustName(e.target.value)} required />
                <Input label="Customer Phone" value={custPhone} onChange={e => setCustPhone(e.target.value)} required />
              </div>
              
              <div className="relative">
                <Input 
                  label="Coordinates (Lat, Lng)" 
                  value={coords} 
                  onChange={e => setCoords(e.target.value)} 
                  required 
                  placeholder="31.5204, 74.3587"
                />
                <button 
                  type="button"
                  className="absolute top-8 right-2 p-2 text-brand-600 hover:bg-brand-50 rounded-lg text-xs font-bold flex items-center gap-1"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(pos => {
                        setCoords(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
                      });
                    }
                  }}
                >
                  <MapPin size={14}/> My Loc
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <Input label="Fee (PKR)" type="number" value={delCharges} onChange={e => setDelCharges(e.target.value)} required />
                 <Input label="Value (PKR)" type="number" value={itemsVal} onChange={e => setItemsVal(e.target.value)} required />
                 <Input label="Items Qty" type="number" value={qty} onChange={e => setQty(e.target.value)} required />
              </div>

              <div className="pt-4">
                <Button fullWidth type="submit" className="text-lg shadow-xl shadow-brand-500/20">
                  Broadcast Request
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* MANAGE RIDERS TAB */}
        {activeTab === 'riders' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserPlus size={20} className="text-brand-600"/> Add New Rider</h3>
              <form onSubmit={handleAddRider}>
                <Input label="Full Name" value={riderName} onChange={e => setRiderName(e.target.value)} required />
                <Input label="Phone Number" value={riderPhone} onChange={e => setRiderPhone(e.target.value)} required placeholder="e.g. 03001234567" />
                <Input label="Assign ID" value={riderId} onChange={e => setRiderId(e.target.value)} required placeholder="RIDER-01" />
                <Button fullWidth type="submit">Save Rider</Button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><List size={20} className="text-gray-600"/> Registered Riders</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {riders.length === 0 && <p className="text-gray-400 text-center py-4">No riders yet.</p>}
                {riders.map(rider => (
                  <div key={rider.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{rider.name}</p>
                      <p className="text-xs text-gray-500">{rider.phoneNumber}</p>
                    </div>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold">{rider.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brand-600">
              <History size={24} /> 
              Order History
            </h3>
            
            <div className="space-y-4">
              {orders.slice().reverse().map(order => {
                const assignedRider = getRiderDetails(order.assignedRiderId);
                return (
                  <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="bg-brand-100 text-brand-800 text-xs font-bold px-2 py-1 rounded-md">Order #{order.shortId}</span>
                        <h4 className="font-bold text-gray-800 mt-1">{order.customerName}</h4>
                        <p className="text-xs text-gray-500">{order.customerNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${order.status === 'accepted' ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                          ${order.status === 'declined' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {order.status === 'pending' && <Clock size={12}/>}
                          {order.status === 'accepted' && <CheckCircle size={12}/>}
                          {order.status === 'delivered' && <CheckCircle size={12}/>}
                          {order.status === 'declined' && <XCircle size={12}/>}
                          {order.status}
                        </span>
                        <p className="text-sm font-bold mt-1">PKR {order.deliveryCharges + order.itemsValue}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        {order.itemsQuantity} Items • Value: PKR {order.itemsValue}
                      </div>
                      
                      {assignedRider ? (
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase font-bold">Rider</p>
                          <p className="font-semibold text-gray-800">{assignedRider.name}</p>
                          <p className="text-xs text-gray-600">{assignedRider.phoneNumber}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No rider assigned yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && <p className="text-center text-gray-400 py-8">No orders broadcasted yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;