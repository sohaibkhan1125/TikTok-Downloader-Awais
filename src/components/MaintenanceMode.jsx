import React, { useState } from 'react';
import { useMaintenanceMode } from '../hooks/useMaintenanceMode';
import Loader from './Loader';

const MaintenanceMode = () => {
  const { isMaintenanceMode, loading, saving, error, toggleMaintenanceMode } = useMaintenanceMode();
  const [localToggle, setLocalToggle] = useState(isMaintenanceMode);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = async () => {
    const newValue = !localToggle;
    setLocalToggle(newValue);
    
    try {
      await toggleMaintenanceMode(newValue);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      // Revert toggle on error
      setLocalToggle(!newValue);
      console.error('Maintenance mode toggle error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="lg" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Maintenance Mode</h3>
            <p className="text-sm text-gray-600 mt-1">
              Enable maintenance mode to temporarily disable the website for users
            </p>
          </div>
          <div className="flex items-center justify-between sm:justify-end">
            <span className={`text-sm font-medium mr-3 ${
              localToggle ? 'text-red-600' : 'text-green-600'
            }`}>
              {localToggle ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={handleToggle}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                localToggle ? 'bg-red-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  localToggle ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {localToggle && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  When maintenance mode is enabled, users will see a maintenance page instead of the main website.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              localToggle
                ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            } ${saving ? 'opacity-50 cursor-not-allowed transform-none' : ''} flex items-center space-x-2`}
          >
            {saving ? (
              <>
                <Loader size="sm" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{localToggle ? 'Disable Maintenance' : 'Enable Maintenance'}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-800">
                {error}
              </span>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Maintenance mode {localToggle ? 'enabled' : 'disabled'} successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceMode;
