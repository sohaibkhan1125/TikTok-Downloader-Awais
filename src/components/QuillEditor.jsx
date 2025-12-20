import React, { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Prism from 'prismjs';
import './PrismTheme.css'; // Local file for theme
import { supabase } from '../supabaseClient';
import './QuillEditor.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Now available after install

const EDITOR_KEY = 'quill_editor_content';
const THEME_KEY = 'editor_theme_preference';

const QuillEditor = () => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [lastSaved, setLastSaved] = useState('Unsaved');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [codeOutput, setCodeOutput] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success');
    const [saving, setSaving] = useState(false);
    const imageInputRef = useRef(null);

    useEffect(() => {
        // Init Quill
        if (quillRef.current) return; // Already initialized

        const toolbarOptions = [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ];

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        image: imageHandler
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: true
                }
            },
            placeholder: 'Start writing your document here...'
        });

        quillRef.current = quill;

        // Text Change Listener
        quill.on('text-change', () => {
            updateStats();
        });

        // Initial Load
        loadSettings();
        loadContent();

        // Auto Save
        const autoSaveInterval = setInterval(() => {
            localAutoSave();
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, []);

    const imageHandler = () => {
        imageInputRef.current.click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && /^image\//.test(file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const range = quillRef.current.getSelection();
                quillRef.current.insertEmbed(range.index, 'image', reader.result);
                quillRef.current.setSelection(range.index + 1);
                triggerToast('Image inserted successfully');
            };
        } else {
            triggerToast('Please select a valid image file', 'error');
        }
    };

    const updateStats = () => {
        if (!quillRef.current) return;
        const text = quillRef.current.getText();
        const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length > 1 ? text.length - 1 : 0;
        setWordCount(words);
        setCharCount(chars);
    };

    const loadSettings = () => {
        const theme = localStorage.getItem(THEME_KEY);
        if (theme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    };

    const loadContent = async () => {
        try {
            // First load from Supabase as per requirements to sync across devices
            const { data, error } = await supabase
                .from('tiktok_website')
                .select('content')
                .eq('id', 1)
                .single();

            if (data && data.content) {
                quillRef.current.root.innerHTML = data.content;
            } else {
                // Fallback to local storage if needed, or just keep empty
                const saved = localStorage.getItem(EDITOR_KEY);
                if (saved) {
                    quillRef.current.root.innerHTML = saved;
                }
            }
            updateStats();
        } catch (error) {
            console.error('Error loading content:', error);
            // Fallback to local storage
            const saved = localStorage.getItem(EDITOR_KEY);
            if (saved) {
                quillRef.current.root.innerHTML = saved;
                updateStats();
            }
        }
    };

    const localAutoSave = () => {
        if (!quillRef.current) return;
        const content = quillRef.current.root.innerHTML;
        localStorage.setItem(EDITOR_KEY, content);
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSaved(`Autosaved locally at ${timeString}`);
    };

    const saveContent = async () => {
        if (!quillRef.current) return;
        setSaving(true);
        const content = quillRef.current.root.innerHTML;

        // Local Save
        localStorage.setItem(EDITOR_KEY, content);

        try {
            // Supabase Save
            const { error: saveError } = await supabase
                .from('tiktok_website')
                .upsert(
                    { id: 1, content: content, updated_at: new Date().toISOString() },
                    { onConflict: 'id' }
                );

            if (saveError) {
                throw new Error(saveError.message);
            }

            // Real-time update
            window.dispatchEvent(new CustomEvent('contentUpdated', {
                detail: { content: content }
            }));

            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastSaved(`Saved at ${timeString}`);
            triggerToast('Document saved successfully');
        } catch (error) {
            console.error('Error saving:', error);
            triggerToast(`Error saving: ${error.message}`, 'error');
        } finally {
            setSaving(false);
        }
    };

    const clearContent = () => {
        if (window.confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
            quillRef.current.setContents([]);
            localAutoSave();
            triggerToast('Editor cleared');
        }
    };

    const triggerToast = (msg, type = 'success') => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    };

    const convertToCode = () => {
        const html = quillRef.current.root.innerHTML;
        const formatted = formatHTML(html);
        setCodeOutput(formatted);
        setShowCodeModal(true);
        // Timeout to let DOM update before highlighting
        setTimeout(() => {
            // We can use Prism here if we want to highlight inside the modal
        }, 100);
    };

    const formatHTML = (html) => {
        let formatted = '';
        let indent = '';
        const tab = '    ';
        html.split(/>\s*</).forEach(function (element) {
            if (element.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && !element.startsWith("img") && !element.startsWith("br")) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(codeOutput).then(() => {
            triggerToast('HTML code copied to clipboard');
        });
    };

    const downloadHtml = () => {
        const blob = new Blob([codeOutput], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`quill-editor-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Header */}
            <header className="quill-header">
                <div className="quill-logo">
                    <i className="fas fa-pen-nib"></i>
                    Professional Editor
                </div>
                <div className="quill-header-controls">
                    <button className="quill-btn quill-btn-primary" onClick={convertToCode}>
                        <i className="fas fa-code"></i> Convert Text to Code
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 5px' }}></div>
                    <button className="quill-btn quill-btn-icon" onClick={toggleTheme} title="Toggle Dark Mode">
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                    </button>
                    <button className="quill-btn quill-btn-icon" onClick={() => setIsFullscreen(!isFullscreen)} title="Fullscreen">
                        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                    </button>
                    <button className="quill-btn quill-btn-icon" onClick={clearContent} title="Clear All">
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    <button className="quill-btn" onClick={saveContent} title="Save Content" disabled={saving}>
                        <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </header>

            {/* Main Editor */}
            <div className="quill-editor-container">
                <div ref={editorRef} style={{ height: '100%', border: 'none' }}></div>
            </div>

            {/* Status Bar */}
            <div className="quill-stats-bar">
                <div className="quill-stats-group">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>
                <div className="quill-stats-group">
                    <span>{lastSaved}</span>
                </div>
            </div>

            {/* View Code Modal */}
            <div className={`quill-modal ${showCodeModal ? 'active' : ''}`} id="codeModal">
                <div className="quill-modal-content">
                    <div className="quill-modal-header">
                        <h3><i className="fas fa-file-code"></i> Generated HTML Code</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="quill-btn" onClick={copyCode}>
                                <i className="fas fa-copy"></i> Copy HTML
                            </button>
                            <button className="quill-btn" onClick={downloadHtml}>
                                <i className="fas fa-download"></i> Download .html
                            </button>
                            <button className="quill-btn quill-btn-icon" onClick={() => setShowCodeModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="quill-modal-body">
                        <pre className="quill-code-output"><code className="language-html">{codeOutput}</code></pre>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <div className={`quill-toast ${showToast ? 'show' : ''}`} style={{ borderLeftColor: toastType === 'error' ? 'var(--error-color)' : 'var(--primary-color)' }}>
                <i className={`fas ${toastType === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                <span>{toastMessage}</span>
            </div>

            <input
                type="file"
                ref={imageInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
        </div>
    );
};

export default QuillEditor;
