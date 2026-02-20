import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import Downloader from './components/Downloader';
import HowToUse from './components/HowToUse';
import DynamicContent from './components/DynamicContent';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MaintenanceOverlay from './components/MaintenanceOverlay';
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import Dashboard from './pages/admin/Dashboard';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import SEO from './components/SEO';

// Main TikTok Downloader Component
const TikTokDownloader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async (videoUrl, contentType = 'video') => {
    setIsLoading(true);
    setVideoData(null);
    setError(null);

    try {
      const response = await fetch(
        `https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index?url=${encodeURIComponent(videoUrl)}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'cca330428dmsh4b459b029c77e3cp1a7504jsn8f61efbba564',
            'x-rapidapi-host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setVideoData(data);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download video. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <SEO
        title="TikSaver - Download TikTok Videos Without Watermark | Free HD TikTok Downloader 2025"
        description="Download TikTok videos without watermark in HD quality (720p, 480p, 360p) and MP3 audio. Fast, secure, and completely free TikTok video downloader."
        canonical="/"
      />
      <MaintenanceOverlay />
      <Header />
      <Hero onDownload={handleDownload} isLoading={isLoading} />
      <Downloader videoData={videoData} isLoading={isLoading} error={error} />
      <HowToUse />
      <DynamicContent />
      <section id="faq-section">
        <FAQ />
      </section>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Main TikTok Downloader Routes */}
            <Route path="/" element={<TikTokDownloader />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/signup" element={<Signup />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
