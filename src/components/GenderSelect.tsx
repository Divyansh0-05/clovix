import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenderSelectProps {
  onSelect: (gender: string) => void;
}

export default function GenderSelect({ onSelect }: GenderSelectProps) {
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
    setTimeout(() => onSelect(gender), 600);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                background: `rgba(${Math.random() > 0.5 ? '139, 92, 246' : '236, 72, 153'}, ${Math.random() * 0.3 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <motion.div
          className="mb-4 z-10"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wider"
            style={{
              background: 'linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            CLOVIX
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-white/70 text-lg md:text-xl mb-10 z-10 text-center px-4 font-light"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Let's personalize your experience
        </motion.p>

        {/* Gender Cards */}
        <motion.div
          className="flex flex-row gap-6 md:gap-10 z-10 px-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {/* Male Card */}
          <motion.div
            className="relative cursor-pointer group"
            onMouseEnter={() => setHoveredGender('male')}
            onMouseLeave={() => setHoveredGender(null)}
            onClick={() => handleSelect('male')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={selectedGender === 'male' ? { scale: 1.1, y: -10 } : {}}
          >
            <div className={`
              relative w-[140px] h-[200px] md:w-[240px] md:h-[340px] rounded-2xl md:rounded-3xl overflow-hidden
              shadow-2xl transition-all duration-500
              ${hoveredGender === 'male' ? 'shadow-blue-500/40' : 'shadow-black/30'}
              ${selectedGender === 'male' ? 'ring-4 ring-blue-400 shadow-blue-500/50' : ''}
            `}>
              <img
                src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500"
                alt="Men's Fashion"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-1">Men</h3>
                <p className="text-white/60 text-xs md:text-sm hidden md:block">Explore men's fashion</p>
              </div>
              {selectedGender === 'male' && (
                <motion.div
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Female Card */}
          <motion.div
            className="relative cursor-pointer group"
            onMouseEnter={() => setHoveredGender('female')}
            onMouseLeave={() => setHoveredGender(null)}
            onClick={() => handleSelect('female')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={selectedGender === 'female' ? { scale: 1.1, y: -10 } : {}}
          >
            <div className={`
              relative w-[140px] h-[200px] md:w-[240px] md:h-[340px] rounded-2xl md:rounded-3xl overflow-hidden
              shadow-2xl transition-all duration-500
              ${hoveredGender === 'female' ? 'shadow-pink-500/40' : 'shadow-black/30'}
              ${selectedGender === 'female' ? 'ring-4 ring-pink-400 shadow-pink-500/50' : ''}
            `}>
              <img
                src="https://images.unsplash.com/photo-1520048330564-702a8875182f?w=500"
                alt="Women's Fashion"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-1">Women</h3>
                <p className="text-white/60 text-xs md:text-sm hidden md:block">Explore women's fashion</p>
              </div>
              {selectedGender === 'female' && (
                <motion.div
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-pink-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          className="text-white/40 text-sm mt-8 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Tap to select your preference
        </motion.p>

        <style>{`
          @keyframes shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
