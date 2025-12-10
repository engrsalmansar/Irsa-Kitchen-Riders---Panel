import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RiderLogin from './pages/RiderLogin';
import RiderDashboard from './pages/RiderDashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/rider-login" element={<RiderLogin />} />
          <Route path="/rider-dashboard" element={<RiderDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;