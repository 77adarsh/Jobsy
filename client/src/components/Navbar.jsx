// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white shadow'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">J</span>obsy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/find-job" className="text-gray-700 hover:text-blue-600">Find Job</Link>
            <Link to="/category" className="text-gray-700 hover:text-blue-600">Category</Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Log In</Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="mobile-menu-button outline-none"
            >
              <svg
                className="w-6 h-6 text-gray-500 hover:text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow">
          <Link 
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>
          <Link 
            to="/find-job"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Find Job
          </Link>
          <Link 
            to="/category"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Category
          </Link>
          <Link 
            to="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
          >
            Blog
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link 
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>
              <button 
                onClick={logout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
              >
                Log In
              </Link>
              <Link 
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;