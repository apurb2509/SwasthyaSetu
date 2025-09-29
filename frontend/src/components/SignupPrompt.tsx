import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignupPrompt: React.FC = () => {
  const { session } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  // Read the initial count from localStorage, defaulting to 0
  const [promptCount, setPromptCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('promptDismissCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showPrompt = () => {
    if (!session) {
      setIsVisible(true);
    }
  };

  const closePrompt = () => {
    setIsVisible(false);
    const newCount = promptCount + 1;
    setPromptCount(newCount);
    // Save the new count to localStorage
    localStorage.setItem('promptDismissCount', String(newCount));
    
    if (timerRef.current) clearTimeout(timerRef.current);
    // Set the next timer for 30 seconds
    timerRef.current = setTimeout(showPrompt, 30000);
  };

  useEffect(() => {
    // If the user has already been blocked, show the prompt immediately
    if (promptCount >= 3) {
      showPrompt();
    } else {
      // Otherwise, start the initial 30-second timer
      timerRef.current = setTimeout(showPrompt, 30000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // Run only once

  if (session || !isVisible) {
    return null;
  }

  const isBlocked = promptCount >= 3;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="relative bg-gradient-to-br from-blue-600 to-green-500 text-white max-w-lg w-full rounded-xl shadow-2xl p-8 text-center">
        {/* The close button is now conditional */}
        {!isBlocked && (
          <button 
            onClick={closePrompt}
            className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
            aria-label="Close prompt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <h2 className="text-3xl font-bold mb-4">
          {isBlocked ? 'Please Sign In to Continue' : 'Unlock the Full Experience'}
        </h2>
        <p className="mb-6">
          Sign in or create an account to save your chat history, receive personalized tips, and access all the features of SwasthyaSetu.
        </p>
        <Link
          to="/login"
          onClick={() => setIsVisible(false)}
          className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors text-lg"
        >
          Sign In / Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignupPrompt;