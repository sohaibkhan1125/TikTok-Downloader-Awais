import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const DynamicContent = () => {
  const [dynamicContent, setDynamicContent] = useState('');

  useEffect(() => {
    // Load content from Supabase on load
    const loadContent = async () => {
      try {
        const { data, error } = await supabase
          .from('tiktok_website')
          .select('content')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('Error loading content from Supabase:', error);
          return;
        }

        if (data) {
          const content = data.content?.trim() || '';
          setDynamicContent(content);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };
    loadContent();

    // Subscribe to real-time changes from Supabase
    const subscription = supabase
      .channel('tiktok_website_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'tiktok_website',
          filter: 'id=eq.1'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          if (payload.new && payload.new.content !== undefined) {
            const content = payload.new.content?.trim() || '';
            setDynamicContent(content);
          }
        }
      )
      .subscribe();

    // Keep custom event listener for backward compatibility during migration
    const onContentUpdated = (e) => {
      const content = e.detail.content?.trim() || '';
      setDynamicContent(content);
    };
    window.addEventListener('contentUpdated', onContentUpdated);

    return () => {
      // Cleanup Supabase subscription
      subscription.unsubscribe();
      window.removeEventListener('contentUpdated', onContentUpdated);
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
