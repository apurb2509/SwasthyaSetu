import React, { useState } from 'react';

const PhoneForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [useForWhatsApp, setUseForWhatsApp] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    console.log({
      phone: `+91${phoneNumber}`,
      whatsapp: useForWhatsApp,
    });
    
    setSubmitted(true);
    setPhoneNumber('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center border-2 border-gray-200 rounded-lg focus-within:border-green-500 transition-colors">
        <div className="bg-gray-100 p-3 text-gray-600 font-semibold">+91</div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
          maxLength={10}
          className="w-full p-3 outline-none"
          placeholder="Enter your 10-digit mobile number"
          aria-label="Mobile number"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <div className="mt-4 flex items-center justify-center">
        <input
          type="checkbox"
          id="whatsapp-check"
          checked={useForWhatsApp}
          onChange={() => setUseForWhatsApp(!useForWhatsApp)}
          className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="whatsapp-check" className="ml-2 block text-sm text-gray-700">
          Use same number for WhatsApp tips
        </label>
      </div>

      <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors mt-6">
        Subscribe for Free
      </button>

      {submitted && <p className="text-green-700 font-semibold text-sm mt-4">Thank you for subscribing!</p>}
    </form>
  );
};

export default PhoneForm;