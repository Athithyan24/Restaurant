import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const PAGE_SIZE = 8; 

const HomeMenu = () => {
  const [categories, setCategories] = useState(['Full Menu']);
  const [activeTab, setActiveTab] = useState('Full Menu');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchLiveMenu = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        const result = await response.json();
        if (result.success) {
          const availableItems = result.data.filter(item => item.isAvailable !== false);
          setMenuItems(availableItems);
          const distinctCategories = ['Full Menu', ...new Set(availableItems.map(item => item.category))];
          setCategories(distinctCategories);
        }
      } catch (err) {
        console.error("Failed to sync home menu parameters:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveMenu();
  }, []);

  const handleTabChange = (category) => {
    setActiveTab(category);
    setVisibleCount(PAGE_SIZE); 
  };

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE); 
  };

  const filteredItems = activeTab === 'Full Menu' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = visibleCount < filteredItems.length;

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#060606]">
        <div className="w-8 h-8 border-2 border-[#FFB000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#060606] text-white py-20 px-0 sm:px-6 lg:px-8 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block */}
        <div className="flex flex-col items-center justify-center w-full text-center mb-10 px-4">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#FFB000] uppercase tracking-[0.25em] text-[10px] sm:text-xs font-serif font-bold mb-4"
          >
            This is what we serve you
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight max-w-3xl leading-tight text-white font-medium"
          >
            Discover the perfect meal
          </motion.h2>
          <div className="w-12 h-[1px] bg-white/20 mt-6"></div>
        </div>

        {/* 1. FIXED CATEGORY SCROLLING */}
        <div className="relative w-full mb-12">
          {/* Scroll container: No rounded-full here to prevent clipping */}
          <div className="flex overflow-x-auto pb-4 px-4 scrollbar-hide no-scrollbar">
            <div className="flex flex-nowrap gap-2 mx-auto min-w-max">
              <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleTabChange(category)}
                    className={`px-6 py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest font-bold font-serif transition-all duration-300 whitespace-nowrap ${
                      activeTab === category
                        ? 'bg-[#FFB000] text-black shadow-[0_4px_20px_rgba(255,176,0,0.25)]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. MOBILE GRID FIX (2 items per row) */}
        {/* Adjusted gap-x and responsive image size for tight 2-column mobile layout */}
        <motion.div 
          layout 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-10 sm:gap-y-14 px-4 sm:px-0"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item) => (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col items-center text-center w-full"
              >
                {/* Responsive Image size: w-full on mobile (max-w-40) to keep 2 per row */}
                <div className="w-36 h-36 xs:w-40 xs:h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FFB000] shadow-lg bg-[#121212] mb-4 shrink-0 transition-all duration-500">
                  <img
                    src={item.image || item.img || "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=400&auto=format&fit=crop"}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <h3 className="text-xs sm:text-lg font-serif tracking-wide text-gray-200 line-clamp-1 w-full px-1">
                  {item.name}
                </h3>
                <p className="text-[11px] sm:text-sm font-semibold text-[#FFB000] mt-1">
                  {String(item.price).includes('₹') ? item.price : `₹${item.price}`}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 3. INCREMENTAL SEE MORE */}
        {hasMoreItems && (
          <div className="flex justify-center mt-16 px-4">
            <button
              onClick={handleSeeMore}
              className="group flex items-center gap-3 px-8 py-3 rounded-full border border-white/20 hover:border-[#FFB000] text-gray-300 hover:text-[#FFB000] transition-all duration-300"
            >
              <span className="text-[10px] sm:text-xs font-bold font-serif uppercase tracking-[0.2em]">
                See More Dishes
              </span>
              <ChevronDown size={16} className="text-[#FFB000] group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl mx-4">
            <p className="text-gray-500 text-[10px] uppercase font-serif tracking-widest">
              Curating new flavors...
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default HomeMenu;