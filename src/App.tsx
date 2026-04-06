import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import queryClient from './utils/queryClient';
import Navbar from './components/Navbar';
import ToastNotifications from './components/ToastNotifications';
import { UserRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './pages/ProductForm';
import CategoryManager from './pages/CategoryManager';
import AllOrders from './pages/AllOrders';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <ToastNotifications />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* User Protected */}
            <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
            <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>} />
            <Route path="/orders" element={<UserRoute><OrderHistory /></UserRoute>} />

            {/* Admin Protected */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/product/:id" element={<AdminRoute><ProductForm /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><CategoryManager /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AllOrders /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;