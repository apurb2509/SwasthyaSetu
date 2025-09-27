import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat'; // <-- Import the new page

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} /> {/* <-- Add the new route */}
        </Routes>
      </main>
    </div>
  );
}

export default App;