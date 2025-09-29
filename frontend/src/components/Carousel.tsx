import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- NEW SVG Icons for a more professional card layout ---
const SymptomsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5-2.5-6.5s-7 3-7 7a8 8 0 0011.657 6.657l6.343 6.343-1.414 1.414-6.343-6.343z" /></svg>;
const PreventionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const DosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const DontsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


// --- EXPANDED Seasonal Health Data with Symptoms ---
const seasonalDiseases = [
  // Jan - Feb (Winter)
  [
    { name: 'Common Cold & Cough', symptoms: ['Runny nose', 'Sore throat', 'Sneezing'], prevention: 'Avoid crowded places, wash hands often.', dos: ["Drink warm fluids", "Gargle", "Rest"], donts: ["Take antibiotics without prescription", "Avoid cold foods"] },
    { name: 'Asthma', symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness'], prevention: 'Avoid dust and smoke, keep inhaler handy.', dos: ["Stay warm", "Breathing exercises"], donts: ["Skip medications", "Sudden temperature changes"] },
    { name: 'Dry Skin (Xerosis)', symptoms: ['Itching', 'Flaking skin', 'Redness'], prevention: 'Moisturize regularly, use gentle soaps.', dos: ["Use lukewarm water", "Stay hydrated"], donts: ["Take very hot showers", "Use harsh soaps"] },
    { name: 'Pneumonia', symptoms: ['Fever with chills', 'Cough with phlegm', 'Difficulty breathing'], prevention: 'Get vaccinated, maintain good hygiene.', dos: ["Take full antibiotics", "Rest", "Drink fluids"], donts: ["Smoke", "Contact sick people"] },
    { name: 'Scabies', symptoms: ['Intense itching', 'Pimple-like rash', 'Sores'], prevention: 'Avoid skin-to-skin contact with infected person.', dos: ["Wash all clothes in hot water", "Apply prescribed lotion"], donts: ["Share personal items", "Scratch affected area"] }
  ],
  // Mar - Apr (Spring)
  [
    { name: 'Chickenpox', symptoms: ['Itchy blister-like rash', 'Fever', 'Tiredness'], prevention: 'Get vaccinated, avoid contact with infected persons.', dos: ["Keep nails short", "Apply calamine lotion"], donts: ["Scratch blisters", "Eat spicy food"] },
    { name: 'Measles', symptoms: ['High fever', 'Cough', 'Rash'], prevention: 'MMR vaccination is key.', dos: ["Isolate patient", "Keep room dark", "Drink fluids"], donts: ["Stop isolation early", "Go to crowds"] },
    { name: 'Jaundice', symptoms: ['Yellow skin and eyes', 'Dark urine', 'Fatigue'], prevention: 'Drink clean water, eat hygienic food.', dos: ["Take complete rest", "Eat boiled food"], donts: ["Eat oily/spicy food", "Consume alcohol"] },
    { name: 'Gastroenteritis', symptoms: ['Diarrhea', 'Vomiting', 'Stomach cramps'], prevention: 'Wash hands, eat properly cooked food.', dos: ["Drink ORS", "Eat light food like khichdi"], donts: ["Eat outside food", "Drink sugary drinks"] },
    { name: 'Allergies', symptoms: ['Sneezing', 'Watery eyes', 'Runny nose'], prevention: 'Identify and avoid allergens like pollen.', dos: ["Keep windows closed", "Use air purifiers"], donts: ["Self-medicate with steroids", "Go to dusty areas"] }
  ],
  // May - Jun (Summer)
  [
    { name: 'Heatstroke', symptoms: ['High body temperature', 'Confusion', 'No sweating'], prevention: 'Stay hydrated, avoid sun during peak hours.', dos: ["Move to a cool place", "Sip water", "Apply cool cloths"], donts: ["Drink sugary drinks", "Strenuous activity in heat"] },
    { name: 'Dehydration', symptoms: ['Dry mouth', 'Dark urine', 'Dizziness'], prevention: 'Drink plenty of water, ORS, and coconut water.', dos: ["Recognize early symptoms", "Rest in shade"], donts: ["Ignore thirst", "Drink caffeine/alcohol"] },
    { name: 'Food Poisoning', symptoms: ['Nausea', 'Vomiting', 'Diarrhea'], prevention: 'Eat fresh food, avoid stale street food.', dos: ["Stay hydrated", "Eat bland food", "Rest"], donts: ["Eat raw meat/eggs", "Consume unpasteurized dairy"] },
    { name: 'Typhoid', symptoms: ['Prolonged high fever', 'Headache', 'Stomach pain'], prevention: 'Get vaccinated, drink safe water.', dos: ["Take full antibiotics", "High-calorie diet"], donts: ["Eat from unhygienic places", "Eat heavy foods"] },
    { name: 'Sunburn', symptoms: ['Red skin', 'Pain and tenderness', 'Blisters'], prevention: 'Use sunscreen, wear protective clothing.', dos: ["Apply cool compresses", "Use aloe vera gel"], donts: ["Peel the skin", "Expose skin to more sun"] }
  ],
  // Jul - Aug (Monsoon)
  [
    { name: 'Malaria', symptoms: ['High fever with chills', 'Headache', 'Muscle pain'], prevention: 'Use mosquito nets, don\'t allow water to stagnate.', dos: ["Complete anti-malarial course", "Stay hydrated"], donts: ["Ignore fever", "Allow mosquito breeding"] },
    { name: 'Dengue Fever', symptoms: ['Sudden high fever', 'Severe headache', 'Pain behind eyes'], prevention: 'Eliminate mosquito breeding sites, use repellent.', dos: ["Rest", "Papaya leaf juice", "Paracetamol"], donts: ["Take aspirin/ibuprofen", "Self-medicate"] },
    { name: 'Cholera', symptoms: ['Watery diarrhea', 'Vomiting', 'Leg cramps'], prevention: 'Drink boiled or treated water, eat cooked food.', dos: ["Drink ORS", "Seek medical help immediately"], donts: ["Eat unhygienic street food", "Drink contaminated water"] },
    { name: 'Leptospirosis', symptoms: ['High fever', 'Headache', 'Muscle aches'], prevention: 'Avoid wading in floodwater, cover wounds.', dos: ["Take prophylactic antibiotics", "Consult doctor"], donts: ["Walk barefoot in stagnant water", "Ignore wounds"] },
    { name: 'Fungal Infections', symptoms: ['Itchy rash', 'Ring-shaped patches', 'Skin peeling'], prevention: 'Keep skin dry, wear clean cotton clothes.', dos: ["Use anti-fungal powder", "Maintain hygiene"], donts: ["Wear tight clothes", "Share towels"] }
  ],
  // Sep - Oct (Post-Monsoon)
  [
    { name: 'Chikungunya', symptoms: ['Severe joint pain', 'Fever', 'Rash'], prevention: 'Prevent mosquito bites, keep surroundings clean.', dos: ["Manage joint pain", "Drink fluids", "Rest"], donts: ["Allow water stagnation", "Self-medicate for pain"] },
    { name: 'Viral Fever', symptoms: ['High temperature', 'Body aches', 'Fatigue'], prevention: 'Boost immunity, avoid sick people.', dos: ["Take paracetamol", "Rest", "Stay hydrated"], donts: ["Go to crowded places", "Do heavy work"] },
    { name: 'Conjunctivitis', symptoms: ['Red/pink eyes', 'Itching and burning', 'Discharge'], prevention: 'Wash hands, don\'t touch eyes.', dos: ["Use prescribed eye drops", "Wear dark glasses"], donts: ["Share towels", "Rub eyes"] },
    { name: 'Scrub Typhus', symptoms: ['Fever and chills', 'Headache', 'Dark, scab-like lesion'], prevention: 'Avoid areas with mites like dense bushes.', dos: ["Use insect repellent", "Wear protective clothing"], donts: ["Ignore fever after visiting rural areas", "Self-medicate"] },
    { name: 'Hepatitis A', symptoms: ['Fatigue', 'Nausea', 'Jaundice'], prevention: 'Get vaccinated, practice good hygiene.', dos: ["Eat a healthy diet", "Avoid alcohol", "Rest"], donts: ["Eat from contaminated sources", "Share utensils"] }
  ],
  // Nov - Dec (Pre-Winter)
  [
    { name: 'Influenza (Flu)', symptoms: ['Fever', 'Aching muscles', 'Dry cough'], prevention: 'Get an annual flu shot, maintain hygiene.', dos: ["Rest", "Drink plenty of fluids", "Take antivirals if prescribed"], donts: ["Go to work/school sick", "Touch your face"] },
    { name: 'Bronchitis', symptoms: ['Persistent cough', 'Mucus production', 'Chest discomfort'], prevention: 'Avoid smoking, reduce exposure to pollutants.', dos: ["Use a humidifier", "Drink warm liquids"], donts: ["Skip medication", "Expose to cold air"] },
    { name: 'Tonsillitis', symptoms: ['Sore throat', 'Swollen tonsils', 'Difficulty swallowing'], prevention: 'Maintain oral hygiene, avoid cold drinks.', dos: ["Gargle warm salt water", "Eat soft foods"], donts: ["Strain your voice", "Smoke"] },
    { name: 'Diphtheria', symptoms: ['Thick gray coating in throat', 'Sore throat', 'Swollen glands'], prevention: 'Ensure childhood vaccinations (DPT) are complete.', dos: ["Isolate patient", "Take antibiotics"], donts: ["Break isolation", "Miss vaccine doses"] },
    { name: 'Sinusitis', symptoms: ['Facial pain/pressure', 'Nasal congestion', 'Headache'], prevention: 'Manage allergies, stay hydrated.', dos: ["Use saline nasal spray", "Steam inhalation"], donts: ["Fly when congested", "Expose to smoke/fumes"] }
  ]
];

// --- Carousel Component ---
const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diseases, setDiseases] = useState(seasonalDiseases[0]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const seasonIndex = Math.floor(currentMonth / 2);
    setDiseases(seasonalDiseases[seasonIndex]);
  }, []);

  const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  const nextSlide = useCallback(() => { setCurrentIndex((prevIndex) => (prevIndex === diseases.length - 1 ? 0 : prevIndex + 1)); }, [diseases.length]);
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(nextSlide, 4000);
    return () => resetTimeout();
  }, [currentIndex, nextSlide]);
  
  const goToSlide = (slideIndex: number) => setCurrentIndex(slideIndex);
  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? diseases.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === diseases.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-4xl mx-auto relative group">
      <div className="w-full h-auto md:h-96 rounded-2xl shadow-2xl overflow-hidden relative bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 border-2 border-white">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {diseases.map((disease) => (
            <div key={disease.name} className="w-full h-full flex-shrink-0 p-6 md:p-8">
              <div className="w-full h-full flex flex-col text-gray-800">
                <h4 className="text-2xl md:text-3xl font-bold text-green-800 mb-4 text-center">{disease.name}</h4>
                
                <div className="text-sm font-semibold mb-4 bg-blue-100/50 text-blue-800 p-3 rounded-lg flex items-center"><PreventionIcon /> {disease.prevention}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm flex-grow">
                  <div>
                    <h5 className="font-bold mb-2 text-gray-600 flex items-center"><SymptomsIcon /> Symptoms</h5>
                    <ul className="list-disc list-inside space-y-1 pl-4 text-gray-700">
                      {disease.symptoms.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="grid grid-rows-2 gap-y-3">
                    <div>
                      <h5 className="font-bold mb-2 text-green-700 flex items-center"><DosIcon /> Do's</h5>
                      <ul className="list-disc list-inside space-y-1 pl-4 text-green-900">
                        {disease.dos.map(item => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold mb-2 text-red-700 flex items-center"><DontsIcon /> Don'ts</h5>
                      <ul className="list-disc list-inside space-y-1 pl-4 text-red-900">
                        {disease.donts.map(item => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={goToPrev} className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-500">
        <span className="sr-only">Previous Slide</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-500">
        <span className="sr-only">Next Slide</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="flex justify-center pt-5">
        {diseases.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-2.5 h-2.5 rounded-full mx-1.5 transition-all duration-300 ${currentIndex === slideIndex ? 'bg-green-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${slideIndex + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;    