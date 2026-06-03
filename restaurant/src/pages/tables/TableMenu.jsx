import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { ShoppingBag, ChevronRight, Minus, Plus, Layers } from 'lucide-react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

const TableMenu = () => {
  const { tableId } = useParams();
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All Items']);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchMenu();
    const socket = io(SOCKET_URL);
    
    socket.on('tableMenuUpdate', (data) => {
      setMenuItems((prev) => 
        prev.map(item => item._id === data.id ? { ...item, isAvailableForTable: data.isAvailableForTable } : item)
      );
      if (data.isAvailableForTable === false) {
        setCart(prev => prev.filter(cartItem => cartItem._id !== data.id));
      }
    });

    return () => socket.disconnect();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      const json = await res.json();
      if (json.success) {
        setMenuItems(json.data);
        const cats = ['All Items', ...new Set(json.data.map(i => i.category))];
        setCategories(cats);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === itemId);
      if (existing.quantity === 1) {
        return prev.filter(i => i._id !== itemId);
      }
      return prev.map(i => i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const getQuantity = (itemId) => {
    const item = cart.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);

    try {
      const orderPayload = {
        tableNumber: tableId,
        items: cart.map(item => ({
          menuItem: item._id,
          quantity: item.quantity
        }))
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const json = await res.json();
      
      if (json.success) {
        setCart([]);
        alert('Order sent to the kitchen successfully!');
      } else {
        alert(json.message || 'Failed to place order.');
      }
    } catch (error) {
      alert('Network error while placing order.');
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All Items' || item.category === activeCategory;
    return matchesCategory && item.isAvailable !== false; 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <p className="text-neutral-500 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
          Opening Digital Cellar Menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans flex flex-col md:flex-row selection:bg-neutral-800 pb-32 md:pb-0">
      
      {/* LEFT SIDEBAR: EXPERT BRANDING & CATEGORY MATRIX */}
      <aside className="w-full md:w-80 shrink-0 md:sticky md:top-0 md:h-screen bg-[#050505] border-b md:border-b-0 md:border-r border-neutral-900 p-6 md:p-10 flex flex-col justify-between z-50">
        <div>
          {/* Curated Header Block */}
          <div className="border-b border-neutral-900 pb-6 mb-8">
            <h1 className="text-xl font-light tracking-[0.25em] text-white font-serif uppercase">
              THE LOCATION
            </h1>
            <p className="text-[10px] tracking-[0.4em] text-neutral-600 font-mono uppercase mt-1">
              Table Configuration {tableId}
            </p>
          </div>

          {/* Left Positioned Menu Navigation */}
          <div className="space-y-1.5 flex flex-row md:flex-col overflow-x-auto no-scrollbar md:overflow-x-visible pb-4 md:pb-0 gap-3 md:gap-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left py-3 px-4 text-[11px] font-mono uppercase tracking-widest transition-all duration-300 border-l-2 whitespace-nowrap md:whitespace-normal ${
                  activeCategory === cat 
                    ? 'border-[#FFB000] text-[#FFB000] bg-neutral-900/50 font-medium' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Static Info Footer for Table */}
        <div className="hidden md:block border-t border-neutral-900 pt-6 font-mono text-[9px] text-neutral-600 tracking-wider uppercase">
          <p>Interactive Guest Node</p>
          <p className="mt-1 text-neutral-700">Secured Digital Pipeline Active</p>
        </div>
      </aside>

      {/* RIGHT CONTENT WORKSPACE: ULTRA HIGH-END 3-COLUMN MESH GRID */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8 text-neutral-500 font-mono text-xs uppercase tracking-widest border-b border-neutral-900 pb-4">
          <Layers size={14} className="text-neutral-700" />
          <span>{activeCategory}</span>
          <span className="text-neutral-800">/</span>
          <span className="text-neutral-600 font-light">{filteredItems.length} Offerings Available</span>
        </div>

        <AnimatePresence mode='popLayout'>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => {
              const isSoldOut = item.isAvailableForTable === false;
              const quantity = getQuantity(item._id);
              
              return (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`bg-[#080808] border rounded-xl overflow-hidden flex flex-col justify-between group transition-all duration-500 ${
                    isSoldOut 
                      ? 'border-neutral-950 opacity-30 grayscale' 
                      : 'border-neutral-900 hover:border-neutral-700 shadow-sm'
                  }`}
                >
                  {/* Dramatic Aspect-Square Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-neutral-950 border-b border-neutral-900/50">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                        <span className="text-[10px] font-mono tracking-[0.2em] border border-neutral-800 bg-[#020202] text-neutral-400 px-3 py-1.5 rounded uppercase">
                          Exhausted Allocation
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Highly Visible Component Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-lg font-serif font-light text-white group-hover:text-[#FFB000] transition-colors leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-lg font-mono text-[#FFB000] font-medium shrink-0">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed mt-2.5">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Highly Disciplined Operational Order Interfaces */}
                    <div className="pt-2">
                      {!isSoldOut && (
                        quantity === 0 ? (
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-900 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-1.5"
                          >
                            Add To Order <Plus size={12} className="text-neutral-500" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                            <button 
                              onClick={() => removeFromCart(item._id)} 
                              className="p-2 text-neutral-500 hover:text-neutral-200 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-mono font-bold text-[#FFB000] w-6 text-center">
                              {quantity}
                            </span>
                            <button 
                              onClick={() => addToCart(item)} 
                              className="p-2 text-neutral-500 hover:text-neutral-200 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* IMMERSIVE ORDER DISPATCH CONSOLE BAR */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl bg-[#080808]/95 backdrop-blur-md border border-neutral-800 text-white p-4 md:p-5 rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex justify-between items-center z-[60]"
          >
            <div className="flex items-center gap-4 pl-1">
              <div className="bg-neutral-900 border border-neutral-800 text-[#FFB000] w-12 h-12 rounded-lg flex items-center justify-center font-mono text-base font-bold">
                {cartItemCount}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase">Subtotal Accumulation</span>
                <span className="text-xl font-mono text-white tracking-tight mt-0.5">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="bg-neutral-900 hover:bg-neutral-800 text-[#FFB000] border border-neutral-800 px-6 md:px-10 py-3.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-lg flex items-center gap-2.5 transition-all duration-300 disabled:opacity-50"
            >
              {isOrdering ? 'Dispatching...' : 'Transmit Order'} <ChevronRight size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableMenu;