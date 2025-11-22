import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DynamicContent = () => {
  const [dynamicContent, setDynamicContent] = useState('');

  useEffect(() => {
    // Load content from localStorage on load
    const loadContent = () => {
      const saved = localStorage.getItem('admin_settings');
      if (saved) {
        const data = JSON.parse(saved);
        const content = data.content?.trim() || '';
        setDynamicContent(content);
      } else {
        setDynamicContent('');
      }
    };
    loadContent();

    // Listen for admin panel updates
    const onContentUpdated = (e) => {
      const content = e.detail.content?.trim() || '';
      setDynamicContent(content);
    };
    window.addEventListener('contentUpdated', onContentUpdated);

    // Also handle settingsUpdated for compatibility with new editor
    const onSettingsUpdated = (e) => {
      const content = e.detail?.content?.trim?.() || e.detail?.content || '';
      setDynamicContent(content);
    };
    window.addEventListener('settingsUpdated', onSettingsUpdated);

    // Also listen for localStorage changes (cross-tab)
    window.addEventListener('storage', loadContent);

    return () => {
      window.removeEventListener('contentUpdated', onContentUpdated);
      window.removeEventListener('settingsUpdated', onSettingsUpdated);
      window.removeEventListener('storage', loadContent);
    };
  }, []);

  return (
    <AnimatePresence>
      {dynamicContent && dynamicContent.trim() !== '' && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="content-section w-full py-8 bg-white border-b border-gray-200"
        >
          <div className="max-w-5xl mx-auto px-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: dynamicContent }}
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

export default DynamicContent;
