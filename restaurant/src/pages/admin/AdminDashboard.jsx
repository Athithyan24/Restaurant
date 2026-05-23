import React, { useState } from 'react';
import AdminMenuManager from './AdminMenuManager';
import AdminCategoryManager from './AdminCategoryManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'categories'


  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans selection:bg-[#FFB000] selection:text-black">
      {/* Top Premium Navigation Header */}
      <header className="border-b border-white/5 bg-[#0A0A0A] px-6 py-5 sticky top-0 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand/Identity Title */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-serif font-bold tracking-wide text-white flex items-center justify-center md:justify-start gap-2">
              <span className="text-[#FFB000]">✦</span> Culinary Control Panel
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-medium">
              Database Administration Engine
            </p>
          </div>

          {/* Interactive Navigation Switcher */}
          <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                activeTab === 'menu'
                  ? 'bg-[#FFB000] text-black shadow-[0_4px_20px_rgba(255,176,0,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Manage Dishes
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                activeTab === 'categories'
                  ? 'bg-[#FFB000] text-black shadow-[0_4px_20px_rgba(255,176,0,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.674.509a11.94 11.94 0 0 0 5.33-5.33c.363-.894.19-1.975-.509-2.674l-9.581-9.581A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              Manage Categories
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Render Viewport */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {activeTab === 'menu' ? <AdminMenuManager /> : <AdminCategoryManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;