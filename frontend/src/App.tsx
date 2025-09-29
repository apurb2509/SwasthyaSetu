import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Disclaimer from './pages/Disclaimer';
import ProfilePage from './pages/ProfilePage';
import SignupPrompt from './components/SignupPrompt'; // <-- Import the new component

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Protected Routes */}
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <SignupPrompt /> {/* <-- Add the component here */}
    </div>
  );
}

export default App;