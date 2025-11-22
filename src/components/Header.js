import React, { useState, useEffect } from 'react';
import { getSetting } from '../utils/localStorageHelper';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [websiteTitle, setWebsiteTitle] = useState('TikSaver');
  const [websiteLogo, setWebsiteLogo] = useState('');

  useEffect(() => {
    // Load initial values
    const loadSettings = () => {
      const title = getSetting('websiteTitle', 'TikSaver');
      const logo = getSetting('websiteLogo', '');
      setWebsiteTitle(title);
      setWebsiteLogo(logo);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
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
            <h1 className="text-2xl font-bold gradient-text">
              {websiteTitle}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
              Home
            </a>
            <a href="#how-to-use" className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
              How to Use
            </a>
            <a href="#faq" className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
              FAQ
            </a>
            <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors duration-300">
              Contact
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-pink-600 focus:outline-none focus:text-pink-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a
                href="#home"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#how-to-use"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                How to Use
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;