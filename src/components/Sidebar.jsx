import React from 'react';

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    {
      id: 'general',
      label: 'General Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Configure general settings and maintenance mode'
    },
    {
      id: 'footer',
      label: 'Footer Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      description: 'Manage social media icons and footer links'
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: 'Edit website content above FAQ section'
    }
    , {
      id: 'hero',
      label: 'Hero Section Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Update hero heading and description'
    },
    {
      id: 'blogs',
      label: 'Blog Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 002 2h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h3M7 12h8M7 16h8" />
        </svg>
      ),
      description: 'Create, edit and manage blog posts'
    }
  ];

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-3 lg:p-4 animate-slide-in-left">
      {/* Mobile header */}
      <div className="lg:hidden mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600">Manage your settings</p>
      </div>

      <div className="hidden lg:block mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Admin Panel</h2>
        <p className="text-sm text-gray-600">Manage your TikTok downloader settings</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-3 rounded-lg text-left transition-all duration-200 ease-out transform hover:-translate-y-0.5 ${activeMenu === item.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <div className={`flex-shrink-0 ${activeMenu === item.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${activeMenu === item.id ? 'text-blue-700' : 'text-gray-900'
                }`}>
                {item.label}
              </p>
              <p className={`text-xs hidden sm:block ${activeMenu === item.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                {item.description}
              </p>
            </div>
            {activeMenu === item.id && (
              <div className="flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}

      </nav>
    </div>
  );
};

export default Sidebar;
