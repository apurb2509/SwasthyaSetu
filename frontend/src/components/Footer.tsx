import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Get the base URL from environment variables for production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const fetchHealthStatus = async () => {
  // Use the full backend URL
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Footer: React.FC = () => {
  const { data, error, isLoading } = useQuery({ 
    queryKey: ['healthCheck'], 
    queryFn: fetchHealthStatus, 
    retry: false 
  });

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto py-8 px-4 text-center">
        
        <div className="mb-6">
          <h3 className="font-bold text-white text-xl mb-2">SwasthyaSetu</h3>
          <p className="text-sm max-w-2xl mx-auto">
            Your trusted partner in rural health awareness, bridging the information gap with technology to build a healthier, more informed India.
          </p>
        </div>
        
        <div className="mb-6">
          <ul className="flex justify-center items-center space-x-4 sm:space-x-8">
            <li><a href="/about-us" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">About Us</a></li>
            <li><a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Terms of Use</a></li>
            <li><a href="/disclaimer" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">Disclaimer</a></li>
          </ul>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="text-sm mb-2">
            {isLoading && <p>Connecting to server...</p>}
            {error && <p className="flex items-center justify-center gap-2 text-red-400"><span className="h-2 w-2 rounded-full bg-red-500"></span>Backend Offline</p>}
            {data && <p className="flex items-center justify-center gap-2 text-green-400"><span className="h-2 w-2 rounded-full bg-green-500"></span>Backend Online</p>}
          </div>
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} SwasthyaSetu. All Rights Reserved.</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;