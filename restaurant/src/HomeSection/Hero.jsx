import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 120, damping: 20 } 
    },
  };

  const categories = [
    { 
      name: 'Main Course', 
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop', 
      icon: '🍲' 
    },
    { 
      name: 'Desserts', 
      img: 'https://images.unsplash.com/photo-1599749001441-5f2c23e3bbe0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRlc2VydHMlMjBmb29kfGVufDB8fDB8fHww', 
      icon: '🍰' 
    },
    { 
      name: 'Appetizer', 
      img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=500&auto=format&fit=crop', 
      icon: '🥗' 
    },
    { 
      name: 'Starter', 
      img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=500&auto=format&fit=crop', 
      icon: '🥐' 
    },
  ];

  return (
    <section className="relative min-h-screen bg-black text-white pt-32 pb-32 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
      >
        <motion.p 
          variants={itemVariants}
          className="text-yellow-500 uppercase tracking-[0.25em] text-xs font-serif font-bold mb-6"
        >
          Premium Restaurant Template
        </motion.p>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-clash max-w-4xl leading-[1.1] tracking-tight mb-8"
        >
          Where every meal is <br/> a chef masterpiece
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-gray-400 max-w-2xl text-lg md:text-xl mb-10 font-serif font-light"
        >
          We bring you the finest flavors, carefully crafted with the freshest ingredients & every meal.
        </motion.p>

        {/* CTA Area */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-6 mb-32"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(234, 179, 8, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-500 text-black px-8 py-4 rounded-full font-clash font-semibold text-base tracking-wide transition-all duration-300"
          >
            <Link to="/reserve">Book a table</Link>
          </motion.button>

          {/* Star Rating */}
          <div className="flex items-center gap-3">
            <span className="font-serif font-medium text-gray-300">(4.9/5)</span>
            <div className="flex text-yellow-500 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="flex flex-row justify-center items-center gap-4 md:gap-8 lg:gap-12"
        >
          {categories.map((item, index) => {
            const isDown = index % 2 === 0;

            return (
              <React.Fragment key={item.name}>
                <motion.div 
                  variants={itemVariants}
                  className={`flex flex-col items-center group cursor-pointer transition-transform duration-500 ${
                    isDown ? 'translate-y-8 md:translate-y-12' : '-translate-y-8 md:-translate-y-12'
                  }`}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-48 md:w-48 md:h-72 rounded-[100px] p-1 border border-white/10 group-hover:border-yellow-500/50 transition-colors duration-500"
                  >
                    <div className="w-full h-full rounded-[100px] overflow-hidden relative">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                    </div>

                    <div className="absolute -top-3 -right-3 bg-white text-black w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg shadow-lg z-10 border-4 border-black">
                      {item.icon}
                    </div>
                  </motion.div>

                  <p className="mt-6 text-gray-300 font-serif font-medium group-hover:text-yellow-500 transition-colors text-sm md:text-base">
                    {item.name}
                  </p>
                </motion.div>

                {index < categories.length - 1 && (
                  <motion.div 
                    variants={itemVariants}
                    className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 shrink-0"
                  />
                )}
              </React.Fragment>
            );
          })}
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;