'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/community';
import { usersApi, ApiError } from '@/lib/api/users';
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Weight,
  Ruler,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import MeasurementEditorModal from './MeasurementEditorModal';

interface MeasurementsListProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default function MeasurementsList({
  user,
  onUpdate,
}: MeasurementsListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMeasurement = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await usersApi.addMeasurement(data);
      onUpdate(updatedUser);
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add measurement:', error);
      if (error instanceof ApiError) {
        setError(`Failed to add measurement: ${error.message}`);
      } else {
        setError('Failed to add measurement. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMeasurement = async (measurementId: string, data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await usersApi.updateMeasurement(measurementId, data);
      onUpdate(updatedUser);
      setEditingMeasurement(null);
    } catch (error) {
      console.error('Failed to update measurement:', error);
      if (error instanceof ApiError) {
        setError(`Failed to update measurement: ${error.message}`);
      } else {
        setError('Failed to update measurement. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeasurement = async (measurementId: string) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await usersApi.deleteMeasurement(measurementId);
      const updatedUser = await usersApi.getMyProfile();
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to delete measurement:', error);
      if (error instanceof ApiError) {
        setError(`Failed to delete measurement: ${error.message}`);
      } else {
        setError('Failed to delete measurement. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const measurements = user.measurements || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Measurements</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="bg-atelier-darkYellow text-black font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Measurement</span>
        </motion.button>
      </div>

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
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Measurements List */}
      {measurements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white/5 rounded-2xl border border-white/10"
        >
          <Weight className="w-16 h-16 text-atelier-darkYellow mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-white mb-2">
            No Measurements Yet
          </h4>
          <p className="text-gray-400 mb-6">
            Start tracking your progress by adding your first measurement
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="bg-atelier-darkYellow text-black font-bold py-3 px-6 rounded-lg"
          >
            Add First Measurement
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {measurements
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((measurement, index) => (
              <motion.div
                key={measurement._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-atelier-darkYellow" />
                    <span className="text-white font-semibold">
                      {formatDate(measurement.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingMeasurement(measurement)}
                      className="p-2 text-gray-400 hover:text-atelier-darkYellow transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteMeasurement(measurement._id!)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {measurement.weightKg && (
                    <div className="flex items-center space-x-2">
                      <Weight className="w-4 h-4 text-atelier-darkRed" />
                      <div>
                        <p className="text-gray-400 text-sm">Weight</p>
                        <p className="text-white font-semibold">
                          {measurement.weightKg} kg
                        </p>
                      </div>
                    </div>
                  )}

                  {measurement.chestCm && (
                    <div className="flex items-center space-x-2">
                      <Ruler className="w-4 h-4 text-atelier-navy" />
                      <div>
                        <p className="text-gray-400 text-sm">Chest</p>
                        <p className="text-white font-semibold">
                          {measurement.chestCm} cm
                        </p>
                      </div>
                    </div>
                  )}

                  {measurement.waistCm && (
                    <div className="flex items-center space-x-2">
                      <Ruler className="w-4 h-4 text-atelier-navy" />
                      <div>
                        <p className="text-gray-400 text-sm">Waist</p>
                        <p className="text-white font-semibold">
                          {measurement.waistCm} cm
                        </p>
                      </div>
                    </div>
                  )}

                  {measurement.hipsCm && (
                    <div className="flex items-center space-x-2">
                      <Ruler className="w-4 h-4 text-atelier-navy" />
                      <div>
                        <p className="text-gray-400 text-sm">Hips</p>
                        <p className="text-white font-semibold">
                          {measurement.hipsCm} cm
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {measurement.notes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-300 text-sm">{measurement.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-atelier-darkYellow" />
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {isAdding && (
        <MeasurementEditorModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          onSave={handleAddMeasurement}
        />
      )}

      {/* Edit Measurement Modal */}
      {editingMeasurement && (
        <MeasurementEditorModal
          isOpen={!!editingMeasurement}
          onClose={() => setEditingMeasurement(null)}
          onSave={data =>
            handleUpdateMeasurement(editingMeasurement._id!, data)
          }
          measurement={editingMeasurement}
        />
      )}
    </div>
  );
}
