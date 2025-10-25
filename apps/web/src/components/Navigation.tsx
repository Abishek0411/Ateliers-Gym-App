'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  User,
  LogOut,
  FileText,
  Calendar,
  Trophy,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User as UserType } from '@/types/community';
import { useNavigation } from '@/contexts/NavigationContext';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = '' }: NavigationProps) {
  const router = useRouter();
  const { navigateWithLoading, isLoading, resetLoading } = useNavigation();
  const [user, setUser] = useState<UserType | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Enhanced safety mechanism: Multiple fallbacks for stuck navigation
  useEffect(() => {
    if (isLoading) {
      console.log('Navigation loading state is active');

      // Primary safety timeout
      const primaryTimeout = setTimeout(() => {
        console.warn(
          'Primary safety timeout: Navigation loading state stuck, auto-resetting'
        );
        resetLoading();
      }, 2000); // Reduced to 2 seconds for faster recovery

      // Secondary safety timeout (backup)
      const secondaryTimeout = setTimeout(() => {
        console.error(
          'Secondary safety timeout: Force resetting navigation state'
        );
        resetLoading();
        // Force reload if still stuck
        if (isLoading) {
          console.error('Navigation still stuck, forcing page reload');
          window.location.reload();
        }
      }, 5000);

      return () => {
        clearTimeout(primaryTimeout);
        clearTimeout(secondaryTimeout);
      };
    }
  }, [isLoading, resetLoading]);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    setIsLoggingOut(true);
    setShowProfileMenu(false); // Close profile menu immediately

    try {
      // Add a small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Clear user data
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      // Clear user state immediately for visual feedback
      setUser(null);

      // Reset navigation loading state
      resetLoading();

      // Navigate to home with loading
      navigateWithLoading('/', router);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    {
      id: 'challenges',
      label: 'Challenges',
      icon: Trophy,
      path: '/challenges',
    },
    { id: 'tracking', label: 'Tracking', icon: Calendar, path: '/tracking' },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigateWithLoading('/', router)}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/images/ateliers-gym-logo.jpg"
                  alt="Atelier's Gym Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="text-white font-bold text-lg">Atelier's</span>
            </motion.div>

            {/* User Avatar */}
            {user && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium hidden sm:block">
                    {user.name}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-2xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/20">
                      <p className="text-white font-medium">{user.name}</p>
                      <p
                        className={`text-xs ${
                          user.role === 'admin'
                            ? 'text-atelier-darkYellow'
                            : user.role === 'trainer'
                              ? 'text-atelier-darkRed'
                              : 'text-gray-400'
                        }`}
                      >
                        {user.role} • {user.membershipType}
                      </p>
                    </div>

                    {/* My Profile Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigateWithLoading('/profile', router);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-atelier-darkYellow hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </motion.button>

                    {/* My Posts Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigateWithLoading('/profile/my-posts', router);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-atelier-darkYellow hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">My Posts</span>
                    </motion.button>

                    {/* Admin/Trainer Challenges Option */}
                    {(user.role === 'admin' || user.role === 'trainer') && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigateWithLoading('/admin/challenges', router);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-atelier-darkYellow hover:bg-white/10 rounded-lg transition-all duration-200"
                      >
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm">Manage Challenges</span>
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
                      whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isLoggingOut
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-gray-300 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span className="text-sm">
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10"
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    console.log('Navigating to:', item.path);
                    // Add safety check before navigation
                    if (isLoading) {
                      console.warn(
                        'Navigation already in progress, resetting and retrying'
                      );
                      resetLoading();
                      setTimeout(() => {
                        navigateWithLoading(item.path, router);
                      }, 100);
                    } else {
                      navigateWithLoading(item.path, router);
                    }
                  }}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-atelier-darkYellow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-atelier-darkYellow' : ''}`}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}

            {/* Profile Tab */}
            {user && (
              <motion.button
                whileHover={{ scale: isLoggingOut ? 1 : 1.05 }}
                whileTap={{ scale: isLoggingOut ? 1 : 0.95 }}
                onClick={() =>
                  !isLoggingOut && setShowProfileMenu(!showProfileMenu)
                }
                disabled={isLoggingOut}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isLoggingOut
                    ? 'text-gray-500 cursor-not-allowed'
                    : showProfileMenu
                      ? 'text-atelier-darkYellow'
                      : 'text-gray-400 hover:text-white'
                }`}
              >
                {isLoggingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <User
                    className={`w-5 h-5 ${showProfileMenu ? 'text-atelier-darkYellow' : ''}`}
                  />
                )}
                <span className="text-xs font-medium">
                  {isLoggingOut ? 'Logging out...' : 'Profile'}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Navigation stuck indicator and manual reset */}
      {isLoading && (
        <div className="fixed top-20 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-red-400/30"
          >
            <div className="flex items-center space-x-2 text-white text-sm">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span>Navigation loading...</span>
              <button
                onClick={() => {
                  console.log('Manual navigation reset triggered');
                  resetLoading();
                }}
                className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
}
