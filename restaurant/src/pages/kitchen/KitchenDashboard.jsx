import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Clock } from 'lucide-react'; // Added for the order timer icon

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', ''); 

const KitchenDashboard = () => {
  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'

  // --- DATA STATES ---
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [orders, setOrders] = useState([]); // KDS Orders State
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();

    // --- SOCKET.IO CLIENT SETUP ---
    const socket = io(SOCKET_URL);

    // 1. Listen for QR/Table menu changes (Your original socket)
    socket.on('tableMenuAvailabilityChanged', (data) => {
      setMenuItems((prevItems) => 
        prevItems.map((item) => 
          item._id === data.id ? { ...item, isAvailableForTable: data.isAvailableForTable } : item
        )
      );
    });

    // 2. Listen for New Orders (KDS)
    socket.on('newKitchenOrder', (data) => {
      setOrders(prev => [data.order, ...prev]);
      new Audio('/notification.mp3').play().catch(() => {}); // Optional alert sound
    });

    // 3. Listen for Order Status Updates (KDS)
    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [menuRes, orderRes] = await Promise.all([
        fetch(`${API_BASE_URL}/menu`),
        fetch(`${API_BASE_URL}/orders/active`)
      ]);
      
      const menuJson = await menuRes.json();
      const orderJson = await orderRes.json();

      if (menuJson.success) {
        setMenuItems(menuJson.data);
        const uniqueCategories = [...new Set(menuJson.data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
      
      if (orderJson.success) {
        setOrders(orderJson.data);
      }
    } catch (error) {
      console.error("Failed to load kitchen dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- MENU ENABLER LOGIC (Your exact function) ---
  const toggleTableAvailability = async (id, currentTableStatus) => {
    const newStatus = !currentTableStatus;
    setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailableForTable: newStatus } : item));

    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/menu/${id}/table-availability`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isAvailableForTable: newStatus }) 
      });
      
      const json = await res.json();
      if (!json.success) {
        setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailableForTable: currentTableStatus } : item));
        alert("Failed to update QR Table status on server.");
      }
    } catch (error) {
      setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailableForTable: currentTableStatus } : item));
      alert("Network error.");
    }
  };

  // --- KDS ORDER LOGIC ---
  const updateOrderStatus = async (orderId, status) => {
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  };

  const displayedItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // 🛠️ NEW: Filter out 'Served' orders so they disappear from the Kitchen Screen
  const activeOrders = orders.filter(order => order.status !== 'Served');

  if (loading) return <div className="min-h-screen bg-[#060606] flex items-center justify-center text-[#FFB000]">Loading Kitchen Terminal...</div>;

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#FFB000]">Kitchen Dispatch Terminal</h1>
            <p className="text-gray-400 text-xs tracking-[0.2em] uppercase mt-1">
              {activeTab === 'menu' 
                ? 'Controlling Live QR-Table Menu Availability (Does not affect main website)'
                : 'Live Order Production System'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
            {/* TABS TOGGLE */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === 'orders' ? 'bg-[#FFB000] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {/* Dynamically show active order count */}
                Live Orders ({activeOrders.length})
              </button>
              <button 
                onClick={() => setActiveTab('menu')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${activeTab === 'menu' ? 'bg-[#FFB000] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Menu Control
              </button>
            </div>

            {/* YOUR ORIGINAL SOCKET BADGE */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg self-start sm:self-end">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Dine-In Socket Active</span>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            
            /* --- KDS LIVE ORDERS VIEW --- */
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Map over the filtered activeOrders array instead of all orders */}
              {activeOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 font-serif text-xl border border-white/5 rounded-3xl bg-white/5">
                  No active orders at the moment.
                </div>
              ) : (
                activeOrders.map((order) => (
                  <div key={order._id} className={`p-6 rounded-3xl border ${order.status === 'Preparing' ? 'border-[#FFB000] bg-[#FFB000]/5 shadow-[0_0_15px_rgba(255,176,0,0.1)]' : 'border-white/10 bg-[#121212]'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-2xl font-black text-white">TABLE {order.table?.tableNumber || '??'}</span>
                        <p className="text-[10px] text-gray-500 uppercase mt-1">Ordered at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <Clock size={20} className={order.status === 'Preparing' ? 'text-[#FFB000] animate-pulse' : 'text-gray-500'} />
                    </div>

                    <div className="space-y-3 mb-6 bg-black/40 p-4 rounded-xl border border-white/5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-white/5 last:border-0 pb-2 last:pb-0">
                          <span className="text-sm font-medium text-gray-200">
                            <span className="text-[#FFB000] font-bold mr-2">{item.quantity}x</span> 
                            {item.menuItem?.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => updateOrderStatus(order._id, order.status === 'Pending' ? 'Preparing' : 'Served')}
                      className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        order.status === 'Pending' 
                          ? 'bg-white text-black hover:bg-gray-200' 
                          : 'bg-[#FFB000] text-black hover:bg-yellow-400'
                      }`}
                    >
                      {order.status === 'Pending' ? 'Start Cooking' : 'Mark as Served'}
                    </button>
                  </div>
                ))
              )}
            </motion.div>

          ) : (
            
            /* --- YOUR EXACT ORIGINAL MENU UI --- */
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
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
                  {displayedItems.map(item => {
                    const isAvailable = item.isAvailableForTable !== false;

                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={item._id} 
                        className={`flex items-center p-4 rounded-2xl border transition-colors duration-300 ${isAvailable ? 'bg-[#121212] border-white/10' : 'bg-red-500/5 border-red-500/20 opacity-75'}`}
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-black mr-4 border border-white/5">
                          <img src={item.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150"} alt={item.name} className={`w-full h-full object-cover ${!isAvailable ? 'grayscale' : ''}`} />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm truncate text-white">{item.name}</h3>
                          <p className="text-[#FFB000] text-xs font-mono mt-0.5">{item.isCombo ? 'COMBO' : item.category}</p>
                          {!isAvailable && <p className="text-red-400 text-[9px] uppercase tracking-widest font-bold mt-1">HIDDEN ON TABLE APP</p>}
                        </div>

                        {/* Big Toggle Switch for Table Availability */}
                        <button 
                          onClick={() => toggleTableAvailability(item._id, isAvailable)}
                          className={`relative shrink-0 w-16 h-8 rounded-full transition-colors duration-300 ease-in-out border-2 ${isAvailable ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500'}`}
                        >
                          <div className={`absolute top-0.5 bottom-0.5 w-6 rounded-full transition-all duration-300 ease-in-out shadow-sm flex items-center justify-center ${isAvailable ? 'left-[34px] bg-emerald-500' : 'left-1 bg-red-500'}`}>
                            {isAvailable ? (
                              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                            )}
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default KitchenDashboard;