import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Carousel from '../components/Carousel';
import PhoneForm from '../components/PhoneForm';

// --- Icon Components (unchanged) ---
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const SmsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const SchemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

// --- Data for Components (unchanged) ---
const heroSlides = [
  { title: "Trusted Health Information for a Stronger India", description: "SwasthyaSetu fights misinformation by providing clear, reliable health advice and connecting you to vital government schemes." },
  { title: "Accessible to All, Everywhere", description: "Reaching every village with crucial health updates and AI assistance via Web, SMS, and eventually WhatsApp." },
  { title: "Empowering Communities with Knowledge", description: "Simplifying complex schemes like Ayushman Bharat, ensuring every citizen knows their health rights and benefits." }
];
const features = [
  { title: "Multilingual AI Chat", icon: <ChatIcon /> },
  { title: "SMS & WhatsApp Access", icon: <SmsIcon /> },
  { title: "Govt. Scheme Info", icon: <SchemeIcon /> },
  { title: "Always Up-to-Date", icon: <UploadIcon /> }
];

const fetchHealthStatus = async () => { /* ... */ };

const Home: React.FC = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['healthCheck'], queryFn: fetchHealthStatus, retry: false });
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(nextSlide, 6000);
    return () => resetTimeout();
  }, [currentSlide, nextSlide]);
  
  const goToPrevSlide = () => {
    const isFirstSlide = currentSlide === 0;
    const newIndex = isFirstSlide ? heroSlides.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
  };
  
  const goToNextSlide = () => {
    const isLastSlide = currentSlide === heroSlides.length - 1;
    const newIndex = isLastSlide ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
  };

  return (
    <div>
      {/* --- Hero Section --- */}
      <section className="bg-green-100/70 pt-16 md:pt-24 pb-12 md:pb-20 px-4">
        <div className="container mx-auto text-center">
          
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    {/* --- THE FIX IS HERE --- */}
                    <div className="min-h-36 md:min-h-40 flex flex-col justify-center">
                      <h2 className="text-3xl md:text-5xl font-extrabold text-green-800 mb-4">
                        {slide.title}
                      </h2>
                      <p className="text-md md:text-xl text-gray-700 max-w-3xl mx-auto">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={goToPrevSlide} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-10 p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={goToNextSlide} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-10 p-2 bg-white/50 hover:bg-white rounded-full shadow-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-110 hover:-rotate-3 border border-green-200/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white mx-auto mb-3 shadow">
                  {feature.icon}
                </div>
                <h4 className="text-sm md:text-base font-semibold text-gray-800">{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Other Sections (unchanged) --- */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Seasonal Health Awareness
          </h3>
          <Carousel />
        </div>
      </section>

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

      <footer className="bg-gray-800 text-white text-center p-4">
          <div className="container mx-auto">
              {isLoading && <p>Connecting to server...</p>}
              {error && <p>❌ Could not connect to server.</p>}
              {data && <p>✅ Backend Status: {data.status}</p>}
          </div>
      </footer>
    </div>
  );
};

export default Home;