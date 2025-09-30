import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const PhoneForm: React.FC = () => {
  const [smsNumber, setSmsNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [useSameNumber, setUseSameNumber] = useState(false);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useSameNumber) {
      setWhatsappNumber(smsNumber);
    } else {
      setWhatsappNumber('');
    }
  }, [useSameNumber, smsNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!/^\d{10}$/.test(smsNumber)) {
      setError('Please enter a valid 10-digit SMS number.');
      setLoading(false);
      return;
    }

    try {
      const formattedPhoneNumber = `+91${smsNumber}`;
      
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({ phone_number: formattedPhoneNumber });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('This phone number is already subscribed for SMS tips.');
        }
        throw insertError;
      }
      
      setSuccessMessage('Thank you for subscribing!');
      setSmsNumber('');
      setWhatsappNumber('');
      setUseSameNumber(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="space-y-4">
        {/* SMS Number Input */}
        <div>
          <label htmlFor="sms-number" className="block text-sm font-semibold text-gray-700 text-left mb-1">SMS Notifications</label>
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-300 shadow-sm">
            <div className="bg-gray-100 p-3 text-gray-600 font-semibold border-r-2 border-gray-200">+91</div>
            <input
              id="sms-number"
              type="tel"
              value={smsNumber}
              onChange={(e) => setSmsNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              className="w-full p-3 outline-none appearance-none"
              placeholder="10-digit number for SMS"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="pt-2 flex items-center justify-center">
            <input
            type="checkbox"
            id="whatsapp-check"
            checked={useSameNumber}
            onChange={(e) => setUseSameNumber(e.target.checked)}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="whatsapp-check" className="ml-2 block text-sm text-gray-700">
            Use same number for WhatsApp (coming soon)
            </label>
        </div>

        {/* WhatsApp Number Input */}
        <div>
          <label htmlFor="whatsapp-number" className="block text-sm font-semibold text-gray-700 text-left mb-1">WhatsApp Notifications (Optional)</label>
          <div className="flex items-center bg-white border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-200 transition-all duration-300 shadow-sm">
            <div className="bg-gray-100 p-3 text-gray-600 font-semibold border-r-2 border-gray-200">+91</div>
            <input
              id="whatsapp-number"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              className="w-full p-3 outline-none appearance-none disabled:bg-gray-50"
              placeholder="10-digit number for WhatsApp"
              disabled={loading || useSameNumber}
            />
          </div>
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {successMessage && <p className="text-green-700 font-semibold text-sm mt-4">{successMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-6 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 hover:brightness-110 bg-gradient-to-r from-green-500 to-teal-500 text-white"
      >
        {loading ? 'Subscribing...' : 'Subscribe for Free'}
      </button>
    </form>
  );
};

export default PhoneForm;