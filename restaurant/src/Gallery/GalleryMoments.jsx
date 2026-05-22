import React from 'react';
import { motion } from 'framer-motion';

const GalleryMoments = () => {
  // Stagger entry configurations for the header and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // Upward fade-in animation for individual elements
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // Gallery Data representing the 3 moments shown in the reference
  const moments = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80",
      caption: "Clean & hygienic kitchen view",
      tilt: "-rotate-2" // Counter-clockwise tilt
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80",
      caption: "Always serve with love",
      tilt: "rotate-2" // Clockwise tilt
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
      caption: "Famous visit to restaurant",
      tilt: "-rotate-1" // Slight counter-clockwise tilt
    }
  ];

  return (
    // Transformed background to matching premium brand dark layout
    <section className="bg-[#0B0B0B] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        
        {/* --- Header Section --- */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          {/* Brand yellow uppercase tagline */}
          <motion.p 
            variants={itemVariants}
            className="text-[#FFB000] uppercase tracking-[0.2em] font-semibold text-xs sm:text-sm mb-4"
          >
            Visual stories behind moments
          </motion.p>
          
          {/* Main Serif Title - Set to stark white for a luxury high-contrast feel */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-tight tracking-tight mb-6"
          >
            Discover the beauty <br className="hidden sm:block" /> of our food creations
          </motion.h2>

          {/* Subtitle Description - Softened to muted gray for elegant readability */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 font-medium text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Take a look at our gallery, showcasing the art and <br className="hidden sm:block"/> passion that go into every dish at Plateria restaurant
          </motion.p>
        </div>

        {/* --- Gallery Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-0">
          {moments.map((moment) => (
            <motion.div 
              key={moment.id}
              variants={itemVariants}
              // Interactive hover scaling with luxury gold shadow glow
              whileHover={{ 
                scale: 1.04, 
                rotate: 0, 
                zIndex: 10,
                boxShadow: "0_25px_50px_-12px_rgba(255,176,0,0.15)"
              }}
              // Switched container base background to modern dark-mode card structure
              className={`bg-[#161616] p-3 sm:p-4 rounded-[2rem] border border-white/5 shadow-xl transition-all duration-300 group cursor-pointer ${moment.tilt}`}
            >
              <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden rounded-[1.5rem] mb-4">
                <img 
                  src={moment.image} 
                  alt={moment.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </div>
              
              {/* Text caption matching theme */}
              <div className="text-center pb-3">
                <p className="text-white font-semibold text-base sm:text-lg transition-colors duration-300 group-hover:text-[#FFB000]">
                  {moment.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
};

export default GalleryMoments;