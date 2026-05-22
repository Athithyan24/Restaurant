import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Framer Motion variants for staggered elegant drop-in animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 90, damping: 20 } 
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060606] text-white pt-24 pb-12 border-t border-white/5 font-sans relative overflow-hidden">
      {/* Ambient soft glow background accent common in premium luxury designs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFB000]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* BRAND COLUMN (Typographic Lockup) */}
          <motion.div variants={itemVariants} className="space-y-6 flex flex-col items-start">
            <Link to="/" className="flex flex-col items-start group select-none">
              <span className="text-2xl sm:text-3xl font-serif text-white tracking-[0.22em] uppercase font-light leading-none mr-[-0.22em] group-hover:text-[#FFB000] transition-colors duration-300">
                Location
              </span>
              
              {/* Luxury Geometric Accent Line */}
              <div className="w-24 sm:w-28 h-[1px] bg-gradient-to-r from-[#FFB000]/70 via-[#FFB000]/20 to-transparent my-2.5" />
              
              <span className="text-[10px] sm:text-[11px] font-sans text-[#FFB000] tracking-[0.11em] uppercase font-semibold leading-none mr-[-0.11em]">
                Multi Cuisine
              </span>
              
              <span className="text-[9.5px] sm:text-[10.5px] font-sans text-gray-400 tracking-[0.24em] uppercase font-light leading-none mt-1 mr-[-0.24em]">
                Restaurant
              </span>
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xs pt-2 font-light">
              An exquisite symphony of authentic culinary heritage and global flavors, delivered with legendary hospitality.
            </p>
          </motion.div>

          {/* EXPLORE NAVIGATION LINKS COLUMN */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white font-sans border-l-2 border-[#FFB000] pl-3">
              Explore
            </h4>
            <ul className="space-y-3.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Our Menu', path: '/menu' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Culinary Blog', path: '/blog' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-[#FFB000] transition-colors duration-300 text-sm font-light tracking-wide block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT & RESERVATIONS COLUMN */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white font-sans border-l-2 border-[#FFB000] pl-3">
              Visit Us
            </h4>
            <ul className="space-y-3.5 text-gray-400 text-sm font-light">
              <li className="leading-relaxed">
                TMJ Complex, Thiruvithamcode,<br />
                Azhagiyamandapam, Tamil Nadu 629167
              </li>
              <li className="pt-2">
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Reservations Desk</span>
                <a href="tel:09384783679" className="text-white hover:text-[#FFB000] transition-colors font-medium">
                  093847 83679
                </a>
              </li>
              <li>
                <span className="text-gray-500 block text-xs uppercase tracking-wider mb-0.5">Enquiries</span>
                <a href="mailto:info@locationrestaurant.com" className="text-white hover:text-[#FFB000] transition-colors font-medium">
                  info@locationrestaurant.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* OPENING HOURS COLUMN */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-white font-sans border-l-2 border-[#FFB000] pl-3">
              Hours of Operation
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm font-light">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <span>Monday - Sunday</span>
                <span className="text-[#FFB000] text-xs font-medium">9:00 AM - 11:30 PM</span>
              </li>
              <li className="flex flex-col pt-1">
                <span className="text-xs text-white">Public Holidays / Festivals</span>
                <span className="text-[10px] text-gray-500 italic mt-0.5">Hours might differ (e.g., Eid al-Adha)</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* BOTTOM METRICS BAR */}
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-gray-500 text-xs text-center md:text-left font-light tracking-wide">
            &copy; {currentYear} Location Restaurant. Crafted with premium luxury design standards. All rights reserved.
          </p>
          
          {/* Social Links Layout */}
          <div className="flex space-x-6">
            {['Instagram', 'Facebook', 'TripAdvisor'].map((social) => (
              <a 
                key={social} 
                href={`#${social.toLowerCase()}`} 
                aria-label={social}
                className="text-gray-400 hover:text-[#FFB000] text-xs uppercase tracking-[0.15em] font-medium transition-all duration-300 hover:-translate-y-0.5"
              >
                {social}
              </a>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </footer>
  );
};

export default Footer;