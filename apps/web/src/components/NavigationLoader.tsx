'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NavigationLoaderProps {
  isLoading: boolean;
}

export default function NavigationLoader({ isLoading }: NavigationLoaderProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Faster transition
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15 }} // Faster animation
            className="text-center"
          >
            {/* Optimized spinner - lighter animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8, // Faster rotation
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-12 h-12 border-3 border-atelier-darkYellow border-t-transparent rounded-full mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }} // Faster text animation
              className="text-white text-lg font-medium"
            >
              Loading...
            </motion.p>
            {/* Simplified dots animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="flex justify-center space-x-1 mt-3"
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-atelier-darkYellow rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1, // Faster animation
                    repeat: Infinity,
                    delay: i * 0.15, // Reduced delay
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
