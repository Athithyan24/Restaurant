import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BookATable = () => {
  const [formState, setFormState] = useState({
    date: '',
    time: '',
    guests: '2',
    tableNumber: '', // Added missing table number logic
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Available tables map inside the restaurant layout
  const luxuryTables = [
    { id: 'T-01', name: 'Table 01', type: 'Window View (2-4 Pax)', status: 'available' },
    { id: 'T-02', name: 'Table 02', type: 'Window View (2 Pax)', status: 'available' },
    { id: 'T-03', name: 'Table 03', type: 'VIP Alcove (2-4 Pax)', status: 'available' },
    { id: 'T-04', name: 'Table 04', type: 'Private Booth (4-6 Pax)', status: 'available' },
    { id: 'T-05', name: 'Table 05', type: 'Royal Lounge (6+ Pax)', status: 'available' },
    { id: 'T-06', name: 'Table 06', type: 'Chef\'s Counter (2 Pax)', status: 'available' },
    { id: 'T-07', name: 'Table 07', type: 'Courtyard Side (4 Pax)', status: 'available' },
    { id: 'T-08', name: 'Table 08', type: 'Premium Center (2-4 Pax)', status: 'available' },
  ];

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleTableSelect = (tableId) => {
    setFormState({ ...formState, tableNumber: tableId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.tableNumber) {
      alert("Please select a table number to complete your reservation.");
      return;
    }
    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 90, damping: 22 } 
    }
  };

  return (
    <div className="bg-[#060606] text-white min-h-screen pt-28 sm:pt-36 pb-20 relative overflow-hidden font-sans">
      {/* Ambient Luxury Lighting */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#FFB000]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER BLOCK */}
        <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#FFB000] block mb-3">
            Secure Your Experience
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-wide uppercase text-white mb-5">
            Book A Table
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000] to-transparent mx-auto mb-5" />
          <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xl mx-auto">
            Review our active floor configuration below, choose your preferred table location, and complete your premium dining reservation.
          </p>
        </motion.div>

        {/* RESERVATION FORM CONTAINER */}
        <motion.div 
          variants={itemVariants}
          className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 sm:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000]/20 to-transparent" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="reservation-form"
                onSubmit={handleSubmit} 
                className="space-y-8"
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {/* SECTION 1: THE DATE & TIME */}
                <div>
                  <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-white border-l-2 border-[#FFB000] pl-3 mb-6">
                    1. Schedule Schedule
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="date" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        value={formState.date}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light [color-scheme:dark]"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="time" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Time Slot</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        required
                        value={formState.time}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light [color-scheme:dark]"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="guests" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Size of Party</label>
                      <select
                        id="guests"
                        name="guests"
                        value={formState.guests}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, '7+'].map(num => (
                          <option key={num} value={num} className="bg-[#0d0d0d]">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: INTERACTIVE TABLE SELECTION */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-l-2 border-[#FFB000] pl-3 mb-4">
                    <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-white">
                      2. Choose Your Table Number
                    </h3>
                    {formState.tableNumber && (
                      <span className="text-xs text-[#FFB000] font-mono tracking-wider font-semibold mt-1 sm:mt-0">
                        Selected: {formState.tableNumber}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {luxuryTables.map((table) => {
                      const isSelected = formState.tableNumber === table.id;
                      return (
                        <div
                          key={table.id}
                          onClick={() => handleTableSelect(table.id)}
                          className={`cursor-pointer border p-4 rounded-xl flex flex-col justify-between transition-all duration-300 h-28 ${
                            isSelected 
                              ? 'border-[#FFB000] bg-[#FFB000]/10 shadow-[0_0_15px_rgba(255,176,0,0.15)]' 
                              : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-black/40'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-[#FFB000]' : 'text-gray-400'}`}>
                              {table.id}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#FFB000] animate-pulse' : 'bg-green-500'}`} />
                          </div>
                          <div>
                            <h4 className="text-sm font-serif font-medium text-white">{table.name}</h4>
                            <p className="text-[10px] text-gray-500 font-light truncate">{table.type}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!formState.tableNumber && (
                    <p className="text-[11px] text-[#FFB000]/70 italic mt-3 font-light">
                      * Please tap on a specific layout quadrant above to assign a table number.
                    </p>
                  )}
                </div>

                {/* SECTION 3: GUEST DETAILS */}
                <div>
                  <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-white border-l-2 border-[#FFB000] pl-3 mb-6">
                    3. Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="Alexander Wright"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formState.phone}
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light"
                        placeholder="Mobile connection"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mb-6">
                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light"
                      placeholder="alex@luxury.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="specialRequests" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dietary Preferences / Special Arrangements</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      value={formState.specialRequests}
                      onChange={handleChange}
                      className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light resize-none"
                      placeholder="Allergies, anniversaries, or special accommodations..."
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full bg-[#FFB000] text-black py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 shadow-[0_4px_25px_rgba(255,176,0,0.15)]"
                  >
                    Confirm Luxury Reservation
                  </motion.button>
                  <p className="text-center text-[10px] text-gray-500 tracking-wider mt-4">
                    By confirmation, you agree to our smart casual dress code alignment.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 16 }}
                className="text-center py-20 px-4 flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full border border-[#FFB000]/30 flex items-center justify-center bg-[#FFB000]/5 text-[#FFB000] mb-4 shadow-[0_0_30px_rgba(255,176,0,0.2)]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-white tracking-wide uppercase font-light">
                  Table Secured
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <span className="text-white font-medium">{formState.name}</span>. Your assignment at <span className="text-[#FFB000] font-mono font-bold tracking-wider">{formState.tableNumber}</span> for <span className="text-white font-medium">{formState.guests} guests</span> on <span className="text-white font-medium">{formState.date}</span> at <span className="text-white font-medium">{formState.time}</span> has been locked in.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  A verification transmission has been dispatched to {formState.email}.
                </p>
                
                <button 
                  onClick={() => { 
                    setIsSubmitted(false); 
                    setFormState({ date: '', time: '', guests: '2', tableNumber: '', name: '', email: '', phone: '', specialRequests: '' }); 
                  }}
                  className="mt-8 text-xs tracking-[0.2em] text-[#FFB000] uppercase font-bold hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white pb-1"
                >
                  Make Another Booking
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default BookATable;