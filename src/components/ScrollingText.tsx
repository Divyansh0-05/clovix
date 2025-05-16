import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollingText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Define screen width and approximate text width
  const screenWidth = window.innerWidth;
  const textWidth = 3000; // Wide enough to start off-screen

  // Line 1 and Line 3: Move from left edge to right edge
  const leftToRight = useTransform(scrollYProgress, [0, 1], [-textWidth, screenWidth]);
  // Line 2: Move from right edge to left edge
  const rightToLeft = useTransform(scrollYProgress, [0, 1], [screenWidth, -textWidth]);

  return (
    <div 
      ref={containerRef}
      className="absolute w-full h-full flex flex-col justify-center gap-8 overflow-hidden z-10"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #4c1d95 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* Line 1 - Starts from left, moves right */}
      <div className="relative overflow-hidden">
        <motion.div 
          ref={line1Ref}
          className="text-[100px] font-extrabold whitespace-nowrap tracking-tight"
          style={{
            color: 'rgba(251, 191, 36, 0.25)',
            x: leftToRight,
            willChange: 'transform',
            fontFamily: "'Poppins', sans-serif",
            textTransform: 'uppercase',
          }}
          transition={{ ease: 'linear' }} // Smooth movement
        >
          {Array(10).fill('Clovix').join(' ')}
        </motion.div>
      </div>

      {/* Line 2 - Starts from right, moves left */}
      <div className="relative overflow-hidden">
        <motion.div 
          ref={line2Ref}
          className="text-[100px] font-extrabold whitespace-nowrap tracking-tight"
          style={{
            color: 'rgba(245, 158, 11, 0.35)',
            x: rightToLeft,
            willChange: 'transform',
            fontFamily: "'Poppins', sans-serif",
            textTransform: 'uppercase',
          }}
          transition={{ ease: 'linear' }} // Smooth movement
        >
          {Array(10).fill('Clovix').join(' ')}
        </motion.div>
      </div>

      {/* Line 3 - Starts from left, moves right */}
      <div className="relative overflow-hidden">
        <motion.div 
          ref={line3Ref}
          className="text-[100px] font-extrabold whitespace-nowrap tracking-tight"
          style={{
            color: 'rgba(234, 179, 8, 0.2)',
            x: leftToRight,
            willChange: 'transform',
            fontFamily: "'Poppins', sans-serif",
            textTransform: 'uppercase',
          }}
          transition={{ ease: 'linear' }} // Smooth movement
        >
          {Array(10).fill('Clovix').join(' ')}
        </motion.div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}