import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import Carousel from '../components/Carousel';
import PhoneForm from '../components/PhoneForm';

// --- Icon Components (unchanged) ---
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const SmsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const SchemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

// --- Data for Components ---
const heroSlides = [
  { title: "Trusted Health Information for a Stronger India", description: "SwasthyaSetu fights misinformation by providing clear, reliable health advice and connecting you to vital government schemes." },
  { title: "Accessible to All, Everywhere", description: "Reaching every village with crucial health updates and AI assistance via Web, SMS, and eventually WhatsApp." },
  { title: "Empowering Communities with Knowledge", description: "Simplifying complex schemes like Ayushman Bharat, ensuring every citizen knows their health rights and benefits." }
];
const features = [
  { title: "Multilingual AI Chat", icon: <ChatIcon />, backContent: "Ask health questions in your local language and get instant, reliable answers from our AI." },
  { title: "SMS & WhatsApp Access", icon: <SmsIcon />, backContent: "Receive crucial health information directly on your basic mobile phone, no internet required." },
  { title: "Govt. Scheme Info", icon: <SchemeIcon />, backContent: "Understand the benefits of government programs like Ayushman Bharat in simple, clear terms." },
  { title: "Always Up-to-Date", icon: <UploadIcon />, backContent: "Information is continuously updated by verified health workers and NGOs for local relevance." }
];
const backgroundImages = Array.from({ length: 9 }, (_, i) => `/images/heroimage_${i + 1}.jpg`);

const fetchHealthStatus = async () => {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Home: React.FC = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['healthCheck'], queryFn: fetchHealthStatus, retry: false });
  const [currentTextSlide, setCurrentTextSlide] = useState(0);
  const textTimeoutRef = useRef<number | null>(null);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const bgTimer = setTimeout(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearTimeout(bgTimer);
  }, [currentBgIndex]);

  const resetTextTimeout = () => { if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current); };
  const nextTextSlide = useCallback(() => { setCurrentTextSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1)); }, []);
  useEffect(() => {
    resetTextTimeout();
    textTimeoutRef.current = window.setTimeout(nextTextSlide, 6000);
    return () => resetTextTimeout();
  }, [currentTextSlide, nextTextSlide]);
  const goToPrevTextSlide = () => { setCurrentTextSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1)); };
  const goToNextTextSlide = () => { setCurrentTextSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1)); };

  return (
    <div>
      <section className="relative w-full aspect-video bg-gray-800">
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{ backgroundImage: `url(${img})`, opacity: index === currentBgIndex ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="relative z-10 w-full h-full flex flex-col justify-start items-center pt-16 md:pt-24 p-4 bg-black/30 backdrop-blur-sm text-white">
          <div className="container mx-auto text-center">
            
            {/* --- NEW TRANSPARENT LOGO --- */}
            <img 
              src="/transparent_swasthyasetu_logo.png" 
              alt="SwasthyaSetu Transparent Logo" 
              className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 opacity-75"
            />

            <div className="relative max-w-4xl mx-auto mb-8">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentTextSlide * 100}%)` }}
                >
                  {heroSlides.map((slide, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <div className="min-h-36 md:min-h-40 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                          {slide.title}
                        </h2>
                        <p className="text-md md:text-xl text-gray-200 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={goToPrevTextSlide} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-10 p-2 bg-white/30 hover:bg-white/50 rounded-full shadow-md transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={goToNextTextSlide} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-10 p-2 bg-white/30 hover:bg-white/50 rounded-full shadow-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="card-container h-48 transform transition-transform duration-300 hover:scale-105">
                  <div className="card-inner">
                    <div className="card-front p-4 rounded-lg shadow-lg bg-white/30 backdrop-blur-md border border-white/20">
                      <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/80 mx-auto mb-3 shadow-inner">
                        {feature.icon}
                      </div>
                      <h4 className="font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">{feature.title}</h4>
                    </div>
                    <div className="card-back p-4 rounded-lg shadow-lg bg-green-600/90 backdrop-blur-md border border-white/20">
                      <p className="text-sm font-semibold text-white">{feature.backContent}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* Other sections remain unchanged */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
            Seasonal Health Awareness
          </h3>
          <Carousel />
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-green-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">Our Vision and Goals</h3>
            <p className="text-gray-600 mt-2">Building a healthier, more informed rural India, one query at a time.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="font-bold text-lg text-gray-800">Tackle Misinformation with Facts</h4>
              <p className="mt-1 text-gray-600">Our primary goal is to replace harmful rumors on social media with verified, easy-to-understand health information from trusted sources like the WHO and ICMR.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="font-bold text-lg text-gray-800">Ensure Digital Inclusion</h4>
              <p className="mt-1 text-gray-600">We are committed to bridging the digital divide by providing equal access to information for both smartphone users via our web app and basic phone users through SMS.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="font-bold text-lg text-gray-800">Simplify Government Health Schemes</h4>
              <p className="mt-1 text-gray-600">We aim to demystify complex but vital government schemes, ensuring every citizen understands their entitlements and how to access them.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="font-bold text-lg text-gray-800">Promote Preventive Healthcare</h4>
              <p className="mt-1 text-gray-600">Through daily tips and seasonal awareness, we focus on prevention as the most effective strategy to reduce the burden of disease in rural communities.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
              <h4 className="font-bold text-lg text-gray-800">Empower Local Health Workers</h4>
              <p className="mt-1 text-gray-600">The admin dashboard serves as a tool for local NGOs and ASHA workers, allowing them to keep the AI's knowledge base updated with the latest local health advisories.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-16 bg-white">
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