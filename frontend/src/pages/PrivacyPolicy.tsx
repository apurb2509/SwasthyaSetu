import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Privacy Policy</h1>
        <div className="space-y-6">
          <p>Your privacy is important to us. This policy explains what information we collect and how we use it.</p>
          
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Phone Number:</strong> We collect your phone number when you register for our service to provide OTP authentication and to send you SMS-based health tips and chat responses.</li>
              <li><strong>Chat History:</strong> Your conversations with our AI assistant, SwasthyaDoot, are saved to provide a continuous experience and help us improve our service.</li>
              <li><strong>Uploaded Documents (Admins):</strong> Administrators and health workers may upload documents to our system to expand the AI's knowledge base. These documents should not contain personal identifiable information.</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">How We Use Your Information</h2>
            <p>Your information is used solely to provide and improve the SwasthyaSetu service. We do not sell or share your personal data with third-party marketers. Anonymized query data may be used for research purposes to identify health trends and improve public health awareness.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Data Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access or disclosure. All data is stored securely in our database, and access is restricted.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
