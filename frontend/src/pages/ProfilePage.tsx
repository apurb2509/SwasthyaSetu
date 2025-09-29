import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { session } = useAuth();
  const { i18n } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State for form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    let isMounted = true;

    async function getProfile() {
      if (!session) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select(`name, age, city, pincode, language_preference`)
        .eq('id', session.user.id)
        .single();

      if (isMounted) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setName(data.name || '');
          setAge(data.age !== 0 ? String(data.age) : '');
          setCity(data.city || '');
          setPincode(data.pincode || '');
          setLanguage(data.language_preference || 'en');
          i18n.changeLanguage(data.language_preference || 'en');
        }
        setLoading(false);
      }
    }

    getProfile();

    return () => {
      isMounted = false;
    };
  }, [session, i18n]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);
    setMessage('');

    const updates = {
      id: session.user.id,
      name,
      age: parseInt(age, 10),
      city,
      pincode,
      language_preference: language,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Profile updated successfully!');
      i18n.changeLanguage(language);
    }
    setLoading(false);

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Your Profile</h1>
        {loading ? (
            <p className="text-center">Loading your profile...</p>
        ) : (
            <div className="bg-white p-8 rounded-lg shadow-md border">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name (Compulsory)</label>
                <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age (Compulsory)</label>
                    <input
                    id="age"
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City (Compulsory)</label>
                    <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode (Optional)</label>
                    <input
                    id="pincode"
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">Preferred Language</label>
                    <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    </select>
                </div>
                </div>
                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
                </div>
                {message && <p className="text-sm text-green-600 text-center">{message}</p>}
            </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;