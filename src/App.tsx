import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Detect from './components/Detect';
import ColorPalette from './components/ColorPalette';
import Shop from './components/Shop';
import About from './components/About';
import Footer from './components/Footer';
import Onboarding from './components/Onboarding';
import { Outfit } from './components/outfit';
import { SpeedInsights } from '@vercel/speed-insights/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [detectedSkinTone, setDetectedSkinTone] = useState<{ color: string; type: string } | null>(null);
  const [wishlist, setWishlist] = useState<Outfit[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // On mount: check if user has visited before
  useEffect(() => {
    const savedGender = Cookies.get('selectedGender');
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      // Returning user with token — verify and restore session
      verifyToken(storedToken);
      if (savedGender) setSelectedGender(savedGender);
      setIsAppReady(true);
    } else if (savedGender) {
      // Guest returning user — has gender but no auth
      setSelectedGender(savedGender);
      setIsAppReady(true);
    } else {
      // First visit — show onboarding
      setShowOnboarding(true);
      setIsAppReady(true);
    }
  }, []);

  const verifyToken = async (storedToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setToken(storedToken);
        setUserId(data.user._id);
        setUsername(data.user.fullName || '');
        setUserEmail(data.user.email || '');
        if (data.user.gender) setSelectedGender(data.user.gender);

        if (data.user.skinTone?.type) {
          setDetectedSkinTone({
            color: data.user.skinTone.hexColor,
            type: data.user.skinTone.type,
          });
        }

        fetchWishlist(storedToken);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  };

  const fetchWishlist = async (authToken: string) => {
    try {
      const res = await fetch(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.wishlist.map((item: any) => ({
          _id: item.outfitId,
          ...item.outfitData,
        }));
        setWishlist(items);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  // Onboarding complete callback
  const handleOnboardingComplete = (authToken: string, user: any, gender: string) => {
    if (authToken && user) {
      localStorage.setItem('token', authToken);
      setIsLoggedIn(true);
      setToken(authToken);
      setUserId(user._id);
      setUsername(user.fullName || '');
      setUserEmail(user.email || '');
      fetchWishlist(authToken);
    }

    setSelectedGender(gender);
    Cookies.set('selectedGender', gender, { expires: 30 });
    setShowOnboarding(false);
  };

  // Login from Navbar (for guest users who skipped onboarding auth)
  const handleLogin = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setToken(data.token);
        setUserId(data.user._id);
        setUsername(data.user.fullName || '');
        setUserEmail(data.user.email || '');
        fetchWishlist(data.token);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch {
      return { success: false, message: 'Network error. Is the server running?' };
    }
  };

  const handleRegister = async (fullName: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, gender: selectedGender }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setToken(data.token);
        setUserId(data.user._id);
        setUsername(data.user.fullName || '');
        setUserEmail(data.user.email || '');
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch {
      return { success: false, message: 'Network error. Is the server running?' };
    }
  };

  // Change gender from profile
  const handleGenderChange = async (gender: string) => {
    setSelectedGender(gender);
    Cookies.set('selectedGender', gender, { expires: 30 });

    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/gender`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gender }),
        });
      } catch (err) {
        console.error('Failed to update gender:', err);
      }
    }
  };

  const handleSkinToneDetected = (color: string, type: string) => {
    setDetectedSkinTone({ color, type });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    setUsername('');
    setUserEmail('');
    setWishlist([]);
    setDetectedSkinTone(null);
    localStorage.removeItem('token');
  };

  const toggleWishlist = async (outfit: Outfit) => {
    const isAlreadyWishlisted = wishlist.some(item => item._id === outfit._id);

    if (isAlreadyWishlisted) {
      setWishlist(prev => prev.filter(item => item._id !== outfit._id));
      if (token) {
        try {
          await fetch(`${API_URL}/api/wishlist/${outfit._id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
        }
      }
    } else {
      setWishlist(prev => [...prev, outfit]);
      if (token) {
        try {
          await fetch(`${API_URL}/api/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              outfitId: outfit._id,
              outfitData: {
                name: outfit.name,
                description: outfit.description,
                price: outfit.price,
                imageUrl: outfit.imageUrl,
                affiliateLink: outfit.affiliateLink,
                recommendedSkinTones: outfit.recommendedSkinTones,
                source: outfit.source,
                gender: outfit.gender,
                category: outfit.category,
              },
            }),
          });
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
        }
      }
    }
  };

  if (!isAppReady) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} apiUrl={API_URL} />
      )}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onRegister={handleRegister}
        username={username}
        userEmail={userEmail}
        selectedGender={selectedGender}
        onGenderChange={handleGenderChange}
        wishlistCount={wishlist.length}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
      <Hero />
      <Detect
        isLoggedIn={isLoggedIn}
        userId={userId}
        token={token}
        onSkinToneDetected={handleSkinToneDetected}
      />
      {detectedSkinTone && (
        <ColorPalette skinToneType={detectedSkinTone.type} />
      )}
      <Shop
        isLoggedIn={isLoggedIn}
        userId={userId}
        token={token}
        detectedSkinTone={detectedSkinTone}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        selectedGender={selectedGender}
      />
      <SpeedInsights />
      <About />
      <Footer />
    </div>
  );
}

export default App;