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
  const { navigateWithLoading } = useNavigation();
  const [user, setUser] = useState<UserType | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
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
                    navigateWithLoading(item.path, router);
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  showProfileMenu
                    ? 'text-atelier-darkYellow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User
                  className={`w-5 h-5 ${showProfileMenu ? 'text-atelier-darkYellow' : ''}`}
                />
                <span className="text-xs font-medium">Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

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
