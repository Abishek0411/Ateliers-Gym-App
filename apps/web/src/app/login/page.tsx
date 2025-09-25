'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';

interface LoginData {
  gymId: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    gymId: string;
    name: string;
    role: string;
    membershipType: string;
    joinDate: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginData>({
    gymId: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const authData: AuthResponse = await response.json();

      // Store token and user data in localStorage
      localStorage.setItem('access_token', authData.access_token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      // Redirect to dashboard or home
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-atelier-black to-atelier-navy flex items-center justify-center p-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-atelier-navy via-atelier-black to-atelier-navy" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-atelier-darkYellow/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-atelier-darkRed/10 rounded-full blur-3xl" />
          </div>
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Login Card */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Logo Section */}
            <div className="text-center mb-8">
              {/* Gym Logo */}
              <motion.div
                className="mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative inline-block">
                  <Image
                    src="/images/ateliers-gym-logo.jpg"
                    alt="Atelier's Gym Logo"
                    width={80}
                    height={80}
                    className="rounded-lg shadow-lg border-2 border-atelier-darkYellow/30"
                    priority
                  />
                  {/* Subtle glow around logo */}
                  <div className="absolute inset-0 rounded-lg bg-atelier-darkYellow/10 blur-sm -z-10" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-2xl font-bold text-atelier-darkYellow mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Atelier's Fitness
              </motion.h1>
              <motion.p
                className="text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Welcome back, champion
              </motion.p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleLogin}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <label
                  htmlFor="gymId"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Gym ID
                </label>
                <input
                  type="text"
                  id="gymId"
                  name="gymId"
                  value={formData.gymId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent transition-all duration-300"
                  placeholder="Enter your Gym ID (e.g., GYM001)"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-atelier-darkRed hover:bg-red-800 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.form>

            {/* Demo Credentials */}
            <motion.div
              className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-atelier-darkYellow font-semibold text-sm mb-2">
                Demo Credentials:
              </h3>
              <div className="text-white/70 text-xs space-y-1">
                <div>
                  <strong>Admin:</strong> GYM001 / password123
                </div>
                <div>
                  <strong>Trainer:</strong> GYM002 / trainer2024
                </div>
                <div>
                  <strong>Member:</strong> GYM003 / member123
                </div>
              </div>
            </motion.div>

            {/* Additional Links */}
            <motion.div
              className="mt-4 text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <a
                href="#"
                className="text-atelier-darkYellow hover:text-yellow-400 text-sm transition-colors duration-300"
              >
                Forgot your password?
              </a>
              <div className="text-white/60 text-sm">
                Don't have an account?{' '}
                <a
                  href="#"
                  className="text-atelier-darkYellow hover:text-yellow-400 transition-colors duration-300"
                >
                  Sign up here
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
