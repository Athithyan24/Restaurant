import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle, RefreshCw, Layers } from 'lucide-react';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const AdminOfferEditor = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fixed structure mapping perfectly to Hero alignment rules
  const [slots, setSlots] = useState([
    { id: 1, name: 'Main Course', img: '', icon: '🍲', menuItemId: '', alignment: 'Down (+Y Translation)' },
    { id: 2, name: 'Desserts', img: '', icon: '🍰', menuItemId: '', alignment: 'Up (-Y Translation)' },
    { id: 3, name: 'Appetizer', img: '', icon: '🥗', menuItemId: '', alignment: 'Down (+Y Translation)' },
    { id: 4, name: 'Starter', img: '', icon: '🥐', menuItemId: '', alignment: 'Up (-Y Translation)' }
  ]);

  const presetEmojis = ['🍲', '🍰', '🥗', '🥐', '✨', '🔥', '🍷', '🥩', '🍕', '🍣', '🍹', '🍦'];

  useEffect(() => {
    initializeEditor();
  }, []);

  const initializeEditor = async () => {
    try {
      // 1. Fetch entire active menu pool
      const menuRes = await fetch(`${API_BASE_URL}/menu`);
      const menuJson = await menuRes.json();
      let availableMenu = [];
      if (menuJson.success) {
        setMenuItems(menuJson.data);
        availableMenu = menuJson.data;
      }

      // 2. Fetch current active Hero configuration configurations
      const offersRes = await fetch(`${API_BASE_URL}/offers`);
      const offersJson = await offersRes.json();
      
      if (offersJson.success && offersJson.data && offersJson.data.length === 4) {
        setSlots(offersJson.data.map((item, idx) => ({
          id: idx + 1,
          name: item.name,
          img: item.img,
          icon: item.icon || '✨',
          menuItemId: item.menuItemId || '',
          alignment: idx % 2 === 0 ? 'Down (+Y Translation)' : 'Up (-Y Translation)'
        })));
      }
    } catch (err) {
      console.error("Error setting up dynamic offer configuration matrices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = (slotId, menuItemId) => {
    const selectedItem = menuItems.find(item => item._id === menuItemId);
    if (!selectedItem) return;

    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, menuItemId: selectedItem._id, name: selectedItem.name, img: selectedItem.image }
        : slot
    ));
  };

  const handleCustomTextChange = (slotId, field, value) => {
    setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, [field]: value } : slot));
  };

  const saveOfferConfiguration = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST', // Or PUT based on your router preference map
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offers: slots })
      });
      const json = await res.json();
      if (json.success) {
        setMessage('Hero presentation vectors synchronized successfully.');
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage('Update rejected: ' + json.message);
      }
    } catch (err) {
      setMessage('Network failure writing to remote configurations database.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 font-mono text-xs text-neutral-500 uppercase tracking-widest animate-pulse">
        Synchronizing Menu Collections...
      </div>
    );
  }

  return (
    <div className="bg-[#000000] text-neutral-200 p-6 md:p-10 font-sans max-w-7xl mx-auto space-y-10">
      
      {/* Structural Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-900 pb-8">
        <div>
          <h2 className="text-xl font-light tracking-widest text-white font-serif uppercase flex items-center gap-2">
            HERO CURATION <span className="text-neutral-500 font-sans text-base">/ PROMOTIONAL MATRIX</span>
          </h2>
          <p className="text-neutral-600 text-[10px] tracking-[0.3em] uppercase mt-1 font-mono">
            Control the 4 high-end featured slots rendered on the homepage splash grid
          </p>
        </div>

        <button
          onClick={saveOfferConfiguration}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 border border-neutral-800 text-[#FFB000] hover:bg-neutral-800 text-xs font-mono uppercase tracking-widest rounded-lg transition-all"
        >
          {saving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          {saving ? 'Writing Parameters...' : 'Commit Layout to DB'}
        </button>
      </div>

      {message && (
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-[#FFB000] flex items-center gap-2">
          <CheckCircle size={14} /> {message}
        </div>
      )}

      {/* 4-Slot Linear Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((slot, index) => (
          <div key={slot.id} className="bg-[#080808] border border-neutral-900 rounded-xl p-5 flex flex-col justify-between space-y-6">
            
            {/* Slot Header Metadata */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="text-xs font-mono font-bold text-[#FFB000] uppercase tracking-wider">
                Slot {slot.id.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                {slot.alignment}
              </span>
            </div>

            {/* Simulated Geometric Preview Card */}
            <div className="relative aspect-[3/4] w-full rounded-lg bg-neutral-950 border border-neutral-900 overflow-hidden group flex flex-col items-center justify-center p-4">
              {slot.img ? (
                <>
                  <img src={slot.img} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </>
              ) : (
                <Layers className="text-neutral-800 mb-2" size={28} />
              )}
              
              {/* Dynamic Badging Emulation Overlay */}
              <div className="relative z-10 text-center space-y-2 w-full px-2">
                <span className="inline-block bg-white text-black text-sm w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mx-auto font-mono">
                  {slot.icon}
                </span>
                <p className="text-sm font-serif font-light text-white tracking-wide truncate">
                  {slot.name || 'Unassigned Slot'}
                </p>
              </div>
            </div>

            {/* Parameter Adjustment Elements */}
            <div className="space-y-4 font-mono text-[11px]">
              
              {/* Database Reference Dropdown Selector */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] text-neutral-500 uppercase tracking-wider">Link Database Item</label>
                <select
                  value={slot.menuItemId}
                  onChange={(e) => handleMenuSelect(slot.id, e.target.value)}
                  className="bg-[#040404] border border-neutral-900 rounded px-3 py-2 text-neutral-300 text-xs focus:outline-none focus:border-[#FFB000]"
                >
                  <option value="">-- Choose From Menu Pool --</option>
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>
                      [{item.category}] {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Overriding Display Title Text */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] text-neutral-500 uppercase tracking-wider">Override Title Label</label>
                <input
                  type="text"
                  value={slot.name}
                  onChange={(e) => handleCustomTextChange(slot.id, 'name', e.target.value)}
                  placeholder="Custom Display Name"
                  className="bg-[#040404] border border-neutral-900 rounded px-3 py-2 text-neutral-300 text-xs focus:outline-none focus:border-[#FFB000]"
                />
              </div>

              {/* Visual Badge Icon Grid Selector */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Overlay Badge Badge Symbol</label>
                <div className="grid grid-cols-6 gap-1 bg-[#040404] p-2 border border-neutral-900 rounded">
                  {presetEmojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleCustomTextChange(slot.id, 'icon', emoji)}
                      className={`p-1.5 text-center text-sm rounded hover:bg-neutral-900 transition-colors ${
                        slot.icon === emoji ? 'bg-neutral-800 border border-neutral-700' : 'opacity-60'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOfferEditor;