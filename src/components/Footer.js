import React, { useState, useEffect } from 'react';
import { getSetting } from '../utils/localStorageHelper';
import * as Icons from 'react-icons/fa';

const Footer = () => {
  const [websiteTitle, setWebsiteTitle] = useState('TikSaver');
  const [websiteLogo, setWebsiteLogo] = useState('');
  const [footerIcons, setFooterIcons] = useState([]);

  useEffect(() => {
    // Load initial values
    const loadSettings = () => {
      const title = getSetting('websiteTitle', 'TikSaver');
      const logo = getSetting('websiteLogo', '');
      const icons = getSetting('footerIcons', []);
      setWebsiteTitle(title);
      setWebsiteLogo(logo);
      setFooterIcons(icons);
    };

    // Load settings on mount
    loadSettings();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorageUpdate', handleStorageChange);
    };
  }, []);
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {websiteLogo && (
                <img
                  src={websiteLogo}
                  alt="Website Logo"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h3 className="text-2xl font-bold gradient-text">
                {websiteTitle}
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Download TikTok videos in HD and MP3 without watermark. Fast, secure, and completely free to use. 
              No registration required.
            </p>
            <div className="flex space-x-4">
              {footerIcons.length > 0 ? (
                footerIcons.map((item, index) => {
                  const IconComponent = Icons[item.icon];
                  return IconComponent ? (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform"
                      title={`Visit our ${item.icon.replace('Fa', '')} page`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  ) : null;
                })
              ) : (
                <div className="text-gray-500 text-sm">
                  No social media links configured
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-to-use" className="text-gray-300 hover:text-white transition-colors duration-300">
                  How to Use
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  DMCA
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 {websiteTitle}. All Rights Reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Made with ❤️ for TikTok users worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;