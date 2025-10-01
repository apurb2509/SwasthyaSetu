import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Data structure for a health scheme
interface Scheme {
  name: string;
  description: string;
  objective: string;
  beneficiaries: string;
  benefits: string[];
}

// Data for various health schemes
const schemesData: Scheme[] = [
  {
    name: "Ayushman Bharat (PM-JAY)",
    description:
      "A flagship national health protection scheme providing health coverage to vulnerable families.",
    objective:
      "To provide financial protection against catastrophic health expenditures for secondary and tertiary care hospitalization.",
    beneficiaries:
      "Over 10.74 crore poor and vulnerable families (approximately 50 crore beneficiaries) identified from the SECC 2011 database.",
    benefits: [
      "Health insurance coverage of up to Rs. 5 lakh per family per year.",
      "Cashless and paperless access to healthcare services at empanelled public and private hospitals.",
      "Covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses, including diagnostics and medicines.",
      "Includes over 1,900 medical procedures across various specialties.",
    ],
  },
  {
    name: "Janani Shishu Suraksha Karyakaram (JSSK)",
    description:
      "An initiative to provide completely free and cashless services to pregnant women and sick newborns.",
    objective:
      "To eliminate all out-of-pocket expenses for both pregnant women and sick infants accessing public health institutions for delivery and treatment.",
    beneficiaries:
      "All pregnant women and sick newborns (up to 1 year of age) in both rural and urban areas of India.",
    benefits: [
      "Free and cashless delivery, including Caesarean section.",
      "Free drugs, consumables, and all necessary diagnostics during stay.",
      "Free provision of blood and a nutritious diet during stay in the health institution.",
      "Free transport from home to the health institution, between facilities in case of referral, and drop back home.",
    ],
  },
  {
    name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
    description:
      "A comprehensive child health screening and early intervention services program.",
    objective:
      "To screen children for 4 ‘D’s: Defects at birth, Deficiencies, Diseases, and Developmental delays including disabilities.",
    beneficiaries:
      "Children from birth up to 18 years of age in Anganwadi centers and government/government-aided schools.",
    benefits: [
      "Early identification and intervention for a comprehensive set of 30 common health conditions.",
      "Free treatment, including surgeries at the tertiary level, for all children diagnosed.",
      "Covers conditions like congenital heart disease, clubfoot, hearing impairment, vision problems, and anemia.",
    ],
  },
  {
    name: "Mission Indradhanush",
    description:
      "A universal immunization program to ensure full immunization for all children and pregnant women.",
    objective:
      "To rapidly accelerate the process of immunization to cover all children who are either unvaccinated or partially vaccinated.",
    beneficiaries: "Children under 2 years of age and all pregnant women.",
    benefits: [
      "Provides vaccination against 12 life-threatening, vaccine-preventable diseases.",
      "Conducted in special, targeted drives in districts and urban areas with low immunization coverage.",
      "Aims to achieve over 90% full immunization coverage across India and sustain it.",
    ],
  },
  {
    name: "National TB Elimination Program (NTEP)",
    description:
      "Formerly RNTCP, this is the national strategic plan for Tuberculosis elimination in India.",
    objective:
      "To achieve a rapid decline in the burden of TB, mortality, and morbidity, with a goal of eliminating TB in India by 2025.",
    beneficiaries:
      "All TB patients in India, regardless of whether they seek care in the public or private sector.",
    benefits: [
      "Free and high-quality diagnosis of TB, including molecular tests.",
      "Free and complete course of first-line and second-line anti-TB drugs.",
      "Nikshay Poshan Yojana: Financial support of Rs. 500 per month for nutritional needs during the entire treatment period.",
    ],
  },
  {
    name: "Janani Suraksha Yojana (JSY)",
    description:
      "A safe motherhood intervention under the National Health Mission.",
    objective:
      "To reduce maternal and neonatal mortality by promoting institutional delivery among pregnant women.",
    beneficiaries:
      "Pregnant women, especially those from low-performing states with low rates of institutional delivery.",
    benefits: [
      "Cash assistance to eligible pregnant women for giving birth in a government or accredited private health facility.",
      "Cash amount varies by geographical location (rural/urban) and state category (LPS/HPS).",
      "ASHA workers are incentivized for facilitating institutional deliveries.",
    ],
  },
];

const HealthSchemes: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [animateOut, setAnimateOut] = useState(false);
  const { t } = useTranslation();

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedScheme) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedScheme]);

  const handleOpen = (scheme: Scheme) => {
    setSelectedScheme(scheme);
  };

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setSelectedScheme(null);
      setAnimateOut(false);
    }, 350); // matches animation duration
  };

  return (
    <>
      {/* Grid of Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
        {schemesData.map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => handleOpen(scheme)}
            className="relative p-6 rounded-2xl shadow-lg text-left text-green-50
              animated-gradient backdrop-blur-xl border border-white/20
              transform transition-all duration-500 
              hover:scale-105 hover:shadow-2xl overflow-hidden"
          >
            {/* glossy overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-20 hover:opacity-30 transition duration-500 pointer-events-none"></div>

            {/* shiny diagonal shimmer */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] 
              bg-gradient-to-r from-white/30 to-transparent 
              rotate-45 animate-shimmer pointer-events-none"></div>

            <h4 className="font-bold text-lg relative z-10">{scheme.name}</h4>
            <p className="mt-2 text-sm relative z-10">{scheme.description}</p>
          </button>
        ))}
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <div
            className={`bg-white/95 max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-green-200 transform transition-all duration-300 origin-top-right ${
              animateOut
                ? "opacity-0 translate-y-6"
                : "opacity-100 translate-y-0 animate-openBox"
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <header className="p-5 flex justify-between items-center border-b bg-gradient-to-r from-green-600 to-green-700 rounded-t-2xl sticky top-0 text-white shadow-md">
              <h3 className="text-xl font-bold">{selectedScheme.name}</h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 text-3xl font-light leading-none"
              >
                &times;
              </button>
            </header>
            <div className="p-6 overflow-y-auto space-y-5 text-gray-700">
              <div>
                <h4 className="font-semibold text-green-700">Objective</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedScheme.objective}
                </p>
              </div>
              <div className="border-t border-green-100 my-3"></div>
              <div>
                <h4 className="font-semibold text-green-700">
                  Target Beneficiaries
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedScheme.beneficiaries}
                </p>
              </div>
              <div className="border-t border-green-100 my-3"></div>
              <div>
                <h4 className="font-semibold text-green-700">Key Benefits</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mt-2 pl-2">
                  {selectedScheme.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom keyframes */}
      <style>
        {`
          @keyframes openBox {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-openBox {
            animation: openBox 0.35s ease-out;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-gradient {
            background: linear-gradient(#1f7039, #247b40, #218f46, #26b254, #218f46, #247b40, #1f7039);
            background-size: 400% 400%;
            animation: gradientMove 8s ease infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
          .animate-shimmer {
            animation: shimmer 6s infinite linear;
          }
        `}
      </style>
    </>
  );
};

export default HealthSchemes;
