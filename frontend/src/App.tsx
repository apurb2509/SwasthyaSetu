import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Disclaimer from './pages/Disclaimer';
import ProfilePage from './pages/ProfilePage';
import DefaultLayout from './components/DefaultLayout';

// --- NEW IMPORTS ---
import SignupPrompt from './components/SignupPrompt';
import FloatingActionButtons from './components/FloatingActionButtons';

function App() {
  return (
    <>
      <Routes>
        {/* --- Routes that WILL have a footer --- */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* --- Route for Chat Page that WILL NOT have a footer --- */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
                <Navbar />
                <main className="flex-grow">
                  <Chat />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* --- NEW GLOBAL COMPONENTS --- */}
      <SignupPrompt />
      <FloatingActionButtons />
    </>
  );
}

export default App;