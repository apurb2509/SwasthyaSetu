import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

// --- Language Toggle Component (code is from previous step, assumed to be correct) ---
const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const { session } = useAuth();

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    if (session) {
      await supabase
        .from('profiles')
        .update({ language_preference: lng })
        .eq('id', session.user.id);
    }
  };
  
  useEffect(() => {
      async function fetchLanguagePref() {
          if(session) {
              const { data } = await supabase
                .from('profiles')
                .select('language_preference')
                .eq('id', session.user.id)
                .single();
            if(data?.language_preference) {
                i18n.changeLanguage(data.language_preference);
            }
          }
      }
      fetchLanguagePref();
  }, [session, i18n]);

  return (
    <div className="relative">
      <select 
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="text-sm bg-gray-100 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="bn">বাংলা</option>
      </select>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL;
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
              {/* --- STYLING FIX IS HERE --- */}
              <Link to="/chat" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-colors duration-200">
                {t('Chat Assistant')}
              </Link>
              
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
                  <a href={adminPanelUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 border border-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200">
                    {t('Admin Login')}
                  </a>
                  <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 shadow-sm">
                    {t('Login')}
                  </Link>
                </>
              )}
              <LanguageToggle />
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;