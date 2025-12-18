import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShippingWebsite from './ShippingWebsite';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShippingWebsite />} />
        <Route
          path="/admin/login"
          element={isAuthenticated ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;