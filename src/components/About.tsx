import { motion } from 'framer-motion';

export default function About() {
  // Animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', type: 'spring', bounce: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut', delay: 0.3 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5, ease: 'easeOut' } },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.7 + i * 0.2, ease: 'easeOut' },
    }),
    hover: {
      y: -5,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
      transition: { duration: 0.3, type: 'spring', stiffness: 200 },
    },
  };

  return (
    <section
      id="about"
      className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-purple-600 py-20 flex items-center relative overflow-hidden"
    >
      {/* Subtle glowing decorative circle */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 opacity-20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="container mx-auto px-4 z-10">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-center text-purple-100 mb-16 drop-shadow-lg"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
        >
          About CLOVIX
        </motion.h2>
        {/* Container for Side-by-Side Boxes */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Original Box: Description and Features */}
          <motion.div
            className="flex-1 bg-purple-900 bg-opacity-80 backdrop-blur-md border border-purple-500 border-opacity-30 rounded-2xl p-10 shadow-2xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col gap-8">
              {/* Description */}
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-purple-100 text-xl leading-relaxed font-light">
                  Clovix is your personal style guide powered by AI. We help you discover the best
                  colors and outfits for your skin tone. Our mission? To make fashion effortless, personalized, and timeless for
                  everyone.
                </p>
              </motion.div>
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
                  custom={0}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-2xl font-semibold text-purple-100 mb-2">AI-Powered</h3>
                  <p className="text-purple-200">
                    Cutting-edge skin tone detection for tailored style recommendations.
                  </p>
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                </motion.div>
                <motion.div
                  className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
                  custom={1}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-2xl font-semibold text-purple-100 mb-2">Personalized</h3>
                  <p className="text-purple-200">
                    Fashion suggestions crafted just for your unique vibe.
                  </p>
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                </motion.div>
                <motion.div
                  className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
                  custom={2}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <h3 className="text-2xl font-semibold text-purple-100 mb-2">Trendy</h3>
                  <p className="text-purple-200">
                    Keep up with the latest styles, effortlessly.
                  </p>
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
                </motion.div>
              </div>
            </div>
          </motion.div>
          {/* New Box: Skin Tone Explanation and Contact */}
          <motion.div
            className="flex-1 bg-purple-900 bg-opacity-80 backdrop-blur-md border border-purple-500 border-opacity-30 rounded-2xl p-10 shadow-2xl"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Skin Tone Explanation */}
              <motion.div
                className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
                custom={3}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <h3 className="text-3xl lg:text-4xl font-semibold text-purple-100 mb-2">Understanding Skin Tones</h3>
                <p className="text-purple-200 text-lg lg:text-xl">
                  Skin tones refer to <span className="font-semibold">undertones</span>, not color, enhancing your natural glow.<br />
                  🌞 <span className="font-semibold">Warm undertones</span> (golden/yellow) shine with earthy shades like reds and oranges.<br />
                  🌀 <span className="font-semibold">Cool undertones</span> (blue/pink) pop with blues and purples.<br />
                  ⚖️ <span className="font-semibold">Neutral undertones</span> balance both, glowing with versatile hues.<br />
                  Matching undertones elevates your radiance! 💫
                </p>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
              </motion.div>
              {/* Contact Information */}
              <motion.div
                className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
                custom={4}
                variants={featureVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <h3 className="text-3xl lg:text-4xl font-semibold text-purple-100 mb-2">Connect with Us 📩</h3>
                <p className="text-purple-200 text-lg lg:text-xl">
                  📷 Instagram: <a href="https://instagram.com/clovix.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100">@clovix.in</a><br />
                  📧 Email: <a href="mailto:support@clovix.com" className="underline hover:text-purple-100">support@clovix.vercel.app</a><br />
                  🌍 Website: <a href="https://clovix.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-100">clovix.vercel.app</a><br />
                  Reach out for style tips and support! 💬
                </p>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Future Plan Section */}
        <motion.div
          className="mt-8 bg-gray-900 bg-opacity-80 rounded-lg p-6 max-w-4xl mx-auto"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="relative bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300"
            custom={5}
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <h3 className="text-3xl font-bold text-purple-100 mb-4">Our Future Vision</h3>
            <p className="text-purple-100 text-lg leading-relaxed">
              We're excited to announce that Clovix is working on a revolutionary <span className="font-semibold">Virtual Try-On</span> feature! 
              Soon, you'll be able to try on clothes virtually, seeing how outfits look on you in real-time, 
              making your shopping experience even more seamless and fun.
            </p>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}