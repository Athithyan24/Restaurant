import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const AdminMenuManager = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [filterCategory, setFilterCategory] = useState('All'); 

  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    price: '', 
    description: '', 
    dietary: 'None',
    image: '',
    isCombo: false,
    // MODIFIED: Combo items now hold an advanced object state
    comboItems: [{ name: '', description: '', image: '' }] 
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setCategories(json.data);
        if (!editingId) {
          setFormData(prev => ({ ...prev, category: json.data[0].categoryName }));
        }
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      const json = await res.json();
      if (json.success) {
        setMenuItems(json.data);
      }
    } catch (err) {
      console.error("Failed to load live menu items", err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // MODIFIED: Handlers for advanced Combo items list
  const handleComboChange = (index, field, value) => {
    const newCombo = [...formData.comboItems];
    newCombo[index][field] = value;
    setFormData({ ...formData, comboItems: newCombo });
  };
  
  const addComboItem = () => {
    setFormData({ ...formData, comboItems: [...formData.comboItems, { name: '', description: '', image: '' }] });
  };

  const removeComboItem = (index) => {
    const newCombo = formData.comboItems.filter((_, i) => i !== index);
    setFormData({ ...formData, comboItems: newCombo });
  };

  // Standard main image upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('location_secure_token');
      const data = new FormData();
      data.append('image', file);
      const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: data });
      const json = await res.json();
      if (json.success || json.url) setFormData(prev => ({ ...prev, image: json.url || json.data?.url }));
      else alert(json.message || "File parsing error.");
    } catch (err) {
      alert("Error pushing file to server upload logic.");
    } finally {
      setUploading(false);
    }
  };

  // NEW: Dedicated upload handler for individual Combo Items
  const handleComboImageUpload = async (index, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('location_secure_token');
      const data = new FormData();
      data.append('image', file);
      const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: data });
      const json = await res.json();
      if (json.success || json.url) {
        handleComboChange(index, 'image', json.url || json.data?.url);
      } else {
        alert(json.message || "File parsing error.");
      }
    } catch (err) {
      alert("Error uploading combo item image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('location_secure_token');
      const url = editingId ? `${API_BASE_URL}/menu/${editingId}` : `${API_BASE_URL}/menu`;
      const method = editingId ? 'PUT' : 'POST';

      // Ensure empty combo items aren't pushed to the database
      const submitData = {
        ...formData,
        comboItems: formData.isCombo ? formData.comboItems.filter(i => i.name.trim() !== '') : []
      };

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(submitData)
      });
      const json = await res.json();

      if (json.success) {
        alert(editingId ? `Successfully updated ${formData.name}!` : `Added ${formData.name} to menu!`);
        resetForm();
        fetchMenuItems(); 
      } else {
        alert(json.message);
      }
    } catch (err) {
      alert("Error processing dish modifications.");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      dietary: item.dietary || 'None',
      image: item.image || item.img || '',
      isCombo: item.isCombo || false,
      comboItems: item.comboItems?.length ? item.comboItems : [{ name: '', description: '', image: '' }]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the menu?`)) return;
    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/menu/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        if (editingId === id) resetForm();
        fetchMenuItems();
      } else {
        alert(json.message || "Failed deletion routine.");
      }
    } catch (err) {
      alert("Server error running deletion routing parameters.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', category: categories[0]?.categoryName || '', price: '', description: '', dietary: 'None', image: '',
      isCombo: false, comboItems: [{ name: '', description: '', image: '' }]
    });
  };

  const filteredMenuItems = filterCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto text-white font-sans space-y-16">
      
      {/* SECTION 1: Dynamic Interactive Editor Form */}
      <div>
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-serif tracking-wide text-[#FFB000] mb-2 font-bold">
              {editingId ? "Update Dish Configuration" : "Menu Engineering"}
            </h1>
            <p className="text-gray-500 text-xs tracking-[0.2em] uppercase font-medium">
              {editingId ? "Modifying existing dish assets inside database parameters" : "Inject unique culinary dishes into the live database"}
            </p>
          </div>
          {editingId && (
            <button 
              type="button" onClick={resetForm}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl text-gray-300 transition-all"
            >
              Cancel Edit Mode
            </button>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0D0D0D] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Main Title Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm"
                  placeholder="e.g., Smoked Malabar Prawns or Couple Combo Pack"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing / Custom Values</label>
                <input 
                  type="text" name="price" value={formData.price} onChange={handleChange} required
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm"
                  placeholder="e.g., 450, 450/220, or As per size"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Menu Section Category Mapping</label>
                <select name="category" value={formData.category} onChange={handleChange} required
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FFB000] text-sm text-white transition-colors h-[46px]">
                  {categories.length === 0 ? <option value="">Please create a Category first!</option> : categories.map(cat => <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>)}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dietary Specifications</label>
                <select name="dietary" value={formData.dietary} onChange={handleChange}
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FFB000] text-sm text-white transition-colors h-[46px]">
                  <option value="None">None (Standard)</option><option value="Vegetarian">Vegetarian</option><option value="Vegan">Vegan</option><option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              {/* ADVANCED COMBO PACK CONFIGURATOR */}
              <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input 
                    type="checkbox" name="isCombo" 
                    checked={formData.isCombo} onChange={handleChange} 
                    className="w-5 h-5 accent-[#FFB000] cursor-pointer" 
                  />
                  <span className="text-sm font-bold uppercase tracking-widest text-[#FFB000]">Configure as a Combo Pack</span>
                </label>
                
                {formData.isCombo && (
                  <div className="space-y-4 pl-4 sm:pl-8 border-l-2 border-[#FFB000]/20">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Detailed Sub-Items in Combo</label>
                      <button type="button" onClick={addComboItem} className="text-[#FFB000] hover:text-white transition-colors text-xs font-bold px-3 py-1 bg-[#FFB000]/10 rounded-lg">
                        + ADD NEW ITEM
                      </button>
                    </div>
                    
                    {formData.comboItems.map((cItem, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-3 relative">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-300">Combo Item {idx + 1}</span>
                          {formData.comboItems.length > 1 && (
                            <button type="button" onClick={() => removeComboItem(idx)} className="text-red-500 hover:text-red-400 text-[10px] uppercase font-bold tracking-wider">
                              Remove Item
                            </button>
                          )}
                        </div>
                        
                        <input 
                          type="text" value={cItem.name} 
                          onChange={(e) => handleComboChange(idx, 'name', e.target.value)} 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFB000] text-sm" 
                          placeholder={`Item ${idx + 1} Name (e.g., French Fries)`} required={formData.isCombo} 
                        />
                        
                        <textarea 
                          value={cItem.description} 
                          onChange={(e) => handleComboChange(idx, 'description', e.target.value)} 
                          className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFB000] text-sm resize-none" 
                          placeholder={`Item ${idx + 1} Description...`} required={formData.isCombo} rows="2"
                        />

                        {/* Individual Combo Item Image Upload */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-white/5 bg-black/60 shrink-0 overflow-hidden flex items-center justify-center">
                            {cItem.image ? <img src={cItem.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] text-gray-500">IMG</span>}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" value={cItem.image} onChange={(e) => handleComboChange(idx, 'image', e.target.value)}
                              className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB000]"
                              placeholder="Image URL..." 
                            />
                            <label className="shrink-0 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-gray-300 cursor-pointer transition-colors flex items-center">
                              {uploading ? '...' : 'UPLOAD'}
                              <input type="file" accept="image/*" onChange={(e) => handleComboImageUpload(idx, e.target.files[0])} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Main Header Dish Image Upload */}
            <div className="flex flex-col space-y-2 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Main Representation Image Card (For standard dishes or combo cover)</label>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-20 h-20 rounded-xl border border-white/5 bg-black/60 flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-600">
                  {formData.image ? <img src={formData.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = ""; }} /> : <span className="text-[10px]">IMG</span>}
                </div>
                <div className="w-full flex-1 space-y-2">
                  <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFB000]" placeholder="Paste explicit recipe image CDN url link..." />
                  <label className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-[#FFB000]/40 rounded-xl py-2.5 px-4 text-xs font-bold tracking-wider text-gray-400 hover:text-white cursor-pointer bg-white/[0.01] transition-all">
                    {uploading ? 'PROCESSING UPLOAD...' : 'PICK IMAGE FILE FROM LOCAL DEVICE'}
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Main Descriptive Summary</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows="3"
                placeholder="Overall description of the meal or combo..."
                className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#FFB000] text-black py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 shadow-md">
              {editingId ? "Update Live Menu Dish" : "Publish New Menu Dish"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* SECTION 2: Interactive Database List Registry */}
      <div className="pt-4">
        <div className="mb-6">
          <h2 className="text-2xl font-serif tracking-wide text-white font-bold">Active Live Menu Registry</h2>
        </div>

        {menuItems.length > 0 && (
          <div className="flex overflow-x-auto whitespace-nowrap items-center gap-2 mb-6 scrollbar-none pb-2">
            <button onClick={() => setFilterCategory('All')} className={`shrink-0 px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${filterCategory === 'All' ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'}`}>All Items</button>
            {categories.map((cat) => (
              <button key={cat._id} onClick={() => setFilterCategory(cat.categoryName)} className={`shrink-0 px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${filterCategory === cat.categoryName ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'}`}>{cat.categoryName}</button>
            ))}
          </div>
        )}

        <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {filteredMenuItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm tracking-wide">No dynamic items found inside the active schema database.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <th className="py-4 px-6">Image</th><th className="py-4 px-4">Title & Details</th><th className="py-4 px-4">Category</th><th className="py-4 px-4">Price</th><th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredMenuItems.map((item) => {
                      const id = item._id || item.id;
                      const hasLetters = /[a-zA-Z]/.test(String(item.price));
                      const displayPrice = hasLetters ? item.price : (String(item.price).includes('₹') ? item.price : `₹${item.price}`);

                      return (
                        <motion.tr key={id} layout exit={{ opacity: 0 }} className={`hover:bg-white/[0.01] transition-colors group ${editingId === id ? 'bg-[#FFB000]/5' : ''}`}>
                          <td className="py-4 px-6 shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-black">
                              <img src={item.image || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=150&q=80"} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>

                          <td className="py-4 px-4 max-w-[280px]">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-medium text-white tracking-wide text-base block truncate">{item.name}</span>
                              {item.isCombo && <span className="bg-[#FFB000] text-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0">Combo</span>}
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                            
                            {/* ADVANCED TABLE DISPLAY FOR COMBOS */}
                            {item.isCombo && item.comboItems?.length > 0 && (
                              <div className="flex flex-col gap-2 mt-2 border-t border-white/5 pt-2">
                                {item.comboItems.map((c, i) => (
                                  <div key={i} className="flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded border border-white/5">
                                    {c.image && <img src={c.image} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />}
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[10px] text-gray-200 block truncate">{c.name}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4"><span className="px-3 py-1 bg-white/5 text-gray-400 border border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest">{item.category}</span></td>
                          <td className="py-4 px-4 font-mono text-[#FFB000] font-bold text-sm">{displayPrice}</td>

                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex gap-3">
                              <button onClick={() => handleEditClick(item)} className="px-3 py-1.5 bg-white/5 hover:bg-[#FFB000] text-gray-300 hover:text-black rounded-xl text-xs font-bold uppercase">Edit</button>
                              <button onClick={() => handleDeleteClick(id, item.name)} className="px-3 py-1.5 bg-red-500/5 hover:bg-red-600 text-red-400 hover:text-white rounded-xl text-xs font-bold uppercase">Delete</button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuManager;