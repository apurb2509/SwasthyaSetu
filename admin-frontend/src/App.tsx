import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'; // <-- Import the new Navbar

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* <-- Add Navbar to the layout */}
      <main>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;