import React from 'react';

const Preview = ({ videoData, formatDuration, formatFileSize }) => {
  const handleDownload = async (url, filename) => {
    try {
      // Try to fetch the file first to handle CORS
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        // Fallback to direct link if fetch fails
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.log('Direct download fallback:', error);
      // Fallback to direct link if fetch fails
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getQualityLabel = (quality) => {
    switch (quality) {
      case 'hd_no_watermark':
        return 'HD (No Watermark)';
      case 'watermark':
        return 'With Watermark';
      case 'audio':
        return 'Audio Only';
      default:
        return quality.replace('_', ' ').toUpperCase();
    }
  };

  const getQualityIcon = (type) => {
    if (type === 'audio') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Video Preview */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          {videoData.thumbnail && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={videoData.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              {videoData.title || 'TikTok Video'}
            </h3>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-pink-100">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>@{videoData.author}</span>
              </span>
              
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{formatDuration(videoData.duration)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Preview */}
      {videoData.medias && videoData.medias.find(media => media.type === 'video') && (
        <div className="p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">Video Preview</h4>
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-black rounded-2xl shadow-lg overflow-hidden">
              <video
                controls
                className="w-full h-80 object-contain"
                poster={videoData.thumbnail}
                preload="metadata"
              >
                <source 
                  src={videoData.medias.find(media => media.type === 'video' && media.quality === 'hd_no_watermark')?.url || 
                        videoData.medias.find(media => media.type === 'video' && media.quality === 'watermark')?.url || 
                        videoData.medias.find(media => media.type === 'video')?.url} 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                Preview
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">
              Click play to preview the video before downloading
            </p>
          </div>
        </div>
      )}

      {/* Download Options */}
      <div className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Download Options
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* HD No Watermark Video */}
          {videoData.medias?.find(media => media.type === 'video' && media.quality === 'hd_no_watermark') && (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-pink-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1 transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-lg">
                    HD (No Watermark)
                  </h5>
                  <p className="text-sm text-gray-500">
                    MP4 • {formatFileSize(videoData.medias.find(media => media.type === 'video' && media.quality === 'hd_no_watermark')?.data_size)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const media = videoData.medias.find(media => media.type === 'video' && media.quality === 'hd_no_watermark');
                  const filename = `${videoData.title || 'tiktok-video'}-HD-NoWatermark.mp4`;
                  // Direct download
                  const link = document.createElement('a');
                  link.href = media.url;
                  link.download = filename;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download HD Video</span>
              </button>
            </div>
          )}

          {/* Audio Only */}
          {videoData.medias?.find(media => media.type === 'audio') && (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-pink-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1 transform">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 text-lg">
                    Audio Only
                  </h5>
                  <p className="text-sm text-gray-500">
                    MP3 • {formatFileSize(videoData.medias.find(media => media.type === 'audio')?.data_size)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const media = videoData.medias.find(media => media.type === 'audio');
                  const filename = `${videoData.title || 'tiktok-video'}-Audio.mp3`;
                  // Direct download
                  const link = document.createElement('a');
                  link.href = media.url;
                  link.download = filename;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Audio</span>
              </button>
            </div>
          )}
        </div>

        {videoData.medias?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No download options available for this video.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
