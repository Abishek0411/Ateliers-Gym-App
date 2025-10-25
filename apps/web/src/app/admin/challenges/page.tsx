'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Challenge } from '@/types/challenge';
import { challengesApi, ApiError } from '@/lib/api/challenges';
import {
  Plus,
  Edit,
  Trash2,
  Trophy,
  Calendar,
  Users,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);

      // Check if user has permission to access this page
      if (userInfo.role !== 'admin' && userInfo.role !== 'trainer') {
        router.push('/challenges');
        return;
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadChallenges = useCallback(async () => {
    try {
      const response = await challengesApi.getChallenges({ limit: 50 });
      setChallenges(response.challenges);
      setError(null);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      if (error instanceof ApiError && error.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load challenges');
      }
    }
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadChallenges();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadChallenges]);

  const handleCreateChallenge = async (challengeData: any) => {
    setIsCreating(true);
    try {
      const newChallenge = await challengesApi.createChallenge(challengeData);
      setChallenges(prev => [newChallenge, ...prev]);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create challenge:', error);
      setError('Failed to create challenge');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) {
      return;
    }

    try {
      await challengesApi.deleteChallenge(id);
      setChallenges(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete challenge:', error);
      setError('Failed to delete challenge');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Target className="w-4 h-4" />;
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'task':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'streak':
        return 'Streak';
      case 'daily':
        return 'Daily';
      case 'task':
        return 'Task';
      default:
        return 'Challenge';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-atelier-darkYellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading challenges...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="admin" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Challenge Management
            </h1>
            <p className="text-gray-300 text-lg">
              {user?.role === 'admin'
                ? 'Create and manage fitness challenges for all members'
                : 'Create and manage fitness challenges for your members'}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black font-bold py-3 px-6 rounded-xl flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Challenge</span>
          </motion.button>
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

        {/* Challenges List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(challenge.type)}
                  <span className="text-atelier-darkYellow font-medium text-sm">
                    {getTypeLabel(challenge.type)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteChallenge(challenge._id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {challenge.title}
              </h3>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {challenge.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {challenge.totalParticipants}
                  </div>
                  <div className="text-xs text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {challenge.averageCompletion}%
                  </div>
                  <div className="text-xs text-gray-400">Avg Completion</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-300">
                <div>
                  <div className="text-gray-400">Start</div>
                  <div>{formatDate(challenge.startDate)}</div>
                </div>
                <div>
                  <div className="text-gray-400">End</div>
                  <div>{formatDate(challenge.endDate)}</div>
                </div>
              </div>

              {challenge.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                  {challenge.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-atelier-darkYellow/20 text-atelier-darkYellow px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {challenge.tags.length > 3 && (
                    <span className="text-gray-400 text-xs">
                      +{challenge.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {challenges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No challenges found
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first challenge to get started
            </p>
          </motion.div>
        )}
      </div>

      {/* Create Challenge Modal */}
      {showCreateForm && (
        <CreateChallengeModal
          onClose={() => setShowCreateForm(false)}
          onCreate={handleCreateChallenge}
          isCreating={isCreating}
          userRole={user?.role}
        />
      )}
    </div>
  );
}

// Simple Create Challenge Modal Component
function CreateChallengeModal({
  onClose,
  onCreate,
  isCreating,
  userRole,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
  isCreating: boolean;
  userRole?: string;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily',
    startDate: '',
    endDate: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const challengeData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
      tasks: [], // Will be added later
    };

    onCreate(challengeData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Create New Challenge
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          {userRole === 'admin'
            ? 'Create a challenge for all gym members'
            : 'Create a challenge for your members'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              placeholder="Challenge title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              placeholder="Challenge description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={e =>
                setFormData(prev => ({ ...prev, type: e.target.value }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="streak">Streak</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e =>
                  setFormData(prev => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e =>
                  setFormData(prev => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={e =>
                setFormData(prev => ({ ...prev, tags: e.target.value }))
              }
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              placeholder="strength, cardio, beginner"
            />
          </div>

          <div className="flex items-center justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isCreating}
              className="bg-atelier-darkYellow text-black font-bold py-2 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Challenge</span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
