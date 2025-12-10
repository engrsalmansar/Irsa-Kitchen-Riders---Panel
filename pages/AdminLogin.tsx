import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'adminpass') {
      navigate('/admin-dashboard');
    } else {
      setError('Invalid Access Key');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl">
        <button onClick={() => navigate('/')} className="mb-6 text-gray-400 hover:text-gray-600">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Admin Access</h2>
        <p className="text-gray-500 mb-8">Please enter your secure key</p>

        <form onSubmit={handleLogin}>
          <Input 
            type="password" 
            label="Secret Key" 
            placeholder="Enter admin key..." 
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button fullWidth type="submit">Unlock Dashboard</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;