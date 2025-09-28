import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Seasonal Health Data for India ---
const seasonalDiseases = [
  // Jan - Feb (Winter / Dry Season)
  [
    { name: 'Common Cold & Cough', prevention: 'Avoid crowded places, wash hands often.', dos: ["Drink warm fluids", "Gargle with salt water", "Rest"], donts: ["Don't take antibiotics without prescription", "Avoid cold foods"] },
    { name: 'Asthma', prevention: 'Avoid dust and smoke, keep inhaler handy.', dos: ["Stay warm", "Do breathing exercises", "Follow doctor’s advice"], donts: ["Don't skip medications", "Avoid sudden temperature changes"] },
    { name: 'Dry Skin (Xerosis)', prevention: 'Moisturize regularly, use gentle soaps.', dos: ["Use lukewarm water for bathing", "Stay hydrated"], donts: ["Don't take very hot showers", "Avoid harsh soaps"] },
    { name: 'Pneumonia', prevention: 'Get vaccinated, maintain good hygiene.', dos: ["Take full course of antibiotics", "Rest", "Drink fluids"], donts: ["Don't smoke", "Avoid contact with sick people"] },
    { name: 'Scabies', prevention: 'Avoid skin-to-skin contact with infected person.', dos: ["Wash all clothes and linen in hot water", "Apply prescribed lotion"], donts: ["Don't share personal items", "Avoid scratching"] }
  ],
  // Mar - Apr (Spring / Pre-Summer)
  [
    { name: 'Chickenpox', prevention: 'Get vaccinated, avoid contact with infected persons.', dos: ["Keep nails short", "Apply calamine lotion", "Stay isolated"], donts: ["Don't scratch the blisters", "Avoid spicy food"] },
    { name: 'Measles', prevention: 'MMR vaccination is key.', dos: ["Isolate the patient", "Keep room dark to protect eyes", "Drink fluids"], donts: ["Don't stop isolation until doctor advises", "Avoid crowds"] },
    { name: 'Jaundice', prevention: 'Drink clean water, eat hygienic food.', dos: ["Take complete rest", "Eat boiled food", "Drink sugarcane juice"], donts: ["Don't eat oily or spicy food", "Avoid alcohol"] },
    { name: 'Stomach Flu (Gastroenteritis)', prevention: 'Wash hands, eat properly cooked food.', dos: ["Drink ORS", "Eat light food like khichdi", "Rest"], donts: ["Don't eat outside food", "Avoid sugary drinks"] },
    { name: 'Allergies', prevention: 'Identify and avoid allergens like pollen.', dos: ["Keep windows closed", "Use air purifiers", "Take anti-allergics"], donts: ["Don't self-medicate with steroids", "Avoid dusty areas"] }
  ],
  // May - Jun (Summer / Peak Heat)
  [
    { name: 'Heatstroke', prevention: 'Stay hydrated, avoid sun during peak hours.', dos: ["Move to a cool place", "Sip water", "Apply cool cloths"], donts: ["Don't drink sugary drinks", "Avoid strenuous activity"] },
    { name: 'Dehydration', prevention: 'Drink plenty of water, ORS, and coconut water.', dos: ["Recognize symptoms like dry mouth, dark urine", "Rest in shade"], donts: ["Don't ignore thirst", "Avoid caffeine and alcohol"] },
    { name: 'Food Poisoning', prevention: 'Eat fresh food, avoid stale street food.', dos: ["Stay hydrated", "Eat bland food", "Rest"], donts: ["Don't eat raw meat or eggs", "Avoid dairy products"] },
    { name: 'Typhoid', prevention: 'Get vaccinated, drink safe water.', dos: ["Take full course of antibiotics", "Eat a high-calorie diet", "Maintain hygiene"], donts: ["Don't eat from unhygienic places", "Avoid heavy foods"] },
    { name: 'Sunburn', prevention: 'Use sunscreen, wear protective clothing.', dos: ["Apply cool compresses", "Use aloe vera gel", "Stay hydrated"], donts: ["Don't peel the skin", "Avoid further sun exposure"] }
  ],
  // Jul - Aug (Monsoon)
  [
    { name: 'Malaria', prevention: 'Use mosquito nets, don\'t allow water to stagnate.', dos: ["Complete anti-malarial course", "Stay hydrated"], donts: ["Don't ignore fever", "Avoid mosquito bites at night"] },
    { name: 'Dengue Fever', prevention: 'Eliminate mosquito breeding sites, use repellent.', dos: ["Rest", "Drink fluids like papaya leaf juice", "Take paracetamol"], donts: ["Don't take aspirin or ibuprofen", "Avoid self-medication"] },
    { name: 'Cholera', prevention: 'Drink boiled or treated water, eat cooked food.', dos: ["Drink ORS", "Seek medical help immediately"], donts: ["Don't eat unhygienic street food", "Avoid contaminated water"] },
    { name: 'Leptospirosis', prevention: 'Avoid wading in floodwater, cover wounds.', dos: ["Take prophylactic antibiotics if exposed", "Consult doctor for fever"], donts: ["Don't walk barefoot in stagnant water", "Ignore cuts/wounds"] },
    { name: 'Fungal Infections', prevention: 'Keep skin dry, wear clean cotton clothes.', dos: ["Use anti-fungal powder", "Maintain personal hygiene"], donts: ["Don't wear tight or synthetic clothes", "Avoid sharing towels"] }
  ],
  // Sep - Oct (Post-Monsoon / Autumn)
  [
    { name: 'Chikungunya', prevention: 'Prevent mosquito bites, keep surroundings clean.', dos: ["Manage joint pain with doctor’s advice", "Drink fluids", "Rest"], donts: ["Don't allow water stagnation", "Avoid self-medication for pain"] },
    { name: 'Viral Fever', prevention: 'Boost immunity, avoid sick people.', dos: ["Take paracetamol for fever", "Rest", "Stay hydrated"], donts: ["Don't go to crowded places", "Avoid heavy work"] },
    { name: 'Eye Infections (Conjunctivitis)', prevention: 'Wash hands, don\'t touch eyes.', dos: ["Use prescribed eye drops", "Wear dark glasses", "Clean eyes gently"], donts: ["Don't share towels or handkerchiefs", "Avoid rubbing eyes"] },
    { name: 'Scrub Typhus', prevention: 'Avoid areas with mites like dense bushes.', dos: ["Use insect repellent", "Wear protective clothing", "Check body for bites"], donts: ["Don't ignore fever after visiting rural areas", "Self-medicate"] },
    { name: 'Hepatitis A', prevention: 'Get vaccinated, practice good hygiene.', dos: ["Eat a healthy diet", "Avoid alcohol", "Take adequate rest"], donts: ["Don't eat from contaminated sources", "Share utensils"] }
  ],
  // Nov - Dec (Pre-Winter)
  [
    { name: 'Influenza (Flu)', prevention: 'Get an annual flu shot, maintain hygiene.', dos: ["Rest", "Drink plenty of fluids", "Take antiviral drugs if prescribed"], donts: ["Don't go to work/school when sick", "Avoid touching your face"] },
    { name: 'Bronchitis', prevention: 'Avoid smoking, reduce exposure to pollutants.', dos: ["Use a humidifier", "Drink warm liquids", "Rest"], donts: ["Don't skip medication", "Avoid cold air"] },
    { name: 'Tonsillitis', prevention: 'Maintain oral hygiene, avoid cold drinks.', dos: ["Gargle with warm salt water", "Eat soft foods", "Take pain relievers"], donts: ["Don't strain your voice", "Avoid smoking"] },
    { name: 'Diphtheria', prevention: 'Ensure childhood vaccinations (DPT) are complete.', dos: ["Isolate the patient", "Take antibiotics as prescribed"], donts: ["Don't break isolation", "Miss vaccine doses"] },
    { name: 'Sinusitis', prevention: 'Manage allergies, stay hydrated.', dos: ["Use saline nasal spray", "Take steam inhalation", "Apply warm compresses"], donts: ["Don't fly when congested", "Avoid smoke and fumes"] }
  ]
];

// --- Carousel Component ---
const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diseases, setDiseases] = useState(seasonalDiseases[0]);
  const timeoutRef = useRef<number | null>(null);

  // Logic to select diseases based on the current month
  useEffect(() => {
    const currentMonth = new Date().getMonth(); // 0 for Jan, 1 for Feb, etc.
    const seasonIndex = Math.floor(currentMonth / 2);
    setDiseases(seasonalDiseases[seasonIndex]);
  }, []);

  const resetTimeout = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === diseases.length - 1 ? 0 : prevIndex + 1));
  }, [diseases.length]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(nextSlide, 4000); // Set to 4 seconds
    return () => resetTimeout();
  }, [currentIndex, nextSlide]);
  
  const goToSlide = (slideIndex: number) => setCurrentIndex(slideIndex);
  const goToPrev = () => setCurrentIndex((prev) => (prev === 0 ? diseases.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === diseases.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-4xl mx-auto relative group">
      <div className="w-full h-80 md:h-72 rounded-xl shadow-lg overflow-hidden relative bg-green-50/50 border border-green-200/50">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {diseases.map((disease) => (
            <div key={disease.name} className="w-full h-full flex-shrink-0 p-6 md:p-8">
              <div className="w-full h-full flex flex-col justify-center text-green-900">
                <h4 className="text-2xl font-bold mb-3">{disease.name}</h4>
                <p className="font-semibold mb-4 text-green-800">Prevention: <span className="font-normal">{disease.prevention}</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-bold mb-1 text-green-700">Do's:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {disease.dos.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1 text-red-700">Don'ts:</h5>
                    <ul className="list-disc list-inside space-y-1 text-red-900">
                      {disease.donts.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* --- MODIFIED ARROWS --- */}
      <button onClick={goToPrev} className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-12 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500">
        <span className="sr-only">Previous Slide</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-12 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500">
        <span className="sr-only">Next Slide</span>
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