'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ChallengeCard from '@/components/ChallengeCard';
import { Challenge, ChallengeFilters } from '@/types/challenge';
import { challengesApi, ApiError } from '@/lib/api/challenges';
import {
  Trophy,
  Target,
  Calendar,
  Filter,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  Flame,
  CheckCircle,
  Clock,
} from 'lucide-react';

type FilterType = 'all' | 'active' | 'upcoming' | 'streak' | 'daily' | 'task';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const router = useRouter();

  const loadChallenges = useCallback(
    async (cursor?: string, append = false) => {
      try {
        const filters: ChallengeFilters = {
          limit: 12,
          cursor,
        };

        // Apply filters
        if (filter === 'active') {
          filters.active = true;
        } else if (filter === 'upcoming') {
          filters.upcoming = true;
        } else if (filter === 'streak') {
          filters.type = 'streak';
        } else if (filter === 'daily') {
          filters.type = 'daily';
        } else if (filter === 'task') {
          filters.type = 'task';
        }

        const response = await challengesApi.getChallenges(filters);

        if (append) {
          setChallenges(prev => [...prev, ...response.challenges]);
        } else {
          setChallenges(response.challenges);
        }

        setHasMore(response.hasMore);
        setNextCursor(response.nextCursor);
        setError(null);
      } catch (error) {
        console.error('Failed to load challenges:', error);
        if (error instanceof ApiError && error.status === 401) {
          router.push('/login');
        } else {
          setError('Failed to load challenges');
        }
      }
    },
    [filter, router]
  );

  const loadMoreChallenges = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadChallenges(nextCursor, true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setChallenges([]);
    setNextCursor(undefined);
    setHasMore(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadChallenges();
      } finally {
        setIsLoading(false);
        // Global navigation loading handles the loading state automatically
      }
    };

    loadData();
  }, [loadChallenges]);

  const filteredChallenges = challenges.filter(challenge => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      challenge.title.toLowerCase().includes(query) ||
      challenge.description?.toLowerCase().includes(query) ||
      challenge.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const getFilterIcon = (filterType: FilterType) => {
    switch (filterType) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'streak':
        return <Flame className="w-4 h-4" />;
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'task':
        return <Target className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getFilterLabel = (filterType: FilterType) => {
    switch (filterType) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'streak':
        return 'Streak';
      case 'daily':
        return 'Daily';
      case 'task':
        return 'Tasks';
      default:
        return 'All';
    }
  };

  // Removed page-level loading - global navigation loading handles this smoothly

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="challenges" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Challenges
          </h1>
          <p className="text-gray-300 text-lg">
            Join the grind • Earn your stripes • Crush your goals
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

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                'all',
                'active',
                'upcoming',
                'streak',
                'daily',
                'task',
              ] as FilterType[]
            ).map(filterType => {
              const isActive = filter === filterType;
              return (
                <motion.button
                  key={filterType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange(filterType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-atelier-darkYellow text-black'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {getFilterIcon(filterType)}
                  <span className="text-sm font-medium">
                    {getFilterLabel(filterType)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
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
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No challenges available at the moment'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ChallengeCard
                  challenge={challenge}
                  onJoin={() => {
                    // Handle join logic
                    router.push(`/challenges/${challenge._id}`);
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && filteredChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMoreChallenges}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more challenges...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Load More Challenges</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
