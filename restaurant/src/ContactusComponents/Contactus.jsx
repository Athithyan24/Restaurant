import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Import the hook from lottie-react
import { useLottie } from 'lottie-react';

// 2. Import your json file safely as a raw module data object
import contactAnimation from '../assets/contacts.json';

const ContactUs = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 3. Define the config options for the Lottie Engine
  const lottieOptions = {
    animationData: contactAnimation,
    loop: true,
    autoplay: true,
  };

  // 4. Initialize the hook (this creates and returns the internal element view)
  const { View: LottieView } = useLottie(lottieOptions);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 90, damping: 22 } 
    }
  };

  return (
    <div className="bg-[#060606] text-white min-h-screen pt-28 sm:pt-36 pb-20 relative overflow-hidden font-sans">
      {/* Luxury background ambient effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FFB000]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[130px] pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER BLOCK */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FFB000] block mb-3">
            Reservations & Enquiries
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-wide uppercase text-white mb-5">
            Connect With Us
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000] to-transparent mx-auto mb-5" />
          <p className="text-gray-400 font-light text-sm leading-relaxed">
            Whether planning an intimate gathering or securing an exclusive alcove, our concierge desk awaits your direct transmission.
          </p>
        </motion.div>

        {/* TWO COLUMN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16 sm:mb-24">
          
          {/* LEFT COLUMN: ANIMATION & ADDRESS */}
          <div className="lg:col-span-5 flex flex-col space-y-10">
            
            {/* ROW 1: ANIMATION CONTAINER */}
            <motion.div 
              variants={itemVariants}
              className="w-full p-6 flex items-center justify-center relative overflow-hidden shadow-xl aspect-16/10 sm:aspect-video lg:aspect-auto lg:h-55"
            >
              <div className="absolute inset-0  pointer-events-none" />
              
              {/* 5. Render the custom hook View wrapper */}
              <div className="w-75 h-full max-h-45 relative z-10 flex items-center justify-center">
                {LottieView}
              </div>
            </motion.div>

            {/* ROW 2: ADDRESS */}
            <motion.div variants={itemVariants} className="space-y-6 bg-[#0d0d0d]/40 border border-white/5 rounded-2xl p-6 sm:p-8">
              <div className="space-y-2">
                <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-[#FFB000] font-sans border-l-2 border-[#FFB000] pl-3">
                  The Estate Location
                </h4>
                <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed pl-4">
                  786 Luxury Marina Boulevard,<br />
                  Downtown Core, Dubai, UAE
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-col pl-4">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Concierge Line</span>
                  <a href="tel:+97145550199" className="text-white hover:text-[#FFB000] transition-colors text-sm sm:text-base font-medium">
                    +971 (4) 555-0199
                  </a>
                </div>
                <div className="flex flex-col pl-4">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Electronic Enquiries</span>
                  <a href="mailto:info@locationrestaurant.com" className="text-white hover:text-[#FFB000] transition-colors text-sm sm:text-base font-medium">
                    info@locationrestaurant.com
                  </a>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: FORM */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-7 bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="e.g., Alexander Wright"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="e.g., alex@luxury.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="Optional"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formState.subject}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="e.g., Private Event Booking"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      value={formState.message}
                      onChange={handleChange}
                      className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000] transition-all duration-300 text-sm font-light resize-none"
                      placeholder="Share details of your inquiry or unique dining requirements..."
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full bg-[#FFB000] text-black py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 shadow-[0_4px_25px_rgba(255,176,0,0.2)]"
                    >
                      Send Luxury Inquiry
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 16 }}
                  className="text-center py-16 px-4 flex flex-col items-center justify-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full border border-[#FFB000]/30 flex items-center justify-center bg-[#FFB000]/5 text-[#FFB000] mb-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-white tracking-wide uppercase font-light">
                    Transmission Received
                  </h3>
                  <p className="text-gray-400 text-sm max-w-sm font-light leading-relaxed">
                    Thank you, <span className="text-white font-medium">{formState.name}</span>. Your details have been delivered to our Head Concierge. An ambassador will connect with you shortly.
                  </p>
                  <button 
                    onClick={() => { setIsSubmitted(false); setFormState({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="text-xs tracking-widest text-[#FFB000] uppercase font-bold hover:text-white transition-colors duration-300 pt-4"
                  >
                    Submit Another Transmission
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* MAP ROW */}
        <motion.div 
          variants={itemVariants}
          className="w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl"
        >
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#060606] to-transparent z-10 pointer-events-none" />
          <iframe 
            title="Location Fine Dining Map Pin"
            src="https://maps.google.com/maps?q=8.2627209,77.2956355&z=15&output=embed"
            className="w-full h-full border-0 relative z-0"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ContactUs;