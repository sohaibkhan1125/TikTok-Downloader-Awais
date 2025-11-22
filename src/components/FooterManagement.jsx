import React, { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaTiktok, 
  FaLinkedin, 
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaWhatsapp,
  FaGithub,
  FaDribbble,
  FaBehance
} from 'react-icons/fa';
import { saveSetting, getSetting, isLocalStorageAvailable } from '../utils/localStorageHelper';

const FooterManagement = () => {
  const [selectedIcon, setSelectedIcon] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [footerIcons, setFooterIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Available social media icons
  const availableIcons = [
    { name: 'FaFacebook', component: FaFacebook, label: 'Facebook', color: 'text-blue-600' },
    { name: 'FaInstagram', component: FaInstagram, label: 'Instagram', color: 'text-pink-600' },
    { name: 'FaTwitter', component: FaTwitter, label: 'Twitter (X)', color: 'text-blue-400' },
    { name: 'FaYoutube', component: FaYoutube, label: 'YouTube', color: 'text-red-600' },
    { name: 'FaTiktok', component: FaTiktok, label: 'TikTok', color: 'text-black' },
    { name: 'FaLinkedin', component: FaLinkedin, label: 'LinkedIn', color: 'text-blue-700' },
    { name: 'FaTelegram', component: FaTelegram, label: 'Telegram', color: 'text-blue-500' },
    { name: 'FaDiscord', component: FaDiscord, label: 'Discord', color: 'text-indigo-600' },
    { name: 'FaSnapchat', component: FaSnapchat, label: 'Snapchat', color: 'text-yellow-500' },
    { name: 'FaPinterest', component: FaPinterest, label: 'Pinterest', color: 'text-red-500' },
    { name: 'FaReddit', component: FaReddit, label: 'Reddit', color: 'text-orange-600' },
    { name: 'FaWhatsapp', component: FaWhatsapp, label: 'WhatsApp', color: 'text-green-600' },
    { name: 'FaGithub', component: FaGithub, label: 'GitHub', color: 'text-gray-800' },
    { name: 'FaDribbble', component: FaDribbble, label: 'Dribbble', color: 'text-pink-500' },
    { name: 'FaBehance', component: FaBehance, label: 'Behance', color: 'text-blue-600' }
  ];

  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      setError('LocalStorage not available in this browser');
      return;
    }

    // Load existing footer icons
    const loadFooterIcons = () => {
      const savedIcons = getSetting('footerIcons', []);
      setFooterIcons(savedIcons);
    };

    loadFooterIcons();
  }, []);

  const handleAddIcon = () => {
    if (!selectedIcon || !socialLink.trim()) {
      setError('Please select an icon and enter a link');
      return;
    }

    // Validate URL
    try {
      new URL(socialLink);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    // Check if icon already exists
    if (footerIcons.some(icon => icon.icon === selectedIcon)) {
      setError('This icon is already added');
      return;
    }

    const newIcon = {
      icon: selectedIcon,
      link: socialLink.trim()
    };

    setFooterIcons(prev => [...prev, newIcon]);
    setSelectedIcon('');
    setSocialLink('');
    setError(null);
  };

  const handleDeleteIcon = (index) => {
    setFooterIcons(prev => prev.filter((_, i) => i !== index));
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
      const success = saveSetting('footerIcons', footerIcons);
      
      if (success) {
        // Trigger custom storage event for real-time updates
        window.dispatchEvent(new Event('customStorageUpdate'));
        
        setSuccess('✅ Footer icons saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to save footer icons');
      }
    } catch (error) {
      console.error('Error saving footer icons:', error);
      setError('Failed to save footer icons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.component : null;
  };

  const getIconColor = (iconName) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.color : 'text-gray-600';
  };

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Footer Management</h3>
          <p className="text-sm lg:text-base text-gray-600">
            Manage social media icons and links that appear in the website footer
          </p>
        </div>
      </div>

      {/* Add New Icon Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Social Icon</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Icon Selection */}
          <div>
            <label htmlFor="iconSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Select Social Media Icon
            </label>
            <select
              id="iconSelect"
              value={selectedIcon}
              onChange={(e) => setSelectedIcon(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            >
              <option value="">Choose an icon...</option>
              {availableIcons.map((icon) => (
                <option key={icon.name} value={icon.name}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>

          {/* Link Input */}
          <div>
            <label htmlFor="socialLink" className="block text-sm font-medium text-gray-700 mb-2">
              Social Link URL
            </label>
            <input
              id="socialLink"
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="https://www.facebook.com/yourpage"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Preview Selected Icon */}
        {selectedIcon && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="flex items-center space-x-3">
              {(() => {
                const IconComponent = getIconComponent(selectedIcon);
                const iconColor = getIconColor(selectedIcon);
                return IconComponent ? (
                  <IconComponent className={`text-2xl ${iconColor}`} />
                ) : null;
              })()}
              <span className="text-gray-700">
                {availableIcons.find(icon => icon.name === selectedIcon)?.label}
              </span>
            </div>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddIcon}
          disabled={!selectedIcon || !socialLink.trim()}
          className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Social Icon</span>
        </button>
      </div>

      {/* Current Icons List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Current Footer Icons ({footerIcons.length})
        </h4>
        
        {footerIcons.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500">No social icons added yet</p>
            <p className="text-sm text-gray-400">Add your first social media icon above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {footerIcons.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              const iconColor = getIconColor(item.icon);
              const iconLabel = availableIcons.find(icon => icon.name === item.icon)?.label;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {IconComponent && (
                      <IconComponent className={`text-2xl ${iconColor}`} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{iconLabel}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{item.link}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteIcon(index)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    title="Delete icon"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Save Changes</h4>
            <p className="text-sm text-gray-600">Save your footer icons to apply them to the website</p>
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

export default FooterManagement;
