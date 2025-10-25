'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import { User } from '@/types/community';
import {
  Calendar,
  Trophy,
  Target,
  CheckCircle,
  Plus,
  CalendarDays,
  TrendingUp,
  Clock,
  Users,
} from 'lucide-react';
import ManualCheckInModal from '@/components/ManualCheckInModal';

interface AttendanceStats {
  checkedInDates: string[];
  currentStreak: number;
  longestStreak: number;
  monthlyCount: number;
}

export default function TrackingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [showManualCheckIn, setShowManualCheckIn] = useState(false);
  const [allUsers, setAllUsers] = useState<
    Array<{ gymId: string; name: string; role: string }>
  >([]);
  const router = useRouter();

  const loadAttendanceStats = useCallback(
    async (userId?: string) => {
      try {
        const token = localStorage.getItem('access_token');
        const currentUserId = userId || user?.gymId;
        if (!token || !currentUserId) return;

        const response = await fetch(
          `http://192.168.0.103:3001/attendance/user/${currentUserId}?month=${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load attendance stats');
        }

        const data = await response.json();
        setStats(data);
        setError(null); // Clear any previous errors

        // Auto-clear any lingering errors after successful load
        setTimeout(() => setError(null), 100);
      } catch (error) {
        console.error('Failed to load attendance stats:', error);
        setError('Failed to load attendance stats');
      }
    },
    [selectedMonth, user?.gymId]
  );

  const loadAllUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token || !user) return;

      // Only load users for trainers and admins
      if (user.role !== 'trainer' && user.role !== 'admin') {
        return;
      }

      const response = await fetch('http://192.168.0.103:3001/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load users');
      }

      const users = await response.json();
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, [user]);

  const loadUserAndStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      setError(null); // Clear any previous errors

      // Load attendance stats for all users
      if (userData) {
        const user = JSON.parse(userData);
        await loadAttendanceStats(user.gymId);
      }

      // Only load all users for trainers and admins (for manual check-in feature)
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === 'trainer' || user.role === 'admin') {
          await loadAllUsers();
        }
      }
    } catch (error) {
      console.error('Failed to load tracking data:', error);
      setError('Failed to load tracking data');
    } finally {
      setIsLoading(false);
      // Global navigation loading handles the loading state automatically
    }
  }, [router, loadAttendanceStats, loadAllUsers]);

  useEffect(() => {
    loadUserAndStats();
  }, [loadUserAndStats]);

  useEffect(() => {
    if (user) {
      loadAttendanceStats(user.gymId);
    }
  }, [selectedMonth, user, loadAttendanceStats]);

  const handleCheckIn = async () => {
    if (!user) return;

    console.log('Starting check-in process...');
    setIsCheckingIn(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        'http://192.168.0.103:3001/attendance/checkin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          setError('You have already checked in today!');
          return;
        }
        throw new Error('Failed to check in');
      }

      console.log('Check-in successful, refreshing stats...');
      // Refresh stats after successful check-in
      await loadAttendanceStats(user.gymId);
      console.log('Stats refreshed successfully');
    } catch (error) {
      console.error('Failed to check in:', error);
      setError('Failed to check in. Please try again.');
    } finally {
      console.log('Check-in process completed');
      setIsCheckingIn(false);
    }
  };

  const handleManualCheckIn = async (
    userId: string,
    date: string,
    notes?: string
  ) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `http://192.168.0.103:3001/attendance/checkin/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date,
            notes,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('User has already checked in on this date');
        }
        throw new Error('Failed to add manual check-in');
      }

      // Refresh stats after successful manual check-in
      if (user) {
        await loadAttendanceStats(user.gymId);
      }
    } catch (error) {
      console.error('Failed to add manual check-in:', error);
      throw error;
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  // Removed page-level loading - global navigation loading handles this smoothly

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="tracking" />

      <div className="container mx-auto px-4 py-8 pt-20 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Attendance Tracking
          </h1>
          <p className="text-gray-300 text-lg">
            Track your consistency and build healthy habits
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-atelier-darkYellow/20 rounded-lg">
                <Trophy className="w-6 h-6 text-atelier-darkYellow" />
              </div>
              <h3 className="text-white font-semibold">Current Streak</h3>
            </div>
            <p className="text-3xl font-bold text-atelier-darkYellow">
              {stats?.currentStreak || 0}
            </p>
            <p className="text-gray-400 text-sm">days in a row</p>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-atelier-darkRed/20 rounded-lg">
                <Target className="w-6 h-6 text-atelier-darkRed" />
              </div>
              <h3 className="text-white font-semibold">Longest Streak</h3>
            </div>
            <p className="text-3xl font-bold text-atelier-darkRed">
              {stats?.longestStreak || 0}
            </p>
            <p className="text-gray-400 text-sm">best record</p>
          </motion.div>

          {/* Monthly Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-atelier-navy/20 rounded-lg">
                <CalendarDays className="w-6 h-6 text-atelier-navy" />
              </div>
              <h3 className="text-white font-semibold">This Month</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats?.monthlyCount || 0}
            </p>
            <p className="text-gray-400 text-sm">check-ins</p>
          </motion.div>

          {/* Check-in Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex flex-col justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingIn ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{isCheckingIn ? 'Checking In...' : 'Check In Today'}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Month Selector and Manual Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-atelier-darkYellow" />
                <h3 className="text-white font-semibold text-lg">
                  Select Month
                </h3>
              </div>

              {/* Manual Check-in Button for Trainers/Admins */}
              {user && (user.role === 'trainer' || user.role === 'admin') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowManualCheckIn(true)}
                  className="bg-gradient-to-r from-atelier-darkRed to-red-600 hover:from-red-600 hover:to-atelier-darkRed text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Manual Check-in</span>
                </motion.button>
              )}
            </div>

            {/* Custom Month/Year Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Year
                </label>
                <select
                  value={selectedMonth.split('-')[0]}
                  onChange={e => {
                    const year = e.target.value;
                    const month = selectedMonth.split('-')[1];
                    handleMonthChange(`${year}-${month}`);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year} className="bg-gray-800">
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth.split('-')[1]}
                  onChange={e => {
                    const year = selectedMonth.split('-')[0];
                    const month = e.target.value;
                    handleMonthChange(`${year}-${month}`);
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                >
                  {[
                    { value: '01', label: 'January' },
                    { value: '02', label: 'February' },
                    { value: '03', label: 'March' },
                    { value: '04', label: 'April' },
                    { value: '05', label: 'May' },
                    { value: '06', label: 'June' },
                    { value: '07', label: 'July' },
                    { value: '08', label: 'August' },
                    { value: '09', label: 'September' },
                    { value: '10', label: 'October' },
                    { value: '11', label: 'November' },
                    { value: '12', label: 'December' },
                  ].map(month => (
                    <option
                      key={month.value}
                      value={month.value}
                      className="bg-gray-800"
                    >
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Month Navigation */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const newDate = new Date(year, month - 2, 1);
                  handleMonthChange(
                    `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
                  );
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white transition-all"
              >
                ← Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const [year, month] = selectedMonth.split('-').map(Number);
                  const newDate = new Date(year, month, 1);
                  handleMonthChange(
                    `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
                  );
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white transition-all"
              >
                Next →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Calendar Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-atelier-darkYellow" />
            <h3 className="text-white font-semibold text-lg">
              Attendance Heatmap
            </h3>
          </div>

          {stats && (
            <CalendarHeatmap
              checkedInDates={stats.checkedInDates}
              month={selectedMonth}
            />
          )}
        </motion.div>

        {/* Manual Check-in Modal */}
        <ManualCheckInModal
          isOpen={showManualCheckIn}
          onClose={() => setShowManualCheckIn(false)}
          onCheckIn={handleManualCheckIn}
          users={allUsers}
        />
      </div>
    </div>
  );
}
