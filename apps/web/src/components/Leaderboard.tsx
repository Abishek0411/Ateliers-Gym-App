'use client';

import { motion } from 'framer-motion';
import { LeaderboardResponse } from '@/types/challenge';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  Target,
  Users,
} from 'lucide-react';

interface LeaderboardProps {
  leaderboard: LeaderboardResponse;
  currentUserGymId?: string;
}

export default function Leaderboard({
  leaderboard,
  currentUserGymId,
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-300/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getBadges = (entry: any) => {
    const badges = [];

    if (entry.percentComplete === 100) {
      badges.push({
        icon: Trophy,
        color: 'text-yellow-400',
        label: 'Complete',
      });
    }

    if (entry.currentStreak >= 7) {
      badges.push({ icon: Flame, color: 'text-red-400', label: 'Hot Streak' });
    }

    if (entry.completedCount >= 20) {
      badges.push({
        icon: Target,
        color: 'text-green-400',
        label: 'Consistent',
      });
    }

    return badges;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-atelier-darkYellow" />
        <h3 className="text-xl font-bold text-white">Who's Crushing It</h3>
      </div>

      <div className="space-y-3">
        {leaderboard.entries.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No participants yet</p>
          </div>
        ) : (
          leaderboard.entries.map((entry, index) => {
            const isCurrentUser = entry.userGymId === currentUserGymId;
            const badges = getBadges(entry);

            return (
              <motion.div
                key={entry.userGymId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${getRankColor(
                  entry.rank
                )} ${
                  isCurrentUser
                    ? 'ring-2 ring-atelier-darkYellow/50 shadow-lg shadow-atelier-darkYellow/20'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(entry.rank)}
                      <span className="text-lg font-bold text-white">
                        #{entry.rank}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-semibold ${
                            isCurrentUser
                              ? 'text-atelier-darkYellow'
                              : 'text-white'
                          }`}
                        >
                          {entry.userName}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs bg-atelier-darkYellow/20 text-atelier-darkYellow px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      {badges.length > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          {badges.map((badge, badgeIndex) => {
                            const Icon = badge.icon;
                            return (
                              <div
                                key={badgeIndex}
                                className="flex items-center space-x-1"
                                title={badge.label}
                              >
                                <Icon className={`w-3 h-3 ${badge.color}`} />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {entry.percentComplete}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.completedCount} tasks
                    </div>
                    {entry.currentStreak > 0 && (
                      <div className="text-xs text-gray-400">
                        {entry.currentStreak} streak
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Total participants */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Total Participants</span>
          <span className="font-semibold text-white">
            {leaderboard.totalParticipants}
          </span>
        </div>

        {leaderboard.userRank && leaderboard.userRank > 10 && (
          <div className="mt-2 text-sm text-gray-400">
            Your rank: #{leaderboard.userRank}
          </div>
        )}
      </div>
    </motion.div>
  );
}
