'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/community';
import { usersApi, ApiError } from '@/lib/api/users';
import { Camera, X, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface ProfileFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  user,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    dob: user.dob ? user.dob.split('T')[0] : '',
    gender: user.gender || '',
    heightCm: user.heightCm || '',
    weightKg: user.weightKg || '',
    goal: user.goal || '',
    preferredTrainerId: user.preferredTrainerId || '',
    emergencyContactName: user.emergencyContact?.name || '',
    emergencyContactPhone: user.emergencyContact?.phone || '',
    achievements: user.achievements?.join(', ') || '',
    favoriteWorkouts: user.favoriteWorkouts?.join(', ') || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let updatedUser = user;

      // Upload avatar if selected
      if (avatarFile) {
        updatedUser = await usersApi.uploadAvatar(avatarFile);
      }

      // Update profile data
      const profileData = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        dob: formData.dob || undefined,
        gender: formData.gender as 'male' | 'female' | 'other' | undefined,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        goal: (formData.goal as any) || undefined,
        preferredTrainerId: formData.preferredTrainerId || undefined,
        emergencyContact: {
          name: formData.emergencyContactName || undefined,
          phone: formData.emergencyContactPhone || undefined,
        },
        achievements: formData.achievements
          ? formData.achievements
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        favoriteWorkouts: formData.favoriteWorkouts
          ? formData.favoriteWorkouts
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
      };

      updatedUser = await usersApi.updateMyProfile(profileData);

      setSuccess(true);
      onSave(updatedUser);

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error instanceof ApiError) {
        setError(`Failed to update profile: ${error.message}`);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6">Edit Profile</h3>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-300 flex items-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Profile updated successfully!</span>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300"
        >
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : user.profileImage?.url ? (
                <Image
                  src={user.profileImage.url}
                  alt={`${user.name}'s avatar`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-black font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-atelier-darkYellow text-black p-1.5 rounded-full shadow-lg"
            >
              <Camera className="w-3 h-3" />
            </motion.button>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Profile Picture</p>
            <p className="text-gray-400 text-sm">
              Click the camera icon to upload a new photo
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleInputChange}
              min="50"
              max="250"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleInputChange}
              min="20"
              max="300"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fitness Goal
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            >
              <option value="">Select Goal</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="maintain">Maintain</option>
              <option value="performance">Performance</option>
              <option value="general_fitness">General Fitness</option>
            </select>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">
            Emergency Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Achievements and Workouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Achievements (comma-separated)
            </label>
            <textarea
              name="achievements"
              value={formData.achievements}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., Lost 10kg, Completed 30 classes"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Favorite Workouts (comma-separated)
            </label>
            <textarea
              name="favoriteWorkouts"
              value={formData.favoriteWorkouts}
              onChange={handleInputChange}
              rows={3}
              placeholder="e.g., Chest Day, HIIT, Yoga"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="bg-atelier-darkYellow text-black font-bold py-3 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
