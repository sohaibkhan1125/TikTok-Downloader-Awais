import React, { useState, useEffect } from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/js/third_party/font_awesome.min.js';
import { supabase } from '../supabaseClient';
import './ContentEditor.css';

const froalaConfig = {
	key: 'nQE2uG3B1F1nmnspC5qpH3B3C11A6D5F5F5G4A-8A-7A2cefE3B2F3C2G2ilva1EAJLQCVLUVBf1NXNRSSATEXA-62WVLGKF2G2H2G1I4B3B2B8D7F6==',
	placeholderText: 'Type or paste your content here!',
	toolbarButtons: [
		['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikeThrough'],
		['paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent'],
		['insertLink', 'insertTable', 'quote', 'html']
	],
	charCounterCount: true
};

const FroalaContentManagement = () => {
	const [content, setContent] = useState('');
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		loadContent();
	}, []);

	const loadContent = async () => {
		try {
			// Load from Supabase
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
				setContent(data.content || '');
			}
		} catch (err) {
			console.error('Error loading content:', err);
		}
	};

	const saveContent = async () => {
		setSaving(true);
		setError(null);
		setSuccess(null);

		try {
			// Save to Supabase
			const { error: saveError } = await supabase
				.from('tiktok_website')
				.upsert(
					{ id: 1, content: content, updated_at: new Date().toISOString() },
					{ onConflict: 'id' }
				);

			if (saveError) {
				throw new Error(saveError.message);
			}

			// Dispatch custom event for real-time updates (backward compatibility)
			window.dispatchEvent(new CustomEvent('settingsUpdated', {
				detail: { content: content }
			}));
			window.dispatchEvent(new CustomEvent('contentUpdated', {
				detail: { content: content }
			}));

			setSuccess('Content saved successfully to Supabase!');

			// Clear success message after 3 seconds
			setTimeout(() => {
				setSuccess(null);
			}, 3000);
		} catch (err) {
			setError('Error saving content: ' + err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Content Management</h2>
				<p className="text-gray-600">Create and manage content that will be displayed above the FAQ section on your website.</p>
			</div>

			{success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{success}
				</div>
			)}

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="main-container">
				<FroalaEditorComponent
					tag="textarea"
					model={content}
					onModelChange={setContent}
					config={froalaConfig}
				/>
			</div>

			<div className="mt-6 flex justify-end space-x-4">
				<button
					onClick={loadContent}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
				>
					Reset
				</button>
				<button
					onClick={saveContent}
					disabled={saving}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{saving ? 'Saving...' : 'Save Content'}
				</button>
			</div>
		</div>
	);
};

export default FroalaContentManagement;


