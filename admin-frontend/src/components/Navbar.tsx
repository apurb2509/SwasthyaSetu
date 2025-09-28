import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || '/';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href={mainSiteUrl} className="flex-shrink-0 flex items-center space-x-2">
              <img className="h-8 w-auto" src="/swasthyasetu_logo.png" alt="SwasthyaSetu Logo" />
              <span className="text-xl font-bold text-gray-800">Admin Panel</span>
            </a>
          </div>
          {session && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;