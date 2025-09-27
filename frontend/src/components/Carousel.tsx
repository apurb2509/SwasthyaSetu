import React, { useState, useEffect, useRef } from 'react';

const diseases = [
  {
    name: 'Dengue Fever',
    prevention: 'Eliminate mosquito breeding sites. Use repellent.',
    dos: ["Rest", "Drink fluids", "Take paracetamol for fever"],
    donts: ["Don't take aspirin or ibuprofen", "Avoid self-medication"],
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  {
    name: 'Malaria',
    prevention: 'Use mosquito nets. Take preventive medicine in high-risk areas.',
    dos: ["Complete the full course of anti-malarial drugs", "Stay hydrated"],
    donts: ["Don't ignore fever", "Avoid mosquito bites, especially at night"],
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  {
    name: 'Heatstroke',
    prevention: 'Stay hydrated. Avoid sun during peak hours. Wear light clothing.',
    dos: ["Move to a cool place", "Sip water", "Apply cool cloths to the skin"],
    donts: ["Don't drink sugary or alcoholic drinks", "Avoid strenuous activity in heat"],
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  {
    name: 'Cholera',
    prevention: 'Drink safe, boiled or treated water. Eat properly cooked food.',
    dos: ["Drink Oral Rehydration Solution (ORS)", "Seek medical help immediately"],
    donts: ["Don't eat raw or unhygienic street food", "Avoid contaminated water"],
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  }
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === diseases.length - 1 ? 0 : prevIndex + 1
        ),
      6000 // Change slide every 6 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const goToPrev = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? diseases.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === diseases.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };


  return (
    <div className="max-w-4xl mx-auto relative group" onMouseEnter={resetTimeout}>
      <div className="w-full h-80 md:h-72 rounded-lg shadow-lg overflow-hidden relative">
        {diseases.map((disease, index) => (
          <div
            key={disease.name}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`w-full h-full p-6 md:p-8 flex flex-col justify-center ${disease.bgColor} ${disease.textColor}`}>
              <h4 className="text-2xl font-bold mb-3">{disease.name}</h4>
              <p className="font-semibold mb-3">Prevention: <span className="font-normal">{disease.prevention}</span></p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-bold mb-1">Do's:</h5>
                  <ul className="list-disc list-inside">
                    {disease.dos.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-1">Don'ts:</h5>
                  <ul className="list-disc list-inside">
                    {disease.donts.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Left Arrow */}
      <button onClick={goToPrev} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-12 p-2 bg-white/50 group-hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Right Arrow */}
      <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-12 p-2 bg-white/50 group-hover:bg-white rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="flex justify-center pt-4">
        {diseases.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full mx-1 transition-colors ${currentIndex === slideIndex ? 'bg-green-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;