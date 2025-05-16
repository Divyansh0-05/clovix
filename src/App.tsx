import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Detect from './components/Detect';
import Shop from './components/Shop';
import About from './components/About';
import Footer from './components/Footer';
import { Outfit } from './components/outfit';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [detectedSkinTone, setDetectedSkinTone] = useState<{ color: string; type: string } | null>(null);
  const [wishlist, setWishlist] = useState<Outfit[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const authCookie = Cookies.get('authData');

    if (storedToken && storedUserId && authCookie) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUserId(storedUserId);
    }
    const savedWishlist = Cookies.get('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      Cookies.set('wishlist', JSON.stringify(wishlist), { expires: 7 });
    } else {
      Cookies.remove('wishlist');
    }
  }, [wishlist]);

  const handleSkinToneDetected = (color: string, type: string) => {
    setDetectedSkinTone({ color, type });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setWishlist([]);
    setDetectedSkinTone(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    Cookies.remove('authData');
  };

  const toggleWishlist = (outfit: Outfit) => {
    setWishlist(prev => {
      const isAlreadyWishlisted = prev.some(item => item._id === outfit._id);
      if (isAlreadyWishlisted) {
        return prev.filter(item => item._id !== outfit._id);
      } else {
        return [...prev, outfit];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        wishlistCount={wishlist.length}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Hero />
      <Detect
        isLoggedIn={isLoggedIn}
        userId={userId}
        token={token}
        onSkinToneDetected={handleSkinToneDetected}
      />
      <Shop
        isLoggedIn={isLoggedIn}
        userId={userId}
        token={token}
        detectedSkinTone={detectedSkinTone}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
      <About />
      <Footer />
    </div>
  );
}

export default App;