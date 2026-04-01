import { useState, useRef, useEffect } from 'react';
import { Heart, User, Home, Camera, ShoppingBag, Shirt, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Outfit } from './outfit';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onRegister: (fullName: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  username: string;
  userEmail: string;
  selectedGender: string | null;
  onGenderChange: (gender: string) => void;
  wishlistCount: number;
  wishlist: Outfit[];
  toggleWishlist: (outfit: Outfit) => void;
  currentPath: string;
  onNavigate: (path: string, sectionId?: string) => void;
}

export default function Navbar({
  isLoggedIn,
  onLogout,
  onLogin,
  onRegister,
  username,
  userEmail,
  selectedGender,
  onGenderChange,
  wishlistCount,
  wishlist,
  toggleWishlist,
  currentPath,
  onNavigate,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [isWelcomePopupOpen, setIsWelcomePopupOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const welcomePopupRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleNavClick = (sectionId: string, path = '/') => {
    closeMobileMenu();
    onNavigate(path, sectionId);
  };

  const toggleAuthPopup = () => {
    closeMobileMenu();
    setAuthError(null);
    setIsAuthPopupOpen(!isAuthPopupOpen);
  };

  const toggleWishlistPopup = () => {
    closeMobileMenu();
    setIsWishlistOpen(prev => !prev);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      let result;
      if (isSignupMode) {
        result = await onRegister(nameInput, emailInput, passwordInput);
      } else {
        result = await onLogin(emailInput, passwordInput);
      }

      if (result.success) {
        setIsAuthPopupOpen(false);
        setIsWelcomePopupOpen(true);
        setEmailInput('');
        setPasswordInput('');
        setNameInput('');
      } else {
        setAuthError(result.message);
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    setIsAuthPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsAuthPopupOpen(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setIsWishlistOpen(false);
      }
      if (welcomePopupRef.current && !welcomePopupRef.current.contains(event.target as Node)) {
        setIsWelcomePopupOpen(false);
      }
    };
    if (isAuthPopupOpen || isWishlistOpen || isWelcomePopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAuthPopupOpen, isWishlistOpen, isWelcomePopupOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const hoverAnimation = {
    whileHover: { y: -5, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  };

  const iconNames = {
    home: 'Home',
    detect: 'Detect',
    shop: 'Shop',
    closet: 'Personal Closet',
    login: 'Login',
    account: 'Account',
    wishlist: 'Wishlist',
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-[rgba(240,232,232,0.95)] backdrop-blur-lg flex justify-between items-center px-4 sm:px-6 md:px-6 h-20 z-50 shadow-lg">
        <div className="relative h-full flex items-center w-[150px] sm:w-[180px]">
          <div className="handbag-animation">
            <div className="handbag" style={{ backgroundColor: "#5B21B6" }}>
              <div className="bag-flap"></div>
              <div className="bag-hardware"></div>
              <div className="bag-stitching"></div>
              <div className="bag-stitching"></div>
              <div className="bag-stitching"></div>
            </div>
            <div className="logo-text" style={{ color: '#5B21B6' }}>CLOVIX</div>
          </div>
        </div>

        <div className="flex items-center">
          <motion.div
            className="relative flex flex-col items-center mr-4 md:hidden"
            onHoverStart={() => setHoveredIcon('wishlist')}
            onHoverEnd={() => setHoveredIcon(null)}
            {...hoverAnimation}
          >
            <button
              onClick={toggleWishlistPopup}
              className="text-[#5B21B6] hover:text-[#6d28d9] transition-colors duration-300 relative p-2"
            >
              <Heart className="w-7 h-7" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#5B21B6] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlistCount}
                </span>
              )}
            </button>
          </motion.div>
          <div
            className={`hamburger md:hidden cursor-pointer z-[51] ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span className={`block w-6 h-0.5 bg-[#5B21B6] my-1.5 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#5B21B6] my-1.5 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#5B21B6] my-1.5 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </div>

        <div
          className={`
            nav-links fixed md:static top-20 left-0 transform md:transform-none
            w-full md:w-auto h-auto md:h-auto
            bg-[rgba(240,232,232,0.98)] md:bg-transparent
            flex flex-row md:flex-row items-center justify-center md:justify-center
            gap-8 md:gap-10 py-4 md:py-0
            transition-all duration-300 ease-in-out
            rounded-b-lg md:rounded-none shadow-lg md:shadow-none z-40 md:z-auto
            ${isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0 pointer-events-none md:pointer-events-auto md:translate-y-0 md:opacity-100'
            }
          `}
        >
          {[
            { id: 'home', Icon: Home, section: '#home', path: '/' },
            { id: 'detect', Icon: Camera, section: '#detect', path: '/' },
            { id: 'shop', Icon: ShoppingBag, section: '#shop', path: '/' },
            { id: 'closet', Icon: Shirt, path: '/closet' },
            { id: isLoggedIn ? 'account' : 'login', Icon: User, action: toggleAuthPopup },
            { id: 'wishlist', Icon: Heart, action: toggleWishlistPopup },
          ].map(({ id, Icon, section, path, action }) => (
            <motion.div
              key={id}
              className={`relative flex flex-col items-center ${id === 'wishlist' ? 'wishlist-icon' : ''}`}
              onHoverStart={() => setHoveredIcon(id)}
              onHoverEnd={() => setHoveredIcon(null)}
              {...hoverAnimation}
            >
              <button
                onClick={() => {
                  if (section) handleNavClick(section, path);
                  else if (path) onNavigate(path);
                  else if (action) action();
                }}
                className={`relative p-2 transition-colors duration-300 ${
                  currentPath === path && id === 'closet'
                    ? 'text-[#6d28d9]'
                    : 'text-[#5B21B6] hover:text-[#6d28d9]'
                }`}
              >
                <Icon className="w-7 h-7 md:w-9 md:h-9" />
                {id === 'wishlist' && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#5B21B6] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>
              {hoveredIcon === id && (
                <motion.span
                  className="absolute top-full mt-2 bg-[#5B21B6] text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg whitespace-nowrap hidden md:block"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {iconNames[id as keyof typeof iconNames]}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Auth / Profile Popup */}
      {isAuthPopupOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black bg-opacity-60 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsAuthPopupOpen(false); }}
        >
          <motion.div
            ref={popupRef}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAuthPopupOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors z-10 p-1"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {isLoggedIn ? (
              /* ===== PROFILE VIEW ===== */
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center text-[#5B21B6]">My Profile</h2>

                {/* User Info */}
                <div className="bg-purple-50 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{username || 'User'}</h3>
                      <p className="text-gray-500 text-sm">{userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Gender Preference */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Gender Preference
                  </h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onGenderChange('male')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                        selectedGender === 'male'
                          ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className="text-lg">👔</span> Men
                      {selectedGender === 'male' && <span className="ml-2 text-blue-500">✓</span>}
                    </button>
                    <button
                      onClick={() => onGenderChange('female')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 border-2 ${
                        selectedGender === 'female'
                          ? 'bg-pink-50 border-pink-400 text-pink-700 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-pink-200 hover:bg-pink-50/50'
                      }`}
                    >
                      <span className="text-lg">👗</span> Women
                      {selectedGender === 'female' && <span className="ml-2 text-pink-500">✓</span>}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Change anytime to see different recommendations
                  </p>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 py-2.5 px-4 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              /* ===== LOGIN / SIGNUP FORM ===== */
              <div>
                <h2 className="text-2xl font-semibold mb-5 text-center text-[#5B21B6]">
                  {isSignupMode ? 'Sign Up' : 'Login'}
                </h2>

                {authError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit}>
                  {isSignupMode && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                      <input id="name" type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent" />
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input id="email" type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required autoComplete="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                    <input id="password" type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required minLength={6} autoComplete={isSignupMode ? 'new-password' : 'current-password'} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B21B6] focus:border-transparent" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className={`w-full py-2 px-4 rounded-lg transition-colors mb-4 text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5B21B6] hover:bg-[#6d28d9]'}`}>
                    {isSubmitting ? 'Please wait...' : isSignupMode ? 'Sign Up' : 'Login'}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" onClick={() => { setIsSignupMode(!isSignupMode); setAuthError(null); }} className="text-[#5B21B6] hover:underline font-medium">
                      {isSignupMode ? 'Login' : 'Sign Up'}
                    </button>
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Welcome Popup */}
      {isWelcomePopupOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black bg-opacity-60 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsWelcomePopupOpen(false); }}
        >
          <motion.div
            ref={welcomePopupRef}
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsWelcomePopupOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 p-1" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="text-2xl font-semibold mb-5 text-center text-[#5B21B6]">
              Welcome{username ? `, ${username}` : ''}! 🎉
            </h2>
            <p className="text-center text-gray-700 mb-4">Find your perfect outfit that matches your skin tone!</p>
            <button onClick={() => setIsWelcomePopupOpen(false)} className="w-full bg-[#5B21B6] text-white py-2 px-4 rounded-lg hover:bg-[#6d28d9] transition-colors">
              Let's Go
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Wishlist Popup */}
      {isWishlistOpen && (
        <motion.div
          ref={wishlistRef}
          className="fixed top-[80px] right-4 w-80 bg-white rounded-xl shadow-2xl p-4 z-[100] max-h-[70vh] overflow-y-auto"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Wishlist</h3>
          {wishlist.length === 0 ? (
            <p className="text-gray-600 text-center">Please fill your wish! 😊</p>
          ) : (
            <div className="space-y-4">
              {wishlist.map(outfit => (
                <div key={outfit._id} className="flex items-center space-x-4">
                  <a href={outfit.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 flex-1">
                    <img src={outfit.imageUrl} alt={outfit.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 hover:text-[#7c3aed] transition-colors">{outfit.name}</h4>
                      <p className="text-xs text-gray-600">{outfit.price}</p>
                    </div>
                  </a>
                  <button
                    onClick={() => toggleWishlist(outfit)}
                    className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0 p-1 rounded-full"
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(255, 0, 0, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        .handbag-animation { position: relative; height: 60px; display: flex; align-items: center; width: 100%; }
        .handbag { position: absolute; width: 40px; height: 50px; background: #7c3aed; border-radius: 5px; animation: slide-left 1s cubic-bezier(0.4, 0, 0.2, 1) forwards, bag-float 3s ease-in-out infinite 1s; z-index: 10; box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3); left: 0; }
        .handbag::before { content: ''; position: absolute; width: 30px; height: 18px; background: transparent; border: 2px solid #7c3aed; border-bottom: none; border-radius: 15px 15px 0 0; top: -14px; left: 5px; }
        .bag-flap { position: absolute; width: 40px; height: 15px; background: #6d28d9; top: 0; left: 0; border-radius: 5px 5px 0 0; z-index: 1; }
        @keyframes slide-left { 0% { transform: translateX(60px); opacity: 1; } 100% { transform: translateX(0) rotate(-10deg); opacity: 1; } }
        @keyframes bag-float { 0%, 100% { transform: translateX(0) rotate(-10deg) translateY(0); } 50% { transform: translateX(0) rotate(-10deg) translateY(-5px); } }
        .logo-text { position: relative; font-weight: 700; font-size: 1.5rem; color: #7c3aed; margin-left: 45px; text-shadow: 0 2px 8px rgba(124, 58, 237, 0.2); letter-spacing: 1px; opacity: 0; animation: fade-in 0.5s ease-in forwards 1s; white-space: nowrap; }
        @media (max-width: 768px) {
          .logo-text { font-size: 1.25rem; margin-left: 40px; }
          .handbag { width: 35px; height: 45px; }
          .handbag::before { width: 25px; height: 15px; top: -12px; left: 4px; }
          .bag-flap { width: 35px; height: 12px; }
          .nav-links .wishlist-icon { display: none; }
        }
        @keyframes fade-in { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .bag-hardware { position: absolute; width: 6px; height: 6px; background: #9f67fa; border-radius: 50%; top: 12px; left: 17px; z-index: 2; }
        .bag-stitching { position: absolute; width: 30px; height: 1px; background: rgba(124, 58, 237, 0.4); left: 5px; top: 20px; border-radius: 1px; }
        .bag-stitching:nth-child(3) { top: 30px; }
        .bag-stitching:nth-child(4) { top: 40px; }
        @media (max-width: 768px) { .bag-stitching { width: 25px; } .bag-hardware { left: 14px; } }
        .nav-links:not(.opacity-100) { pointer-events: none; }
        @media (min-width: 768px) { .nav-links { pointer-events: auto !important; } }
      `}</style>
    </>
  );
}
