import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [loginMode, setLoginMode] = useState<'select' | 'user'>('select');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formattedPhone = `+91${phone}`;
    if (!/^\+91\d{10}$/.test(formattedPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
      if (error) throw error;
      setOtpSent(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP.');
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formattedPhone = `+91${phone}`;
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: 'sms' });
      if (error) throw error;
      navigate('/profile'); // Redirect to profile page on first login/success
    } catch (error: any) {
      setError(error.message || 'Failed to verify OTP.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {loginMode === 'select' && (
          <div className="bg-white p-8 rounded-lg shadow-md border text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-gray-600 mb-6">Are you a general user or an administrator?</p>
            <div className="space-y-4">
              <button
                onClick={() => setLoginMode('user')}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                Continue as a User
              </button>
              <a
                href={adminPanelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-lg"
              >
                Go to Admin Login
              </a>
            </div>
          </div>
        )}

        {loginMode === 'user' && (
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <button onClick={() => setLoginMode('select')} className="text-sm text-green-600 hover:underline mb-6">
              &larr; Back to role selection
            </button>
            {!otpSent ? (
              <form className="space-y-6" onSubmit={handlePhoneSubmit}>
                <h2 className="text-center text-2xl font-bold text-gray-900">User Sign In</h2>
                <p className="text-center text-sm text-gray-600">Enter your phone number to receive a one-time password (OTP).</p>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone number</label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <span className="bg-gray-100 p-3 text-gray-600 font-semibold">+91</span>
                    <input id="phone" name="phone" type="tel" required className="w-full px-3 py-3 border-0 placeholder-gray-500 focus:outline-none" placeholder="10-digit mobile number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} disabled={loading} />
                  </div>
                </div>
                <div>
                  <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleOtpSubmit}>
                <h2 className="text-center text-2xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-center text-sm text-gray-600">Enter the 6-digit code sent to +91{phone}</p>
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <input id="otp" name="otp" type="text" maxLength={6} required className="w-full px-3 py-3 border border-gray-300 rounded-md text-center tracking-[1em]" placeholder="------" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} disabled={loading} />
                </div>
                <div>
                  <button type="submit" className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </div>
              </form>
            )}
            {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;