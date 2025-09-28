import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-red-700 mb-4">Important Medical Disclaimer</h1>
        <div className="p-8 border-4 border-red-200 rounded-lg bg-red-50 text-red-800 space-y-4 leading-relaxed">
          <p className="text-lg font-bold">This Service is Not a Substitute for Professional Medical Advice.</p>
          <p>The information provided by SwasthyaSetu and its AI assistant, SwasthyaDoot, is for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
          <p><strong>Always seek the advice of your physician or another qualified health provider</strong> with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from this service.</p>
          <p>If you think you may have a medical emergency, call your doctor or emergency services immediately. SwasthyaSetu does not recommend or endorse any specific tests, physicians, products, procedures, or opinions.</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
