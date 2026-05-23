import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const GenericCategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
    <path d="M4 12h16a8 8 0 0 1-16 0Z" /><path d="M12 2v3" /><path d="M16 4v3" /><path d="M8 4v3" />
  </svg>
);

const MenuItems = () => {
  const [categoriesMeta, setCategoriesMeta] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/menu`)
        ]);
        const catJson = await catRes.json();
        const menuJson = await menuRes.json();

        if (catJson.success && catJson.data.length > 0) {
          setCategoriesMeta(catJson.data);
          setActiveCategory(catJson.data[0].categoryName);
        }
        if (menuJson.success) {
          setMenuItems(menuJson.data.filter(i => i.isAvailable !== false));
        }
      } catch (err) {
        console.error("Failed to load layout data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeItems = useMemo(() => {
    return menuItems.filter(item => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  const activeMeta = useMemo(() => {
    return categoriesMeta.find(c => c.categoryName === activeCategory);
  }, [categoriesMeta, activeCategory]);

  // --- UPGRADED CHUNKING ALGORITHM ---
  // This treats every Combo Pack as its own isolated "block" (just like 5 regular items).
  // This forces the layout to flip and cycle the category image perfectly for Combos!
  const chunkedItems = useMemo(() => {
    const chunks = [];
    let currentStandardChunk = [];

    activeItems.forEach(item => {
      if (item.isCombo) {
        // If we have standard items waiting, push them as a block first
        if (currentStandardChunk.length > 0) {
          chunks.push(currentStandardChunk);
          currentStandardChunk = [];
        }
        // Push the Combo Pack as its own exclusive block
        chunks.push([item]);
      } else {
        // Build standard 5-item blocks
        currentStandardChunk.push(item);
        if (currentStandardChunk.length === 5) {
          chunks.push(currentStandardChunk);
          currentStandardChunk = [];
        }
      }
    });

    // Push any leftover standard items at the end
    if (currentStandardChunk.length > 0) {
      chunks.push(currentStandardChunk);
    }

    return chunks;
  }, [activeItems]);

  if (loading) return null;

  return (
    <div className="w-full bg-[#060606] py-16 sm:py-24 px-4 font-sans text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">

        {/* Header Block */}
        <div className="text-center mb-12 flex flex-col items-center">
          <p className="text-[#FFB000] uppercase tracking-[0.25em] font-semibold text-xs sm:text-sm mb-4">
            Delicious Masterpieces
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold tracking-tight">
            Our Culinary Menu
          </h2>
          <div className="w-24 h-1 bg-[#FFB000] mt-6 rounded-full opacity-80" />
        </div>

        {/* Category Navigation */}
        <div className="flex overflow-x-auto whitespace-nowrap justify-start lg:justify-center items-center gap-2 sm:gap-4 pb-4 scrollbar-none w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categoriesMeta.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.categoryName)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-serif text-sm tracking-wide transition-all duration-300 border ${
                activeCategory === cat.categoryName 
                  ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <span className={`transition-colors duration-200 shrink-0 ${activeCategory === cat.categoryName ? 'text-[#FFB000]' : 'text-gray-500'}`}>
                <GenericCategoryIcon />
              </span>
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Main UI Container */}
        <div className="relative max-w-6xl mx-auto bg-[#101010] shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-4 sm:p-8 rounded-[2rem] border border-white/5 min-h-[600px] w-full">
          
          <div className="flex flex-col gap-16">
            <AnimatePresence mode="popLayout">
              {chunkedItems.length > 0 ? chunkedItems.map((chunk, chunkIndex) => {
                
                // Loops through available images safely
                const chunkImage = activeMeta?.images?.length > 0 
                  ? activeMeta.images[chunkIndex % activeMeta.images.length] 
                  : "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80";

                // DETECTS IF CHUNK IS EVEN OR ODD FOR ZIGZAG LAYOUT
                const isEvenChunk = chunkIndex % 2 === 0;

                return (
                  <motion.div 
                    key={`${activeCategory}-${chunkIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    // THE MAGIC HAPPENS HERE: lg:flex-row-reverse flips the layout for odd chunks!
                    className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${!isEvenChunk ? 'lg:flex-row-reverse' : ''}`}
                  >
                    
                    {/* Items Mapping (Text / Content Side) */}
                    <div className="flex-1 flex flex-col justify-start pt-4">
                      {chunkIndex === 0 && activeMeta?.description && (
                        <p className="text-gray-400 text-sm font-light mb-8 max-w-2xl">{activeMeta.description}</p>
                      )}
                      
                      <div className="space-y-6 sm:space-y-8">
                        {chunk.map((item) => {
                          // Handle string pricing gracefully to prevent "₹₹450" glitches
                          const displayPrice = String(item.price).includes('₹') || /[a-zA-Z]/.test(String(item.price)) 
                            ? item.price 
                            : `₹${item.price}`;

                          // --- SPECIALIZED COMBO PACK LAYOUT ---
                          if (item.isCombo) {
                            return (
                              <div key={item._id} className="w-full bg-[#161616] rounded-2xl p-4 sm:p-5 border border-[#FFB000]/20 shadow-lg relative my-4 group">
                                <div className="flex flex-col sm:flex-row gap-5">
                                  
                                  {/* Combo Main Image - Left side */}
                                  <div className="w-full sm:w-[160px] md:w-[200px] aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden shrink-0 border border-white/5">
                                    <img src={item.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80"} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  </div>

                                  {/* Combo Details & Sub-items - Right side */}
                                  <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <h3 className="text-lg sm:text-xl font-serif text-[#FFB000] truncate">{item.name}</h3>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest bg-[#FFB000]/10 text-[#FFB000] border border-[#FFB000]/30 px-2 py-0.5 rounded-sm font-bold shrink-0">
                                          Combo Pack
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-400 font-light">{item.description}</p>
                                    </div>

                                    {/* Advanced CSS Bracket & Sub-items */}
                                    {item.comboItems && item.comboItems.length > 0 && (
                                      <div className="flex items-stretch mt-2">
                                        
                                        {/* Sub Items List Container with bracket border attached to the right */}
                                        <div className="flex-1 flex flex-col gap-2.5 relative pr-4 sm:pr-5 py-1">
                                          {/* CSS Dynamic Grouping Bracket `]` */}
                                          <div className="absolute right-0 top-1 bottom-1 w-3 sm:w-4 border-r-2 border-y-2 border-[#FFB000]/40 rounded-r-xl pointer-events-none"></div>
                                          
                                          {item.comboItems.map((c, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5">
                                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                                                {c.image ? (
                                                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                                ) : (
                                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] sm:text-xs font-bold text-gray-200 truncate">{c.name}</h4>
                                                {c.description && <p className="text-[9px] text-gray-500 line-clamp-1">{c.description}</p>}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        {/* Combined Price Centered Outside Bracket */}
                                        <div className="shrink-0 flex items-center justify-center pl-3 sm:pl-4">
                                          <span className="font-mono font-bold text-[#FFB000] text-base sm:text-lg whitespace-nowrap">
                                            {displayPrice}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // --- STANDARD ITEM LAYOUT ---
                          return (
                            <div key={item._id} className="group cursor-pointer">
                              <div className="flex justify-between items-start gap-4 mb-2">
                                <h3 className="text-lg sm:text-xl font-serif text-gray-200 group-hover:text-[#FFB000] transition-colors duration-300">
                                  {item.name}
                                </h3>
                                <span className="text-lg sm:text-xl font-sans font-bold text-white shrink-0">
                                  {displayPrice}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {item.dietary && item.dietary !== 'None' && (
                                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm ${item.dietary === 'Vegetarian' || item.dietary === 'Vegan' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {item.dietary}
                                  </span>
                                )}
                                <p className="text-sm text-gray-500 font-light line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Spotlight Category Image Container */}
                    <div className="hidden lg:block w-[320px] xl:w-[380px] shrink-0">
                      <motion.div 
                        key={`${activeCategory}-${chunkIndex}-img`} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="sticky top-24 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-2 bg-[#1A1A1A]"
                      >
                        <img 
                          src={chunkImage} 
                          alt={`${activeCategory} Feature`}
                          className="w-full h-full object-cover rounded-xl filter brightness-90 hover:brightness-105 transition-all duration-500"
                        />
                        <div className={`absolute bottom-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 ${!isEvenChunk ? 'left-6' : 'right-6'}`}>
                          <p className="text-[#FFB000] font-serif font-bold text-sm uppercase tracking-widest">
                            {activeCategory}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                  </motion.div>
                );
              }) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex-1 flex items-center justify-center py-20 text-gray-500 font-serif italic text-sm sm:text-base"
                >
                  New dishes for this selection are being curated by our chefs.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MenuItems;