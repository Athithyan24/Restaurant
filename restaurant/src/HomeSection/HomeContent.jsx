import React from 'react';
import { motion } from 'framer-motion';

const Content = () => {
  // Framer Motion variants for smooth scroll-reveal animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 20 } 
    },
  };

  const features = [
    {
      num: '01',
      title: 'Authentic Flavors',
      desc: 'We take pride in offering an array of dishes made with love & quality, ensuring every bite is a journey.',
    },
    {
      num: '02',
      title: 'Cozy Ambiance',
      desc: 'Our restaurant provides the perfect setting to enjoy your food, whether for a romantic date or family gathering.',
    },
    {
      num: '03',
      title: 'Exceptional Service',
      desc: 'Our team is dedicated to making your dining experience smooth, memorable, and absolutely perfect.',
    },
  ];

  return (
    <section className="bg-black text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Image and Text Side-by-Side */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }} // Triggers slightly before it fully enters the screen
        >
          
          {/* Left: Large Image */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 group-hover:border-yellow-500/50 transition-colors duration-500">
              <img 
                src='/loc.jpg'
                alt="Couple enjoying dining experience" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Subtle dark overlay to ensure it blends beautifully with the black background */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            {/* Decorative yellow accent behind image */}
            <div className="absolute -inset-4 bg-yellow-500/5 blur-3xl -z-10 rounded-full" />
          </motion.div>

          {/* Right: Content Block */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            
            {/* Top Label */}
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-serif italic text-gray-300 tracking-wider">
                Best Dining Experience
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-clash leading-[1.1] mb-8">
              Best dining experience <br className="hidden md:block" /> with every dish
            </h2>

            {/* Paragraph */}
            <p className="font-serif text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              We believe dining is more than just a meal; it's an experience. Our chefs create dishes that combine the freshest ingredients to bring you a taste of perfection.
            </p>

            {/* Interactive Location/Map Card */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0px 10px 30px rgba(234, 179, 8, 0.2)" }}
              className="flex items-center gap-4 bg-yellow-500 p-3 pr-8 rounded-2xl w-fit cursor-pointer text-black"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-black/10">
                <img 
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=200&auto=format&fit=crop" 
                  alt="Restaurant dish thumbnail" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-clash font-semibold text-lg leading-tight mb-1">
                  Aura Restaurant, NY
                </h4>
                <div className="flex items-center gap-1.5 text-sm font-serif font-bold text-black/70">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>View on Map</span>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Bottom Section: 3 Columns (01, 02, 03) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 border-t border-white/10 pt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.num} 
              variants={itemVariants}
              className="flex flex-col items-center text-center group"
            >
              {/* Large Number - Clash Display */}
              <h3 className="text-6xl font-clash text-white/20 group-hover:text-yellow-500 transition-colors duration-500 mb-6">
                {feature.num}
              </h3>
              
              {/* Title - Santhosi */}
              <h4 className="text-2xl font-serif font-medium text-white mb-4">
                {feature.title}
              </h4>
              
              {/* Description - Santhosi */}
              <p className="font-serif text-gray-400 leading-relaxed text-sm sm:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Content;