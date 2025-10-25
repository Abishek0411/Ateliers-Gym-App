'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressRing({
  progress,
  size = 100,
  strokeWidth = 8,
  showPercentage = false,
  className = '',
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#F6C85F'; // atelier-darkYellow
    if (progress >= 60) return '#B71C1C'; // atelier-darkRed
    if (progress >= 40) return '#0B2545'; // atelier-navy
    return '#6B7280'; // gray
  };

  const getProgressLabel = (progress: number) => {
    if (progress === 100) return 'Complete!';
    if (progress >= 80) return 'Crushing it!';
    if (progress >= 60) return 'On fire!';
    if (progress >= 40) return 'Getting there';
    if (progress >= 20) return 'Good start';
    return 'Just beginning';
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor(progress)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(246, 200, 95, 0.3))',
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {Math.round(progress)}%
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-xs text-gray-400 text-center px-2"
            >
              {getProgressLabel(progress)}
            </motion.div>
          </>
        )}
      </div>

      {/* Progress animation particles */}
      {progress > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-atelier-darkYellow rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
              }}
              initial={{
                scale: 0,
                rotate: i * 120 - 90,
                x: radius,
                y: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                x:
                  radius +
                  Math.cos(((i * 120 - 90) * Math.PI) / 180) * radius * 0.3,
                y: Math.sin(((i * 120 - 90) * Math.PI) / 180) * radius * 0.3,
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
