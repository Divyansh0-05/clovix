import React from 'react';

interface AuthModalsProps {
  showLogin: boolean;
  showSignup: boolean;
  onCloseLogin: () => void;
  onCloseSignup: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (fullName: string, email: string, password: string) => Promise<void>;
}

export default function AuthModals({
  showLogin,
  showSignup,
  onCloseLogin,
  onCloseSignup,
  onLogin,
  onSignup,
}: AuthModalsProps) {
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log('Form data:', { email, password }); // Debug with declared variables
    await onLogin(email, password);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log('Form data:', { fullName, email, password }); // Debug with declared variables
    await onSignup(fullName, email, password);
  };

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Login</h2>
              <button
                onClick={onCloseLogin}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#e94b87] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#e94b87] focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#e94b87] text-white rounded-lg hover:bg-[#ff5447] transition-colors duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sign Up</h2>
              <button
                onClick={onCloseSignup}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#e94b87] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#e94b87] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#e94b87] focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#e94b87] text-white rounded-lg hover:bg-[#ff5447] transition-colors duration-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}