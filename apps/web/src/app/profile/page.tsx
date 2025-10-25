'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ProfileCard from '@/components/ProfileCard';
import ProfileForm from '@/components/ProfileForm';
import MeasurementsList from '@/components/MeasurementsList';
import { User } from '@/types/community';
import { usersApi, ApiError } from '@/lib/api/users';
import {
  User as UserIcon,
  Edit3,
  BarChart3,
  FileText,
  Settings,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type TabType = 'overview' | 'edit' | 'measurements' | 'posts' | 'settings';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userData = await usersApi.getMyProfile();
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error instanceof ApiError && error.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleProfileUpdate = async (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);

    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleMeasurementUpdate = async (updatedUser: User) => {
    setUser(updatedUser);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'edit', label: 'Edit Profile', icon: Edit3 },
    { id: 'measurements', label: 'Measurements', icon: BarChart3 },
    { id: 'posts', label: 'My Posts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-atelier-darkYellow mx-auto mb-4" />
          <p className="text-white">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-12 h-12 text-atelier-darkRed mx-auto mb-4" />
          <p className="text-white">Failed to load profile</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="profile" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            My Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your profile, track progress, and customize your experience
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300"
          >
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-300 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard user={user} />
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6"
            >
              <div className="flex flex-wrap gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-atelier-darkYellow text-black'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Profile Overview
                  </h3>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Personal Information
                      </h4>
                      <div className="space-y-2 text-gray-300">
                        <p>
                          <span className="font-medium">Name:</span> {user.name}
                        </p>
                        <p>
                          <span className="font-medium">Gym ID:</span>{' '}
                          {user.gymId}
                        </p>
                        <p>
                          <span className="font-medium">Role:</span> {user.role}
                        </p>
                        <p>
                          <span className="font-medium">Membership:</span>{' '}
                          {user.membershipType}
                        </p>
                        {user.email && (
                          <p>
                            <span className="font-medium">Email:</span>{' '}
                            {user.email}
                          </p>
                        )}
                        {user.phone && (
                          <p>
                            <span className="font-medium">Phone:</span>{' '}
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Fitness Details
                      </h4>
                      <div className="space-y-2 text-gray-300">
                        {user.dob && (
                          <p>
                            <span className="font-medium">Age:</span>{' '}
                            {new Date().getFullYear() -
                              new Date(user.dob).getFullYear()}{' '}
                            years
                          </p>
                        )}
                        {user.gender && (
                          <p>
                            <span className="font-medium">Gender:</span>{' '}
                            {user.gender}
                          </p>
                        )}
                        {user.heightCm && (
                          <p>
                            <span className="font-medium">Height:</span>{' '}
                            {user.heightCm} cm
                          </p>
                        )}
                        {user.weightKg && (
                          <p>
                            <span className="font-medium">Weight:</span>{' '}
                            {user.weightKg} kg
                          </p>
                        )}
                        {user.goal && (
                          <p>
                            <span className="font-medium">Goal:</span>{' '}
                            {user.goal.replace('_', ' ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {user.achievements && user.achievements.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">
                        Achievements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className="bg-atelier-darkYellow/20 text-atelier-darkYellow px-3 py-1 rounded-full text-sm"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Workouts */}
                  {user.favoriteWorkouts &&
                    user.favoriteWorkouts.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                          Favorite Workouts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.favoriteWorkouts.map((workout, index) => (
                            <span
                              key={index}
                              className="bg-atelier-darkRed/20 text-atelier-darkRed px-3 py-1 rounded-full text-sm"
                            >
                              {workout}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {activeTab === 'edit' && (
                <ProfileForm
                  user={user}
                  onSave={handleProfileUpdate}
                  onCancel={() => setIsEditing(false)}
                />
              )}

              {activeTab === 'measurements' && (
                <MeasurementsList
                  user={user}
                  onUpdate={handleMeasurementUpdate}
                />
              )}

              {activeTab === 'posts' && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-atelier-darkYellow mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    My Posts
                  </h3>
                  <p className="text-gray-400 mb-6">
                    View and manage your community posts
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/profile/my-posts')}
                    className="bg-atelier-darkYellow text-black font-bold py-3 px-6 rounded-lg"
                  >
                    Go to My Posts
                  </motion.button>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-atelier-darkYellow mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Settings
                  </h3>
                  <p className="text-gray-400">
                    Account settings and preferences coming soon
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
