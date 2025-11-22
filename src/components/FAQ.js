import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Is this downloader free to use?",
      answer: "Yes, TikSaver is completely free to use. You can download as many TikTok videos as you want without any registration or payment required. We believe in providing free access to this service for everyone."
    },
    {
      question: "Can I download videos without watermark?",
      answer: "Absolutely! TikSaver provides clean downloads without TikTok watermarks. You can download videos in HD quality (720p, 480p, 360p) and MP3 audio files, all without any watermarks or branding."
    },
    {
      question: "Do you store my videos or personal data?",
      answer: "No, we don't store any of your videos or personal data. Your privacy is our priority. We only process the video URLs you provide to generate download links, and we don't keep any records of your downloads or personal information."
    },
    {
      question: "Can I use it on my mobile phone?",
      answer: "Yes! TikSaver is fully responsive and works perfectly on all devices including mobile phones, tablets, and desktop computers. Simply open our website in your mobile browser and start downloading TikTok videos instantly."
    },
    {
      question: "What video qualities are available?",
      answer: "We provide multiple quality options including HD (720p), standard (480p), and low quality (360p) video downloads. You can also download just the audio as MP3 files. All formats are available instantly after processing."
    },
    {
      question: "Is there a limit on how many videos I can download?",
      answer: "No, there are no limits! You can download as many TikTok videos as you want, whenever you want. Our service is designed to handle high volume usage without any restrictions or daily limits."
    },
    {
      question: "What if the download fails?",
      answer: "If a download fails, it's usually due to an invalid URL or temporary server issues. Make sure you're using a valid TikTok video URL and try again. If the problem persists, the video might be private or restricted."
    },
    {
      question: "Can I download videos from private accounts?",
      answer: "No, you can only download videos from public TikTok accounts. Private videos are protected and cannot be downloaded through our service or any other legitimate downloader."
    }
  ];


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about TikSaver. Can't find what you're looking for? Contact us!
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a
              href="#contact"
              className="inline-flex items-center space-x-2 bg-white text-pink-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;