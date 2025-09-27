import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img className="h-8 w-auto" src="/swasthyasetu_logo.png" alt="SwasthyaSetu Logo" />
              <span className="text-xl font-bold text-gray-800 hidden sm:block">SwasthyaSetu</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/chat"
                className="text-gray-600 hover:bg-gray-100 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Chat Assistant
              </Link>
              {session ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;