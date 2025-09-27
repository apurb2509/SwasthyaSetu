import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

// 1. Import the logo directly from the assets folder
import logo from '../assets/swasthyasetu_logo.png';

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  // 2. Read the main site URL from the environment variable
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
            {/* 3. This is now a standard <a> tag to link to the main site */}
            <a href={mainSiteUrl} className="flex-shrink-0 flex items-center space-x-2">
              <img className="h-8 w-auto" src={logo} alt="SwasthyaSetu Logo" />
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