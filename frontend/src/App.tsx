import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;