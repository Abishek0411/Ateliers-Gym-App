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

      // Redirect to community page
      router.push('/community');
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
            className="glass-card rounded-2xl p-8"
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
                className="text-2xl font-bold text-gradient mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
              >
                Atelier's Fitness
              </motion.h1>
              <motion.p
                className="text-atelier-accentWhite/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ fontFamily: 'Roboto, sans-serif' }}
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
                  className="block text-sm font-medium text-atelier-accentWhite/90 mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
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
                  className="w-full px-4 py-3 glass border border-white/20 rounded-lg text-atelier-accentWhite placeholder-atelier-accentWhite/50 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent transition-all duration-300 morph-button"
                  placeholder="Enter your Gym ID (e.g., GYM001)"
                  aria-describedby="gymId-help"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
                <div
                  id="gymId-help"
                  className="text-xs text-atelier-accentWhite/60 mt-1"
                >
                  Format: GYM followed by 3 digits (e.g., GYM001)
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-atelier-accentWhite/90 mb-2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
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
                  className="w-full px-4 py-3 glass border border-white/20 rounded-lg text-atelier-accentWhite placeholder-atelier-accentWhite/50 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent transition-all duration-300 morph-button"
                  placeholder="Enter your password"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full morph-button bg-gradient-to-r from-atelier-darkRed to-red-700 hover:from-red-700 hover:to-atelier-darkRed disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg shadow-lg accent-stroke focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:ring-offset-2 focus:ring-offset-atelier-navy"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                aria-label={
                  isLoading
                    ? 'Signing in, please wait'
                    : 'Sign in to your account'
                }
                style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
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
              className="mt-6 p-4 glass-dark rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3
                className="text-atelier-darkYellow font-semibold text-sm mb-2"
                style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
              >
                Demo Credentials:
              </h3>
              <div
                className="text-atelier-accentWhite/70 text-xs space-y-1"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
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
                className="text-atelier-darkYellow hover:text-yellow-400 text-sm transition-colors duration-300 morph-button"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Forgot your password?
              </a>
              <div
                className="text-atelier-accentWhite/60 text-sm"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Don't have an account?{' '}
                <a
                  href="#"
                  className="text-atelier-darkYellow hover:text-yellow-400 transition-colors duration-300 morph-button"
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
