import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll(); // Initial check
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [categoriesMeta]);

  const scrollNav = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Scroll distance per click
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const chunkedItems = useMemo(() => {
    const chunks = [];
    let currentStandardChunk = [];

    activeItems.forEach(item => {
      if (item.isCombo) {
        if (currentStandardChunk.length > 0) {
          chunks.push(currentStandardChunk);
          currentStandardChunk = [];
        }
        chunks.push([item]);
      } else {
        currentStandardChunk.push(item);
        if (currentStandardChunk.length === 5) {
          chunks.push(currentStandardChunk);
          currentStandardChunk = [];
        }
      }
    });

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
          <p className="text-[#FFB000] uppercase tracking-[0.25em] font-semibold font-clash text-xs sm:text-sm mb-4">
            Delicious Masterpieces
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-clash text-white font-semibold tracking-tight">
            Our Culinary Menu
          </h2>
          <div className="w-24 h-1 bg-[#FFB000] mt-6 rounded-full opacity-80" />
        </div>

        {/* Category Navigation */}
        {/* Category Navigation (Upgraded High-End Scroll Layout) */}
        <div className="relative w-full max-w-full flex items-center group">
          
          {/* Left Arrow & Fade Gradient */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-0 top-0 bottom-4 w-24 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-transparent z-10 flex items-center justify-start pointer-events-none"
              >
                <button 
                  onClick={() => scrollNav('left')}
                  className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-[#FFB000] hover:border-[#FFB000] transition-all duration-300 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actual Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto whitespace-nowrap justify-start items-center gap-2 sm:gap-4 pb-4 w-full scroll-smooth relative z-0" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Added a spacer block so the first item isn't hidden under the left arrow if needed */}
            <div className="w-2 sm:w-6 shrink-0"></div>

            {categoriesMeta.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.categoryName)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-serif text-sm tracking-wide transition-all duration-300 border shrink-0 ${
                  activeCategory === cat.categoryName 
                    ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                    : 'bg-transparent border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span className={`transition-colors duration-200 shrink-0 ${activeCategory === cat.categoryName ? 'text-[#FFB000]' : 'text-gray-500'}`}>
                  <GenericCategoryIcon />
                </span>
                {cat.categoryName}
              </button>
            ))}

            {/* Added a spacer block so the last item isn't hidden under the right arrow */}
            <div className="w-2 sm:w-6 shrink-0"></div>
          </div>

          {/* Right Arrow & Fade Gradient */}
          <AnimatePresence>
            {canScrollRight && categoriesMeta.length > 3 && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-[#060606] via-[#060606]/80 to-transparent z-10 flex items-center justify-end pointer-events-none"
              >
                <button 
                  onClick={() => scrollNav('right')}
                  className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-[#FFB000] hover:border-[#FFB000] transition-all duration-300 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] mr-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        {/* Main UI Container */}
        <div className="relative max-w-6xl mx-auto bg-[#101010] shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-4 sm:p-8 rounded-[2rem] border border-white/5 min-h-[600px] w-full">
          
          <div className="flex flex-col gap-16">
            <AnimatePresence mode="popLayout">
              {chunkedItems.length > 0 ? chunkedItems.map((chunk, chunkIndex) => {
                
                const chunkImage = activeMeta?.images?.length > 0 
                  ? activeMeta.images[chunkIndex % activeMeta.images.length] 
                  : "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80";

                const isEvenChunk = chunkIndex % 2 === 0;

                return (
                  <motion.div 
                    key={`${activeCategory}-${chunkIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${!isEvenChunk ? 'lg:flex-row-reverse' : ''}`}
                  >
                    
                    {/* Items Mapping (Text / Content Side) */}
                    <div className="flex-1 flex flex-col justify-start pt-4">
                      {chunkIndex === 0 && activeMeta?.description && (
                        <p className="text-yellow-400 text-lg uppercase font-clash font-light mb-8 max-w-2xl">{activeMeta.description}</p>
                      )}
                      
                      <div className="space-y-6 sm:space-y-8">
                        {chunk.map((item) => {
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
                                        <h3 className="text-lg sm:text-xl font-clash text-[#FFB000] truncate">{item.name}</h3>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest bg-[#FFB000]/10 text-[#FFB000] border border-[#FFB000]/30 px-2 py-0.5 rounded-sm font-bold shrink-0">
                                          Combo Pack
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-400 font-clash font-light">{item.description}</p>
                                    </div>

                                    {item.comboItems && item.comboItems.length > 0 && (
                                      <div className="flex items-stretch mt-2">
                                        <div className="flex-1 flex flex-col gap-2.5 relative pr-4 sm:pr-5 py-1">
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

                          // --- STANDARD ITEM LAYOUT (RESTORED WITH INDIVIDUAL ITEM IMAGES) ---
                          return (
                            <div key={item._id} className="group flex items-center gap-4 sm:gap-6 cursor-pointer bg-transparent hover:bg-white/[0.02] p-2 rounded-2xl transition-colors duration-300 -mx-2">
                              
                              {/* RESTORED: Individual Dish Circular Thumbnail */}
                              <div className="relative w-25 h-15 sm:w-15 sm:h-15 shrink-0 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#FFB000] transition-colors duration-500 shadow-lg">
                                <img 
                                  src={item.image || "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=400&auto=format&fit=crop"} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
                                />
                              </div>

                              {/* Dish Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-4 mb-1 sm:mb-2">
                                  <h3 className="text-lg sm:text-xl font-serif text-gray-200 group-hover:text-[#FFB000] transition-colors duration-300 truncate">
                                    {item.name}
                                  </h3>
                                  <span className="text-lg sm:text-xl font-sans font-bold text-[#FFB000] shrink-0">
                                    {displayPrice}
                                  </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  {item.dietary && item.dietary !== 'None' && (
                                    <span className={`w-fit text-[9px] sm:text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm shrink-0 ${item.dietary === 'Vegetarian' || item.dietary === 'Vegan' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                      {item.dietary}
                                    </span>
                                  )}
                                  <p className="text-xs sm:text-sm text-gray-500 font-light line-clamp-2 sm:line-clamp-1">
                                    {item.description}
                                  </p>
                                </div>
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