import React from 'react';
import { motion } from 'framer-motion';

const HomeBooking = () => {
  // Opening hours data matching your template structure
  const schedule = [
    { day: 'Monday', time: 'Closed', isClosed: true },
    { day: 'Tuesday', time: '11 AM - 10 PM', isClosed: false },
    { day: 'Wednesday', time: '10 AM - 08 PM', isClosed: false },
    { day: 'Thursday', time: '10 AM - 11 PM', isClosed: false },
    { day: 'Friday', time: 'Closed', isClosed: true },
    { day: 'Saturday', time: '11 AM - 10 PM', isClosed: false },
    { day: 'Sunday', time: '12 AM - 9 PM', isClosed: false },
  ];

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Frame Container with Premium Rounded Borders */}
        <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-neutral-900 min-h-[550px] md:min-h-[600px] lg:min-h-[660px] flex items-center justify-end p-4 sm:p-8 lg:p-16 border border-white/10">
          
          {/* Background Image Layer */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1600&auto=format&fit=crop" 
              alt="Restaurant Interior Ambiance" 
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Cinematic Gradient overlay to blend seamlessly with the black theme */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-black/80 md:to-black/60" />
          </div>

          {/* Opening Hours Panel - Redesigned to Matte Black & Vibrant Gold Theme */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:max-w-[440px] lg:max-w-[460px] bg-neutral-950/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] flex flex-col justify-between"
          >
            <div>
              {/* Heading Block (Clash Display Style) */}
              <h2 className="text-3xl sm:text-4xl font-clash text-white font-bold tracking-tight mb-2">
                Opening time<span className="text-yellow-500">:</span>
              </h2>
              <p className="text-[10px] font-serif tracking-[0.2em] uppercase text-yellow-500/80 mb-8">
                Experience Culinary Masterpieces Daily
              </p>

              {/* Weekly Timetable List Rows */}
              <div className="space-y-4 mb-8">
                {schedule.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
                    key={item.day}
                    className="flex justify-between items-center pb-3 border-b border-white/5 last:border-none group"
                  >
                    {/* Day String Label */}
                    <span className="text-sm sm:text-base font-serif text-gray-400 group-hover:text-white transition-colors duration-300">
                      {item.day}
                    </span>
                    
                    {/* Timing details mapped in Premium Yellow color formatting */}
                    <span className={`text-sm sm:text-base font-serif tracking-wide transition-colors duration-300 ${
                      item.isClosed 
                        ? 'text-neutral-600 line-through' 
                        : 'text-yellow-500 font-semibold group-hover:text-yellow-400'
                    }`}>
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Theme-Corrected Golden Yellow CTA Action Button */}
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0px 0px 30px rgba(234, 179, 8, 0.3)" 
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-950 font-serif font-bold text-sm sm:text-base py-4 rounded-xl transition-all duration-300 outline-none uppercase tracking-widest"
            >
              Book a table
            </motion.button>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HomeBooking;