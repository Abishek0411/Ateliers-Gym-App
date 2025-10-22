'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, MessageSquare } from 'lucide-react';

interface ManualCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (userId: string, date: string, notes?: string) => Promise<void>;
  users: Array<{ gymId: string; name: string; role: string }>;
}

export default function ManualCheckInModal({
  isOpen,
  onClose,
  onCheckIn,
  users,
}: ManualCheckInModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsSubmitting(true);
    try {
      await onCheckIn(selectedUserId, selectedDate, notes);
      onClose();
      setSelectedUserId('');
      setNotes('');
    } catch (error) {
      console.error('Failed to add manual check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-atelier-darkYellow/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-atelier-darkYellow" />
                </div>
                <h3 className="text-white font-semibold text-lg">
                  Manual Check-In
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select User
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow"
                    required
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user.gymId} value={user.gymId}>
                        {user.name} ({user.gymId}) - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Check-In Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add any notes about this check-in..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow resize-none"
                    rows={3}
                    maxLength={500}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {notes.length}/500 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting || !selectedUserId}
                  className="flex-1 bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Adding...' : 'Add Check-In'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
