'use client';

import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';

interface TrainerCardProps {
  name: string;
  title: string;
  image: string;
  achievements: string[];
  specialties: string[];
}

export default function TrainerCard({
  name,
  title,
  image,
  achievements,
  specialties,
}: TrainerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
    >
      {/* Trainer Image */}
      <div className="relative mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed rounded-full mx-auto flex items-center justify-center">
          <span className="text-black font-bold text-3xl">
            {name.charAt(0)}
          </span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-atelier-darkYellow to-yellow-400 rounded-full flex items-center justify-center">
          <Award className="w-4 h-4 text-black" />
        </div>
      </div>

      {/* Trainer Info */}
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-atelier-darkYellow font-semibold mb-4">{title}</p>

      {/* Achievements */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Achievements
        </h4>
        <div className="space-y-1">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm text-gray-400"
            >
              <Star className="w-3 h-3 text-atelier-darkYellow" />
              <span>{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Specialties
        </h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-white rounded-full text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
