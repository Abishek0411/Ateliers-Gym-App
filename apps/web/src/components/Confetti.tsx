'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function Confetti({ isActive, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // -100 to 100
        y: Math.random() * 50 - 25, // -25 to 25
        delay: Math.random() * 0.3,
      }));
      setPieces(newPieces);

      // Clean up after animation
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          className="confetti-piece"
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: piece.x + (Math.random() - 0.5) * 100,
            y: piece.y - 150,
            rotate: 360,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            delay: piece.delay,
            ease: 'easeOut',
          }}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
