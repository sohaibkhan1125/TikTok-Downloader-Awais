import React, { useEffect, useState } from 'react';

const Hero = ({ onDownload, isLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const [customHeading, setCustomHeading] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const saved = localStorage.getItem('admin_settings');
        if (saved) {
          const data = JSON.parse(saved);
          setCustomHeading(data.heroHeading || '');
          setCustomDescription(data.heroDescription || '');
        }
      } catch {}
    };
    loadFromStorage();

    const onHeroUpdated = (e) => {
      const d = e.detail || {};
      setCustomHeading(d.heroHeading || '');
      setCustomDescription(d.heroDescription || '');
    };

    window.addEventListener('heroUpdated', onHeroUpdated);
    window.addEventListener('storage', loadFromStorage);
    window.addEventListener('customStorageUpdate', loadFromStorage);
    return () => {
      window.removeEventListener('heroUpdated', onHeroUpdated);
      window.removeEventListener('storage', loadFromStorage);
      window.removeEventListener('customStorageUpdate', loadFromStorage);
    };
  }, []);

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'home':
        return 'Paste TikTok profile or homepage URL...';
      case 'video':
        return 'Paste TikTok video URL...';
      case 'story':
        return 'Paste TikTok story URL...';
      case 'sound':
        return 'Paste TikTok sound URL...';
      case 'live':
        return 'Paste TikTok live video URL...';
      case 'photos':
        return 'Paste TikTok photo post URL...';
      default:
        return 'Paste TikTok URL here...';
    }
  };

  const getDownloadButtonText = () => {
    switch (selectedType) {
      case 'home':
        return 'Download Profile';
      case 'video':
        return 'Download Video';
      case 'story':
        return 'Download Story';
      case 'sound':
        return 'Download Sound';
      case 'live':
        return 'Download Live';
      case 'photos':
        return 'Download Photos';
      default:
        return 'Download Content';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      onDownload(videoUrl.trim(), selectedType);
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Title */}
        {customHeading?.trim() ? (
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {customHeading}
          </h1>
        ) : (
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Download TikTok{' '}
            <span className="gradient-text">
              {selectedType === 'video' ? 'Videos' :
               selectedType === 'sound' ? 'Sounds' :
               selectedType === 'story' ? 'Stories' :
               selectedType === 'live' ? 'Live Videos' :
               selectedType === 'photos' ? 'Photos' :
               selectedType === 'home' ? 'Profiles' :
               'Content'}
            </span>
            {' '}Without Watermark
          </h1>
        )}

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          {customDescription?.trim()
            ? customDescription
            : ((selectedType === 'video' ? 'Fast, secure, and high-quality TikTok video downloads (720p, 480p, 360p, and MP3).' :
               selectedType === 'sound' ? 'Download TikTok sounds and audio tracks in high quality MP3 format.' :
               selectedType === 'story' ? 'Download TikTok stories and temporary content before they expire.' :
               selectedType === 'live' ? 'Download TikTok live videos and streams in HD quality.' :
               selectedType === 'photos' ? 'Download TikTok photo posts and carousel content.' :
               selectedType === 'home' ? 'Download entire TikTok profiles and user content collections.' :
               'Fast, secure, and high-quality TikTok content downloads.') + ' No registration required. Download your favorite TikTok content instantly!')}
        </p>

        {/* Download Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative w-full">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors duration-300 shadow-lg"
                required
              />
              
              {/* Paste/Clear Icon Button */}
              <button
                type="button"
                onClick={async () => {
                  if (videoUrl) {
                    setVideoUrl(''); // Clear if already filled
                  } else {
                    try {
                      const text = await navigator.clipboard.readText();
                      setVideoUrl(text);
                    } catch (err) {
                      console.error('Clipboard access denied', err);
                      // Fallback: Show a message to user
                      alert('Unable to access clipboard. Please paste manually.');
                    }
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-600 transition-all duration-300 p-1 rounded-md hover:bg-gray-100"
                title={videoUrl ? "Clear input" : "Paste from clipboard"}
              >
                {videoUrl ? (
                  // Clear icon (X)
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Paste icon (Clipboard)
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !videoUrl.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{getDownloadButtonText()}</span>
                </>
              )}
            </button>
          </form>

          {/* Content Type Selection */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">Select content type:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: '🏠 Home', value: 'home' },
                { label: '🎬 Video', value: 'video' },
                { label: '📖 Story', value: 'story' },
                { label: '🎵 Sound', value: 'sound' },
                { label: '🔴 Live Video', value: 'live' },
                { label: '🖼️ Photos', value: 'photos' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedType(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedType === option.value
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-6 bg-white/50 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm text-center">Download videos in seconds with our optimized servers</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600 text-sm text-center">Get videos in HD quality up to 720p resolution</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white/50 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-gray-600 text-sm text-center">Your privacy is protected, no data stored</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;