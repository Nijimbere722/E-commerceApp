import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">ShopApp</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          {!isAuthenticated && (
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          )}
          {isAuthenticated && userRole === 'USER' && (
            <>
              <Link to="/cart" className="text-gray-700 hover:text-blue-600">My Cart</Link>
              <Link to="/orders" className="text-gray-700 hover:text-blue-600">My Orders</Link>
            </>
          )}
          {isAuthenticated && userRole === 'ADMIN' && (
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 px-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700">Home</Link>
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700">Login</Link>
          )}
          {isAuthenticated && userRole === 'USER' && (
            <>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-700">My Cart</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-gray-700">My Orders</Link>
            </>
          )}
          {isAuthenticated && userRole === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-700">Admin Dashboard</Link>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;