import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, FireExtinguisher } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';

const KitchenKDS = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchActiveOrders();
    const socket = io(SOCKET_URL);

    socket.on('newKitchenOrder', (data) => {
      // Add new order to the start of the list
      setOrders(prev => [...prev, data.order]);
      new Audio('/notification.mp3').play().catch(() => {}); // Optional: Alert sound
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    return () => socket.disconnect();
  }, []);

  const fetchActiveOrders = async () => {
    const res = await fetch('http://localhost:5000/api/orders/active');
    const json = await res.json();
    if (json.success) setOrders(json.data);
  };

  const updateStatus = async (orderId, newStatus) => {
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 text-white">
      <h1 className="text-3xl font-serif text-[#FFB000] mb-8 border-b border-white/10 pb-4">
        Kitchen Production Terminal
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div 
              key={order._id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-3xl border-2 ${
                order.status === 'Preparing' ? 'border-[#FFB000] bg-[#FFB000]/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-black">TABLE {order.tableNumber || '??'}</span>
                <Clock size={16} className="text-gray-500" />
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.quantity}x {item.menuItem?.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status !== 'Preparing' && (
                  <button 
                    onClick={() => updateStatus(order._id, 'Preparing')}
                    className="flex-1 py-3 bg-white text-black text-xs font-bold rounded-xl uppercase tracking-widest"
                  >
                    Start Cooking
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button 
                    onClick={() => updateStatus(order._id, 'Served')}
                    className="flex-1 py-3 bg-emerald-500 text-black text-xs font-bold rounded-xl uppercase tracking-widest"
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KitchenKDS;