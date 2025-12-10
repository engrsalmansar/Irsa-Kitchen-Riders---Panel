import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../AppContext';

const RiderLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginRider, currentRider } = useApp();

  useEffect(() => {
    if (currentRider) {
      navigate('/rider-dashboard');
    }
  }, [currentRider, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginRider(phone);
    if (success) {
      navigate('/rider-dashboard');
    } else {
      setError('Number not found. Contact Admin.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
        <button onClick={() => navigate('/')} className="mb-6 text-gray-400 hover:text-gray-600">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Rider Login</h2>
        <p className="text-gray-500 mb-8">Enter your registered number</p>

        <form onSubmit={handleLogin}>
          <Input 
            type="tel" 
            label="Phone Number" 
            placeholder="e.g. 03001234567" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button fullWidth type="submit">Start Shift</Button>
        </form>
      </div>
    </div>
  );
};

export default RiderLogin;