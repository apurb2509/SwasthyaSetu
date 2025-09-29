import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const DefaultLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Pages like Home, About Us, etc., will be rendered here */}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;