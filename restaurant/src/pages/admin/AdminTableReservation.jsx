import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Calendar, Clock, Users, Check, X, AlertTriangle, Plus, ArrowLeft } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_BASE_URL.replace('/api', ''); 

const AdminTableReservation = () => {
  // --- LEDGER STATE ---
  const [bookings, setBookings] = useState([]);
  const [liveTables, setLiveTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Upcoming');

  // --- CREATION STATE ---
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    date: '', time: '', guests: '2', tableNumber: '', name: '', email: '', phone: '', specialRequests: ''
  });

  useEffect(() => {
    fetchData();

    const socket = io(SOCKET_URL);

    socket.on('newReservationNotification', (newBooking) => {
      setBookings(prev => {
        if (prev.find(b => b._id === newBooking._id)) return prev;
        return [...prev, newBooking].sort((a, b) => new Date(a.date) - new Date(b.date));
      });
      new Audio('/notification.mp3').play().catch(() => {}); 
    });

    socket.on('bookingStatusUpdated', (updatedBooking) => {
      setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
    });

    socket.on('tableStatusChanged', (data) => {
      setLiveTables(prev => {
        const incomingNum = Number(data.tableNumber);
        const exists = prev.some(t => Number(t.tableNumber) === incomingNum);
        if (exists) {
          return prev.map(t => Number(t.tableNumber) === incomingNum ? { ...t, status: data.status } : t);
        }
        return [...prev, { tableNumber: incomingNum, status: data.status }];
      });
    });

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, tablesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings`),
        fetch(`${API_BASE_URL}/tables`)
      ]);
      const bookingsJson = await bookingsRes.json();
      const tablesJson = await tablesRes.json();
      
      if (bookingsJson.success) setBookings(bookingsJson.data || []);
      if (tablesJson.success) setLiveTables(tablesJson.data || []);
    } catch (error) {
      console.error("Failed to synchronize data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // --- ADMIN BOOKING LOGIC ---
  const luxuryTables = Array.from({ length: 15 }, (_, i) => {
    const num = i + 1;
    const id = `T-${num.toString().padStart(2, '0')}`;
    let type = 'Standard Dining (2-4 Pax)';
    if (num <= 4) type = 'Window View (2-4 Pax)';
    else if (num <= 8) type = 'Premium Center (2-4 Pax)';
    else if (num <= 12) type = 'Private Booth (4-6 Pax)';
    else if (num === 13) type = 'VIP Alcove (2-4 Pax)';
    else if (num === 14) type = 'Royal Lounge (6+ Pax)';
    else if (num === 15) type = "Chef's Counter (2 Pax)";
    return { id, name: `Table ${num.toString().padStart(2, '0')}`, type };
  });

  const isTableBooked = (tableId) => {
    if (!formState.date || !formState.time) return false;
    
    const isReserved = bookings.some((b) => {
      if (b.tableNumber !== tableId || b.date !== formState.date || b.status === 'Cancelled') return false;
      const formTime = new Date(`1970-01-01T${formState.time}`);
      const bookedTime = new Date(`1970-01-01T${b.time}`);
      const diffHours = Math.abs(formTime - bookedTime) / 36e5;
      return diffHours < 2; 
    });

    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const isToday = formState.date === getTodayDate();
    const rawTableNumber = parseInt(tableId.split('-')[1], 10); 
    
    let isPhysicallyOccupied = false;
    if (isToday) {
       const now = new Date();
       const formTime = new Date(`${formState.date}T${formState.time}`);
       const diffHours = (formTime - now) / 36e5;
       if (diffHours >= -1 && diffHours <= 2) {
         isPhysicallyOccupied = liveTables.some(
           (t) => Number(t.tableNumber) === rawTableNumber && t.status === 'Occupied'
         );
       }
    }
    return isReserved || isPhysicallyOccupied;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date' || name === 'time') {
      setFormState({ ...formState, [name]: value, tableNumber: '' });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!formState.tableNumber) return alert("Select a table allocation.");

    setIsSubmitting(true);
    try {
      const payload = { ...formState, status: 'Confirmed' }; 
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setFormState({ date: '', time: '', guests: '2', tableNumber: '', name: '', email: '', phone: '', specialRequests: '' });
        setIsCreating(false);
        fetchData();
      } else {
        alert("Allocation failed: " + result.message);
      }
    } catch (error) {
      console.error("Booking Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FILTER LOGIC ---
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const filteredBookings = bookings.filter(b => {
    if (filter === 'Upcoming') return b.status !== 'Cancelled' && b.date >= getTodayDate();
    if (filter === 'Cancelled') return b.status === 'Cancelled';
    return true; 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <p className="text-neutral-500 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">
          Synchronizing Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans p-6 sm:p-10 selection:bg-neutral-800">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER CONTROL BLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-900 pb-8">
          <div>
            <h1 className="text-2xl font-light uppercase tracking-widest text-white font-serif">
              RESERVATION <span className="text-neutral-500 font-sans font-light text-xl">/ CONCIERGE DESK</span>
            </h1>
            <p className="text-neutral-600 text-[10px] tracking-[0.3em] uppercase mt-2 font-mono">
              Live Floor Configuration & Entry Management
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {!isCreating && (
              <div className="flex bg-[#080808] border border-neutral-900 p-1 rounded-lg">
                {['Upcoming', 'All', 'Cancelled'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)} 
                    className={`px-5 py-2 rounded text-[10px] uppercase font-mono tracking-wider transition-all duration-200 ${
                      filter === f ? 'bg-neutral-900 text-[#FFB000] border border-neutral-800 font-medium' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-widest border transition-all duration-300 ${
                isCreating 
                  ? 'bg-neutral-900 text-white border-neutral-700 hover:bg-neutral-800' 
                  : 'bg-[#FFB000]/10 text-[#FFB000] border-[#FFB000]/20 hover:bg-[#FFB000] hover:text-black'
              }`}
            >
              {isCreating ? <><ArrowLeft size={14} /> Return to Ledger</> : <><Plus size={14} /> Add Entry</>}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isCreating ? (
            /* --- CREATION COMMAND CENTER --- */
            <motion.div 
              key="creation-mode"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-[#040404] border border-neutral-900 rounded-2xl p-6 md:p-10"
            >
              <div className="mb-8 border-b border-neutral-900 pb-4">
                <h2 className="text-sm font-mono text-white tracking-[0.2em] uppercase">Manual Allocation Matrix</h2>
                <p className="text-[10px] text-neutral-500 font-mono tracking-widest mt-1">Force-add walk-ins or VIP direct calls.</p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-8">
                {/* Time & Date Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Date Parameter</label>
                    <input type="date" name="date" required value={formState.date} onChange={handleFormChange} className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors [color-scheme:dark]" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Time Vector</label>
                    <input type="time" name="time" required value={formState.time} onChange={handleFormChange} className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors [color-scheme:dark]" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Party Size (Pax)</label>
                    <select name="guests" required value={formState.guests} onChange={handleFormChange} className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors appearance-none">
                      {[1, 2, 3, 4, 5, 6, '7+'].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table Topography */}
                <div className="pt-4">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Grid Selection</label>
                    {formState.tableNumber && <span className="text-[10px] text-[#FFB000] font-mono">Locked: {formState.tableNumber}</span>}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {luxuryTables.map((table) => {
                      const isSelected = formState.tableNumber === table.id;
                      const booked = isTableBooked(table.id);

                      return (
                        <div
                          key={table.id}
                          onClick={() => { if (!booked) setFormState({ ...formState, tableNumber: table.id }) }}
                          className={`p-3 rounded-lg border flex flex-col justify-between h-20 transition-all duration-200 ${
                            booked 
                              ? 'border-neutral-950 bg-[#020202] opacity-40 cursor-not-allowed'
                              : isSelected 
                                ? 'border-[#FFB000] bg-[#FFB000]/10 shadow-[0_0_15px_rgba(255,176,0,0.1)]' 
                                : 'border-neutral-900 bg-[#080808] hover:border-neutral-700 cursor-pointer'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? 'text-[#FFB000]' : booked ? 'text-neutral-700' : 'text-neutral-400'}`}>
                              {table.id}
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full ${booked ? 'bg-neutral-800' : isSelected ? 'bg-[#FFB000]' : 'bg-emerald-900'}`} />
                          </div>
                          <p className="text-[8px] text-neutral-600 font-mono truncate mt-2">{table.type}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Client Dossier */}
                <div className="pt-4 border-t border-neutral-900 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Full Name</label>
                      <input type="text" name="name" required value={formState.name} onChange={handleFormChange} placeholder="Client Name" className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Phone Number</label>
                      <input type="tel" name="phone" required value={formState.phone} onChange={handleFormChange} placeholder="+1 234 567 8900" className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Email Address</label>
                      <input type="email" name="email" required value={formState.email} onChange={handleFormChange} placeholder="client@example.com" className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Dietary Preferences / Special Arrangements</label>
                    <textarea name="specialRequests" value={formState.specialRequests} onChange={handleFormChange} placeholder="Allergies, anniversaries, specific seating requirements..." rows="2" className="bg-[#080808] border border-neutral-900 rounded-lg px-4 py-3 text-neutral-300 font-mono text-xs focus:outline-none focus:border-[#FFB000] transition-colors resize-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-[#FFB000] border border-neutral-800 rounded-lg text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Executing Allocation...' : 'Force Inject Reservation'}
                </button>
              </form>
            </motion.div>
          ) : (
            /* --- SECURE MESH GRID (LEDGER) --- */
            <motion.div 
              key="ledger-mode"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredBookings.length === 0 ? (
                <div className="col-span-full py-20 text-center text-neutral-600 font-mono text-xs border border-dashed border-neutral-900 rounded-xl bg-[#030303] tracking-widest uppercase">
                  No active archives matching segment criteria.
                </div>
              ) : (
                filteredBookings.map((booking) => {
                  const isCancelled = booking.status === 'Cancelled';
                  const isConfirmed = booking.status === 'Confirmed';

                  return (
                    <div 
                      key={booking._id} 
                      className={`bg-[#080808] border rounded-xl p-5 flex flex-col justify-between min-h-[300px] transition-all duration-300 ${
                        isCancelled ? 'border-neutral-950 opacity-40 grayscale' : isConfirmed ? 'border-neutral-800 hover:border-neutral-700 shadow-sm' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start border-b border-neutral-900 pb-4 mb-4">
                          <div>
                            <span className="text-xs font-mono font-bold uppercase text-neutral-500 tracking-wider">Table</span>
                            <h3 className="text-xl font-mono text-white tracking-tight">{booking.tableNumber || "N/A"}</h3>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-[#030303] border border-neutral-900 px-2.5 py-1 rounded">
                            <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? 'bg-neutral-700' : isConfirmed ? 'bg-emerald-500' : 'bg-[#FFB000]'}`} />
                            <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                              {booking.status || 'Pending'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-[#040404] border border-neutral-900 rounded-lg p-3 mb-5 font-mono text-[11px] text-neutral-400">
                          <div className="flex items-center gap-2 border-r border-neutral-900/50">
                            <Calendar size={12} className="text-neutral-600" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 pl-2">
                            <Clock size={12} className="text-neutral-600" />
                            <span>{booking.time}</span>
                          </div>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Client</span>
                            <span className="font-medium text-neutral-200 truncate max-w-[180px]">{booking.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Party Size</span>
                            <span className="font-mono text-neutral-300 flex items-center gap-1">
                              <Users size={11} className="text-neutral-600" /> {booking.guests} Pax
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Phone</span>
                            <span className="font-mono text-neutral-400 hover:text-neutral-200 transition-colors">{booking.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Email</span>
                            <span className="font-mono text-neutral-400 truncate max-w-[160px]" title={booking.email}>{booking.email || 'N/A'}</span>
                          </div>
                        </div>

                        {booking.specialRequests && (
                          <div className="mt-4 p-3 bg-[#030303] border border-neutral-900 rounded-lg">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 mb-1">
                              <AlertTriangle size={10} className="text-neutral-600" /> Special Ledger Entry
                            </span>
                            <p className="text-[11px] text-neutral-400 font-light italic leading-relaxed line-clamp-2">
                              "{booking.specialRequests}"
                            </p>
                          </div>
                        )}
                      </div>

                      {!isCancelled && (
                        <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-900">
                          {booking.status !== 'Confirmed' && (
                            <button 
                              onClick={() => updateStatus(booking._id, 'Confirmed')}
                              className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-200 hover:text-white border border-neutral-900 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-1.5"
                            >
                              <Check size={12} className="text-emerald-500" /> Verify
                            </button>
                          )}
                          <button 
                            onClick={() => { if(window.confirm('Void this structural assignment?')) updateStatus(booking._id, 'Cancelled') }}
                            className="flex-1 py-2 bg-neutral-950 hover:bg-neutral-900/40 text-neutral-500 hover:text-neutral-400 border border-neutral-900 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-1.5"
                          >
                            <X size={12} className="text-neutral-600" /> Void
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminTableReservation;