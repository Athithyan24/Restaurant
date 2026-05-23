import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const MenuDiscoverMeals = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All Collections']);
  const [activeTab, setActiveTab] = useState('All Collections');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabaseMenu = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/menu`);
        const json = await res.json();
        if (json.success) {
          const items = json.data.filter(i => i.isAvailable !== false);
          setMenuItems(items);
          const databaseCategories = ['All Collections', ...new Set(items.map(i => i.category))];
          setCategories(databaseCategories);
        }
      } catch (err) {
        console.error("Error communicating with menu database", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatabaseMenu();
  }, []);

  const displayedItems = activeTab === 'All Collections'
    ? menuItems
    : menuItems.filter(item => item.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#060606]">
        <div className="w-8 h-8 border-2 border-[#FFB000] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#060606] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* 1. EXACT Predefined Fixed Header Block */}
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center mb-10">
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-yellow-500 uppercase tracking-[0.25em] text-xs font-serif font-bold mb-4"
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

      {/* 2. Flat Single Row Pill Bar System (Middle) */}
      <div className="flex overflow-x-auto whitespace-nowrap justify-start sm:justify-center items-center gap-1 sm:gap-2 mb-16 sm:mb-20 bg-white/5 p-1.5 sm:p-2 rounded-full border border-white/10 max-w-fit mx-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-6 py-2.5 rounded-full font-serif text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-[#FFB000] text-black shadow-[0_4px_20px_rgba(255,176,0,0.25)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. 4-Column Minimal Vertical Stack Grid Layout (Bottom) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-14 justify-items-center">
        <AnimatePresence mode="popLayout">
          {displayedItems.map((item) => {
            const isVeg = item.dietary === 'Vegetarian' || item.dietary === 'Vegan' || item.diet === 'veg';
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={item._id || item.id}
                className="group flex flex-col items-center text-center w-full max-w-[240px] cursor-pointer"
              >
                
                {/* LINE 1: Large Perfect Circle Shape Image Box (Rotates 12 degrees on hover) */}
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FFB000] shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[#121212] transition-colors duration-500 ease-out mb-5 shrink-0 relative">
                  <img 
                    src={item.image || item.img || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80"} 
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 group-hover:rotate-12 transition-transform duration-500 ease-out filter brightness-[0.95] group-hover:brightness-110"
                  />
                  {isVeg && (
                    <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-sm p-1.5 rounded-full border border-emerald-500/30">
                      <span className="text-emerald-500 block">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 8C14.24 8 12.03 9.94 11.18 12.54C12.44 11.23 14.19 10.5 16 10.5C19.58 10.5 22.5 13.42 22.5 17C22.5 17.28 22.48 17.55 22.44 17.82C21.84 14.5 18.92 12 15.5 12C12.08 12 9.16 14.5 8.56 17.82C8.52 17.55 8.5 17.28 8.5 17C8.5 16.72 8.52 16.45 8.56 16.18C9.16 19.5 12.08 22 15.5 22C18.92 22 21.84 19.5 22.44 16.18C22.48 15.91 22.5 15.64 22.5 15.36C22.5 11.78 19.58 8.86 16 8.86C14.19 8.86 12.44 9.59 11.18 10.9L10.12 11.96C9.12 12.96 7.5 12.96 6.5 11.96C5.5 10.96 5.5 9.34 6.5 8.34L7.56 7.28C8.82 6.02 10.57 5.29 12.38 5.29C15.96 5.29 18.88 8.21 18.88 11.79Z" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
                
                {/* LINE 2: Heading / Dish Name */}
                <h3 className="text-base sm:text-lg font-serif tracking-wide text-gray-200 group-hover:text-white transition-colors duration-300 font-medium line-clamp-1 w-full px-2">
                  {item.name}
                </h3>

                {/* LINE 3: Price Tag (Formatted at the bottom, no description) */}
                <p className="text-sm font-semibold font-sans text-[#FFB000] tracking-wider mt-1.5">
                  {String(item.price).includes('₹') ? item.price : `₹${item.price}`}
                </p>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Fallback Empty State Content Feedback Block */}
      {displayedItems.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-black/20 mt-4 max-w-7xl mx-auto">
          <p className="text-gray-500 text-xs tracking-widest uppercase font-serif">
            New entries for this collection are currently being crafted.
          </p>
        </div>
      )}

    </div>
  );
};

export default MenuDiscoverMeals;