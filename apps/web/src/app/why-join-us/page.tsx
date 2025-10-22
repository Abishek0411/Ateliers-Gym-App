'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import BenefitsCard from '@/components/BenefitsCard';
import TrainerCard from '@/components/TrainerCard';
import PricingCard from '@/components/PricingCard';
import FAQAccordion from '@/components/FAQAccordion';
import {
  Dumbbell,
  Users,
  Award,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Calendar,
  Phone,
} from 'lucide-react';

export default function WhyJoinUsPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: Award,
      title: 'Champion Trainers',
      description:
        'Learn from certified professionals with years of experience and proven track records.',
      color: 'from-atelier-darkYellow to-yellow-400',
    },
    {
      icon: Dumbbell,
      title: 'Pro-Level Equipment',
      description:
        'Train with state-of-the-art equipment used by professional athletes and bodybuilders.',
      color: 'from-atelier-darkRed to-red-400',
    },
    {
      icon: Users,
      title: 'Personalized Plans',
      description:
        'Get custom workout and nutrition plans tailored to your specific goals and lifestyle.',
      color: 'from-atelier-navy to-blue-400',
    },
    {
      icon: Star,
      title: 'Community & Challenges',
      description:
        'Join a supportive community and participate in exciting fitness challenges and competitions.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const trainers = [
    {
      name: 'Rajesh Kumar',
      title: 'Head Trainer & Former Mr. India',
      image: '/images/trainer-1.jpg',
      achievements: ['Mr. India 2019', 'IFBB Pro', '10+ Years Experience'],
      specialties: ['Bodybuilding', 'Powerlifting', 'Nutrition'],
    },
    {
      name: 'Priya Sharma',
      title: 'Senior Fitness Coach',
      image: '/images/trainer-2.jpg',
      achievements: [
        'Certified Personal Trainer',
        'Yoga Instructor',
        '5+ Years Experience',
      ],
      specialties: ['Weight Loss', 'Yoga', 'Functional Training'],
    },
    {
      name: 'Amit Singh',
      title: 'Strength & Conditioning Specialist',
      image: '/images/trainer-3.jpg',
      achievements: [
        'NSCA Certified',
        'Olympic Lifting Coach',
        '8+ Years Experience',
      ],
      specialties: [
        'Strength Training',
        'Athletic Performance',
        'Injury Prevention',
      ],
    },
  ];

  const membershipTiers = [
    {
      name: 'Basic',
      price: '₹2,999',
      period: '/month',
      features: [
        'Gym Access (6 AM - 10 PM)',
        'Basic Equipment',
        'Group Classes (Limited)',
        'Locker Access',
        'WiFi',
      ],
      cta: 'Start Basic',
      popular: false,
    },
    {
      name: 'Premium',
      price: '₹4,999',
      period: '/month',
      features: [
        '24/7 Gym Access',
        'All Equipment',
        'Unlimited Group Classes',
        'Personal Training (2 sessions)',
        'Nutrition Consultation',
        'Locker + Towel Service',
        'Guest Passes (2/month)',
      ],
      cta: 'Go Premium',
      popular: true,
    },
    {
      name: 'VIP',
      price: '₹7,999',
      period: '/month',
      features: [
        '24/7 Premium Access',
        'All Equipment + Latest',
        'Unlimited Everything',
        'Personal Training (4 sessions)',
        'Nutrition + Meal Plans',
        'Spa & Recovery Services',
        'Guest Passes (5/month)',
        'Priority Booking',
      ],
      cta: 'Become VIP',
      popular: false,
    },
  ];

  const successStories = [
    {
      name: 'Sarah Johnson',
      beforeAfter: 'Lost 25kg in 6 months',
      testimonial:
        "Atelier's transformed my life. The trainers are amazing and the community is so supportive!",
      image: '/images/success-1.jpg',
    },
    {
      name: 'Mike Chen',
      beforeAfter: 'Gained 15kg muscle in 8 months',
      testimonial:
        'Best gym in the city! The equipment is top-notch and the trainers really know their stuff.',
      image: '/images/success-2.jpg',
    },
    {
      name: 'Lisa Rodriguez',
      beforeAfter: 'Completed first marathon at 45',
      testimonial:
        "Never thought I could run a marathon. Atelier's training program made it possible!",
      image: '/images/success-3.jpg',
    },
  ];

  const classSchedule = [
    { time: '6:00 AM', class: 'Morning Yoga', trainer: 'Priya' },
    { time: '7:30 AM', class: 'HIIT Cardio', trainer: 'Amit' },
    { time: '6:00 PM', class: 'Strength Training', trainer: 'Rajesh' },
    { time: '7:30 PM', class: 'Zumba Dance', trainer: 'Priya' },
    { time: '8:30 PM', class: 'Evening Stretch', trainer: 'Amit' },
  ];

  const faqs = [
    {
      question: 'What are your operating hours?',
      answer:
        "We're open 24/7 for Premium and VIP members, and 6 AM - 10 PM for Basic members. Our staff is available during peak hours (6 AM - 10 PM) for assistance.",
    },
    {
      question: 'Do you offer personal training?',
      answer:
        'Yes! We have certified personal trainers available for one-on-one sessions. Premium members get 2 sessions included, and VIP members get 4 sessions per month.',
    },
    {
      question: 'What equipment do you have?',
      answer:
        'We have state-of-the-art equipment including free weights, machines, cardio equipment, functional training areas, and specialized equipment for powerlifting and bodybuilding.',
    },
    {
      question: 'Can I freeze my membership?',
      answer:
        'Yes, you can freeze your membership for up to 3 months per year for medical reasons or travel. A small freeze fee applies.',
    },
    {
      question: 'Do you have parking?',
      answer:
        'Yes, we have free parking for all members. Premium and VIP members get reserved parking spots.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-atelier-navy via-black to-atelier-darkRed">
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Why Join{' '}
              <span className="bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed bg-clip-text text-transparent">
                Atelier's
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Transform your fitness journey with India's premier gym
              experience. Where champions are made, and dreams become reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-gradient-to-r from-atelier-darkYellow to-atelier-darkRed text-black font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Your Free Intro</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Tour</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 right-10 w-32 h-32 border border-atelier-darkYellow/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-20 left-10 w-24 h-24 border border-atelier-darkRed/20 rounded-full"
          />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Atelier's?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide everything you need to achieve your fitness goals with
              world-class facilities and expert guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <BenefitsCard {...benefit} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              World-Class Facilities
            </h2>
            <p className="text-xl text-gray-300">
              Experience our state-of-the-art equipment and premium amenities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: item * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-atelier-navy to-atelier-darkRed rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Dumbbell className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Spotlights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Champions
            </h2>
            <p className="text-xl text-gray-300">
              Learn from the best trainers in the industry
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <TrainerCard {...trainer} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible membership options to fit your lifestyle and budget
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <PricingCard {...tier} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              Real transformations from real members
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-atelier-darkYellow to-atelier-darkRed rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-black font-bold text-xl">
                    {story.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {story.name}
                </h3>
                <p className="text-atelier-darkYellow font-semibold mb-3">
                  {story.beforeAfter}
                </p>
                <p className="text-gray-300 italic">"{story.testimonial}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Class Schedule */}
      <section className="py-16 bg-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Weekly Classes
            </h2>
            <p className="text-xl text-gray-300">
              Join our group classes and train with the community
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="grid gap-4">
                {classSchedule.map((schedule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="w-5 h-5 text-atelier-darkYellow" />
                      <span className="text-white font-semibold">
                        {schedule.time}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">{schedule.class}</p>
                      <p className="text-gray-400 text-sm">
                        with {schedule.trainer}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-atelier-darkYellow text-black rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200"
                    >
                      Book
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about joining Atelier's
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-atelier-navy to-atelier-darkRed">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of members who have already started their fitness
              journey with Atelier's. Your transformation starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-gradient-to-r from-atelier-darkYellow to-yellow-400 text-black font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Join Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Book Intro Session</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
