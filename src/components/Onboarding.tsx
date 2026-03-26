import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onComplete: (token: string, user: any, gender: string) => void;
  apiUrl: string;
}

export default function Onboarding({ onComplete, apiUrl }: OnboardingProps) {
  const [step, setStep] = useState<'auth' | 'gender'>('auth');
  const [isSignup, setIsSignup] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authData, setAuthData] = useState<{ token: string; user: any } | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [hoveredGender, setHoveredGender] = useState<string | null>(null);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const body = isSignup
        ? { fullName, email, password }
        : { email, password };

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setAuthData({ token: data.token, user: data.user });
        // If user already has gender (returning login), skip gender step
        if (data.user.gender) {
          onComplete(data.token, data.user, data.user.gender);
        } else {
          setStep('gender');
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Cannot connect to server. Please make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenderSelect = async (gender: string) => {
    setSelectedGender(gender);

    // Save gender to backend
    if (authData) {
      try {
        await fetch(`${apiUrl}/api/auth/gender`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({ gender }),
        });
      } catch (err) {
        console.error('Failed to save gender:', err);
      }

      // Short delay for animation, then complete
      setTimeout(() => {
        onComplete(authData.token, { ...authData.user, gender }, gender);
      }, 600);
    }
  };

  const handleSkipAuth = () => {
    setStep('gender');
  };

  const handleGuestGender = (gender: string) => {
    setSelectedGender(gender);
    setTimeout(() => {
      onComplete('', null, gender);
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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

      <AnimatePresence mode="wait">
        {step === 'auth' ? (
          <motion.div
            key="auth"
            className="relative z-10 w-full max-w-md mx-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold tracking-wider text-center mb-2"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              CLOVIX
            </motion.h1>
            <p className="text-white/50 text-center text-sm mb-8">Find Your Perfect Color Outfits</p>

            {/* Auth Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>

              {error && (
                <motion.div
                  className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    />
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 6 characters)"
                    required
                    minLength={6}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                    isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/30'
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
                </motion.button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-white/50 text-sm">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => { setIsSignup(!isSignup); setError(null); }}
                    className="text-purple-300 hover:text-purple-200 font-medium hover:underline transition-colors"
                  >
                    {isSignup ? 'Login' : 'Sign Up'}
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={handleSkipAuth}
                  className="text-white/30 hover:text-white/60 text-xs transition-colors"
                >
                  Skip for now →
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gender"
            className="relative z-10 flex flex-col items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Logo */}
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold tracking-wider text-center mb-2"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              CLOVIX
            </motion.h1>
            <p className="text-white/70 text-lg md:text-xl mb-8 text-center font-light">
              Select your preference
            </p>

            {/* Gender Cards */}
            <div className="flex flex-row gap-6 md:gap-10">
              {/* Male Card */}
              <motion.div
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredGender('male')}
                onMouseLeave={() => setHoveredGender(null)}
                onClick={() => authData ? handleGenderSelect('male') : handleGuestGender('male')}
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
                onClick={() => authData ? handleGenderSelect('female') : handleGuestGender('female')}
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
            </div>

            <p className="text-white/40 text-sm mt-8">
              Tap to select your preference
            </p>

            {!authData && (
              <button
                onClick={() => setStep('auth')}
                className="mt-4 text-purple-300/60 hover:text-purple-300 text-sm transition-colors"
              >
                ← Back to login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </motion.div>
  );
}
