'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { CreatePostData, UploadResponse } from '@/types/community';

interface PostFormProps {
  onSubmit: (data: CreatePostData) => Promise<void>;
  isSubmitting?: boolean;
}

const workoutSplits = [
  'Push',
  'Pull',
  'Legs',
  'Full Body',
  'Upper',
  'Lower',
  'Cardio',
  'Other',
];

const commonMuscles = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Core',
  'Abs',
  'Obliques',
  'Forearms',
  'Traps',
  'Lats',
];

export default function PostForm({
  onSubmit,
  isSubmitting = false,
}: PostFormProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    text: '',
    workoutSplit: '',
    musclesWorked: [],
    mediaUrl: undefined,
  });

  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
  };

  const handleWorkoutSplitChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, workoutSplit: e.target.value }));
  };

  const handleMuscleToggle = (muscle: string) => {
    const newSelected = selectedMuscles.includes(muscle)
      ? selectedMuscles.filter(m => m !== muscle)
      : [...selectedMuscles, muscle];

    setSelectedMuscles(newSelected);
    setFormData(prev => ({ ...prev, musclesWorked: newSelected }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image or video file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch(
        'http://192.168.0.103:3001/community/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result: UploadResponse = await response.json();
      setFormData(prev => ({ ...prev, mediaUrl: result.url }));
      setMediaPreview(result.url);
    } catch (error) {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, mediaUrl: undefined }));
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.text.trim() || !formData.workoutSplit) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        text: '',
        workoutSplit: '',
        musclesWorked: [],
        mediaUrl: undefined,
      });
      setSelectedMuscles([]);
      setMediaPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to submit post:', error);
    }
  };

  const isFormValid = formData.text.trim() && formData.workoutSplit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Share Your Workout</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            What did you work on today?
          </label>
          <textarea
            id="text"
            value={formData.text}
            onChange={handleTextChange}
            placeholder="Share your workout experience, tips, or motivation..."
            className="w-full h-32 px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Workout Split */}
        <div>
          <label
            htmlFor="workoutSplit"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Workout Split
          </label>
          <select
            id="workoutSplit"
            value={formData.workoutSplit}
            onChange={handleWorkoutSplitChange}
            className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            required
          >
            <option value="">Select workout split</option>
            {workoutSplits.map(split => (
              <option key={split} value={split}>
                {split}
              </option>
            ))}
          </select>
        </div>

        {/* Muscles Worked */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Muscles Worked
          </label>
          <div className="flex flex-wrap gap-2">
            {commonMuscles.map(muscle => (
              <button
                key={muscle}
                type="button"
                onClick={() => handleMuscleToggle(muscle)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? 'bg-atelier-darkYellow text-black'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Add Media (Optional)
          </label>

          {!mediaPreview ? (
            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-atelier-darkYellow transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
                <span className="text-sm">
                  {isUploading
                    ? 'Uploading...'
                    : 'Click to upload image or video'}
                </span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden">
                {formData.mediaUrl?.includes('video') ||
                mediaPreview.includes('video') ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full h-auto rounded-xl"
                  />
                ) : (
                  <Image
                    src={mediaPreview}
                    alt="Preview"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-xl"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          whileHover={{ scale: isFormValid ? 1.02 : 1 }}
          whileTap={{ scale: isFormValid ? 0.98 : 1 }}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            isFormValid
              ? 'bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black hover:shadow-lg hover:shadow-atelier-darkYellow/25'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Posting...</span>
            </div>
          ) : (
            'Share Post'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
