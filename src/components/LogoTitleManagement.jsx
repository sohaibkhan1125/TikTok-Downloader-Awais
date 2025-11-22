import React, { useState, useEffect } from 'react';
import { saveSetting, getSetting, isLocalStorageAvailable } from '../utils/localStorageHelper';

const LogoTitleManagement = () => {
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteLogo, setWebsiteLogo] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setError('LocalStorage not available in this browser');
      return;
    }

    // Load existing settings
    const savedTitle = getSetting('websiteTitle', 'TikSaver - Download TikTok Videos');
    const savedLogo = getSetting('websiteLogo', '');
    
    setWebsiteTitle(savedTitle);
    setWebsiteLogo(savedLogo);
    setLogoPreview(savedLogo);
  }, []);

  const handleTitleChange = (e) => {
    setWebsiteTitle(e.target.value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPG, JPEG, or SVG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      setWebsiteLogo(reader.result);
      setError(null);
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteLogo = () => {
    setWebsiteLogo('');
    setLogoPreview('');
    setError(null);
  };

  const handleSave = async () => {
    if (!isLocalStorageAvailable()) {
      setError('LocalStorage not available');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    try {
      // Save title
      const titleSaved = saveSetting('websiteTitle', websiteTitle);
      
      // Save logo
      const logoSaved = saveSetting('websiteLogo', websiteLogo);

      if (titleSaved && logoSaved) {
        // Update browser title
        document.title = websiteTitle;
        
        // Trigger custom storage event for real-time updates
        window.dispatchEvent(new Event('customStorageUpdate'));
        
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in-up">
      {/* Website Title Management */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Website Title Management</h3>
          <p className="text-sm text-gray-600">
            Update the website title that appears in browser tabs, navbar, and footer
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="websiteTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Website Title
            </label>
            <input
              id="websiteTitle"
              type="text"
              value={websiteTitle}
              onChange={handleTitleChange}
              placeholder="Enter website title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>Current browser tab title: <span className="font-medium text-gray-700">{websiteTitle || 'TikSaver - Download TikTok Videos'}</span></p>
          </div>
        </div>
      </div>

      {/* Website Logo Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Website Logo Management</h3>
          <p className="text-sm text-gray-600">
            Upload and manage the website logo that appears in navbar and footer
          </p>
        </div>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Logo
            </label>
            <input
              id="logoUpload"
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              onChange={handleLogoUpload}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PNG, JPG, JPEG, SVG. Max size: 2MB
            </p>
          </div>

          {/* Logo Preview */}
          {logoPreview && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Logo Preview</label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">This is how your logo will appear on the website</p>
                  <button
                    onClick={handleDeleteLogo}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Logo
                  </button>
                </div>
              </div>
            </div>
          )}

          {!logoPreview && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No logo uploaded yet</p>
              <p className="text-sm text-gray-400">Upload a logo to see the preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Save Changes</h4>
            <p className="text-sm text-gray-600">Save your title and logo changes to apply them across the website</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoTitleManagement;
