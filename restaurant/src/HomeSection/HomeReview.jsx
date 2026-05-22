import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// High-Performance Animated Counter Component
const AnimatedCounter = ({ from = 98999, to, duration = 2, suffix = "", useFirstComma = false }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const isViewed = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isViewed) {
      const controls = animate(from, to, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Premium cinematic easing
        onUpdate: (value) => {
          setCount(Math.floor(value));
        },
      });
      return () => controls.stop();
    }
  }, [isViewed, from, to, duration]);

  // Format number layout structure
  const formatNumber = (num) => {
    if (useFirstComma && num > 9999) {
      return num.toLocaleString(); // Formats 80022 to 80,022
    }
    return num;
  };

  return (
    <span ref={nodeRef}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

const HomeReview = () => {
  // Continuous gentle floating animation configuration for side dishes
  const floatingAnimation = (delay = 0) => ({
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    },
  });

  return (
    <section className="relative bg-white text-black py-28 sm:py-36 px-4 overflow-hidden select-none">
      
      {/* Decorative Blur Background Accents to match the video frame style */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-yellow-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Floating Plates Layer - Left Side */}
      <div className="absolute left-4 sm:left-12 top-12 lg:top-24 z-10 hidden md:block">
        <motion.div animate={floatingAnimation(0)} className="w-24 h-24 lg:w-40 lg:h-40 filter drop-shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop" 
            alt="Breakfast Plate" 
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </motion.div>
      </div>
      <div className="absolute left-6 sm:left-16 bottom-12 lg:bottom-24 z-10 hidden md:block">
        <motion.div animate={floatingAnimation(1.5)} className="w-24 h-24 lg:w-36 lg:h-36 filter drop-shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" 
            alt="Meatballs Plate" 
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </motion.div>
      </div>

      {/* Floating Plates Layer - Right Side */}
      <div className="absolute right-4 sm:right-12 top-16 lg:top-20 z-10 hidden md:block">
        <motion.div animate={floatingAnimation(0.75)} className="w-24 h-24 lg:w-36 lg:h-36 filter drop-shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop" 
            alt="Pizza Plate" 
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </motion.div>
      </div>
      <div className="absolute right-6 sm:right-16 bottom-16 lg:bottom-28 z-10 hidden md:block">
        <motion.div animate={floatingAnimation(2.2)} className="w-24 h-24 lg:w-40 lg:h-40 filter drop-shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop" 
            alt="Noodles Plate" 
            className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </motion.div>
      </div>

      {/* Center Dashboard Statistics Content Container */}
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-20">
        
        {/* Massive Hero Metric */}
        <div className="mb-14">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-clash font-medium tracking-tight text-neutral-950 leading-none">
            <AnimatedCounter to={100000} suffix="+" useFirstComma={true} duration={2.5} />
          </h1>
          <p className="text-yellow-600 font-serif font-bold text-xs sm:text-sm tracking-[0.25em] uppercase mt-4">
            Meals served for everyone
          </p>
        </div>

        {/* Desktop Metrics Row Grid with separation dots */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-6 lg:gap-x-10 gap-y-6 mt-6">
          
          {/* Metric 1 */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={20} suffix="K+" />
            </h3>
            <p className="text-gray-500 font-serif text-sm mt-1">Creative experience</p>
          </div>

          <span className="text-yellow-500 font-bold text-xl select-none">•</span>

          {/* Metric 2 */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={1000} suffix="+" />
            </h3>
            <p className="text-gray-500 font-serif text-sm mt-1">Events created</p>
          </div>

          <span className="text-yellow-500 font-bold text-xl select-none">•</span>

          {/* Metric 3 */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={500} suffix="K+" />
            </h3>
            <p className="text-gray-500 font-serif text-sm mt-1">Customer Reviews</p>
          </div>

          <span className="text-yellow-500 font-bold text-xl select-none">•</span>

          {/* Metric 4 */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={10} suffix="+" />
            </h3>
            <p className="text-gray-500 font-serif text-sm mt-1">Years experience</p>
          </div>

        </div>

        {/* Fallback layout adjustment exclusively for small Mobile Screens */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:hidden w-full max-w-sm mt-4 border-t border-gray-100 pt-8">
          <div>
            <h3 className="text-3xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={20} suffix="K+" />
            </h3>
            <p className="text-gray-500 font-serif text-xs mt-1">Creative experience</p>
          </div>
          <div>
            <h3 className="text-3xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={1000} suffix="+" />
            </h3>
            <p className="text-gray-500 font-serif text-xs mt-1">Events created</p>
          </div>
          <div>
            <h3 className="text-3xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={500} suffix="K+" />
            </h3>
            <p className="text-gray-500 font-serif text-xs mt-1">Customer Reviews</p>
          </div>
          <div>
            <h3 className="text-3xl font-clash font-bold text-neutral-950">
              <AnimatedCounter to={10} suffix="+" />
            </h3>
            <p className="text-gray-500 font-serif text-xs mt-1">Years experience</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeReview;