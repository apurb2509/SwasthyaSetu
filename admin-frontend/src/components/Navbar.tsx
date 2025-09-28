import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import logo from '../assets/swasthyasetu_logo.png'; // Import the logo from the assets folder

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || '/';

  // The handleLogout function is no longer needed here if the button is removed
  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   navigate('/login');
  // };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href={mainSiteUrl} className="flex-shrink-0 flex items-center space-x-3">
              <img className="h-8 w-auto" src={logo} alt="SwasthyaSetu Logo" />
              <span className="text-xl font-bold text-gray-800">Admin Panel</span>
            </a>
          </div>
          {/* The session check and Logout button have been removed as requested */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;