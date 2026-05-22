import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

const AdminCategoryManager = () => {
  const [existingCategories, setExistingCategories] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    images: [''] 
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const json = await res.json();
        if (json.success) setExistingCategories(json.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
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
        handleImageChange(index, targetUrl);
      } else {
        alert(json.message || "Upload failed from backend routing.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking file stream to server endpoint.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const addImageField = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const removeImageField = (index) => {
    if (formData.images.length === 1) return;
    const newImages = formData.images.filter((_, idx) => idx !== index);
    setFormData({ ...formData, images: newImages });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('location_secure_token');
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        alert(`Successfully saved category: ${formData.categoryName}`);
        window.location.reload();
      }
    } catch (err) {
      alert("Error saving category layout");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white font-sans">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-serif tracking-wide text-[#FFB000] mb-2 font-bold">Category Aesthetics</h1>
        <p className="text-gray-500 text-xs tracking-[0.2em] uppercase font-medium">Design structural chunks and image spotlight carousels</p>
      </div>

      {existingCategories.length > 0 && (
        <div className="mb-10 bg-[#0A0A0A] p-5 rounded-2xl border border-white/5">
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.25em] font-bold block mb-3">Live Active Sub-Collections</span>
          <div className="flex flex-wrap gap-2.5">
            {existingCategories.map(c => (
              <span 
                key={c._id} 
                onClick={() => setFormData({ categoryName: c.categoryName, description: c.description, images: c.images.length ? c.images : [''] })} 
                className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-xs font-medium cursor-pointer hover:border-[#FFB000] hover:bg-white/5 transition-all duration-300"
              >
                {c.categoryName}
              </span>
            ))}
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0D0D0D] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Identifier Name</label>
            <input 
              type="text"
              value={formData.categoryName} 
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm"
              placeholder="e.g., Tandoori Starters"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Section Description (Max 2 lines)</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required rows="2"
              placeholder="Provide a brief artistic narrative describing this specific category cuisine..."
              className="bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#FFB000] transition-colors text-sm resize-none"
            />
          </div>

          {/* Image Chunk System with Dual Selectors */}
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Spotlight Images (5-Item Dynamic Chunks)</label>
              <button type="button" onClick={addImageField} className="text-[#FFB000] hover:text-yellow-400 text-xs font-bold flex items-center gap-1 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Image Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-2xl relative flex flex-col gap-3 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#FFB000] bg-[#FFB000]/10 px-2 py-0.5 rounded">Slot {idx + 1}</span>
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeImageField(idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.72 0-.34-6M9.25 12h5.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    {/* Tiny Local Thumbnail Preview */}
                    <div className="w-14 h-14 rounded-xl border border-white/5 bg-black/60 flex-shrink-0 overflow-hidden flex items-center justify-center text-gray-600">
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = ""; }} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008H12V8.25Z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Web URL Option */}
                      <input 
                        type="text" 
                        value={img} 
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFB000]"
                        placeholder="Paste network web asset URL link..." 
                      />
                      
                      {/* Native Device File Upload Trigger */}
                      <div className="relative">
                        <label className="w-full flex items-center justify-center gap-1.5 border border-dashed border-white/10 hover:border-[#FFB000]/40 rounded-lg py-1.5 px-3 text-[10px] font-bold tracking-wider text-gray-400 hover:text-white cursor-pointer bg-white/[0.02] transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 3 3m-3-3v12" />
                          </svg>
                          {uploadingIndex === idx ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-[#FFB000] text-black py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 shadow-md">
            Save Category Layout
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminCategoryManager;