# TikSaver - TikTok Video Downloader

A modern, professional TikTok video downloader built with React.js, Tailwind CSS, and Framer Motion. Download TikTok videos without watermark in HD quality.

## Features

- 🚀 **Fast & Secure**: Download TikTok videos instantly with our optimized API
- 🎥 **HD Quality**: Get videos in high definition without watermarks
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🎨 **Modern UI**: Beautiful, animated interface with smooth transitions
- 🔒 **Privacy First**: No data storage, completely private
- 💯 **100% Free**: No hidden costs or subscriptions

## Tech Stack

- **React.js** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **RapidAPI** - TikTok download API integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tiksaver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation header
│   ├── Hero.js            # Main hero section with download form
│   ├── Downloader.js       # Video download logic
│   ├── Preview.js          # Video preview and download options
│   ├── HowToUse.js         # How to use guide
│   ├── FAQ.js              # Frequently asked questions
│   └── Footer.js           # Footer section
├── App.js                  # Main app component
├── App.css                 # Custom styles
└── index.css               # Tailwind CSS imports
```

## API Integration

The app uses the Social Download All-in-One API from RapidAPI:

- **Endpoint**: `https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink`
- **Method**: POST
- **Headers**: RapidAPI key and host
- **Body**: TikTok video URL

## Features Breakdown

### Header
- Sticky navigation with smooth scroll
- Responsive mobile menu
- Brand logo with gradient text

### Hero Section
- Animated background with gradient effects
- URL input with validation
- Download button with loading states
- Feature highlights

### Download Section
- Real-time API integration
- Loading states and error handling
- Video preview with metadata
- Multiple download quality options

### How to Use
- Step-by-step guide with animations
- Feature highlights
- Why choose TikSaver section

### FAQ
- Collapsible accordion interface
- Comprehensive Q&A
- Contact CTA

### Footer
- Social media links
- Quick navigation
- Contact information
- Legal links

## Customization

### Colors
The app uses a pink-to-purple gradient theme. You can customize colors in:
- `tailwind.config.js` - Theme configuration
- `src/index.css` - Custom CSS variables

### Animations
Framer Motion animations can be customized in each component:
- Page transitions
- Hover effects
- Scroll animations
- Loading states

## Performance Optimizations

- Lazy loading for components
- Optimized images and assets
- Efficient API calls
- Smooth animations with Framer Motion
- Responsive design for all devices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@tiksaver.com or create an issue in the repository.

---

Built with ❤️ using React.js and Tailwind CSS