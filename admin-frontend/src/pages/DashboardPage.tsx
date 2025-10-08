import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Use the environment variable for the live backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const DashboardPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('Uploading and processing...');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Not authenticated. Please log in again.');
      }
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      // Use the full backend URL for the API call
      const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed.');
      }
      setStatusMessage(result.message);
    } catch (error: any) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          <form onSubmit={handleUpload}>
            <div className="mb-4">
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Select PDF File</label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedFile || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Upload and Update AI Knowledge'}
            </button>
          </form>
          {statusMessage && (
            <p className="mt-4 text-center text-sm text-gray-600">{statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;