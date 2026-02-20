import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                navigate('/blog');
            } else {
                setBlog(data);
            }
            setLoading(false);
        };
        fetchBlog();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="App">
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="App">
            <SEO
                title={blog.meta_title || blog.title}
                description={blog.meta_description || blog.excerpt || ''}
                canonical={`/blog/${blog.slug}`}
            />
            <Header />

            {/* Hero Banner */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-16 px-4 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center mb-4">
                        <Link to="/blog" className="text-blue-200 hover:text-white text-sm flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Blog
                        </Link>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{blog.title}</h1>
                    <div className="flex justify-center items-center gap-6 text-blue-200 text-sm">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div
                        className="prose prose-lg prose-blue max-w-none
              prose-h1:text-3xl prose-h1:font-bold prose-h1:text-gray-900
              prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-800 prose-h2:mt-8
              prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-700
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to all posts
                    </Link>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogDetail;
