import React, { useEffect, useState } from 'react';

const LS_KEY = 'admin_settings';

const HeroSectionManagement = () => {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHeading(data.heroHeading || '');
        setDescription(data.heroDescription || '');
      } catch {}
    }
  }, []);

  // Persist to localStorage and notify site instantly
  const persist = (nextHeading, nextDescription) => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      const base = saved ? JSON.parse(saved) : {};
      const updated = {
        ...base,
        heroHeading: nextHeading,
        heroDescription: nextDescription
      };
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      // Notify listeners (site hero) for real-time updates
      window.dispatchEvent(new CustomEvent('heroUpdated', { detail: updated }));
      // Keep compatibility with other listeners in the app
      window.dispatchEvent(new Event('customStorageUpdate'));
    } catch (e) {
      console.warn('Failed to persist hero content:', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Hero Section Management</h3>
          <p className="text-sm text-gray-600">
            Update the hero section heading and description. Changes are saved to your browser and applied instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Section Heading</label>
            <input
              type="text"
              value={heading}
              onChange={(e) => {
                const v = e.target.value;
                setHeading(v);
                persist(v, description);
              }}
              placeholder="Enter hero heading..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Section Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                const v = e.target.value;
                setDescription(v);
                persist(heading, v);
              }}
              placeholder="Enter hero description..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="mb-4">
          <h4 className="text-base font-semibold text-gray-900">Live Preview</h4>
          <p className="text-sm text-gray-500">This is how it will look on your website’s hero section.</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
            {heading?.trim() || 'Your awesome downloader headline here'}
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            {description?.trim() || 'Write a short, compelling description for your hero section.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionManagement;


