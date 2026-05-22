import React from 'react';
import { motion } from 'framer-motion';

const AboutChef = () => {
  // Chef roster mapped exactly from your design layout names and roles
  const chefs = [
    {
      id: 1,
      name: 'Hiroshi Tanaka',
      role: 'Umami Specialist',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Luca Moretti',
      role: 'Italian Cuisine',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Camille Laurent',
      role: 'Dessert Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Marcus Vance',
      role: 'Executive Sous Chef',
      image: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 5,
      name: 'Sofia Gallard',
      role: 'Sauce Artisan',
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Nikos Pappas',
      role: 'Mediterranean Master',
      image: 'https://images.unsplash.com/photo-1512485694743-99a471614b54?q=80&w=600&auto=format&fit=crop'
    }
  ];

  // Animation layout configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Header block mapped from the layout */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-yellow-500 font-serif text-xs sm:text-sm tracking-[0.3em] uppercase font-bold mb-4"
          >
            Passionate Creators
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-clash font-bold tracking-tight text-white leading-tight mb-8"
          >
            Meet the chefs behind <br /> our culinary creations
          </motion.h2>

          {/* Luxury Themed Master Menu Button Link */}
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(234, 179, 8, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 text-black px-8 py-3.5 rounded-full font-serif font-bold text-sm tracking-widest uppercase transition-all duration-300"
          >
            View menu
          </motion.button>
        </div>

        {/* Dynamic 3-Column Team Profile Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8"
        >
          {chefs.map((chef) => (
            <motion.div 
              key={chef.id}
              variants={cardVariants}
              className="group flex flex-col"
            >
              {/* Premium Image Border Wrapper Layer */}
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 mb-6 shadow-2xl">
                <motion.img 
                  src={chef.image} 
                  alt={chef.name}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                {/* Immersive Dark Vignette Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Title & Detailed Label Row Configuration */}
              <div className="flex justify-between items-center px-2">
                <div>
                  <h3 className="text-2xl font-clash font-bold text-white tracking-tight mb-1 group-hover:text-yellow-500 transition-colors duration-300">
                    {chef.name}
                  </h3>
                  <p className="text-sm font-serif text-gray-400 uppercase tracking-wider">
                    {chef.role}
                  </p>
                </div>

                {/* Theme-Corrected Interactive Golden Arrow Element */}
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: '#eab308', color: '#000000' }}
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-yellow-500 cursor-pointer bg-neutral-900/50 backdrop-blur-sm transition-colors duration-300"
                >
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutChef;