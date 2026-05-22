import React from 'react';
import { motion } from 'framer-motion';

const GalleryOtherMoments = () => {
  
  // Grid container scroll entry animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Smooth ripple fade-in across all 6 images
        delayChildren: 0.15
      }
    }
  };

  // Individual card spring reveal animations
  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 0.9
      }
    }
  };

  // High-quality contextual food & hospitality imagery matching the reference layout
  const otherMoments = [
    {
      id: 1,
      alt: "Waiter serving premium coffee to guests",
      image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      alt: "Fine dining service table setup at sunset window",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      alt: "Chef showcasing main course platter to dining room",
      image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      alt: "Professional culinary chef plating dessert meticulously",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      alt: "Beautiful luxury restaurant indoor seating with plants",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      alt: "Smiling outdoor terrace hospitality staff taking order",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    // Replaced the light gray with a rich premium near-black background to fit the brand theme
    <section className="bg-[#0B0B0B] pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Scroll-tracked structural content wrapper */}
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={containerVariants}
      >
        
        {/* --- Header Section --- */}
        <div className="text-center mb-12 sm:mb-16">
          {/* Changed text color to a soft muted gray with our distinct brand-yellow heart */}
          <motion.h3 
            variants={itemVariants}
            className="text-gray-400 font-sans font-medium text-base sm:text-lg tracking-wide flex items-center justify-center gap-2 select-none"
          >
            Other moments captured with <span className="text-[#FFB000] animate-pulse">❤️</span>
          </motion.h3>
        </div>

        {/* --- 3-Column Image Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {otherMoments.map((moment) => (
            <motion.div
              key={moment.id}
              variants={itemVariants}
              // Luxurious dynamic scale hover interaction with a subtle premium golden shadow glow
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0_25px_50px_-12px_rgba(255,176,0,0.12)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              // Ultra-rounded aesthetic layout from the original frame design
              className="relative w-full aspect-square overflow-hidden rounded-[1.75rem] shadow-md bg-[#161616] cursor-pointer group"
            >
              {/* Image element configured with custom container dimensions */}
              <img 
                src={moment.image} 
                alt={moment.alt} 
                className="w-full h-full object-cover select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                loading="lazy"
              />
              
              {/* Premium dark vignette border ring overlay to enrich contrast */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.75rem] pointer-events-none transition-colors duration-300 group-hover:ring-[#FFB000]/30" />
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
};

export default GalleryOtherMoments;