import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    noindex
}) => {
    const siteUrl = 'https://tiksaver.com';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title || 'TikSaver - Download TikTok Videos Without Watermark | Free HD TikTok Downloader 2025'}</title>
            <meta name="description" content={description || 'Download TikTok videos without watermark in HD quality (720p, 480p, 360p) and MP3 audio. Fast, secure, and completely free TikTok video downloader.'} />

            {/* Canonical Tag */}
            {!noindex && <link rel="canonical" href={fullCanonical} />}

            {/* Robots Tag */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={ogTitle || title || 'TikSaver - Download TikTok Videos Without Watermark'} />
            <meta property="og:description" content={ogDescription || description || 'Download TikTok videos without watermark in HD quality.'} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:image" content={ogImage || `${siteUrl}/logo512.png`} />
            <meta property="og:type" content="website" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || title} />
            <meta name="twitter:description" content={ogDescription || description} />
            <meta name="twitter:image" content={ogImage || `${siteUrl}/logo512.png`} />
        </Helmet>
    );
};

export default SEO;
