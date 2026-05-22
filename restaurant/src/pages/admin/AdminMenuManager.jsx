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
    price: '', // Now accepts strings
    description: '', 
    dietary: 'None',
    image: '' 
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('location_secure_token');
      const data = new FormData();
      data.append('image', file);

      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      const json = await res.json();
      
      if (json.success || json.url) {
        const targetUrl = json.url || json.data?.url;
        setFormData(prev => ({ ...prev, image: targetUrl }));
      } else {
        alert(json.message || "File parsing error.");
      }
    } catch (err) {
      alert("Error pushing file to server upload logic.");
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

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
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
      image: item.image || item.img || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the menu?`)) return;
    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
      name: '', 
      category: categories[0]?.categoryName || '', 
      price: '', 
      description: '', 
      dietary: 'None', 
      image: ''
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
              type="button" 
              onClick={resetForm}
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dish Title Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm"
                  placeholder="e.g., Smoked Malabar Prawns"
                />
              </div>

              {/* CRITICAL CHANGE: Price Input is now type="text" */}
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
                  {categories.length === 0 ? (
                    <option value="">Please create a Category first!</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dietary Specifications</label>
                <select name="dietary" value={formData.dietary} onChange={handleChange}
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FFB000] text-sm text-white transition-colors h-[46px]">
                  <option value="None">None (Standard)</option>
                  <option value="Vegetarian">Vegetarian (Green Marker)</option>
                  <option value="Vegan">Vegan (Plant Based)</option>
                  <option value="Non-Vegetarian">Non-Vegetarian (Red Marker)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dish Representation Image Card</label>
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                
                <div className="w-20 h-20 rounded-xl border border-white/5 bg-black/60 flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-600">
                  {formData.image ? (
                    <img src={formData.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = ""; }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008H12V8.25Z" />
                    </svg>
                  )}
                </div>

                <div className="w-full flex-1 space-y-2">
                  <input 
                    type="text" name="image" value={formData.image} onChange={handleChange}
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFB000]"
                    placeholder="Paste explicit recipe image CDN url link..." 
                  />
                  
                  <label className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-[#FFB000]/40 rounded-xl py-2.5 px-4 text-xs font-bold tracking-wider text-gray-400 hover:text-white cursor-pointer bg-white/[0.01] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 3 3m-3-3v12" />
                    </svg>
                    {uploading ? 'PROCESSING UPLOAD...' : 'PICK IMAGE FILE FROM LOCAL DEVICE'}
                    <input 
                      type="file" accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Dish Descriptive Components</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows="3"
                placeholder="Detail ingredients, culinary techniques used, flavor profiling nodes, and potential allergen warnings..."
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
          <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-0.5">Manage live website elements, track sections, delete, or load parameters</p>
        </div>

        {menuItems.length > 0 && (
          <div className="flex overflow-x-auto whitespace-nowrap items-center gap-2 mb-6 scrollbar-none pb-2">
            <button
              onClick={() => setFilterCategory('All')}
              className={`shrink-0 px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${
                filterCategory === 'All' 
                  ? 'bg-[#FFB000] text-black border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.2)]' 
                  : 'bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setFilterCategory(cat.categoryName)}
                className={`shrink-0 px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border ${
                  filterCategory === cat.categoryName 
                    ? 'bg-[#FFB000] text-black border-[#FFB000] shadow-[0_0_15px_rgba(255,176,0,0.2)]' 
                    : 'bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>
        )}

        <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {filteredMenuItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm tracking-wide">
              {menuItems.length === 0 
                ? "No dynamic items found inside the active schema database. Use the manager module above to construct elements."
                : `No dishes found under the "${filterCategory}" category.`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <th className="py-4 px-6">Dish Representation</th>
                    <th className="py-4 px-4">Title & Description</th>
                    <th className="py-4 px-4">Section mapping</th>
                    <th className="py-4 px-4">Pricing</th>
                    <th className="py-4 px-6 text-right">Database Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredMenuItems.map((item) => {
                      const id = item._id || item.id;
                      const imageSource = item.image || item.img || "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=150&q=80";
                      
                      // Smart formatter: Only prepend ₹ if it's numbers/symbols, not if it contains letters like "As per size"
                      const hasLetters = /[a-zA-Z]/.test(String(item.price));
                      const displayPrice = hasLetters ? item.price : (String(item.price).includes('₹') ? item.price : `₹${item.price}`);

                      return (
                        <motion.tr 
                          key={id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`hover:bg-white/[0.01] transition-colors group ${editingId === id ? 'bg-[#FFB000]/5' : ''}`}
                        >
                          <td className="py-4 px-6 shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-[#FFB000] transition-colors bg-black">
                              <img src={imageSource} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>

                          <td className="py-4 px-4 max-w-[220px]">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-medium text-white tracking-wide text-base block truncate">{item.name}</span>
                              {item.dietary && item.dietary !== 'None' && (
                                <span className={`text-[8px] tracking-widest uppercase font-extrabold px-1.5 py-0.5 rounded ${
                                  item.dietary === 'Vegetarian' || item.dietary === 'Vegan'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {item.dietary}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{item.description || 'No descriptive nodes provided.'}</p>
                          </td>

                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-white/5 text-gray-400 border border-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest font-serif">
                              {item.category}
                            </span>
                          </td>

                          {/* SMART PRICE DISPLAY MODIFICATION */}
                          <td className="py-4 px-4 font-mono text-[#FFB000] font-bold text-sm">
                            {displayPrice}
                          </td>

                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <div className="inline-flex gap-3">
                              <button
                                type="button"
                                onClick={() => handleEditClick(item)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-[#FFB000] text-gray-300 hover:text-black border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(id, item.name)}
                                className="px-3 py-1.5 bg-red-500/5 hover:bg-red-600 border border-red-500/10 text-red-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Delete
                              </button>
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