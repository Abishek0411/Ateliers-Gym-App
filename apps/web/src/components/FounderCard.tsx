'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Confetti from './Confetti';

interface FounderCardProps {
  className?: string;
}

export default function FounderCard({ className = '' }: FounderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const achievements = [
    'Ex Mr. India 2019',
    'Certified Personal Trainer',
    '10+ Years Experience',
    '500+ Clients Transformed',
  ];

  const handleHoverStart = () => {
    setIsHovered(true);
    setShowConfetti(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative glass-card rounded-2xl p-8 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? -5 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Confetti Animation */}
        <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0"
          style={{
            background:
              'linear-gradient(45deg, rgba(246, 200, 95, 0.3), rgba(183, 28, 28, 0.3))',
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Founder Photo */}
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-atelier-darkYellow shadow-lg">
              <Image
                src="/images/ateliers-gym-logo.jpg"
                alt="Founder Photo - Ex Mr. India"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-atelier-darkRed text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              Ex Mr. India
            </motion.div>
          </div>

          {/* Name */}
          <motion.h3
            className="text-2xl font-bold text-gradient text-center mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
          >
            Rajesh Kumar
          </motion.h3>

          <motion.p
            className="text-atelier-accentWhite/80 text-center mb-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Founder & Head Trainer
          </motion.p>

          {/* Achievements */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h4
              className="text-atelier-darkYellow font-semibold text-center mb-4"
              style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
            >
              Achievements
            </h4>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  className="flex items-center space-x-3 text-atelier-accentWhite/70 morph-button rounded-lg p-2 hover:bg-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  <div className="w-2 h-2 bg-atelier-darkYellow rounded-full flex-shrink-0" />
                  <span className="text-sm">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            className="mt-6 text-center text-atelier-accentWhite/80 italic text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            "Fitness is not just about the body, it's about transforming your
            entire life."
          </motion.blockquote>
        </div>
      </motion.div>
    </motion.div>
  );
}
