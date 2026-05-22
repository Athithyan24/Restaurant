import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeMenu = () => {
  const categories = ['Full Menu', 'Courses', 'Desserts', 'Starters', 'Appetizers'];
  const [activeTab, setActiveTab] = useState('Full Menu');

  // Premium mock data matching the top-down aesthetic
  const menuItems = [
    {
      id: 1,
      name: 'Mashed potatoes',
      category: 'Courses',
      price: 'USD 10.00',
      img: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 2,
      name: 'Truffle fries',
      category: 'Starters',
      price: 'USD 42.00',
      img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 3,
      name: 'Caesar salad',
      category: 'Appetizers',
      price: 'USD 30.00',
      img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 4,
      name: 'Mushroom soup',
      category: 'Starters',
      price: 'USD 70.00',
      img: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 5,
      name: 'Classic Crème',
      category: 'Desserts',
      price: 'USD 15.00',
      img: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 6,
      name: 'Berry Waffles',
      category: 'Desserts',
      price: 'USD 18.00',
      img: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 7,
      name: 'Chocolate Fondant',
      category: 'Desserts',
      price: 'USD 22.00',
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 8,
      name: 'Strawberry Tart',
      category: 'Desserts',
      price: 'USD 19.00',
      img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    // --- 20 NEW ADDITIONS UNTIL ID: 28 ---
    {
      id: 9,
      name: 'Wagyu Ribeye Steak',
      category: 'Courses',
      price: 'USD 95.00',
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 10,
      name: 'Pan-Seared Salmon',
      category: 'Courses',
      price: 'USD 48.00',
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 11,
      name: 'Truffle Mushroom Risotto',
      category: 'Courses',
      price: 'USD 36.00',
      img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 12,
      name: 'Lobster Ravioli',
      category: 'Courses',
      price: 'USD 54.00',
      img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 13,
      name: 'Slow-Cooked Lamb Shank',
      category: 'Courses',
      price: 'USD 58.00',
      img: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 14,
      name: 'Golden Crispy Calamari',
      category: 'Starters',
      price: 'USD 26.00',
      img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 15,
      name: 'Seared Foie Gras',
      category: 'Starters',
      price: 'USD 62.00',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 16,
      name: 'Artisanal Cheese Board',
      category: 'Starters',
      price: 'USD 38.00',
      img: 'https://images.unsplash.com/photo-1631709497146-a239ef373cf5?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 17,
      name: 'Spiced Chicken Yakitori',
      category: 'Starters',
      price: 'USD 24.00',
      img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 18,
      name: 'Burrata & Heirloom Tomato',
      category: 'Appetizers',
      price: 'USD 28.00',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 19,
      name: 'Avocado Tartare',
      category: 'Appetizers',
      price: 'USD 22.00',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 20,
      name: 'Wagyu Beef Sliders',
      category: 'Appetizers',
      price: 'USD 34.00',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 21,
      name: 'Garlic Butter Prawns',
      category: 'Appetizers',
      price: 'USD 32.00',
      img: 'https://images.unsplash.com/photo-1559742811-82428b492238?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 22,
      name: 'Pan-Seared Gyoza',
      category: 'Appetizers',
      price: 'USD 19.00',
      img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 23,
      name: 'Matcha Lava Cake',
      category: 'Desserts',
      price: 'USD 18.00',
      img: 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 24,
      name: 'Saffron Mango Panna Cotta',
      category: 'Desserts',
      price: 'USD 16.00',
      img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 25,
      name: 'Madagascar Vanilla Bean Brûlée',
      category: 'Desserts',
      price: 'USD 17.00',
      img: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 26,
      name: 'Gourmet Macaron Assortment',
      category: 'Desserts',
      price: 'USD 21.00',
      img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=400&auto=format&fit=crop',
      hasLeaf: false,
    },
    {
      id: 27,
      name: 'Truffle Mac & Cheese',
      category: 'Starters',
      price: 'USD 29.00',
      img: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    },
    {
      id: 28,
      name: 'Roasted Asparagus Spears',
      category: 'Appetizers',
      price: 'USD 15.00',
      img: 'https://images.unsplash.com/photo-1515467837915-15c477732a61?q=80&w=400&auto=format&fit=crop',
      hasLeaf: true,
    }
  ];

  const filteredItems = activeTab === 'Full Menu' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeTab);

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-yellow-500 uppercase tracking-[0.25em] text-xs font-serif font-bold mb-6"
        >
          This is what we serve you
        </motion.p>

        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-clash text-center tracking-tight mb-12 max-w-3xl leading-tight"
        >
          Discover the perfect meal for every taste
        </motion.h2>

        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-16 sm:mb-20 bg-white/5 p-1.5 sm:p-2 rounded-full border border-white/10 max-w-fit">
          {categories.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-serif text-xs sm:text-sm font-medium transition-colors duration-300 outline-none select-none ${
                  isActive ? 'text-yellow-500 font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-neutral-950 border border-yellow-500/20 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                {tab}
              </button>
            );
          })}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-12 sm:gap-y-16 w-full justify-items-center"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                viewport={{ once: false, amount: 0.1 }}
                key={item.id}
                className="flex flex-col items-center text-center group cursor-pointer w-full"
              >
                <div className="relative w-full aspect-square max-w-[145px] sm:max-w-[224px] rounded-full overflow-hidden p-1 border border-white/10 bg-gradient-to-b from-white/5 to-transparent group-hover:border-yellow-500/40 transition-colors duration-500 shadow-xl mb-4 sm:mb-6">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 group-hover:rotate-[15deg] transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-full group-hover:bg-transparent transition-colors duration-500" />
                </div>

                <div className="flex items-center gap-1.5 mb-1 sm:mb-2 justify-center px-1">
                  <h3 className="text-base sm:text-xl font-serif text-gray-200 group-hover:text-white transition-colors duration-300 truncate max-w-[120px] sm:max-w-none">
                    {item.name}
                  </h3>
                  
                  {item.hasLeaf && (
                    <span className="text-emerald-500 flex items-center justify-center bg-emerald-500/10 p-0.5 sm:p-1 rounded-full scale-75 sm:scale-90 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 8C14.24 8 12.03 9.94 11.18 12.54C12.44 11.23 14.19 10.5 16 10.5C19.58 10.5 22.5 13.42 22.5 17C22.5 17.28 22.48 17.55 22.44 17.82C21.84 14.5 18.92 12 15.5 12C12.08 12 9.16 14.5 8.56 17.82C8.52 17.55 8.5 17.28 8.5 17C8.5 12.31 12.31 8.5 17 8ZM1.5 17C1.5 13.42 4.42 10.5 8 10.5C8.75 10.5 9.47 10.63 10.14 10.86C9.11 8.06 6.43 6 3.25 6C3.11 6 2.97 6.01 2.83 6.02C4.1 9.45 7.45 12 11.25 12C7.45 12 4.1 14.55 2.83 17.98C2.97 17.99 3.11 18 3.25 18C6.83 18 9.75 15.08 9.75 11.5" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="font-serif text-xs sm:text-base text-gray-400 font-medium group-hover:text-yellow-500 transition-colors duration-300">
                  {item.price}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default HomeMenu;