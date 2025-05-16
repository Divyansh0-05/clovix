import ScrollingText from './ScrollingText';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Hero() {
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(true); // State for video popup, set to true for every page load
  const videoPopupRef = useRef<HTMLDivElement>(null); // Ref for video popup

  const scrollToDetect = () => {
    document.getElementById('detect')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle clicks outside the video popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videoPopupRef.current && !videoPopupRef.current.contains(event.target as Node)) {
        setIsVideoPopupOpen(false);
      }
    };
    if (isVideoPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVideoPopupOpen]);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-[#15286b] to-[#3c5bcc]"
    >
      <ScrollingText />
      <div className="relative z-20 space-y-4 text-center px-4">
        <motion.h1
          className="text-4xl text-white font-bold uppercase tracking-wide"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          Find Your Perfect Color Outfits!
        </motion.h1>
        <motion.p
          className="text-xl mb-6 text-white font-bold mobile-hidden" // Added unique class 'mobile-hidden'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        >
          "Your skin under tone is unique, and so is your style! Let our AI-powered tool recommend clothing with colors that suit you perfectly."
        </motion.p>
        <motion.button
          onClick={scrollToDetect}
          className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          whileHover={{ scale: 1.05, backgroundColor: '#7c3aed' }}
          whileTap={{ scale: 0.95 }}
        >
          Discover Your Skin Tone
        </motion.button>
      </div>

      {/* Video Popup */}
      {isVideoPopupOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black bg-opacity-60 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVideoPopupOpen(false);
            }
          }}
        >
          <motion.div
            ref={videoPopupRef}
            className="w-full max-w-3xl relative"
            style={{ background: 'transparent' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setIsVideoPopupOpen(false);
              }}
              className="absolute top-3 right-12 text-white hover:text-gray-400 transition-colors z-10 p-1 close-button"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <video
              className="w-full h-auto video-popup"
              style={{ aspectRatio: '9/16', maxWidth: '400px', maxHeight: '700px', border: 'none', transform: 'translateX(256px)', borderRadius: '16px' }}
              autoPlay
              loop
              muted
              preload="metadata"
            >
              <source
                src="src/components/Clovix4.mp4"
                type="video/mp4"
                media="(max-width: 768px)"
              />
              <source
                src="src/components/Clovix4.mp4" /* Replace 'src/components/Clovix.mp4' with your video URL */
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      )}

      <style>
        {`
          @media (max-width: 768px) {
            .mobile-hidden {
              display: none; /* Hides only the paragraph on mobile */
            }
            .text-4xl {
              font-size: 2xl !important; /* Reduces h1 size to 1.5rem (24px) on mobile */
            }
            .text-xl {
              font-size: lg !important; /* Reduces button text size to 1rem (16px) on mobile */
            }
            .video-popup {
              max-width: 250px !important; /* Smaller width for mobile */
              max-height: 444px !important; /* Smaller height for mobile, maintaining 9:16 aspect ratio */
              transform: translateX(-10px) !important; /* Slightly more centered on mobile */
              border-radius: 24px !important; /* More curved edges on mobile */
            }
            .close-button {
              right: 8px !important; /* Closer to video on mobile */
            }
          }
        `}
      </style>
    </section>
  );
}