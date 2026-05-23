import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const HomeMenu = () => {
  const [categories, setCategories] = useState(['Full Menu']);
  const [activeTab, setActiveTab] = useState('Full Menu');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredItems = activeTab === 'Full Menu' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#060606]">
        <div className="w-8 h-8 border-2 border-[#FFB000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#060606] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Predefined Title & Subtitle Block (Top) */}
        <div className="flex flex-col items-center justify-center w-full text-center mb-10">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#FFB000] uppercase tracking-[0.25em] text-xs font-serif font-bold mb-4"
          >
            This is what we serve you
          </motion.p>

          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight max-w-3xl leading-tight text-white font-medium"
          >
            Discover the perfect meal for every taste
          </motion.h2>
          <div className="w-12 h-[1px] bg-white/20 mt-6"></div>
        </div>

        {/* 2. Category Navigation Menu Selector Tabs (Middle) */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-3 scrollbar-none">
          <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold font-serif transition-all duration-300 ${
                  activeTab === category
                    ? 'bg-[#FFB000] text-black shadow-[0_4px_20px_rgba(255,176,0,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Dynamic Culinary Grid Framework (Bottom) */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 justify-items-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id || item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col items-center text-center w-full max-w-[240px] cursor-pointer"
              >
                
                {/* LINE 1: Prominent Circle Image (Rotates on hover) */}
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FFB000] shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[#121212] transition-colors duration-500 ease-out mb-5 shrink-0">
                  <img
                    src={item.image || item.img || "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=400&auto=format&fit=crop"}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 group-hover:rotate-12 transition-transform duration-500 ease-out filter brightness-[0.95] group-hover:brightness-110"
                  />
                </div>

                {/* LINE 2: Heading (Dish Name) */}
                <h3 className="text-base sm:text-lg font-serif tracking-wide text-gray-200 group-hover:text-white transition-colors duration-300 font-medium line-clamp-1 w-full px-2">
                  {item.name}
                </h3>

                {/* LINE 3: Price Tag (INR Format) */}
                <p className="text-sm font-semibold font-sans text-[#FFB000] tracking-wider mt-1.5">
                  {String(item.price).includes('₹') ? item.price : `₹${item.price}`}
                </p>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State Curated Fallback Flag */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-black/20 mt-4">
            <p className="text-gray-500 text-xs tracking-widest uppercase font-serif">
              New dishes for this selection are being curated by our chefs.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default HomeMenu;