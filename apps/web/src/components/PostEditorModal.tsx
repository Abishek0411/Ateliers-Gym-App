'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { Post, CreatePostData } from '@/types/community';
import { communityApi } from '@/lib/api/community';
import Image from 'next/image';

interface PostEditorModalProps {
  post?: Post; // If provided, we're editing; if not, we're creating
  onSave: (post: Post) => void;
  onClose: () => void;
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
  'Forearms',
  'Quads',
  'Hamstrings',
  'Glutes',
  'Calves',
  'Abs',
  'Obliques',
  'Traps',
  'Lats',
  'Delts',
  'Core',
];

export default function PostEditorModal({
  post,
  onSave,
  onClose,
}: PostEditorModalProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    text: post?.text || '',
    workoutSplit: post?.workoutSplit || 'Push',
    musclesWorked: post?.musclesWorked || [],
    mediaUrl: post?.mediaUrl || '',
  });

  const [mediaPreview, setMediaPreview] = useState<string | null>(
    post?.mediaUrl || null
  );
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(
    post?.mediaType || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(
    post?.musclesWorked || []
  );
  const [customMuscle, setCustomMuscle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await communityApi.uploadMedia(file);
      setFormData(prev => ({ ...prev, mediaUrl: response.url }));
      setMediaPreview(response.url);

      // Determine media type
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setError('Please select a valid image or video file.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    handleFileUpload(file);
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMuscleToggle = (muscle: string) => {
    setSelectedMuscles(prev =>
      prev.includes(muscle) ? prev.filter(m => m !== muscle) : [...prev, muscle]
    );
  };

  const addCustomMuscle = () => {
    if (customMuscle.trim() && !selectedMuscles.includes(customMuscle.trim())) {
      setSelectedMuscles(prev => [...prev, customMuscle.trim()]);
      setCustomMuscle('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      setError('Please enter some text for your post.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        musclesWorked: selectedMuscles,
      };

      let savedPost: Post;

      if (post) {
        // Editing existing post
        savedPost = await communityApi.updatePost(post._id, postData);
      } else {
        // Creating new post
        savedPost = await communityApi.createPost(postData);
      }

      onSave(savedPost);
    } catch (error) {
      console.error('Failed to save post:', error);
      setError('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gradient-to-br from-atelier-navy to-black border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {post ? 'Edit Post' : 'Create New Post'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Content */}
            <div>
              <label className="block text-white font-medium mb-2">
                What's on your mind?
              </label>
              <textarea
                value={formData.text}
                onChange={e =>
                  setFormData(prev => ({ ...prev, text: e.target.value }))
                }
                placeholder="Share your workout, progress, or fitness tips..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {/* Workout Split */}
            <div>
              <label className="block text-white font-medium mb-2">
                Workout Split
              </label>
              <select
                value={formData.workoutSplit}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    workoutSplit: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              >
                {workoutSplits.map(split => (
                  <option key={split} value={split} className="bg-atelier-navy">
                    {split}
                  </option>
                ))}
              </select>
            </div>

            {/* Muscles Worked */}
            <div>
              <label className="block text-white font-medium mb-2">
                Muscles Worked
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonMuscles.map(muscle => (
                  <motion.button
                    key={muscle}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMuscleToggle(muscle)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedMuscles.includes(muscle)
                        ? 'bg-atelier-darkYellow text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {muscle}
                  </motion.button>
                ))}
              </div>

              {/* Custom Muscle Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customMuscle}
                  onChange={e => setCustomMuscle(e.target.value)}
                  placeholder="Add custom muscle..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent text-sm"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addCustomMuscle}
                  className="px-4 py-2 bg-atelier-darkYellow text-black rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200"
                >
                  Add
                </motion.button>
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-white font-medium mb-2">
                Media (Optional)
              </label>

              {!mediaPreview ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-atelier-darkYellow hover:bg-white/5 transition-all duration-200"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    Click to upload an image or video
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, GIF, WebP, MP4, MOV, WebM (max 10MB)
                  </p>
                </motion.div>
              ) : (
                <div className="relative">
                  <div className="relative bg-gray-800 rounded-xl overflow-hidden">
                    {mediaType === 'video' ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full h-auto rounded-xl"
                      />
                    ) : (
                      <Image
                        src={mediaPreview}
                        alt="Media preview"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-xl"
                      />
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeMedia}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200"
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={isSubmitting || isUploading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{post ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <span>{post ? 'Update Post' : 'Create Post'}</span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
