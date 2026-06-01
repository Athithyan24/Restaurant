import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
// Socket URL is usually the base URL without the '/api' part
const SOCKET_URL = API_BASE_URL.replace('/api', ''); 

const KitchenDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();

    // --- SOCKET.IO CLIENT SETUP ---
    const socket = io(SOCKET_URL);

    // Listen for real-time changes made by other kitchen screens
    socket.on('menuAvailabilityChanged', (data) => {
      setMenuItems((prevItems) => 
        prevItems.map((item) => 
          item._id === data.id ? { ...item, isAvailable: data.isAvailable } : item
        )
      );
    });

    // Cleanup socket on unmount
    return () => socket.disconnect();
  }, []);

  const fetchMenuData = async () => {
    try {
      // Note: We need ALL items here, not just available ones!
      const res = await fetch(`${API_BASE_URL}/menu`);
      const json = await res.json();
      if (json.success) {
        setMenuItems(json.data);
        const uniqueCategories = [...new Set(json.data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Failed to load kitchen dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    // 1. Optimistic UI Update (feels instantly responsive to the chef)
    const newStatus = !currentStatus;
    setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailable: newStatus } : item));

    // 2. Send request to backend
    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/menu/${id}/availability`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isAvailable: newStatus })
      });
      
      const json = await res.json();
      if (!json.success) {
        // Revert if failed
        setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailable: currentStatus } : item));
        alert("Failed to update status on server.");
      }
    } catch (error) {
      // Revert if failed
      setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailable: currentStatus } : item));
      alert("Network error.");
    }
  };

  const displayedItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) return <div className="min-h-screen bg-[#060606] flex items-center justify-center text-[#FFB000]">Loading Kitchen Terminal...</div>;

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#FFB000]">Kitchen Live Terminal</h1>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mt-1">Real-time Food Availability Controls</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Socket Connected</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`shrink-0 px-5 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all border ${activeCategory === 'All' ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black/40 text-gray-400 border-white/10'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all border ${activeCategory === cat ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black/40 text-gray-400 border-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Toggle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayedItems.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={item._id} 
                className={`flex items-center p-4 rounded-2xl border transition-colors duration-300 ${item.isAvailable !== false ? 'bg-[#121212] border-white/10' : 'bg-red-500/5 border-red-500/20 opacity-75'}`}
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black mr-4 border border-white/5">
                  <img src={item.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150"} alt={item.name} className={`w-full h-full object-cover ${item.isAvailable === false ? 'grayscale' : ''}`} />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate text-white">{item.name}</h3>
                  <p className="text-[#FFB000] text-xs font-mono mt-0.5">{item.isCombo ? 'COMBO' : item.category}</p>
                </div>

                {/* Big Toggle Switch */}
                <button 
                  onClick={() => toggleAvailability(item._id, item.isAvailable !== false)}
                  className={`relative shrink-0 w-16 h-8 rounded-full transition-colors duration-300 ease-in-out border-2 ${item.isAvailable !== false ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500'}`}
                >
                  <div className={`absolute top-0.5 bottom-0.5 w-6 rounded-full transition-all duration-300 ease-in-out shadow-sm flex items-center justify-center ${item.isAvailable !== false ? 'left-[34px] bg-emerald-500' : 'left-1 bg-red-500'}`}>
                    {/* Tiny Icon inside the toggle knob */}
                    {item.isAvailable !== false ? (
                       <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default KitchenDashboard;