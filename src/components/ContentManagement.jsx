import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import { motion } from 'framer-motion';
import './ContentEditor.css';

const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjIzMDA3OTksImp0aSI6Ijg5OTk2NDRlLWM5MWItNGI0Ny1iOGY1LWYwMzI0ZmU0ZjkzZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImE0NTdiOWRkIn0.EI5vY46uDveiNZxbkgi0kV8okb4d9DozALvcriPRxAYffnTu9l37kGtpf4yOFKk44ZJcgh0Tqm43ntw9D6_Naw';

const ContentManagement = () => {
	const editorContainerRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const [content, setContent] = useState('');
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState(null);
	const [error, setError] = useState(null);
	const cloud = useCKEditorCloud({ version: '47.1.0', premium: true });

	useEffect(() => {
		setIsLayoutReady(true);
		loadContent();
		return () => setIsLayoutReady(false);
	}, []);

	const loadContent = async () => {
		try {
			// Load from localStorage
			const savedSettings = localStorage.getItem('admin_settings');
			if (savedSettings) {
				const data = JSON.parse(savedSettings);
				setContent(data.content || '');
			}
		} catch (error) {
			console.warn('Error loading content:', error);
		}
	};

	const saveContent = async () => {
		setSaving(true);
		setError(null);
		setSuccess(null);

		try {
			// Get existing settings from localStorage
			const existingSettings = localStorage.getItem('admin_settings');
			let settingsData = {};
			
			if (existingSettings) {
				settingsData = JSON.parse(existingSettings);
			}

			// Update content in settings
			settingsData.content = content;

			// Save to localStorage
			localStorage.setItem('admin_settings', JSON.stringify(settingsData));
			
			// Dispatch custom event for real-time updates
			window.dispatchEvent(new CustomEvent('contentUpdated', { 
				detail: { content: content } 
			}));

			setSuccess('Content saved successfully!');
			
			// Clear success message after 3 seconds
			setTimeout(() => {
				setSuccess(null);
			}, 3000);
		} catch (error) {
			setError('Error saving content: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const clearContent = () => {
		setContent('');
		setError(null);
		setSuccess(null);
	};

	const { ClassicEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== 'success' || !isLayoutReady) {
			return {};
		}

		const {
			ClassicEditor,
			Autosave,
			Essentials,
			Paragraph,
			ImageInsertViaUrl,
			ImageBlock,
			ImageToolbar,
			AutoImage,
			CloudServices,
			ImageUpload,
			ImageCaption,
			ImageInline,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			List,
			ListProperties,
			Table,
			TableToolbar,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TodoList,
			Mention,
			Bold,
			Italic,
			Underline,
			Strikethrough,
			Code,
			Subscript,
			Superscript,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			RemoveFormat,
			Highlight,
			Heading,
			Link,
			AutoLink,
			Bookmark,
			BlockQuote,
			HorizontalLine,
			CodeBlock,
			Indent,
			IndentBlock,
			Alignment,
			Style,
			GeneralHtmlSupport,
			BalloonToolbar,
			BlockToolbar
		} = cloud.CKEditor;
		const { LineHeight } = cloud.CKEditorPremiumFeatures;

		return {
			ClassicEditor,
			editorConfig: {
				toolbar: {
					items: [
						'undo',
						'redo',
						'|',
						'heading',
						'style',
						'|',
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'strikethrough',
						'subscript',
						'superscript',
						'code',
						'removeFormat',
						'|',
						'horizontalLine',
						'link',
						'bookmark',
						'insertTable',
						'highlight',
						'blockQuote',
						'codeBlock',
						'|',
						'alignment',
						'lineHeight',
						'|',
						'bulletedList',
						'numberedList',
						'todoList',
						'outdent',
						'indent'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					Alignment,
					AutoImage,
					AutoLink,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					BlockToolbar,
					Bold,
					Bookmark,
					CloudServices,
					Code,
					CodeBlock,
					Essentials,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					GeneralHtmlSupport,
					Heading,
					Highlight,
					HorizontalLine,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsertViaUrl,
					ImageResize,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					Indent,
					IndentBlock,
					Italic,
					LineHeight,
					Link,
					List,
					ListProperties,
					Mention,
					Paragraph,
					RemoveFormat,
					Strikethrough,
					Style,
					Subscript,
					Superscript,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableProperties,
					TableToolbar,
					TodoList,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link', '|', 'bulletedList', 'numberedList'],
				blockToolbar: [
					'fontSize',
					'fontColor',
					'fontBackgroundColor',
					'|',
					'bold',
					'italic',
					'|',
					'link',
					'insertTable',
					'|',
					'bulletedList',
					'numberedList',
					'outdent',
					'indent'
				],
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				heading: {
					options: [
						{
							model: 'paragraph',
							title: 'Paragraph',
							class: 'ck-heading_paragraph'
						},
						{
							model: 'heading1',
							view: 'h1',
							title: 'Heading 1',
							class: 'ck-heading_heading1'
						},
						{
							model: 'heading2',
							view: 'h2',
							title: 'Heading 2',
							class: 'ck-heading_heading2'
						},
						{
							model: 'heading3',
							view: 'h3',
							title: 'Heading 3',
							class: 'ck-heading_heading3'
						},
						{
							model: 'heading4',
							view: 'h4',
							title: 'Heading 4',
							class: 'ck-heading_heading4'
						},
						{
							model: 'heading5',
							view: 'h5',
							title: 'Heading 5',
							class: 'ck-heading_heading5'
						},
						{
							model: 'heading6',
							view: 'h6',
							title: 'Heading 6',
							class: 'ck-heading_heading6'
						}
					]
				},
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:inline',
						'imageStyle:wrapText',
						'imageStyle:breakText',
						'|',
						'resizeImage'
					]
				},
				initialData: content || '<h2>Welcome to Content Management</h2><p>Start creating your content here...</p>',
				licenseKey: LICENSE_KEY,
				lineHeight: {
					supportAllValues: true
				},
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				mention: {
					feeds: [
						{
							marker: '@',
							feed: []
						}
					]
				},
				placeholder: 'Type or paste your content here!',
				style: {
					definitions: [
						{
							name: 'Article category',
							element: 'h3',
							classes: ['category']
						},
						{
							name: 'Title',
							element: 'h2',
							classes: ['document-title']
						},
						{
							name: 'Subtitle',
							element: 'h3',
							classes: ['document-subtitle']
						},
						{
							name: 'Info box',
							element: 'p',
							classes: ['info-box']
						},
						{
							name: 'CTA Link Primary',
							element: 'a',
							classes: ['button', 'button--green']
						},
						{
							name: 'CTA Link Secondary',
							element: 'a',
							classes: ['button', 'button--black']
						},
						{
							name: 'Marker',
							element: 'span',
							classes: ['marker']
						},
						{
							name: 'Spoiler',
							element: 'span',
							classes: ['spoiler']
						}
					]
				},
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [cloud, isLayoutReady, content]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-4 lg:p-6"
    >
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Edit Website Content (Above FAQs)</h2>
        <p className="text-sm lg:text-base text-gray-600">Create and manage content that will be displayed above the FAQ section on your website.</p>
      </div>

			{success && (
				<motion.div 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
				>
					{success}
				</motion.div>
			)}

			{error && (
				<motion.div 
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
				>
					{error}
				</motion.div>
			)}

			<div className="main-container">
				<div
					className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar"
					ref={editorContainerRef}
				>
					<div className="editor-container__editor">
						<div ref={editorRef}>
							{ClassicEditor && editorConfig && (
								<CKEditor 
									editor={ClassicEditor} 
									config={editorConfig}
									data={content}
									onChange={(event, editor) => {
										const data = editor.getData();
										setContent(data);
									}}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
				<button
					onClick={clearContent}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
				>
					Clear Content
				</button>
				<button
					onClick={loadContent}
					className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
				>
					Reset
				</button>
				<button
					onClick={saveContent}
					disabled={saving}
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
				>
					{saving ? 'Saving...' : 'Save Content'}
				</button>
			</div>
		</motion.div>
	);
};

export default ContentManagement;
