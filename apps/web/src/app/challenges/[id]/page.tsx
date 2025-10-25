'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ProgressRing from '@/components/ProgressRing';
import Leaderboard from '@/components/Leaderboard';
import TaskDayChip from '@/components/TaskDayChip';
import {
  Challenge,
  Participation,
  LeaderboardResponse,
} from '@/types/challenge';
import { challengesApi, ApiError } from '@/lib/api/challenges';
import {
  Trophy,
  Flame,
  Calendar,
  Target,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  Crown,
  Medal,
  Award,
} from 'lucide-react';

export default function ChallengeDetailPage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participation, setParticipation] = useState<Participation | null>(
    null
  );
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;

  const loadChallengeData = useCallback(async () => {
    try {
      const [challengeData, leaderboardData] = await Promise.all([
        challengesApi.getChallenge(challengeId),
        challengesApi.getLeaderboard(challengeId, 10),
      ]);

      setChallenge(challengeData);
      setLeaderboard(leaderboardData);

      // Try to get user's participation
      try {
        const participationData =
          await challengesApi.getParticipation(challengeId);
        setParticipation(participationData);
      } catch (error) {
        // User is not participating, that's okay
        setParticipation(null);
      }

      setError(null);
    } catch (error) {
      console.error('Failed to load challenge:', error);
      if (error instanceof ApiError && error.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load challenge');
      }
    } finally {
      setIsLoading(false);
    }
  }, [challengeId, router]);

  const handleJoinChallenge = async () => {
    if (!challenge) return;

    setIsJoining(true);
    try {
      const participationData = await challengesApi.joinChallenge(challengeId);
      setParticipation(participationData);
      setShowJoinModal(false);

      // Refresh leaderboard
      const leaderboardData = await challengesApi.getLeaderboard(
        challengeId,
        10
      );
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to join challenge:', error);
      setError('Failed to join challenge');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveChallenge = async () => {
    if (!challenge) return;

    if (!window.confirm('Are you sure you want to leave this challenge?')) {
      return;
    }

    setIsLeaving(true);
    try {
      await challengesApi.leaveChallenge(challengeId);
      setParticipation(null);

      // Refresh leaderboard
      const leaderboardData = await challengesApi.getLeaderboard(
        challengeId,
        10
      );
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to leave challenge:', error);
      setError('Failed to leave challenge');
    } finally {
      setIsLeaving(false);
    }
  };

  const handleMarkProgress = async (day: number, completed: boolean) => {
    if (!participation) return;

    setIsUpdatingProgress(true);
    try {
      const updatedParticipation = await challengesApi.markProgress(
        challengeId,
        day,
        completed
      );
      setParticipation(updatedParticipation);

      // Refresh leaderboard
      const leaderboardData = await challengesApi.getLeaderboard(
        challengeId,
        10
      );
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to update progress:', error);
      setError('Failed to update progress');
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      // TODO: Show toast notification
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  useEffect(() => {
    loadChallengeData();
  }, [loadChallengeData]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-6 h-6" />;
      case 'daily':
        return <Calendar className="w-6 h-6" />;
      case 'task':
        return <Target className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'streak':
        return 'Daily Discipline';
      case 'daily':
        return 'Daily Tasks';
      case 'task':
        return 'Skill Tasks';
      default:
        return 'Challenge';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeStatus = () => {
    if (!challenge)
      return { status: 'loading', text: 'Loading...', color: 'text-gray-400' };

    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (now < startDate) {
      const daysUntilStart = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        status: 'upcoming',
        text: `Starts in ${daysUntilStart} day${daysUntilStart !== 1 ? 's' : ''}`,
        color: 'text-blue-400',
      };
    } else if (now > endDate) {
      return {
        status: 'ended',
        text: 'Challenge ended',
        color: 'text-gray-400',
      };
    } else {
      const daysUntilEnd = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        status: 'active',
        text: `Ends in ${daysUntilEnd} day${daysUntilEnd !== 1 ? 's' : ''}`,
        color: 'text-green-400',
      };
    }
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
          <p className="text-white">Loading challenge...</p>
        </motion.div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-12 h-12 text-atelier-darkRed mx-auto mb-4" />
          <p className="text-white">Challenge not found</p>
        </motion.div>
      </div>
    );
  }

  const timeStatus = getTimeStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="challenges" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Challenges</span>
        </motion.button>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(challenge.type)}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {challenge.title}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <span className="text-atelier-darkYellow font-medium">
                        {getTypeLabel(challenge.type)}
                      </span>
                      <span className={`text-sm ${timeStatus.color}`}>
                        {timeStatus.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {challenge.description && (
                <p className="text-gray-300 text-lg mb-6">
                  {challenge.description}
                </p>
              )}

              {/* Challenge Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {challenge.totalParticipants}
                  </div>
                  <div className="text-sm text-gray-400">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {challenge.averageCompletion}%
                  </div>
                  <div className="text-sm text-gray-400">Avg Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {challenge.tasks?.length || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">Total Tasks</div>
                </div>
              </div>

              {/* Challenge Timeline */}
              <div className="flex items-center justify-between text-sm text-gray-300">
                <div>
                  <div className="text-gray-400">Start Date</div>
                  <div>{formatDate(challenge.startDate)}</div>
                </div>
                <div>
                  <div className="text-gray-400">End Date</div>
                  <div>{formatDate(challenge.endDate)}</div>
                </div>
              </div>
            </motion.div>

            {/* Progress Section */}
            {participation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Your Progress
                </h3>

                <div className="flex items-center justify-center mb-8">
                  <ProgressRing
                    progress={participation.percentComplete}
                    size={120}
                    strokeWidth={8}
                    showPercentage={true}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {participation.completedCount}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {participation.currentStreak}
                    </div>
                    <div className="text-sm text-gray-400">Current Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {participation.longestStreak}
                    </div>
                    <div className="text-sm text-gray-400">Best Streak</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Daily Tasks */}
            {challenge.tasks && challenge.tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  Daily Tasks
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenge.tasks.map((task, index) => (
                    <TaskDayChip
                      key={task.day}
                      day={task.day}
                      task={task.task}
                      completed={
                        participation?.progress.find(p => p.day === task.day)
                          ?.completed || false
                      }
                      onToggle={completed =>
                        handleMarkProgress(task.day, completed)
                      }
                      disabled={isUpdatingProgress}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center space-x-4"
            >
              {participation ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLeaveChallenge}
                  disabled={isLeaving}
                  className="bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl py-3 px-6 font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLeaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Leaving...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      <span>Leave Challenge</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowJoinModal(true)}
                  disabled={timeStatus.status === 'ended'}
                  className="bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Join the Grind</span>
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            {leaderboard && (
              <Leaderboard
                leaderboard={leaderboard}
                currentUserGymId={participation?.userGymId}
              />
            )}

            {/* Challenge Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                Challenge Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Type</span>
                  <span className="text-white font-medium">
                    {getTypeLabel(challenge.type)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white font-medium">
                    {challenge.tasks?.length || 'N/A'} days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status</span>
                  <span className={`font-medium ${timeStatus.color}`}>
                    {timeStatus.text}
                  </span>
                </div>
              </div>

              {challenge.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {challenge.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-atelier-darkYellow/20 text-atelier-darkYellow px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Welcome to the Grind
            </h3>
            <p className="text-gray-300 mb-6">
              You'll get daily tasks, streaks, and bragging rights. Let's earn
              it.
            </p>

            <div className="flex items-center justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinChallenge}
                disabled={isJoining}
                className="bg-atelier-darkYellow text-black font-bold py-2 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>Join Challenge</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
