import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Bike } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">Irsa Kitchen</h1>
        <p className="text-brand-100 opacity-90">Delivery Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button 
          onClick={() => navigate('/admin-login')}
          className="group bg-white/10 backdrop-blur-md p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all active:scale-95 flex flex-col items-center gap-4"
        >
          <div className="bg-white text-brand-600 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
            <ShieldCheck size={48} />
          </div>
          <span className="text-2xl font-bold">Admin Portal</span>
          <span className="text-sm opacity-70">Manage riders & orders</span>
        </button>

        <button 
          onClick={() => navigate('/rider-login')}
          className="group bg-white p-8 rounded-2xl border-2 border-white shadow-xl hover:shadow-2xl transition-all active:scale-95 flex flex-col items-center gap-4"
        >
          <div className="bg-brand-600 text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
            <Bike size={48} />
          </div>
          <span className="text-2xl font-bold text-gray-800">Rider App</span>
          <span className="text-sm text-gray-500">Deliver orders & earn</span>
        </button>
      </div>
    </div>
  );
};

export default Home;