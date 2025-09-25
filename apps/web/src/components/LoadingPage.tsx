'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';

interface LoadingPageProps {
  onComplete: () => void;
  duration?: number;
}

export default function LoadingPage({
  onComplete,
  duration = 3000,
}: LoadingPageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Call onComplete after fade out animation
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-atelier-navy via-atelier-black to-atelier-darkRed flex flex-col items-center justify-center z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-atelier-darkYellow/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Gym Logo */}
            <motion.div
              className="relative"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 100 }}
            >
              <Image
                src="/images/ateliers-gym-logo.jpg"
                alt="Atelier's Gym Logo"
                width={120}
                height={120}
                className="rounded-lg shadow-2xl border-2 border-atelier-darkYellow/50"
                priority
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-atelier-darkYellow/20 blur-lg -z-10" />
            </motion.div>

            {/* Gym Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-atelier-darkYellow mb-2"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Atelier's
              </motion.h1>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Fitness
              </motion.h2>
            </motion.div>

            {/* Dumbbell Animation */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              {/* Left Dumbbell */}
              <motion.div
                className="flex items-center"
                animate={{
                  rotate: [0, -15, 0, 15, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Dumbbell className="w-8 h-8 text-atelier-darkYellow" />
              </motion.div>

              {/* Loading Text */}
              <motion.div
                className="text-white/80 text-lg font-medium"
                style={{ fontFamily: 'Arial, sans-serif' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading...
              </motion.div>

              {/* Right Dumbbell */}
              <motion.div
                className="flex items-center"
                animate={{
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <Dumbbell className="w-8 h-8 text-atelier-darkYellow" />
              </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="w-64 h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, delay: 1.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>

          {/* Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-atelier-black/50 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
