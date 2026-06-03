import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', ''); 

const KitchenDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
    const socket = io(SOCKET_URL);

    socket.on('tableMenuAvailabilityChanged', (data) => {
      setMenuItems((prev) => prev.map((item) => item._id === data.id ? { ...item, isAvailableForTable: data.isAvailableForTable } : item));
    });

    socket.on('newKitchenOrder', (data) => {
      if (data && data.order) {
        setOrders(prev => [data.order, ...prev]);
        new Audio('/notification.mp3').play().catch(() => {});
      }
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder && updatedOrder._id) {
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
      }
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
        const menuData = menuJson.data || [];
        setMenuItems(menuData);
        const uniqueCategories = [...new Set(menuData.map(item => item.category))];
        setCategories(uniqueCategories);
      }
      if (orderJson.success) setOrders(orderJson.data || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTableAvailability = async (id, currentTableStatus) => {
    const newStatus = !currentTableStatus;
    setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailableForTable: newStatus } : item));
    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/menu/${id}/table-availability`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ isAvailableForTable: newStatus }) 
      });
      const json = await res.json();
      if (!json.success) throw new Error("Failed");
    } catch (error) {
      setMenuItems(prev => prev.map(item => item._id === id ? { ...item, isAvailableForTable: currentTableStatus } : item));
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const displayedItems = activeCategory === 'All' ? menuItems : menuItems.filter(item => item.category === activeCategory);
  const kitchenOrders = orders.filter(order => order.status !== 'Served' && order.paymentStatus === 'Unpaid');

  if (loading) return <div className="min-h-screen bg-[#060606] flex items-center justify-center text-[#FFB000] font-mono tracking-widest uppercase text-xs">Initializing Kitchen Sync...</div>;

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#FFB000]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-light uppercase tracking-wide text-white">Kitchen <span className="text-[#FFB000] font-medium">Line</span></h1>
            <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mt-1">Back of House Operations</p>
          </div>
          
          <div className="flex bg-black border border-white/10 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
            <button onClick={() => setActiveTab('orders')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'orders' ? 'bg-[#FFB000] text-black font-black' : 'text-gray-400 hover:text-white'}`}>
              Active Tickets ({kitchenOrders.length})
            </button>
            <button onClick={() => setActiveTab('menu')} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'menu' ? 'bg-[#FFB000] text-black font-black' : 'text-gray-400 hover:text-white'}`}>
              Menu Matrix
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kitchenOrders.length === 0 ? (
                <div className="col-span-full py-24 text-center text-gray-500 font-serif text-lg border border-white/5 rounded-2xl bg-black/40 tracking-wide font-light">No outstanding tickets.</div>
              ) : (
                kitchenOrders.map((order) => (
                  <div key={order._id} className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[320px] transition-all duration-300 ${order.status === 'Preparing' ? 'border-[#FFB000] bg-[#FFB000]/5' : 'border-white/5 bg-[#0d0d0d]'}`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-2xl font-serif tracking-wide text-white">Table {order.table?.tableNumber || '??'}</span>
                          <p className="text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-1">Fired: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[9px] uppercase tracking-widest font-black ${order.status === 'Preparing' ? 'bg-[#FFB000] text-black animate-pulse' : 'bg-white/10 text-gray-300'}`}>
                          {order.status === 'Pending' ? 'Queued' : 'Cooking'}
                        </span>
                      </div>

                      <div className="space-y-2.5 my-4 bg-black/60 p-4 rounded-xl border border-white/5 max-h-[160px] overflow-y-auto">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-white/5 last:border-0 pb-2 last:pb-0">
                            <span className="text-xs font-light text-gray-300">
                              <span className="text-[#FFB000] font-mono font-bold mr-2 text-sm">{item.quantity}x</span> {item.menuItem?.name || 'Item Loading...'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={() => updateOrderStatus(order._id, order.status === 'Pending' ? 'Preparing' : 'Served')} className={`w-full py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${order.status === 'Pending' ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#FFB000] text-black hover:bg-yellow-400'}`}>
                      {order.status === 'Pending' ? 'Accept & Prepare' : 'Out to Service'}
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
                <button onClick={() => setActiveCategory('All')} className={`shrink-0 px-5 py-2 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all border ${activeCategory === 'All' ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black text-gray-500 border-white/10 hover:text-white'}`}>All Matrix</button>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`shrink-0 px-5 py-2 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all border ${activeCategory === cat ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black text-gray-500 border-white/10 hover:text-white'}`}>{cat}</button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {displayedItems.map(item => {
                    const isAvailable = item.isAvailableForTable !== false;
                    const safePrice = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;

                    return (
                      <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={item._id} className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${isAvailable ? 'bg-[#0d0d0d] border-white/5' : 'bg-red-500/5 border-red-500/10 opacity-70'}`}>
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-black mr-4 border border-white/5">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150"} 
                            alt={item.name} 
                            className={`w-full h-full object-cover ${!isAvailable ? 'grayscale' : ''}`}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=150"; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs truncate text-white">{item.name}</h3>
                          <p className="text-[#FFB000] font-mono text-[10px] mt-0.5">${safePrice.toFixed(2)}</p>
                        </div>
                        <button onClick={() => toggleTableAvailability(item._id, isAvailable)} className={`relative shrink-0 w-14 h-7 rounded-full transition-colors duration-300 border ${isAvailable ? 'bg-emerald-500/10 border-emerald-500' : 'bg-red-500/10 border-red-500'}`}>
                          <div className={`absolute top-0.5 bottom-0.5 w-5 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center ${isAvailable ? 'left-[26px] bg-emerald-500' : 'left-1 bg-red-500'}`}>
                            {isAvailable ? <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> : <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>}
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