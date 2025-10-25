'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Weight, Ruler, FileText, Loader2 } from 'lucide-react';

interface MeasurementEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  measurement?: any;
}

export default function MeasurementEditorModal({
  isOpen,
  onClose,
  onSave,
  measurement,
}: MeasurementEditorModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    weightKg: '',
    chestCm: '',
    waistCm: '',
    hipsCm: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (measurement) {
      setFormData({
        date: measurement.date ? measurement.date.split('T')[0] : '',
        weightKg: measurement.weightKg?.toString() || '',
        chestCm: measurement.chestCm?.toString() || '',
        waistCm: measurement.waistCm?.toString() || '',
        hipsCm: measurement.hipsCm?.toString() || '',
        notes: measurement.notes || '',
      });
    } else {
      // Set default date to today for new measurements
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weightKg: '',
        chestCm: '',
        waistCm: '',
        hipsCm: '',
        notes: '',
      });
    }
  }, [measurement, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        date: formData.date || undefined,
        weightKg: formData.weightKg ? Number(formData.weightKg) : undefined,
        chestCm: formData.chestCm ? Number(formData.chestCm) : undefined,
        waistCm: formData.waistCm ? Number(formData.waistCm) : undefined,
        hipsCm: formData.hipsCm ? Number(formData.hipsCm) : undefined,
        notes: formData.notes || undefined,
      };

      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Failed to save measurement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {measurement ? 'Edit Measurement' : 'Add Measurement'}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weight (kg)
            </label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleInputChange}
                min="20"
                max="300"
                step="0.1"
                placeholder="Enter weight"
                className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chest (cm)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="chestCm"
                  value={formData.chestCm}
                  onChange={handleInputChange}
                  min="50"
                  max="200"
                  step="0.1"
                  placeholder="Chest"
                  className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Waist (cm)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="waistCm"
                  value={formData.waistCm}
                  onChange={handleInputChange}
                  min="50"
                  max="200"
                  step="0.1"
                  placeholder="Waist"
                  className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hips (cm)
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                name="hipsCm"
                value={formData.hipsCm}
                onChange={handleInputChange}
                min="50"
                max="200"
                step="0.1"
                placeholder="Hips"
                className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any notes about this measurement..."
                className="w-full bg-white/20 border border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="bg-atelier-darkYellow text-black font-bold py-2 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>
                {isLoading ? 'Saving...' : measurement ? 'Update' : 'Add'}
              </span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
