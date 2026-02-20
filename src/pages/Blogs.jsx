import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('id, title, slug, excerpt, author, created_at')
                .order('created_at', { ascending: false });

            if (!error) setBlogs(data || []);
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    return (
        <div className="App">
            <SEO
                title="Blog | TikSaver – Tips, Guides & Updates"
                description="Read the latest articles, guides and tips on TikTok videos, downloading, and social media tools from TikSaver."
                canonical="/blog"
            />
            <Header />

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 px-4 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Our Blog</h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                    Tips, guides and updates about TikTok, social media downloads and more.
                </p>
            </section>

            {/* Blog Grid */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl font-semibold">No blog posts yet.</p>
                        <p className="text-sm mt-2">Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                to={`/blog/${blog.slug}`}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                            >
                                {/* Card Header Gradient */}
                                <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    {blog.excerpt && (
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">{blog.excerpt}</p>
                                    )}
                                    <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
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
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                                        Read more
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default Blogs;
