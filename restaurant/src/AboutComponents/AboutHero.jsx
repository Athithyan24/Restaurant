import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  // Premium animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="bg-black text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Centered Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.h4 variants={itemVariants} className="text-yellow-500 font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-bold mb-4">
            What we stand for
          </motion.h4>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-clash font-medium tracking-tight mb-8">
            Discover the passion <br className="hidden sm:block" /> behind our restaurant
          </motion.h1>

          <motion.p variants={itemVariants} className="text-gray-400 font-serif text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Our sauces and spreads are made from fresh, imperfect fruits and vegetables that are often overlooked. Nutritious, flavorful, and ready to enhance your table.
          </motion.p>
          
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(234, 179, 8, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 uppercase"
          >
            View Menu
          </motion.button>
        </motion.div>

        {/* Two-Column Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Image container with premium dark mode styling */}
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Subtle glow behind the image */}
            <div className="absolute inset-0 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop" 
                alt="Waiter serving happy couple at a premium restaurant" 
                className="w-full h-[500px] sm:h-[600px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>

          {/* Right Side: Text & Mission Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col justify-center"
          >
            <motion.h4 variants={itemVariants} className="text-yellow-500 font-serif text-sm tracking-[0.2em] uppercase font-bold mb-4">
              Our Journey of Passion
            </motion.h4>
            
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-clash font-medium tracking-tight mb-6 text-white leading-tight">
              Where flavor meets <br className="hidden lg:block"/> passion on every plate
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-gray-400 font-serif text-base sm:text-lg mb-10 leading-relaxed">
              Dining is not just a meal; it's an experience. We've always been dedicated to combining global flavors with fresh, locally sourced ingredients to create unforgettable culinary moments.
            </motion.p>

            {/* Premium "Our Mission" Glassmorphism Card (Replacing the flat orange box) */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            >
              {/* Subtle hover accent light */}
              <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500 transition-all duration-300 group-hover:w-full group-hover:opacity-10 opacity-100" />
              
              <h3 className="text-2xl font-clash font-medium text-white mb-3 relative z-10">
                Our Mission
              </h3>
              <p className="text-gray-300 font-serif text-sm sm:text-base leading-relaxed relative z-10">
                We believe in using perfectly imperfect fruits and vegetables to create our sauces and spreads, minimizing waste while maximizing flavor for our guests.
              </p>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default AboutHero;