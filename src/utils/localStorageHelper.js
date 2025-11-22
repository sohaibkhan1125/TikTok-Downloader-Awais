// Local Storage Helper Utility
// Provides consistent localStorage operations with error handling

export const saveSetting = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving setting ${key}:`, error);
    return false;
  }
};

export const getSetting = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
};

export const removeSetting = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing setting ${key}:`, error);
    return false;
  }
};

export const clearAllSettings = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing all settings:', error);
    return false;
  }
};

// Specific helper for maintenance mode
export const saveMaintenanceMode = (enabled) => {
  const maintenanceData = {
    enabled,
    updatedAt: new Date().toISOString(),
    updatedBy: 'admin'
  };
  return saveSetting('maintenanceMode', maintenanceData);
};

export const getMaintenanceMode = () => {
  const data = getSetting('maintenanceMode', { enabled: false });
  return data.enabled || false;
};

// Helper to check if localStorage is available
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};
