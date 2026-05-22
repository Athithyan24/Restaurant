import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Flat menu dataset matching the structure and categories perfectly
const menuData = [
  // --- Main Dishes ---
  { id: 1, name: "Masala Fried Egg Croissant", price: "₹345", category: "Main Dish", diet: "non-veg", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Chole Bhature Tacos", price: "₹380", category: "Main Dish", diet: "veg", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Paneer Bhurji Benedict", price: "₹410", category: "Main Dish", diet: "veg", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Kheema Ghotala Pav", price: "₹450", category: "Main Dish", diet: "non-veg", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Butter Chicken Lasagna", price: "₹545", category: "Main Dish", diet: "non-veg", img: "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Paneer Pasanda Risotto", price: "₹495", category: "Main Dish", diet: "veg", img: "https://images.unsplash.com/photo-1595295333158-4742f28fbe85?auto=format&fit=crop&w=400&q=80" },
  { id: 7, name: "Awadhi Dum Biryani", price: "₹625", category: "Main Dish", diet: "non-veg", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80" },
  { id: 8, name: "Nalli Nihari with Taftan", price: "₹695", category: "Main Dish", diet: "non-veg", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80" },

  // --- Side Dishes ---
  { id: 9, name: "Gunpowder Hash Browns", price: "₹220", category: "Side Dish", diet: "veg", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80" },
  { id: 10, name: "Maska Pav Strips", price: "₹180", category: "Side Dish", diet: "veg", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },
  { id: 11, name: "Truffle Garlic Naan", price: "₹160", category: "Side Dish", diet: "veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80" },
  { id: 12, name: "Dal Makhani Fondue", price: "₹240", category: "Side Dish", diet: "veg", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80" },
  { id: 13, name: "Khamiri Roti Basket", price: "₹180", category: "Side Dish", diet: "veg", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },

  // --- Snacks ---
  { id: 14, name: "Paneer Tikka Croquettes", price: "₹320", category: "Snacks", diet: "veg", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80" },
  { id: 15, name: "Mutton Samosa Pockets", price: "₹350", category: "Snacks", diet: "non-veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80" },
  { id: 16, name: "Chicken Lollipop", price: "₹395", category: "Snacks", diet: "non-veg", img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80" },
  { id: 17, name: "Dahi Puri Chaat Bombs", price: "₹220", category: "Snacks", diet: "veg", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80" },
  { id: 18, name: "Mutton Galouti Kebab", price: "₹520", category: "Snacks", diet: "non-veg", img: "https://images.unsplash.com/photo-1529692236671-f1f6e994a52c?auto=format&fit=crop&w=400&q=80" },

  // --- Drinks & Juices ---
  { id: 19, name: "Tandoori Chai", price: "₹145", category: "Drinks & Juices", diet: "veg", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80" },
  { id: 20, name: "Filter Coffee", price: "₹165", category: "Drinks & Juices", diet: "veg", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
  { id: 21, name: "Alphonso Mango Nectar", price: "₹295", category: "Drinks & Juices", diet: "veg", img: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=400&q=80" },
  { id: 22, name: "Classic Mango Lassi", price: "₹195", category: "Drinks & Juices", diet: "veg", img: "https://images.unsplash.com/photo-1534706936160-d5ee67737249?auto=format&fit=crop&w=400&q=80" },
  { id: 23, name: "Saffron Smoked Drink", price: "₹350", category: "Drinks & Juices", diet: "veg", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80" },

  // --- Soups ---
  { id: 24, name: "Tamatar Dhaniya Shorba", price: "₹210", category: "Soups", diet: "veg", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
  { id: 25, name: "Classic Mulligatawny", price: "₹260", category: "Soups", diet: "veg", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80" },
  { id: 26, name: "Chicken Manchow Soup", price: "₹270", category: "Soups", diet: "non-veg", img: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=400&q=80" },

  // --- Fast Foods ---
  { id: 27, name: "Bombay Masala Toastie", price: "₹290", category: "Fast Foods", diet: "veg", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80" },
  { id: 28, name: "Schezwan Chicken Noodles", price: "₹385", category: "Fast Foods", diet: "non-veg", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80" },
  { id: 29, name: "Peri-Peri Tikka Pizza", price: "₹560", category: "Fast Foods", diet: "non-veg", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80" },
  { id: 30, name: "Double Cheese Burger", price: "₹380", category: "Fast Foods", diet: "veg", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" }
];

const MenuDiscoverMeals = () => {
  // Flat selection categories mirroring HomeMenu.jsx perfectly
  const categories = ['Full Menu', 'Main Dish', 'Side Dish', 'Snacks', 'Drinks & Juices', 'Soups', 'Fast Foods'];
  const [activeTab, setActiveTab] = useState('Full Menu');

  // Filtering condition extracted directly from HomeMenu.jsx
  const filteredItems = activeTab === 'Full Menu' 
    ? menuData 
    : menuData.filter(item => item.category === activeTab);

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* --- Top Typography Subtitle --- */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-yellow-500 uppercase tracking-[0.25em] text-xs font-serif font-bold mb-6"
        >
          This is what we serve you
        </motion.p>

        {/* --- Main Content Header Title --- */}
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-clash text-center tracking-tight mb-12 max-w-3xl leading-tight"
        >
          Discover the perfect meal for every taste
        </motion.h2>

        {/* --- Flat Single Row Pill Bar System --- */}
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

        {/* --- Perfect Top-Down Circular Showcase Grid --- */}
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
                {/* Image Border Wrapper Container with Hover Tilt Mechanics */}
                <div className="relative w-full aspect-square max-w-[145px] sm:max-w-[224px] rounded-full overflow-hidden p-1 border border-white/10 bg-gradient-to-b from-white/5 to-transparent group-hover:border-yellow-500/40 transition-colors duration-500 shadow-xl mb-4 sm:mb-6">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 group-hover:rotate-[15deg] transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-full group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Text Line containing Name and Premium Leaf Tag */}
                <div className="flex items-center gap-1.5 mb-1 sm:mb-2 justify-center px-1">
                  <h3 className="text-base sm:text-xl font-serif text-gray-200 group-hover:text-white transition-colors duration-300 truncate max-w-[120px] sm:max-w-none">
                    {item.name}
                  </h3>
                  
                  {item.diet === 'veg' && (
                    <span className="text-emerald-500 flex items-center justify-center bg-emerald-500/10 p-0.5 sm:p-1 rounded-full scale-75 sm:scale-90 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 8C14.24 8 12.03 9.94 11.18 12.54C12.44 11.23 14.19 10.5 16 10.5C19.58 10.5 22.5 13.42 22.5 17+C22.5 17.28 22.48 17.55 22.44 17.82C21.84 14.5 18.92 12 15.5 12C12.08 12 9.16 14.5 8.56 17.82C8.52 17.55 8.5 17.28 8.5 17C8.5 12.31 12.31 8.5 17 8ZM1.5 17C1.5 13.42 4.42 10.5 8 10.5C8.75 10.5 9.47 10.63 10.14 10.86C9.11 8.06 6.43 6 3.25 6C3.11 6 2.97 6.01 2.83 6.02C4.1 9.45 7.45 12 11.25 12C7.45 12 4.1 14.55 2.83 17.98C2.97 17.99 3.11 18 3.25 18C6.83 18 9.75 15.08 9.75 11.5" />
                      </svg>
                    </span>
                  )}
                </div>

                {/* Price Display */}
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

export default MenuDiscoverMeals;