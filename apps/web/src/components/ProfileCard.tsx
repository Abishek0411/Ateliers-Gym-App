'use client';

import { motion } from 'framer-motion';
import { User } from '@/types/community';
import { Camera, Trophy, Target, Calendar } from 'lucide-react';
import Image from 'next/image';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-atelier-darkYellow';
      case 'trainer':
        return 'text-atelier-darkRed';
      default:
        return 'text-gray-400';
    }
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case 'VIP':
        return 'text-atelier-darkYellow';
      case 'Premium':
        return 'text-atelier-darkRed';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      {/* Avatar Section */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed mx-auto mb-4">
            {user.profileImage?.url ? (
              <Image
                src={user.profileImage.url}
                alt={`${user.name}'s avatar`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -bottom-2 -right-2 bg-atelier-darkYellow text-black p-2 rounded-full shadow-lg"
          >
            <Camera className="w-4 h-4" />
          </motion.button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-gray-400 text-sm mb-2">{user.gymId}</p>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-sm font-medium ${getRoleColor(user.role)}`}>
            {user.role.toUpperCase()}
          </span>
          <span className="text-gray-500">•</span>
          <span
            className={`text-sm font-medium ${getMembershipColor(user.membershipType)}`}
          >
            {user.membershipType}
          </span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-atelier-darkYellow" />
            <span className="text-gray-300 text-sm">Achievements</span>
          </div>
          <span className="text-white font-semibold">
            {user.achievements?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-atelier-darkRed" />
            <span className="text-gray-300 text-sm">Measurements</span>
          </div>
          <span className="text-white font-semibold">
            {user.measurements?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-atelier-navy" />
            <span className="text-gray-300 text-sm">Member Since</span>
          </div>
          <span className="text-white font-semibold">
            {user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">Profile Complete</span>
          <span
            className={`text-sm font-medium ${
              user.isProfileComplete ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {user.isProfileComplete ? '100%' : 'Incomplete'}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              user.isProfileComplete ? 'bg-green-400' : 'bg-yellow-400'
            }`}
            style={{ width: user.isProfileComplete ? '100%' : '60%' }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-atelier-darkYellow/20 text-atelier-darkYellow border border-atelier-darkYellow/30 rounded-lg py-2 px-4 text-sm font-medium transition-all hover:bg-atelier-darkYellow/30"
        >
          Edit Profile
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/10 text-gray-300 border border-white/20 rounded-lg py-2 px-4 text-sm font-medium transition-all hover:bg-white/20"
        >
          View Progress
        </motion.button>
      </div>
    </motion.div>
  );
}
