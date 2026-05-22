import React from 'react';
import { motion } from 'framer-motion';

const AboutBooking = () => {
  
  // High-motion stagger orchestration for central elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, 
        delayChildren: 0.1
      }
    }
  };

  // High-end cinematic entry animation with soft spring
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 90,
        damping: 14,
        mass: 0.8
      }
    }
  };

  // Continuous floating and pulsing keyframes for Left image stack
  const leftFloatKeyframes = {
    y: ["-50%", "-52%", "-48%", "-50%"], // subtle vertical drift relative to center
    rotate: [-3, -4, -2, -3], // slight rotation wobble
    scale: [1, 1.015, 1, 1], // slow pulse
    transition: {
      duration: 7,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  };

  // Continuous floating and pulsing keyframes for Right image stack
  // Alternating direction for an organic, complementary effect
  const rightFloatKeyframes = {
    y: ["-50%", "-48%", "-52%", "-50%"], // opposite subtle vertical drift
    rotate: [4, 5, 3, 4], // slight opposite rotation wobble
    scale: [1, 1.015, 1, 1], // slow pulse
    transition: {
      duration: 7.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      delay: 0.5 // slightly out of phase
    }
  };

  return (
    // Section uses an optimized height and golden background to match requested theme while containing elements
    <section className="relative bg-[#FFB000] text-white py-8 sm:py-6 lg:py-10 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      
      {/* Absolute positioning context container with vertical centering */}
      <div className="max-w-7xl mx-auto relative flex flex-col items-center justify-center min-h-[360px] lg:min-h-[440px]">
        
        {/* Centralized Text Content Stack using updated larger text sizes */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto flex flex-col items-center z-30 relative"
        >
          {/* Top small sans-serif tagline - keeping xs for professional look */}
          <motion.p 
            variants={itemVariants} 
            className="text-white uppercase tracking-[0.3em] font-semibold text-xs mb-3 shadow-sm"
          >
            RESERVE YOUR SPOT TODAY
          </motion.p>
          
          {/* Enhanced larger Title Header using elegant serif formatting */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-tight tracking-tight mb-5 drop-shadow-md"
          >
            Ready to indulge in a <br className="hidden sm:block" /> memorable meal?
          </motion.h2>

          {/* Enhanced larger Description sub-paragraph */}
          <motion.p 
            variants={itemVariants}
            className="text-white/95 font-medium text-base sm:text-lg max-w-xl leading-relaxed mb-10 drop-shadow-sm"
          >
            Reserve your table now and enjoy a delightful dining <br className="hidden sm:block" /> experience with exceptional flavors
          </motion.p>

          {/* Call to action element + Rating metrics */}
          <motion.div variants={itemVariants} className="flex items-center gap-6 flex-wrap justify-center">
            <motion.button 
              whileHover={{ scale: 1.06, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.94 }}
              className="bg-white text-black px-9 py-4 rounded-full font-bold text-xs tracking-widest transition-all duration-300 uppercase shadow-lg hover:shadow-xl"
            >
              Book a table
            </motion.button>
            
            <p className="text-white text-sm sm:text-base font-semibold flex items-center gap-1.5 select-none drop-shadow-sm">
              (4.9/5)
              <span className="text-white tracking-wider text-xl flex gap-1" aria-label="Five stars">
                ★★★★★
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* --- Left Flanking Graphic Overlap Stack - Optimized smaller dimensions --- */}
        <motion.div 
          initial={{ opacity: 0, x: -60, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          // Custom entry ease + spring transition, delayed slightly for high-end feel
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          // Continuous floating loop applied on top of centered positioning
          animate={leftFloatKeyframes}
          className="absolute left-[-2%] xl:left-[3%] top-1/2 hidden lg:block w-48 xl:w-56 aspect-square z-10 pointer-events-none origin-center"
        >
          <div className="relative w-full h-full">
            {/* Background overlapping element - Fresh Salad appetizer */}
            <div className="absolute top-[-10%] left-[-10%] w-[55%] aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/20 z-10 -rotate-6">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" 
                alt="Fresh appetizer salad" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Foreground primary display element - Gourmet Pizza */}
            <div className="w-full h-full rounded-[1.75rem] overflow-hidden shadow-2xl border border-white/20 z-20 transform rotate-[-3deg]">
              <img 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" 
                alt="Gourmet artisan pizza" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* --- Right Flanking Graphic Overlap Stack - Optimized smaller dimensions --- */}
        <motion.div 
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          // Staggered cinematic entry
          transition={{ duration: 1.1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          // Alternating continuous floating loop
          animate={rightFloatKeyframes}
          className="absolute right-[-2%] xl:right-[3%] top-1/2 hidden lg:block w-48 xl:w-56 aspect-square z-10 pointer-events-none origin-center"
        >
          <div className="relative w-full h-full">
            {/* Background overlapping element - Healthy Salad */}
            <div className="absolute top-[-15%] right-[-10%] w-[55%] aspect-square rounded-2xl overflow-hidden shadow-lg border border-white/20 z-10 rotate-12">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" 
                alt="Healthy side dish mix" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Foreground primary display element - Chicken Skewers */}
            <div className="w-full h-full rounded-[1.75rem] overflow-hidden shadow-2xl border border-white/20 z-20 transform rotate-[4deg]">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80" 
                alt="Sizzling grilled skewers" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutBooking;