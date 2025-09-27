import React from 'react';
import Carousel from '../components/Carousel';
import PhoneForm from '../components/PhoneForm';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-green-100 text-center py-16 md:py-24 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-green-800 mb-4">
          Trusted Health Information for a Stronger India
        </h2>
        <p className="text-md md:text-xl text-gray-700 max-w-3xl mx-auto">
          SwasthyaSetu fights misinformation by providing clear, reliable health advice and connecting you to vital government schemes, accessible to everyone, everywhere.
        </p>
      </section>

      {/* Carousel Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Seasonal Health Awareness
          </h3>
          <Carousel />
        </div>
      </section>

      {/* Phone & WhatsApp Form Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Get Daily Health Tips
          </h3>
          <p className="text-gray-600 mb-8">
            Subscribe via SMS or WhatsApp for daily updates in your local language.
          </p>
          <PhoneForm />
        </div>
      </section>

      {/* Web Chat CTA - Hidden on small screens for now */}
      <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Have a Health Question?</h3>
              <p className="text-gray-600 mb-8">Use our chat assistant for information on symptoms, prevention, and government schemes.</p>
              <button disabled className="bg-gray-300 text-gray-500 font-bold py-3 px-8 rounded-lg cursor-not-allowed hidden md:inline-block">
                Open Web Chat (Login Required)
              </button>
               <p className="text-gray-500 mt-4 md:hidden">Web chat is available on larger screens after login.</p>
          </div>
      </section>
    </div>
  );
};

export default Home;