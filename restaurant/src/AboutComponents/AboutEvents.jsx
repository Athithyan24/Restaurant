import React from 'react';
import { motion } from 'framer-motion';

const AboutEvents = () => {
  // Event categories mapped exactly from the reference layout structure
  const eventCategories = [
    {
      id: '01',
      title: 'Weddings',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '02',
      title: 'Birthday Parties',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '03',
      title: 'Corporate Events',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '04',
      title: 'Anniversaries',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '05',
      title: 'Private Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '06',
      title: 'Cocktail Soirées',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '07',
      title: "Chef's Table Experience",
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '08',
      title: 'Festive Celebrations',
      image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=600&auto=format&fit=crop'
    },
    
  ];

  // Stagger entry configurations for grid architecture
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Header Section Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-yellow-500 font-serif text-xs sm:text-sm tracking-[0.3em] uppercase font-medium mb-4"
          >
            Exclusive Catering
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-clash font-medium tracking-tight text-white leading-tight"
          >
            Ready to cater for <br /> your all special events
          </motion.h2>
        </div>

        {/* Interactive Responsive Grid Frame */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
        >
          {eventCategories.map((event) => (
            <motion.div 
              key={event.id}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              {/* Image Frame Holder Container with Smooth Premium Outer Border Stroke */}
              <div className="relative aspect-square rounded-[1.8rem] overflow-hidden bg-neutral-900 border border-white/10 mb-5">
                <motion.img 
                  src={event.image} 
                  alt={event.title}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                {/* Micro Ambient Shadow Gradient Layer overlay within the image panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Text Layout Metadata Grid (Title Left, Index Value Right) */}
              <div className="flex justify-between items-baseline px-2">
                <h3 className="text-xl font-clash font-light text-gray-200 group-hover:text-white transition-colors duration-300">
                  {event.title}
                </h3>
                
                {/* Styled Counter Index Element in Accent Luxury Gold */}
                <span className="text-sm font-serif font-medium text-yellow-500/80 group-hover:text-yellow-400 tracking-wider transition-colors duration-300">
                  {event.id}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutEvents;