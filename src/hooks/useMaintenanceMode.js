import { useState, useEffect } from 'react';
import { getMaintenanceMode, saveMaintenanceMode, isLocalStorageAvailable } from '../utils/localStorageHelper';

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage not available');
      setError('LocalStorage not available in this browser');
      setLoading(false);
      return;
    }

    try {
      // Load maintenance mode from localStorage
      const maintenanceEnabled = getMaintenanceMode();
      setIsMaintenanceMode(maintenanceEnabled);
      setError(null);
    } catch (error) {
      console.error('Error loading maintenance mode:', error);
      setError('Failed to load maintenance mode settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleMaintenanceMode = async (enabled) => {
    if (!isLocalStorageAvailable()) {
      throw new Error('LocalStorage not available');
    }

    setSaving(true);
    setError(null);
    
    try {
      // Save to localStorage
      const success = saveMaintenanceMode(enabled);
      
      if (success) {
        setIsMaintenanceMode(enabled);
      } else {
        throw new Error('Failed to save maintenance mode');
      }
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      setError('Failed to update maintenance mode');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    isMaintenanceMode,
    loading,
    saving,
    error,
    toggleMaintenanceMode
  };
};
