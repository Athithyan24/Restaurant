import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import Auth

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pull user context and logout function
  const { user, logout } = useAuth();

  // Hide/Show Header on Scroll Mechanics
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // HIDE if scrolling DOWN, REVEAL if scrolling UP
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Auto-close mobile menu on scroll
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      // Always show at absolute top
      if (currentScrollY <= 10) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // DYNAMIC TAB ROUTING ENGINE
  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Live Bookings', path: '/admin/bookings' },
    { name: 'Promotions', path: '/admin/offers' }
  ];

  // Assign links based on active session role
  const navLinks = user?.role === 'admin' ? adminLinks : publicLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : '-100%' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            
            {/* BRAND LOGO SECTION */}
            <Link to={user?.role === 'admin' ? "/admin/dashboard" : "/"} className="flex items-center gap-3 sm:gap-4 group z-50 overflow-hidden py-2">
              
              {/* Graphic Logo Image */}
              <img 
                src="/logo.png" 
                alt="Location Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Stacked Proportional Typographic Block (Arabian Luxury Aesthetic) */}
              <div className="flex flex-col items-center justify-center select-none text-center">
                {/* Row 1: LOCATION - Grand, elegant, spacious serif font */}
                <img src="/logos.png" alt="Location" className="w-30 font-serif text-white tracking-[0.28em] uppercase font-light leading-none mr-[-0.28em] group-hover:text-[#FFB000] transition-colors duration-300" />
                
                {/* Ultra-thin elegant gold accent line defining the structural width of the logo */}
                <div className="w-26.25 sm:w-32.5 h-px bg-linear-to-r from-transparent via-[#FFB000]/60 to-transparent my-1.5" />
                
                {/* Row 2: MULTI CUISINE - Refined, high-contrast crisp alignment */}
                <span className="text-[6px] sm:text-[9px] font-clash text-[#FFB000] tracking-widest uppercase font-bold leading-none mr-[-0.095em]">
                  Multi Cuisine
                </span>
                
                {/* Row 3: RESTAURANT - Muted luxury gray completing the uniform block */}
                <span className="text-[11px] sm:text-[11.5px] font-clash text-white tracking-[0.23em] uppercase font-bold leading-none mt-1 mr-[-0.23em]">
                  Restaurant
                </span>
              </div>

            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative group py-2"
                  >
                    <span className={`text-xs font-sans tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                      isActive ? 'text-[#FFB000]' : 'text-gray-400 hover:text-white'
                    }`}>
                      {link.name}
                    </span>
                    
                    {/* Animated Underline Indicator */}
                    <motion.div
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#FFB000] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'} transition-all duration-300 ease-out`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* ACTION BUTTON */}
            <div className="hidden md:flex items-center">
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-500/10 border border-red-500/50 text-red-400 px-7 py-3 rounded-full font-sans font-bold text-xs tracking-[0.2em] uppercase hover:bg-red-500 hover:text-white transition-colors duration-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                >
                  Terminate Session
                </motion.button>
              ) : (
                <Link to="/reserve">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#FFB000] text-black px-7 py-3 rounded-full font-sans font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(255,176,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                  >
                    Book a Table
                  </motion.button>
                </Link>
              )}
            </div>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <div className="md:hidden flex items-center z-50">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#FFB000] transition-colors focus:outline-none p-2"
              >
                <motion.div animate={isMobileMenuOpen ? "open" : "closed"} className="flex flex-col gap-1.5">
                  <motion.span 
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 8 } }} 
                    className="w-7 h-0.5 bg-current block transition-transform"
                  />
                  <motion.span 
                    variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} 
                    className="w-7 h-0.5 bg-current block transition-opacity"
                  />
                  <motion.span 
                    variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -8 } }} 
                    className="w-7 h-0.5 bg-current block transition-transform"
                  />
                </motion.div>
              </button>
            </div>

          </div>
        </div>
      </motion.header>

      {/* MOBILE FULL-SCREEN NAVIGATION MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex flex-col justify-center items-center pt-20"
          >
            <div className="flex flex-col items-center gap-8 w-full px-6">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl font-serif tracking-widest uppercase ${
                        isActive ? 'text-[#FFB000]' : 'text-white hover:text-gray-300'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                className="mt-8 w-full max-w-xs"
              >
                {user ? (
                   <button 
                     onClick={handleLogout} 
                     className="w-full bg-red-500/10 border border-red-500/50 text-red-400 px-7 py-4 rounded-full font-sans font-bold text-sm tracking-[0.2em] uppercase active:scale-95 transition-transform"
                   >
                     Terminate Session
                   </button>
                ) : (
                  <Link to="/reserve" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full bg-[#FFB000] text-black px-7 py-4 rounded-full font-sans font-bold text-sm tracking-[0.2em] uppercase active:scale-95 transition-transform">
                      Book a Table
                    </button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;