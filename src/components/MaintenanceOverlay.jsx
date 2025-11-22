import React, { useState, useEffect } from 'react';
import { getMaintenanceMode, isLocalStorageAvailable } from '../utils/localStorageHelper';

const MaintenanceOverlay = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage not available in MaintenanceOverlay');
      setLoading(false);
      return;
    }

    try {
      // Load maintenance mode from localStorage
      const maintenanceEnabled = getMaintenanceMode();
      setIsMaintenanceMode(maintenanceEnabled);
      setError(null);
    } catch (error) {
      console.error('Error loading maintenance mode in overlay:', error);
      setError('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }

    // Set up interval to check for changes (since localStorage doesn't have real-time listeners)
    const interval = setInterval(() => {
      try {
        const maintenanceEnabled = getMaintenanceMode();
        setIsMaintenanceMode(maintenanceEnabled);
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error) {
    // Show error state but don't block the website
    console.warn('Maintenance overlay error:', error);
    return null;
  }

  if (!isMaintenanceMode) {
    return null; // Don't show overlay if maintenance mode is disabled
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-95">
        {/* Maintenance Icon */}
        <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
          <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Maintenance Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚧 We're Currently Performing Maintenance
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          We're working hard to improve your experience. Please check back soon!
        </p>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-800">What's happening?</span>
          </div>
          <p className="text-sm text-blue-700">
            We're updating our systems to provide you with a better TikTok download experience. 
            This usually takes just a few minutes.
          </p>
        </div>

        {/* Contact Info */}
        <div className="text-sm text-gray-500">
          <p>Need immediate assistance?</p>
          <p className="font-medium text-gray-700 mt-1">
            Contact us at{' '}
            <a 
              href="mailto:support@tiksaver.com" 
              className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              support@tiksaver.com
            </a>
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default MaintenanceOverlay;
