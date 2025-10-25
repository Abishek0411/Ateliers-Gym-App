'use client';

import { motion } from 'framer-motion';
import { Challenge } from '@/types/challenge';
import { CldImage } from 'next-cloudinary';
import {
  Trophy,
  Flame,
  Calendar,
  Target,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: () => void;
  isJoined?: boolean;
}

export default function ChallengeCard({
  challenge,
  onJoin,
  isJoined = false,
}: ChallengeCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Flame className="w-5 h-5" />;
      case 'daily':
        return <Calendar className="w-5 h-5" />;
      case 'task':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
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

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'streak':
        return 'Keep the streak alive';
      case 'daily':
        return 'Small wins, big changes';
      case 'task':
        return 'Master moves one at a time';
      default:
        return 'Push your limits';
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

  const getTimeStatus = () => {
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

  const timeStatus = getTimeStatus();

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        {challenge.heroImage ? (
          <CldImage
            src={challenge.heroImage.publicId || challenge.heroImage.url}
            alt={challenge.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality="auto"
            format="auto"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-atelier-darkRed to-atelier-navy flex items-center justify-center">
            <Trophy className="w-16 h-16 text-white/50" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
            {getTypeIcon(challenge.type)}
            <span className="text-white text-sm font-medium">
              {getTypeLabel(challenge.type)}
            </span>
          </div>
        </div>

        {/* Time Status */}
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 ${timeStatus.color}`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{timeStatus.text}</span>
          </div>
        </div>

        {/* Participants Count */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <Users className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              {challenge.totalParticipants} grinding
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {challenge.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2">
            {challenge.description || getTypeDescription(challenge.type)}
          </p>
        </div>

        {/* Tags */}
        {challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {challenge.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
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

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {challenge.averageCompletion}%
              </div>
              <div className="text-xs text-gray-400">Avg Completion</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {challenge.tasks?.length || 'N/A'}
              </div>
              <div className="text-xs text-gray-400">Tasks</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-300">
              {formatDate(challenge.startDate)} -{' '}
              {formatDate(challenge.endDate)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onJoin}
          disabled={timeStatus.status === 'ended'}
          className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
            isJoined
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : timeStatus.status === 'ended'
                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                : 'bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black hover:shadow-lg'
          }`}
        >
          {isJoined ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Joined</span>
            </>
          ) : timeStatus.status === 'ended' ? (
            <span>Challenge Ended</span>
          ) : (
            <>
              <span>Join the Grind</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
