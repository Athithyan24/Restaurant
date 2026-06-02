import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Plus, Minus, QrCode, Link as LinkIcon } from 'lucide-react';

const AdminQRGenerator = () => {
  const [tableCount, setTableCount] = useState(15);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Automatically detect your current domain (e.g., http://localhost:5173 or https://your-restaurant.com)
    setBaseUrl(window.location.origin);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Generate an array of numbers from 1 to tableCount
  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  return (
    <div className="bg-[#060606] min-h-screen text-white font-sans p-6 sm:p-10">
      
      {/* ========================================= */}
      {/* 1. SCREEN UI (Hidden during printing) */}
      {/* ========================================= */}
      <div className="max-w-6xl mx-auto print:hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-[#FFB000] font-bold flex items-center gap-3">
              <QrCode size={32} />
              Dine-In QR Generator
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">
              Create and print physical table codes
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="bg-[#FFB000] text-black px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,176,0,0.2)]"
            >
              <Printer size={18} />
              Print QR Sheets
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl mb-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Tables:</div>
            <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden">
              <button 
                onClick={() => setTableCount(Math.max(1, tableCount - 1))}
                className="p-3 hover:bg-white/10 transition-colors text-[#FFB000]"
              >
                <Minus size={16} />
              </button>
              <div className="w-16 text-center font-mono font-bold text-lg">{tableCount}</div>
              <button 
                onClick={() => setTableCount(tableCount + 1)}
                className="p-3 hover:bg-white/10 transition-colors text-[#FFB000]"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full bg-black border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-gray-400">
            <LinkIcon size={16} className="text-[#FFB000]" />
            <span className="truncate">Linking to: <span className="text-white font-mono">{baseUrl}/table/[id]</span></span>
          </div>
        </div>

        {/* Screen Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tables.map(tableNumber => (
            <div key={tableNumber} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-xl mb-4">
                <QRCodeSVG 
                  value={`${baseUrl}/table/${tableNumber}`} 
                  size={120}
                  level={"H"} // High error correction (good for scuffed table stickers)
                />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-1">Table {tableNumber}</h3>
              <p className="text-[9px] text-[#FFB000] uppercase tracking-widest">Scan to Order</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. PRINT UI (Only visible when printing) */}
      {/* ========================================= */}
      <div className="hidden print:block bg-white text-black min-h-screen">
        <div className="print:grid print:grid-cols-3 print:gap-8 print:p-8">
          {tables.map(tableNumber => (
            <div 
              key={tableNumber} 
              className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center break-inside-avoid"
            >
              <h2 className="text-3xl font-serif font-bold mb-2">The Location</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mb-6">Premium Dining</p>
              
              <div className="mb-6">
                <QRCodeSVG 
                  value={`${baseUrl}/table/${tableNumber}`} 
                  size={180}
                  level={"H"}
                />
              </div>
              
              <h3 className="text-4xl font-bold font-sans mb-2">Table {tableNumber}</h3>
              <p className="text-sm font-bold uppercase tracking-widest text-black border-t-2 border-black pt-2 w-full">
                Scan to View Menu & Order
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminQRGenerator;