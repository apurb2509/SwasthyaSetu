import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">About SwasthyaSetu</h1>
        <p className="text-lg text-gray-600 text-center mb-12">Building a bridge to better health for rural India.</p>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Our Mission</h2>
            <p>Our mission is to combat health misinformation and improve healthcare outcomes in rural and underserved communities across India. We believe that access to clear, reliable, and verified health information is a fundamental right. By leveraging AI and accessible technology like SMS, we aim to empower every individual to make informed decisions about their health and well-being.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">What We Do</h2>
            <p>SwasthyaSetu provides an AI-powered chatbot, SwasthyaDoot, that answers health-related questions in multiple languages. We focus on delivering preventive healthcare information, details on government schemes like Ayushman Bharat, and seasonal health alerts. Our platform is designed for everyone, accessible via a web application for smartphone users and a simple SMS service for those with basic phones.</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Our Vision</h2>
            <p>We envision a future where geographical location and lack of internet access are no longer barriers to essential health knowledge. By providing a trustworthy and easy-to-use platform, we hope to foster healthier communities, increase the uptake of government health initiatives, and ultimately save lives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
