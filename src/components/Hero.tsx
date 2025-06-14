import ScrollingText from './ScrollingText';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToDetect = () => {
    document.getElementById('detect')?.scrollIntoView({ behavior: 'smooth' });
  };
 
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
          className="text-xl mb-6 text-white font-bold mobile-hidden"
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
          }
        `}
      </style>
    </section>
  );
}