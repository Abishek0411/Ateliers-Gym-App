'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface TaskDayChipProps {
  day: number;
  task: string;
  completed: boolean;
  onToggle: (completed: boolean) => void;
  disabled?: boolean;
}

export default function TaskDayChip({
  day,
  task,
  completed,
  onToggle,
  disabled = false,
}: TaskDayChipProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async () => {
    if (disabled) return;

    setIsAnimating(true);

    // Add a small delay for the animation
    setTimeout(() => {
      onToggle(!completed);
      setIsAnimating(false);
    }, 150);
  };

  const getStatusIcon = () => {
    if (disabled && isAnimating) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }

    if (completed) {
      return <CheckCircle className="w-4 h-4" />;
    }

    return <Clock className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (completed) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }

    return 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20';
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${getStatusColor()} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={handleToggle}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span className="font-bold text-sm">Day {day}</span>
        </div>

        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {getStatusIcon()}
        </motion.div>
      </div>

      {/* Task description */}
      <p className="text-sm leading-relaxed">{task}</p>

      {/* Completion status */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium">
          {completed ? 'Crushed it!' : 'Not started'}
        </span>

        {completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
        )}
      </div>

      {/* Confetti animation for completion */}
      {completed && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-atelier-darkYellow rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                scale: 0,
                x: 0,
                y: 0,
                rotate: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Hover effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-atelier-darkYellow/10 to-transparent rounded-xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}
