import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Sidebar from '../../components/Sidebar';
import ContentArea from '../../components/ContentArea';
import SEO from '../../components/SEO';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('general');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO title="Admin Dashboard | TikSaver" noindex />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">TikSaver Admin</h1>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                <span className="hidden lg:inline">Welcome, </span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader size="sm" />
                    <span className="hidden sm:inline">Signing out...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Sidebar - Mobile: Full width overlay, Desktop: 30% width */}
          <div className={`lg:col-span-3 ${sidebarOpen
            ? 'fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out'
            : 'hidden lg:block'
            }`}>
            <div className="h-full overflow-y-auto">
              <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={(menu) => {
                  setActiveMenu(menu);
                  setSidebarOpen(false); // Close mobile sidebar when menu item is selected
                }}
              />
            </div>
          </div>

          {/* Right Content Area - Mobile: Full width, Desktop: 70% width */}
          <div className="lg:col-span-9">
            <ContentArea activeMenu={activeMenu} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;