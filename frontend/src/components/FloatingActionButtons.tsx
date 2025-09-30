import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const FloatingActionButtons: React.FC = () => {
  const location = useLocation();
  const whatsappLink = "https://wa.me/+918249814944";

  // This logic correctly shows the buttons only on the homepage.
  if (location.pathname !== '/') {
    return null;
  }

  return (
    // --- THE FIX IS HERE: Changed 'left' to 'right' ---
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 40 }} className="flex flex-col items-end space-y-4">
      
      {/* SwasthyaDoot Chatbot Button */}
      <div className="relative group flex items-center">
        {/* Tooltip is now on the left */}
        <div className="absolute right-20 bg-gray-800 text-white text-sm rounded-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          SwasthyaDoot Bot
        </div>
        <Link 
          to="/chat"
          aria-label="Open SwasthyaDoot Chat"
          className="transform transition-transform hover:scale-110"
        >
          <img 
            src="/swasthyadoot_icon.png" 
            alt="Chatbot Icon" 
            className="w-14 h-14"
            style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }} 
          />
        </Link>
      </div>

      {/* WhatsApp Button */}
      <div className="relative group flex items-center">
        {/* Tooltip is now on the left */}
        <div className="absolute right-20 bg-gray-800 text-white text-sm rounded-md px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp Query
        </div>
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact on WhatsApp"
          className="transform transition-transform hover:scale-110"
        >
          <img 
            src="/whatsapp_icon.png" 
            alt="WhatsApp Icon" 
            className="w-14 h-14"
            style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }}
          />
        </a>
      </div>
      
    </div>
  );
};

export default FloatingActionButtons;