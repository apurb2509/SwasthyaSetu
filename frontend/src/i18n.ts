import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navbar & Profile Dropdown
      "Chat Assistant": "Chat Assistant",
      "Admin Login": "Admin Login",
      "Login": "Login",
      "Logout": "Logout",
      "Profile": "Profile",
      // Home Page - Hero
      "HeroTitle1": "Trusted Health Information for a Stronger India",
      "HeroDescription1": "SwasthyaSetu fights misinformation by providing clear, reliable health advice and connecting you to vital government schemes.",
      "HeroTitle2": "Accessible to All, Everywhere",
      "HeroDescription2": "Reaching every village with crucial health updates and AI assistance via Web, SMS, and eventually WhatsApp.",
      "HeroTitle3": "Empowering Communities with Knowledge",
      "HeroDescription3": "Simplifying complex schemes like Ayushman Bharat, ensuring every citizen knows their health rights and benefits.",
      // Home Page - Features
      "Feature1": "Multilingual AI Chat",
      "Feature2": "SMS & WhatsApp Access",
      "Feature3": "Govt. Scheme Info",
      "Feature4": "Always Up-to-Date",
      // Other Sections
      "Seasonal Health Awareness": "Seasonal Health Awareness",
      "Get Daily Health Tips": "Get Daily Health Tips",
    }
  },
  hi: {
    translation: {
      // Navbar & Profile Dropdown
      "Chat Assistant": "चैट सहायक",
      "Admin Login": "एडमिन लॉगिन",
      "Login": "लॉगिन करें",
      "Logout": "लॉगआउट करें",
      "Profile": "प्रोफ़ाइल",
      // Home Page - Hero
      "HeroTitle1": "एक मजबूत भारत के लिए विश्वसनीय स्वास्थ्य जानकारी",
      "HeroDescription1": "स्वास्थ्य सेतु गलत सूचनाओं से लड़ता है, स्पष्ट, विश्वसनीय स्वास्थ्य सलाह प्रदान करता है और आपको महत्वपूर्ण सरकारी योजनाओं से जोड़ता है।",
      "HeroTitle2": "सभी के लिए, हर जगह सुलभ",
      "HeroDescription2": "वेब, एसएमएस और व्हाट्सएप के माध्यम से हर गांव तक महत्वपूर्ण स्वास्थ्य अपडेट और एआई सहायता पहुंचाना।",
      "HeroTitle3": "ज्ञान के साथ समुदायों को सशक्त बनाना",
      "HeroDescription3": "आयुष्मान भारत जैसी जटिल योजनाओं को सरल बनाना, यह सुनिश्चित करना कि प्रत्येक नागरिक अपने स्वास्थ्य अधिकारों और लाभों को जानता है।",
      // Home Page - Features
      "Feature1": "बहुभाषी एआई चैट",
      "Feature2": "एसएमएस और व्हाट्सएप एक्सेस",
      "Feature3": "सरकारी योजना की जानकारी",
      "Feature4": "हमेशा अद्यतन",
      // Other Sections
      "Seasonal Health Awareness": "मौसमी स्वास्थ्य जागरूकता",
      "Get Daily Health Tips": "दैनिक स्वास्थ्य सुझाव प्राप्त करें",
    }
  },
  bn: {
    translation: {
        // Navbar & Profile Dropdown
        "Chat Assistant": "চ্যাট সহকারী",
        "Admin Login": "অ্যাডমিন লগইন",
        "Login": "লগইন করুন",
        "Logout": "লগআউট করুন",
        "Profile": "প্রোফাইল",
        // Home Page - Hero
        "HeroTitle1": "একটি শক্তিশালী ভারতের জন্য বিশ্বস্ত স্বাস্থ্য তথ্য",
        "HeroDescription1": "স্বাস্থ্য সেতু ভুল তথ্যের বিরুদ্ধে লড়াই করে, স্পষ্ট, নির্ভরযোগ্য স্বাস্থ্য পরামর্শ প্রদান করে এবং আপনাকে গুরুত্বপূর্ণ সরকারি প্রকল্পের সাথে সংযুক্ত করে।",
        "HeroTitle2": "সবার জন্য, সর্বত্র অ্যাক্সেসযোগ্য",
        "HeroDescription2": "ওয়েব, এসএমএস এবং হোয়াটসঅ্যাপের মাধ্যমে প্রতিটি গ্রামে গুরুত্বপূর্ণ স্বাস্থ্য আপডেট এবং এআই সহায়তা পৌঁছানো।",
        "HeroTitle3": "জ্ঞান দিয়ে সম্প্রদায়কে শক্তিশালী করা",
        "HeroDescription3": "আয়ুষ্মান ভারতের মতো জটিল প্রকল্পগুলিকে সরল করা, প্রত্যেক নাগরিক যাতে তাদের স্বাস্থ্য অধিকার এবং সুবিধাগুলি জানে তা নিশ্চিত করা।",
        // Home Page - Features
        "Feature1": "বহুভাষিক এআই চ্যাট",
        "Feature2": "এসএমএস এবং হোয়াটসঅ্যাপ অ্যাক্সেস",
        "Feature3": "সরকারি প্রকল্পের তথ্য",
        "Feature4": "সর্বদা আপ-টু-ডেট",
        // Other Sections
        "Seasonal Health Awareness": "মৌসুমী স্বাস্থ্য সচেতনতা",
        "Get Daily Health Tips": "দৈনিক স্বাস্থ্য টিপস পান",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;