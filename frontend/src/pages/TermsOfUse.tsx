import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">Terms of Use</h1>
        <div className="space-y-6">
          <p>By using the SwasthyaSetu platform, you agree to these terms.</p>

          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Acceptable Use</h2>
            <p>You agree not to use this service for any unlawful purpose or to send malicious or spam messages. The information provided is for educational purposes only.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">Service Limitations</h2>
            <p>The service is provided "as is." We do not guarantee 100% accuracy or availability. The AI's knowledge is limited to the documents uploaded by our administrators and should not be considered exhaustive.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-3">User Conduct</h2>
            <p>You are responsible for your interactions with the chatbot. Do not share sensitive personal health information that you are not comfortable with being stored in your chat history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
