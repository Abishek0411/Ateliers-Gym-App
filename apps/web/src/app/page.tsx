'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';
import PageTransition from '../components/PageTransition';
import LoadingPage from '../components/LoadingPage';
import Navigation from '@/components/Navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showFounderCard, setShowFounderCard] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Always show loading animation on Home page refresh to flaunt the cool loading
    // This creates an impressive experience every time users visit the home page
    setIsFirstVisit(true);
  }, []);

  useEffect(() => {
    // Show founder card after loading completes
    const timer = setTimeout(() => {
      setShowFounderCard(true);
    }, 3500); // Slightly after loading completes

    return () => clearTimeout(timer);
  }, []);

  const handleBookSession = () => {
    router.push('/login');
  };

  return (
    <>
      {/* Loading Page - Only show on first visit */}
      {isFirstVisit && (
        <LoadingPage onComplete={() => setIsLoading(false)} duration={3000} />
      )}

      {/* Main Page */}
      {!isLoading && (
        <PageTransition>
          <Navigation currentPage="home" />
          <HeroParallax>
            <div className="container mx-auto px-4 py-16 pt-20 pb-20 min-h-screen flex items-center">
              <main
                id="main-content"
                className="grid lg:grid-cols-2 gap-12 items-center w-full"
              >
                {/* Left Side - Content */}
                <motion.div
                  className="text-center lg:text-left flex flex-col items-center lg:items-start"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Logo + Title Combination */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <div className="flex flex-col items-center lg:items-start">
                      {/* Gym Logo */}
                      <motion.div
                        className="relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Image
                          src="/images/ateliers-gym-logo.jpg"
                          alt="Atelier's Gym Logo"
                          width={150}
                          height={150}
                          className="rounded-lg shadow-lg border-2 border-atelier-darkYellow/30"
                          priority
                        />
                        {/* Subtle glow around logo */}
                        <div className="absolute inset-0 rounded-lg bg-atelier-darkYellow/10 blur-sm -z-10" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Tagline */}
                  <motion.p
                    className="text-2xl md:text-3xl lg:text-4xl text-gradient mb-8 max-w-lg mx-auto lg:mx-0 font-bold tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
                  >
                    Train with the spirit of champions
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div
                    className="w-full flex flex-row gap-3 justify-center lg:justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.button
                      onClick={() => router.push('/why-join-us')}
                      className="morph-button bg-gradient-to-r from-atelier-darkYellow to-yellow-400 hover:from-yellow-400 hover:to-atelier-darkYellow text-black font-bold py-3 px-6 rounded-lg text-base shadow-lg flex items-center space-x-2 accent-stroke focus:outline-none focus:ring-2 focus:ring-atelier-darkRed focus:ring-offset-2 focus:ring-offset-atelier-navy"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Learn why you should join Atelier's - Navigate to why join us page"
                      role="button"
                      tabIndex={0}
                      style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
                    >
                      <span>Why Join Us?</span>
                    </motion.button>

                    <motion.button
                      onClick={handleBookSession}
                      className="morph-button bg-gradient-to-r from-atelier-darkRed to-red-700 hover:from-red-700 hover:to-atelier-darkRed text-white font-bold py-3 px-6 rounded-lg text-base shadow-lg flex items-center space-x-2 accent-stroke focus:outline-none focus:ring-2 focus:ring-atelier-darkYellow focus:ring-offset-2 focus:ring-offset-atelier-navy"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Start your fitness journey - Navigate to login page"
                      role="button"
                      tabIndex={0}
                      style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
                    >
                      {/* Dumbbell Icon */}
                      <Dumbbell className="w-5 h-5" />
                      <span>Let's Start</span>
                    </motion.button>
                  </motion.div>

                  {/* Additional Info */}
                  <motion.div
                    className="mt-12 grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                  >
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold text-gradient mb-2"
                        style={{
                          fontFamily: 'Poppins, Inter, sans-serif',
                        }}
                      >
                        500+
                      </div>
                      <div
                        className="text-atelier-accentWhite/80 text-sm font-medium"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Happy Clients
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold text-gradient mb-2"
                        style={{
                          fontFamily: 'Poppins, Inter, sans-serif',
                        }}
                      >
                        10+
                      </div>
                      <div
                        className="text-atelier-accentWhite/80 text-sm font-medium"
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Years Experience
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Side - Founder Hero Image with Details */}
                <motion.div
                  className="flex justify-center lg:justify-end"
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="relative w-full max-w-lg">
                    {/* Founder Hero Image Container with 3D Tilt */}
                    <motion.div
                      className="relative rounded-2xl overflow-hidden shadow-2xl founder-card-3d"
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        filter: 'blur(20px)',
                        rotateY: -45,
                        x: 100,
                      }}
                      animate={
                        showFounderCard
                          ? {
                              opacity: 1,
                              scale: 1,
                              filter: 'blur(0px)',
                              rotateY: 0,
                              x: 0,
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.5,
                        delay: 0.2,
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                      }}
                      whileHover={{
                        rotateX: 5,
                        rotateY: -5,
                        scale: 1.02,
                      }}
                      style={{ perspective: '1000px' }}
                    >
                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0"
                        style={{
                          background:
                            'linear-gradient(45deg, rgba(246, 200, 95, 0.3), rgba(183, 28, 28, 0.3))',
                          filter: 'blur(20px)',
                        }}
                        whileHover={{
                          opacity: 0.6,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Main Image */}
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          src="/images/Gemini_Generated_Image.png"
                          alt="Arasu Mounaguru - Ex Mr. India 2003, Founder & Head Trainer"
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Blending Overlays */}
                        <div className="absolute inset-0 hero-image-blend" />
                        <div className="absolute inset-0 hero-image-overlay" />
                        <div className="absolute inset-0 hero-image-vignette" />

                        {/* Subtle Glow Effect */}
                        <div className="absolute inset-0 hero-image-glow opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Floating Badge */}
                      <motion.div
                        className="absolute top-4 right-4 bg-atelier-darkRed text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 1,
                          type: 'spring',
                          stiffness: 200,
                        }}
                      >
                        Ex Mr. India
                      </motion.div>
                    </motion.div>

                    {/* Founder Details Card */}
                    <motion.div
                      className="relative z-10 mt-6 glass-card rounded-2xl p-6"
                      initial={{
                        opacity: 0,
                        y: 50,
                        scale: 0.9,
                        rotateX: 15,
                      }}
                      animate={
                        showFounderCard
                          ? {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              rotateX: 0,
                            }
                          : {}
                      }
                      transition={{
                        duration: 1.2,
                        delay: 0.8,
                        type: 'spring',
                        stiffness: 80,
                        damping: 12,
                      }}
                    >
                      {/* Founder Name */}
                      <motion.h3
                        className="text-2xl font-bold text-gradient text-center mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        style={{
                          fontFamily: 'Poppins, Inter, sans-serif',
                        }}
                      >
                        Arasu Mounaguru
                      </motion.h3>

                      {/* Founder Title */}
                      <motion.p
                        className="text-atelier-accentWhite/80 text-center mb-6 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        Founder & Head Trainer
                      </motion.p>

                      {/* Achievements List */}
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, staggerChildren: 0.1 }}
                      >
                        <h4
                          className="text-atelier-darkYellow font-semibold text-center mb-4"
                          style={{
                            fontFamily: 'Poppins, Inter, sans-serif',
                          }}
                        >
                          Achievements
                        </h4>
                        <div className="space-y-2">
                          {[
                            'Ex Mr. India 2003',
                            'Certified Personal Trainer',
                            '20+ Years Experience',
                            '500+ Clients Transformed',
                          ].map((achievement, index) => (
                            <motion.div
                              key={achievement}
                              className="flex items-center space-x-3 text-atelier-accentWhite/70 morph-button rounded-lg p-2 hover:bg-white/5"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.3 + index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                              <div className="w-2 h-2 bg-atelier-darkYellow rounded-full flex-shrink-0"></div>
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
                        transition={{ delay: 1.6 }}
                        style={{ fontFamily: 'Roboto, sans-serif' }}
                      >
                        "Your Body is a Temple, But only if you Treat it as One"
                      </motion.blockquote>
                    </motion.div>

                    {/* Parallax Background Elements */}
                    <div className="absolute -inset-4 -z-10">
                      <motion.div
                        className="absolute top-1/4 left-1/4 w-32 h-32 bg-atelier-darkYellow/20 rounded-full blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <motion.div
                        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-atelier-darkRed/20 rounded-full blur-lg"
                        animate={{
                          scale: [1.2, 1, 1.2],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </main>
            </div>

            {/* Description Section - Moved to end */}
            <motion.div
              className="container mx-auto px-4 py-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="max-w-4xl mx-auto text-center">
                <motion.p
                  className="text-lg md:text-xl text-atelier-accentWhite/80 leading-relaxed"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Experience world-class training with our certified experts.
                  From beginners to athletes, we transform lives through
                  personalized fitness programs and unwavering dedication.
                </motion.p>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.div
                className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-3 bg-white/70 rounded-full mt-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </HeroParallax>
        </PageTransition>
      )}
    </>
  );
}
