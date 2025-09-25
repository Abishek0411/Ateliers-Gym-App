'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeroParallaxProps {
  children: React.ReactNode;
}

export default function HeroParallax({ children }: HeroParallaxProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-atelier-navy via-atelier-black to-atelier-navy" />

        {/* Parallax gradient layer 1 */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(246, 200, 95, 0.1) 0%, transparent 50%)`,
          }}
          animate={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(246, 200, 95, 0.1) 0%, transparent 50%)`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Parallax gradient layer 2 */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(183, 28, 28, 0.1) 0%, transparent 60%)`,
          }}
          animate={{
            background: `radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(183, 28, 28, 0.1) 0%, transparent 60%)`,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background:
                  i % 3 === 0 ? '#F6C85F' : i % 3 === 1 ? '#B71C1C' : '#0B2545',
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Floating dust particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-0.5 h-0.5 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
