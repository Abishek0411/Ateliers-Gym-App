'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BenefitsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export default function BenefitsCard({
  icon: Icon,
  title,
  description,
  color,
}: BenefitsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`w-16 h-16 bg-gradient-to-r ${color} rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        <Icon className="w-8 h-8 text-black" />
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}
