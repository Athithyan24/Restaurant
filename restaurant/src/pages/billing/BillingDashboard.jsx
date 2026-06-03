import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { CheckCircle, Receipt, Lock } from 'lucide-react'; 

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', ''); 

const BillingDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchBillingOrders();
    const socket = io(SOCKET_URL);

    socket.on('orderStatusUpdated', (updatedOrder) => {
      if (updatedOrder && updatedOrder._id) {
        setOrders(prev => {
          const exists = prev.find(o => o._id === updatedOrder._id);
          if (exists) {
            return prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
          }
          // If it just became 'Served', add it to the POS
          if (updatedOrder.status === 'Served' && updatedOrder.paymentStatus === 'Unpaid') {
            return [...prev, updatedOrder];
          }
          return prev;
        });
      }
    });

    return () => socket.disconnect();
  }, [isAuthenticated]);

  const fetchBillingOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/active`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      }
    } catch (error) {
      console.error("Failed to load POS data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processCheckout = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/checkout`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if(json.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
      }
    } catch(err) {
      alert("Error processing payment execution.");
    }
  };

  const calculateSubtotal = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const rawPrice = String(item.menuItem?.price || '0').replace(/[^0-9.]/g, '');
      const price = parseFloat(rawPrice) || 0;
      const qty = item.quantity || 1;
      return sum + (price * qty);
    }, 0);
  };

  const handlePinSubmit = () => {
    if (pinInput === '1234') {
      setIsAuthenticated(true);
    } else {
      alert("Access Denied: Invalid POS PIN.");
      setPinInput('');
    }
  };

  // -------------------------
  // LOGIN SCREEN RENDER
  // -------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h3 className="text-xl font-serif text-white text-center tracking-wide uppercase mb-2">POS Terminal</h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-8">Cashier Authentication Required</p>
          
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
            placeholder="••••"
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-center text-3xl text-white tracking-[0.5em] focus:outline-none focus:border-emerald-500 transition-colors mb-6 font-mono"
            autoFocus
          />

          <button onClick={handlePinSubmit} className="w-full py-3.5 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            Login to Register
          </button>
        </motion.div>
      </div>
    );
  }

  // -------------------------
  // POS SYSTEM RENDER
  // -------------------------
  const billingOrders = orders.filter(order => order.status === 'Served' && order.paymentStatus === 'Unpaid');

  if (loading) return <div className="min-h-screen bg-[#060606] flex items-center justify-center text-emerald-500 font-mono tracking-widest uppercase text-xs">Connecting to Register...</div>;

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-serif font-light uppercase tracking-wide text-white">Cashier <span className="text-emerald-500 font-medium">Terminal</span></h1>
            <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mt-1">Awaiting Settlements</p>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 hover:text-white transition-all border border-white/5">
            Log Out
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {billingOrders.length === 0 ? (
            <div className="col-span-full py-24 text-center text-emerald-500/40 font-serif text-lg border border-emerald-500/10 rounded-2xl bg-emerald-900/5 tracking-wide font-light">
              <CheckCircle className="mx-auto mb-4 opacity-40 text-emerald-500" size={28} />
              All accounts settled. Balance books clear.
            </div>
          ) : (
            billingOrders.map((order) => {
              const subtotal = calculateSubtotal(order.items);
              const serviceCharge = subtotal * 0.10; // 10% Service Charge
              const grandTotal = subtotal + serviceCharge;

              return (
                <div key={order._id} className="border border-white/10 bg-[#0d0d0d] rounded-2xl p-6 flex flex-col justify-between min-h-[420px] shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                  
                  <div>
                    <div className="flex justify-between items-start pb-4 border-b border-dashed border-white/10 mb-4">
                      <div>
                        <span className="text-xl font-serif tracking-wide text-white">Receipt: Table {order.table?.tableNumber || '??'}</span>
                        <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">POS: {order._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <Receipt size={18} className="text-gray-600" />
                    </div>

                    <div className="space-y-3 my-4 max-h-[180px] overflow-y-auto pr-1">
                      {(order.items || []).map((item, idx) => {
                        const rawPrice = parseFloat(String(item.menuItem?.price || '0').replace(/[^0-9.]/g, '')) || 0;
                        const qty = item.quantity || 1;
                        const itemTotal = rawPrice * qty;

                        return (
                          <div key={idx} className="flex justify-between items-start text-xs font-light">
                            <div className="max-w-[70%]">
                              <span className="text-gray-400 font-mono text-[11px] mr-1.5">{qty}x</span>
                              <span className="text-gray-200">{item.menuItem?.name || 'Item Loading...'}</span>
                            </div>
                            <span className="font-mono text-gray-400 text-[11px]">${itemTotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-white/10 pt-4 mt-auto space-y-2">
                    <div className="flex justify-between text-[11px] font-light text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-light text-gray-500">
                      <span>Service & VAT (10%)</span>
                      <span className="font-mono">${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                      <span className="tracking-wide uppercase text-xs text-emerald-500">Total Due</span>
                      <span className="font-mono text-emerald-500 text-base">${grandTotal.toFixed(2)}</span>
                    </div>

                    <button onClick={() => processCheckout(order._id)} className="w-full mt-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-emerald-500 text-black hover:bg-white shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
                      Process Payment
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BillingDashboard;