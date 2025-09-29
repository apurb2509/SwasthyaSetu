import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

// --- Language Toggle Component ---
const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const { session } = useAuth();
  // ... (rest of the component is unchanged)
};

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL;
  
  // --- NEW state for profile dropdown ---
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user's name
  useEffect(() => {
    if (session) {
      const getProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setUserName(data.name);
        }
      };
      getProfile();
    }
  }, [session]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
            <img className="h-8 w-auto" src="/swasthyasetu_logo.png" alt="SwasthyaSetu Logo" />
            <span className="text-xl font-bold text-gray-800 hidden sm:block">SwasthyaSetu</span>
          </Link>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/chat" className="nav-link">{t('Chat Assistant')}</Link>
              
              {session ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    {getInitials(userName)}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Profile')}</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Logout')}</button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a href={adminPanelUrl} target="_blank" rel="noopener noreferrer" className="nav-link-outline">{t('Admin Login')}</a>
                  <Link to="/login" className="nav-link-primary">{t('Login')}</Link>
                </>
              )}
              <LanguageToggle />
            </div>
          </div>
          {/* ... mobile menu ... */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;