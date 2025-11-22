import React, { useState, useRef, useEffect } from 'react';

const Downloader = ({ videoData, isLoading, error }) => {
  const [downloadingItems, setDownloadingItems] = useState(new Set());
  const [downloadComplete, setDownloadComplete] = useState(null);
  const previewRef = useRef(null);

  // Auto scroll to preview section when video data is received
  useEffect(() => {
    if (videoData && previewRef.current) {
      // Small delay to ensure content is fully rendered
      setTimeout(() => {
        previewRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  }, [videoData]);

  const downloadFile = async (url, filename, type) => {
    const itemKey = `${type}-${filename}`;
    
    // Add to downloading items
    setDownloadingItems(prev => new Set([...prev, itemKey]));
    setDownloadComplete(null);

    try {
      // Simulate a small delay for better UX (1 second total)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Method 1: Try direct download first (simplest approach)
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        link.setAttribute('download', filename);
        link.setAttribute('type', 'application/octet-stream');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message immediately
        setDownloadComplete(itemKey);
        setTimeout(() => setDownloadComplete(null), 3000);
        return;
      } catch (directError) {
        // Silently continue to proxy methods
      }

      // Method 2: Use only reliable CORS proxies with minimal headers
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      ];

      for (const proxyUrl of proxyUrls) {
        try {
          const response = await fetch(proxyUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': '*/*'
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            
            // Create blob URL for download
            const blobUrl = URL.createObjectURL(blob);
            
            // Create download link with proper attributes
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            link.setAttribute('download', filename);
            link.setAttribute('type', 'application/octet-stream');
            
            // Add to DOM and trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
            // Show success message immediately
            setDownloadComplete(itemKey);
            setTimeout(() => setDownloadComplete(null), 3000);
            return;
          }
        } catch (proxyError) {
          // Silently continue to next method
          continue;
        }
      }

      // Method 3: Use XMLHttpRequest for more control (without problematic headers)
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Accept', '*/*');
        
        xhr.onload = function() {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const blobUrl = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            link.setAttribute('download', filename);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            
            // Show success message immediately
            setDownloadComplete(itemKey);
            setTimeout(() => setDownloadComplete(null), 3000);
          }
        };
        
        xhr.onerror = function() {
          // Silently handle error, don't show warnings
        };
        
        xhr.send();
        return;
      } catch (xhrError) {
        // Silently continue to next method
      }

      // Method 4: Use iframe with proper download attributes
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      
      // Set iframe source with download parameter
      iframe.src = `${url}?download=1&filename=${encodeURIComponent(filename)}`;
      
      document.body.appendChild(iframe);
      
      // Also try direct link with download attribute
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      link.setAttribute('download', filename);
      link.setAttribute('type', 'application/octet-stream');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up iframe
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
      
      // Show success message immediately (assume download will work)
      setDownloadComplete(itemKey);
      setTimeout(() => setDownloadComplete(null), 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Final fallback: Show user instructions for manual download
      const userChoice = window.confirm(
        `Automatic download failed. Would you like to:\n\n` +
        `1. Click "OK" to open the file in a new tab (then right-click and "Save as...")\n` +
        `2. Click "Cancel" to copy the download URL to clipboard\n\n` +
        `File: ${filename}\nURL: ${url}`
      );
      
      if (userChoice) {
        // Open in new tab for manual download
        window.open(url, '_blank');
      } else {
        // Copy URL to clipboard
        navigator.clipboard.writeText(url).then(() => {
          window.alert('Download URL copied to clipboard! Paste it in your browser to download.');
        }).catch(() => {
          window.alert(`Download URL: ${url}\n\nCopy this URL and paste it in your browser to download.`);
        });
      }
    } finally {
      // Remove from downloading items
      setDownloadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const getFileExtension = (url, type) => {
    if (type === 'audio') return '.mp3';
    if (url.includes('.mp4')) return '.mp4';
    if (url.includes('.webm')) return '.webm';
    return '.mp4';
  };

  const getFilename = (type, quality = '') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `tiktok-${type}${quality ? `-${quality}` : ''}-${timestamp}`;
  };
  if (isLoading) {
  return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <svg className="animate-spin h-8 w-8 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing your video...</h3>
            <p className="text-gray-600">Please wait while we fetch the video details</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Download Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Please check the URL and try again</p>
          </div>
        </div>
      </section>
    );
  }

  if (!videoData) {
    return null;
  }

  // Extract data from API response
  const video = videoData.video?.[0];
  const music = videoData.music?.[0];
  const cover = videoData.cover?.[0];
  const watermarkedVideo = videoData.OriginalWatermarkedVideo?.[0];
  const author = videoData.author?.[0];
  const description = videoData.description?.[0];
  const videoId = videoData.videoid?.[0];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={previewRef} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Video Preview */}
          {cover && (
            <div className="relative">
              <img 
                src={cover} 
                alt="Video thumbnail" 
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                  <p className="text-lg font-semibold">Video Preview</p>
                </div>
              </div>
            </div>
          )}

          {/* Video Info */}
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Details</h2>
              {author && (
                <p className="text-lg text-gray-700 mb-2">
                  <span className="font-semibold">Author:</span> @{author}
                </p>
              )}
              {videoId && (
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Video ID:</span> {videoId}
                </p>
              )}
              {description && (
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Download Options */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Download Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 720p HD Video */}
                {video && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const filename = getFilename('video', '720p') + getFileExtension(video, 'video');
                        downloadFile(video, filename, '720p');
                      }}
                      disabled={downloadingItems.has('720p-video')}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                        downloadingItems.has('720p-video')
                          ? 'bg-blue-300 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      {downloadingItems.has('720p-video') ? (
                        <>
                          <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-semibold">Preparing Download...</span>
                        </>
                      ) : downloadComplete === '720p-video' ? (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">Download Complete!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold">🎥 720p (HD)</span>
                        </>
                      )}
                    </button>
                    
                    {/* Progress Bar */}
                    {downloadingItems.has('720p-video') && (
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{
                          animation: 'progress 2s ease-in-out infinite'
                        }}></div>
                      </div>
                    )}
                  </div>
                )}

                {/* 480p Video */}
                {video && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const filename = getFilename('video', '480p') + getFileExtension(video, 'video');
                        downloadFile(video, filename, '480p');
                      }}
                      disabled={downloadingItems.has('480p-video')}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                        downloadingItems.has('480p-video')
                          ? 'bg-green-300 cursor-not-allowed'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {downloadingItems.has('480p-video') ? (
                        <>
                          <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-semibold">Preparing Download...</span>
                        </>
                      ) : downloadComplete === '480p-video' ? (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">Download Complete!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">🎥 480p</span>
                      </>
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  {downloadingItems.has('480p-video') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{
                        animation: 'progress 2s ease-in-out infinite'
                      }}></div>
                    </div>
                  )}
                </div>
                )}

                {/* 360p Video */}
                {video && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const filename = getFilename('video', '360p') + getFileExtension(video, 'video');
                        downloadFile(video, filename, '360p');
                      }}
                      disabled={downloadingItems.has('360p-video')}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                        downloadingItems.has('360p-video')
                          ? 'bg-yellow-300 cursor-not-allowed'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white`}
                    >
                      {downloadingItems.has('360p-video') ? (
                        <>
                          <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-semibold">Preparing Download...</span>
                        </>
                      ) : downloadComplete === '360p-video' ? (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">Download Complete!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">🎥 360p</span>
                      </>
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  {downloadingItems.has('360p-video') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-full animate-pulse" style={{
                        animation: 'progress 2s ease-in-out infinite'
                      }}></div>
                    </div>
                  )}
                </div>
                )}

                {/* MP3 Audio */}
                {music && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const filename = getFilename('audio', 'mp3') + getFileExtension(music, 'audio');
                        downloadFile(music, filename, 'audio');
                      }}
                      disabled={downloadingItems.has('audio-mp3')}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                        downloadingItems.has('audio-mp3')
                          ? 'bg-purple-300 cursor-not-allowed'
                          : 'bg-purple-500 hover:bg-purple-600'
                      } text-white`}
                    >
                      {downloadingItems.has('audio-mp3') ? (
                        <>
                          <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-semibold">Preparing Download...</span>
                      </>
                    ) : downloadComplete === 'audio-mp3' ? (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">Download Complete!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="font-semibold">🎵 MP3 Audio</span>
                      </>
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  {downloadingItems.has('audio-mp3') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{
                        animation: 'progress 2s ease-in-out infinite'
                      }}></div>
                    </div>
                  )}
          </div>
        )}

                {/* Watermarked Video */}
                {watermarkedVideo && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const filename = getFilename('watermarked', 'video') + getFileExtension(watermarkedVideo, 'video');
                        downloadFile(watermarkedVideo, filename, 'watermarked');
                      }}
                      disabled={downloadingItems.has('watermarked-video')}
                      className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                        downloadingItems.has('watermarked-video')
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-gray-500 hover:bg-gray-600'
                      } text-white`}
                    >
                      {downloadingItems.has('watermarked-video') ? (
                        <>
                          <svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-semibold">Preparing Download...</span>
                        </>
                      ) : downloadComplete === 'watermarked-video' ? (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">Download Complete!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">🎥 Watermarked</span>
                      </>
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  {downloadingItems.has('watermarked-video') && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gray-500 h-2 rounded-full animate-pulse" style={{
                        animation: 'progress 2s ease-in-out infinite'
                      }}></div>
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Show message if no downloads available */}
              {!video && !music && !watermarkedVideo && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Downloads Available</h3>
                  <p className="text-gray-600">This video doesn't have downloadable content or the URL is invalid.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Downloader;