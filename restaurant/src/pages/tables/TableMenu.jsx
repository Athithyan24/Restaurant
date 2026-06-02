import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { ShoppingBag, ChevronRight, Star, Minus, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom'; // 1. Import useParams to get the Table Number

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', '');

const TableMenu = () => {
  const { tableId } = useParams(); // Gets the '5' from '/table/5'
  
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All Items']);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [loading, setLoading] = useState(true);
  
  // 2. Cart State
  const [cart, setCart] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchMenu();
    const socket = io(SOCKET_URL);
    
    socket.on('tableMenuUpdate', (data) => {
      setMenuItems((prev) => 
        prev.map(item => item._id === data.id ? { ...item, isAvailableForTable: data.isAvailableForTable } : item)
      );
      // Auto-remove sold out items from cart
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

  // --- CART LOGIC ---
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

  // --- SUBMIT ORDER LOGIC ---
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
        setCart([]); // Clear cart on success
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#FFB000] font-serif">Loading Digital Menu...</div>;

  return (
    <div className="min-h-screen bg-[#000000] text-[#f0f0f0] font-sans selection:bg-[#FFB000] selection:text-black pb-32">
      
      {/* HEADER */}
      <header className="relative py-12 px-6 text-center border-b border-[#FFB000]/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')` }}></div>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-[#FFB000] font-serif text-4xl tracking-widest uppercase mb-2">Table {tableId}</h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-[#FFB000]/40"></div>
            <span className="text-[10px] tracking-[0.5em] text-gray-500 uppercase">The Location Dining</span>
            <div className="h-[1px] w-8 bg-[#FFB000]/40"></div>
          </div>
        </motion.div>
      </header>

      {/* CATEGORIES */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 overflow-x-auto no-scrollbar flex gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border whitespace-nowrap ${
              activeCategory === cat 
              ? 'bg-[#FFB000] text-black border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.3)]' 
              : 'bg-white/5 text-gray-500 border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* MENU GRID */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => {
              const isSoldOut = item.isAvailableForTable === false;
              const quantity = getQuantity(item._id);
              
              return (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative group flex gap-4 p-4 rounded-3xl border transition-all duration-500 ${
                    isSoldOut ? 'border-white/5 opacity-40 bg-white/[0.02]' : 'border-white/5 bg-white/[0.03] hover:border-[#FFB000]/30'
                  }`}
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border border-white/5">
                    <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${isSoldOut && 'grayscale'}`} />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[8px] font-bold tracking-tighter bg-white text-black px-2 py-1 rounded">SOLD OUT</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between py-1 flex-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-serif text-white group-hover:text-[#FFB000] transition-colors pr-2">{item.name}</h3>
                        {!isSoldOut && <Star size={12} className="text-[#FFB000] fill-[#FFB000] opacity-40 shrink-0 mt-1" />}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[#FFB000] font-bold text-lg">₹{item.price}</span>
                      
                      {/* CART CONTROLS */}
                      {!isSoldOut && (
                        quantity === 0 ? (
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-white text-black p-2 rounded-xl hover:bg-[#FFB000] transition-colors"
                          >
                            <ShoppingBag size={18} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-1 border border-white/20">
                            <button onClick={() => removeFromCart(item._id)} className="p-1 text-white hover:text-[#FFB000]">
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                            <button onClick={() => addToCart(item)} className="p-1 text-[#FFB000] hover:text-white">
                              <Plus size={14} />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* FLOATING ORDER BAR */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#FFB000] text-black p-4 rounded-3xl shadow-[0_20px_50px_rgba(255,176,0,0.3)] flex justify-between items-center z-[60]"
          >
            <div className="flex items-center gap-3 pl-2">
              <div className="bg-black text-[#FFB000] w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg">
                {cartItemCount}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Bill</p>
                <p className="text-sm font-bold tracking-tighter">₹{cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="bg-black text-[#FFB000] px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isOrdering ? 'Sending...' : 'Place Order'} <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableMenu;