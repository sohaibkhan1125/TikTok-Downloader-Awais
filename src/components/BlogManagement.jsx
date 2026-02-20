import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import QuillEditor from './QuillEditor';
import Loader from './Loader';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBlog, setEditingBlog] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        meta_title: '',
        meta_description: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching blogs:', error);
        } else {
            setBlogs(data || []);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'title' && !editingBlog ? { slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') } : {})
        }));
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || '',
            meta_title: blog.meta_title || '',
            meta_description: blog.meta_description || ''
        });
        setIsCreating(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Error deleting blog: ' + error.message);
            } else {
                fetchBlogs();
            }
        }
    };

    const handleSave = async (content) => {
        if (!formData.title || !formData.slug) {
            alert('Title and Slug are required');
            return;
        }

        setSaving(true);
        const blogData = {
            ...formData,
            content,
            updated_at: new Date().toISOString()
        };

        try {
            if (editingBlog) {
                const { error } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', editingBlog.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([blogData]);
                if (error) throw error;
            }

            setIsCreating(false);
            setEditingBlog(null);
            setFormData({ title: '', slug: '', excerpt: '', meta_title: '', meta_description: '' });
            fetchBlogs();
        } catch (error) {
            alert('Error saving blog: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader size="lg" /></div>;

    if (isCreating) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">
                        {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h3>
                    <button
                        onClick={() => { setIsCreating(false); setEditingBlog(null); }}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Cancel
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter blog title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="blog-post-url"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (Short Description)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Briefly describe what this blog is about"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Meta Title</label>
                            <input
                                type="text"
                                name="meta_title"
                                value={formData.meta_title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">SEO Meta Description</label>
                            <input
                                type="text"
                                name="meta_description"
                                value={formData.meta_description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                        <QuillEditor
                            initialContent={editingBlog?.content || ''}
                            onSave={handleSave}
                            saving={saving}
                            title="Blog Content Editor"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Blog Posts ({blogs.length})</h3>
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setEditingBlog(null);
                        setFormData({ title: '', slug: '', excerpt: '', meta_title: '', meta_description: '' });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </button>
            </div>

            {blogs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">No blog posts found</h4>
                    <p className="text-gray-500">Create your first blog post to see it here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{blog.title}</h4>
                                    <p className="text-sm text-blue-500 font-medium mb-1">/{blog.slug}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{blog.excerpt || 'No excerpt provided.'}</p>
                                    <div className="flex items-center text-xs text-gray-400 space-x-3">
                                        <span><i className="far fa-calendar-alt mr-1"></i> {new Date(blog.created_at).toLocaleDateString()}</span>
                                        <span><i className="far fa-user mr-1"></i> {blog.author}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogManagement;
