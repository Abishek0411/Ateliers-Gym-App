'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful login
    }, 2000);
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
                  htmlFor="email"
                  className="block text-sm font-medium text-white/90 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
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

            {/* Additional Links */}
            <motion.div
              className="mt-6 text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
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
