'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  popular,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 ${
        popular
          ? 'border-atelier-darkYellow bg-gradient-to-br from-atelier-darkYellow/10 to-atelier-darkRed/10'
          : 'border-white/10'
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      {/* Plan Name */}
      <div className="text-center mb-6">
        <h3
          className={`text-2xl font-bold mb-2 ${popular ? 'text-atelier-darkYellow' : 'text-white'}`}
        >
          {name}
        </h3>
        <div className="flex items-baseline justify-center">
          <span
            className={`text-4xl font-bold ${popular ? 'text-atelier-darkYellow' : 'text-white'}`}
          >
            {price}
          </span>
          <span className="text-gray-400 ml-1">{period}</span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                popular ? 'bg-atelier-darkYellow' : 'bg-white/20'
              }`}
            >
              <Check
                className={`w-3 h-3 ${popular ? 'text-black' : 'text-white'}`}
              />
            </div>
            <span className="text-gray-300">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
          popular
            ? 'bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black hover:shadow-2xl'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }`}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}
