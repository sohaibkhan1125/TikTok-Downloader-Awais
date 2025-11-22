import React, { useState } from 'react';
import MaintenanceMode from './MaintenanceMode';
import LogoTitleManagement from './LogoTitleManagement';
import FooterManagement from './FooterManagement';
import FroalaContentManagement from './FroalaContentManagement';
import HeroSectionManagement from './HeroSectionManagement';

const ContentArea = ({ activeMenu }) => {
  const [activeSubMenu, setActiveSubMenu] = useState('maintenance');

  const renderContent = () => {
    switch (activeMenu) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* Sub-menu for General Settings */}
            <div className="bg-white rounded-xl shadow-lg p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveSubMenu('maintenance')}
                  className={`flex-1 px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSubMenu === 'maintenance'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Maintenance Mode</span>
                  <span className="sm:hidden">Maintenance</span>
                </button>
                <button
                  onClick={() => setActiveSubMenu('logo-title')}
                  className={`flex-1 px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSubMenu === 'logo-title'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Logo & Title</span>
                  <span className="sm:hidden">Logo</span>
                </button>
              </div>
            </div>

            {/* Content based on active sub-menu */}
            {activeSubMenu === 'maintenance' && <MaintenanceMode />}
            {activeSubMenu === 'logo-title' && <LogoTitleManagement />}
          </div>
        );
      case 'footer':
        return <FooterManagement />;
      case 'content':
        return <FroalaContentManagement />;
      case 'hero':
        return <HeroSectionManagement />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a menu item</h3>
              <p className="text-sm text-gray-600">Choose an option from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 h-full overflow-y-auto animate-slide-in-right">
        <div className="mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            {activeMenu === 'general' ? 'General Settings' : 
             activeMenu === 'footer' ? 'Footer Management' :
             activeMenu === 'content' ? 'Content Management' :
             activeMenu === 'hero' ? 'Hero Section Management' :
             'Dashboard'}
          </h2>
          <p className="text-sm lg:text-base text-gray-600">
            {activeMenu === 'general' 
              ? 'Configure general settings and maintenance mode for your TikTok downloader'
              : activeMenu === 'footer'
              ? 'Manage social media icons and footer links'
              : activeMenu === 'content'
              ? 'Edit website content above FAQ section'
              : activeMenu === 'hero'
              ? 'Update hero section heading and description with live preview'
              : 'Welcome to the admin dashboard'
            }
          </p>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ContentArea;
