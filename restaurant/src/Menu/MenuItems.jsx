import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Icons = {
  Breakfast: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M12 2v8" /><path d="M5.2 11.2l1.4 1.4" /><path d="M2 18h20" /><path d="M17.4 12.6l1.4-1.4" /><path d="M22 12h-2" /><path d="M4 12H2" /><path d="M12 10a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4Z" /></svg>
  ),
  Lunch: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
  ),
  Dinner: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
  ),
  MainDish: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M2 18h20" /><path d="M12 2v4" /><path d="M12 22v-4" /><path d="M12 6a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8Z" /></svg>
  ),
  SideDish: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M4 12h16a8 8 0 0 1-16 0Z" /><path d="M12 2v3" /><path d="M16 4v3" /><path d="M8 4v3" /></svg>
  ),
  Snacks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 12.5v.01" /><path d="M12 16v.01" /><path d="M11 11v.01" /></svg>
  ),
  Drinks: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M8 22h8" /><path d="M12 15v7" /><path d="M12 15 2 4.5A2.5 2.5 0 0 1 4 2h16a2.5 2.5 0 0 1 2 2.5L12 15Z" /></svg>
  ),
  Juices: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M4 6h16l-1.5 14a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 6Z" /><path d="M7 2h10" /><path d="M12 2v4" /></svg>
  ),
  Soups: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M4 12h16a8 8 0 0 1-16 0Z" /><path d="M12 2v3" /><path d="M16 2v3" /><path d="M8 2v3" /></svg>
  ),
  FastFoods: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0"><path d="M2.5 12.5a8.5 8.5 0 0 1 19 0Z" /><path d="M2 15.5h20" /><path d="M3.5 18.5h17a1 1 0 0 1 1 1 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2 1 1 0 0 1 1-1Z" /></svg>
  )
};

const categoryFeatureImages = {
  "Main Dish": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  "Side Dish": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
  "Snacks": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "Drinks": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
  "Juices": "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Soups": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "Fast Foods": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
};

const menuData = [
  { id: 1, name: "Masala Fried Egg Croissant", price: "₹345", description: "Flaky Parisian croissant stuffed with a fluffy triple-egg masala omelette, sharp cheddar, and fresh cilantro.", time: "Breakfast", category: "Main Dish", diet: "non-veg" },
  { id: 2, name: "Chole Bhature Tacos", price: "₹380", description: "Mini puffed bhatura shells loaded with spiced Amritsari chickpea curry, pickled onions, and mint yogurt drizzle.", time: "Breakfast", category: "Main Dish", diet: "veg" },
  { id: 3, name: "Paneer Bhurji Benedict", price: "₹410", description: "Toasted English muffins topped with spiced scrambled cottage cheese, wilted spinach, and a saffron-infused hollandaise sauce.", time: "Breakfast", category: "Main Dish", diet: "veg" },
  { id: 4, name: "Kheema Ghotala Pav", price: "₹450", description: "Spiced minced mutton cooked with scrambled eggs, served with butter-toasted local buns.", time: "Breakfast", category: "Main Dish", diet: "non-veg" },

  { id: 5, name: "Gunpowder Hash Brown Bites", price: "₹220", description: "Crisp shredded potato cakes tossed in aromatic South Indian podi (gunpowder) spice mix and ghee.", time: "Breakfast", category: "Side Dish", diet: "veg" },
  { id: 6, name: "Maska Pav Strips", price: "₹180", description: "Toasted local brioche-style bun fingers heavily slathered with salted white butter.", time: "Breakfast", category: "Side Dish", diet: "veg" },
  { id: 7, name: "Spiced Sweet Potato Wedges", price: "₹240", description: "Baked sweet potato wedges dusted with chat masala and roasted cumin powder.", time: "Breakfast", category: "Side Dish", diet: "veg" },
  { id: 8, name: "Chicken Sausage Skewers", price: "₹290", description: "Pan-seared herbed chicken sausages glazed with honey mustard.", time: "Breakfast", category: "Side Dish", diet: "non-veg" },

  { id: 9, name: "Paneer Tikka Croquettes", price: "₹320", description: "Crisp panko-crusted rolls filled with smoky mashed paneer tikka and melted mozzarella.", time: "Breakfast", category: "Snacks", diet: "veg" },
  { id: 10, name: "Baked Idli Fries", price: "₹260", description: "Finger-cut steamed rice cakes deep-fried and served with a tangy tomato-onion relish.", time: "Breakfast", category: "Snacks", diet: "veg" },
  { id: 11, name: "Mutton Samosa Pockets", price: "₹350", description: "Crispy pastry triangles stuffed with spiced minced lamb and green peas.", time: "Breakfast", category: "Snacks", diet: "non-veg" },
  { id: 12, name: "Cheese & Corn Samosa", price: "₹290", description: "Crispy pastry triangles stuffed with sweet corn, green chilies, and gooey process cheese.", time: "Breakfast", category: "Snacks", diet: "veg" },

  { id: 13, name: "Amrut Tandoori Chai", price: "₹145", description: "Clay-pot kulhad chai infused with lemongrass and cardamom, served smoking hot.", time: "Breakfast", category: "Drinks", diet: "veg" },
  { id: 14, name: "Kumbakonam Filter Coffee", price: "₹165", description: "Traditional chicory-blended milk coffee frothed to perfection in brass vessels.", time: "Breakfast", category: "Drinks", diet: "veg" },
  { id: 15, name: "Golden Turmeric Almond Latte", price: "₹245", description: "Espresso shot combined with steamed almond milk, organic wild turmeric, and honey.", time: "Breakfast", category: "Drinks", diet: "veg" },
  { id: 16, name: "Kesar Badam Milk", price: "₹210", description: "Warm milk reduced with saffron threads and crushed premium almonds.", time: "Breakfast", category: "Drinks", diet: "veg" },

  { id: 17, name: "Alphonso Mango Nectar", price: "₹295", description: "Thick, chilled puree of premium handpicked Ratnagiri Alphonso mangoes.", time: "Breakfast", category: "Juices", diet: "veg" },
  { id: 18, name: "Spiced Watermelon Mint", price: "₹225", description: "Freshly pressed cold watermelon juice spiked with black salt and crushed mint leaves.", time: "Breakfast", category: "Juices", diet: "veg" },
  { id: 19, name: "Kala Jamun Wellness Shot", price: "₹195", description: "Antioxidant-rich pure black plum extract with a hint of pink Himalayan salt.", time: "Breakfast", category: "Juices", diet: "veg" },

  { id: 21, name: "Tamatar Dhaniya Shorba", price: "₹210", description: "A light, aromatic Indian soup made from fresh vine tomatoes and roasted coriander stems.", time: "Breakfast", category: "Soups", diet: "veg" },
  { id: 22, name: "Classic Mulligatawny", price: "₹260", description: "Curry-infused spiced lentil and apple soup, a timeless colonial Indian breakfast recipe.", time: "Breakfast", category: "Soups", diet: "veg" },
  { id: 23, name: "Chicken Sweet Corn", price: "₹280", description: "Warm, creamy broth loaded with fresh sweet corn and shredded chicken breast.", time: "Breakfast", category: "Soups", diet: "non-veg" },
  
  { id: 24, name: "Bombay Masala Toastie", price: "₹290", description: "Double-decker sandwich layered with spicy potato mash, beetroot, cucumber, and green chutney.", time: "Breakfast", category: "Fast Foods", diet: "veg" },
  { id: 25, name: "Keema Ghugni Sliders", price: "₹425", description: "Soft buttered slider buns filled with minced curried mutton and yellow peas.", time: "Breakfast", category: "Fast Foods", diet: "non-veg" },
  { id: 26, name: "Chilli Cheese Toast Flambé", price: "₹310", description: "Artisan sourdough loaded with chopped green chilies and cheddar, melted under an open flame.", time: "Breakfast", category: "Fast Foods", diet: "veg" },

  { id: 28, name: "Butter Chicken Lasagna", price: "₹545", description: "Layers of fresh pasta sheet alternating with shredded clay-oven tandoori chicken and rich makhani gravy.", time: "Lunch", category: "Main Dish", diet: "non-veg" },
  { id: 29, name: "Paneer Pasanda Risotto", price: "₹495", description: "Creamy Italian arborio rice slow-cooked with a rich saffron almond paste and paneer cubes.", time: "Lunch", category: "Main Dish", diet: "veg" },
  { id: 30, name: "Awadhi Gosht Dum Biryani", price: "₹625", description: "Fragrant long-grain basmati rice layered with tender mutton, cooked sealed in a clay pot.", time: "Lunch", category: "Main Dish", diet: "non-veg" },
  { id: 31, name: "Soya Chaap Tikka Masala", price: "₹420", description: "Charcoal-grilled soy protein chunks simmered in a luscious spiced tomato gravy.", time: "Lunch", category: "Main Dish", diet: "veg" },

  { id: 32, name: "Truffle Garlic Naan Shards", price: "₹160", description: "Crisp, tandoor-baked flatbread glazed with white truffle oil and minced garlic toppings.", time: "Lunch", category: "Side Dish", diet: "veg" },
  { id: 33, name: "Dal Makhani Fondue Shot", price: "₹240", description: "Slow-simmered black lentils served inside a miniature heated pot with mini garlic kulchas.", time: "Lunch", category: "Side Dish", diet: "veg" },
  { id: 34, name: "Burrani Raita Bowl", price: "₹140", description: "Creamy hung yogurt whipped with roasted garlic pearls and deggi mirch powder.", time: "Lunch", category: "Side Dish", diet: "veg" },
  { id: 35, name: "Masala French Fries", price: "₹180", description: "Crispy crinkle-cut fries generously dusted with spicy peri-peri and chat masala.", time: "Lunch", category: "Side Dish", diet: "veg" },

  { id: 36, name: "Indo-Chinese Chicken Lollipop", price: "₹395", description: "Frenched chicken wings fried crisp and tossed in a fiery ginger, garlic, and celery sauce.", time: "Lunch", category: "Snacks", diet: "non-veg" },
  { id: 37, name: "Crispy Honey Chilli Potatoes", price: "₹310", description: "Sesame-crusted potato batons tossed in a sweet and spicy dark soy glaze.", time: "Lunch", category: "Snacks", diet: "veg" },
  { id: 38, name: "Dahi Puri Chaat Bombs", price: "₹220", description: "Crisp hollow semolina shells filled with potato sprouts, sweet yogurt, and tangy chutneys.", time: "Lunch", category: "Snacks", diet: "veg" },

  { id: 40, name: "Classic Mango Lassi", price: "₹195", description: "Thick, churned yogurt beverage sweetened with premium mango pulp and pistachio slivers.", time: "Lunch", category: "Drinks", diet: "veg" },
  { id: 41, name: "Pudina Masala Chaas", price: "₹135", description: "Refreshing buttermilk infused with roasted cumin, fresh mint, and green chilies.", time: "Lunch", category: "Drinks", diet: "veg" },
  { id: 42, name: "Shahi Thandai Cooler", price: "₹220", description: "Cold milk reduction spiced with crushed almonds, fennel seeds, and real rose petals.", time: "Lunch", category: "Drinks", diet: "veg" },

  { id: 44, name: "Sugarcane Ginger Elixir", price: "₹185", description: "Freshly cold-pressed sugarcane juice balanced with sharp ginger juice and lemon.", time: "Lunch", category: "Juices", diet: "veg" },
  { id: 45, name: "Lychee Chilli Mock-Tail", price: "₹245", description: "Sweet lychee juice blended with a subtle tickle of fresh bird's eye chili.", time: "Lunch", category: "Juices", diet: "veg" },
  { id: 46, name: "Sweet Lime Mosambi Splash", price: "₹210", description: "100% pure extracted Indian sweet lime juice served with zero artificial sugar.", time: "Lunch", category: "Juices", diet: "veg" },

  { id: 47, name: "Veg Hot & Sour Soup", price: "₹230", description: "Spicy dark soy broth loaded with minced bamboo shoots, mushrooms, and white pepper.", time: "Lunch", category: "Soups", diet: "veg" },
  { id: 48, name: "Chicken Manchow Crunch", price: "₹270", description: "Thick Indo-Chinese garlic soup with shredded chicken, topped with crispy fried noodles.", time: "Lunch", category: "Soups", diet: "non-veg" },
  { id: 49, name: "Cream of Tomato", price: "₹210", description: "Rich, creamy roasted tomato soup served with crunchy croutons.", time: "Lunch", category: "Soups", diet: "veg" },

  { id: 50, name: "Schezwan Chicken Hakka Noodles", price: "₹385", description: "Wok-tossed stir-fried wheat noodles tossed with chicken strips in a spicy home-made Schezwan sauce.", time: "Lunch", category: "Fast Foods", diet: "non-veg" },
  { id: 51, name: "Lebanese Falafel Wrap", price: "₹340", description: "Crispy chickpea falafels rolled inside flat lavash bread with hummus and pickled turnip.", time: "Lunch", category: "Fast Foods", diet: "veg" },
  { id: 52, name: "Paneer Tikka Kathi Roll", price: "₹320", description: "Flaky laccha paratha wrapped around clay-oven charred paneer cubes and mint sauce.", time: "Lunch", category: "Fast Foods", diet: "veg" },

  
  { id: 54, name: "Nalli Nihari with Taftan", price: "₹695", description: "Slow-cooked overnight lamb shanks in a rich spiced bone-marrow gravy, served with leavened bread.", time: "Dinner", category: "Main Dish", diet: "non-veg" },
  { id: 55, name: "Kadhai Mushroom Bao Stack", price: "₹465", description: "Steamed Japanese lotus-flour buns stuffed with semi-dry, wok-tossed spicy kadhai mushrooms.", time: "Dinner", category: "Main Dish", diet: "veg" },
  { id: 56, name: "Tandoori Atlantic Salmon Steak", price: "₹895", description: "Premium salmon fillet marinated in yellow mustard and yogurt, grilled over natural charcoal.", time: "Dinner", category: "Main Dish", diet: "non-veg" },
  { id: 57, name: "Malai Kofta Royale", price: "₹480", description: "Soft cottage cheese and potato dumplings simmered in a velvety cashew-based white gravy.", time: "Dinner", category: "Main Dish", diet: "veg" },

  { id: 58, name: "Khamiri Roti Basket", price: "₹180", description: "Thick, spongey Mughlai-style sourdough flatbreads baked in a deep clay oven.", time: "Dinner", category: "Side Dish", diet: "veg" },
  { id: 59, name: "Jeera Peas Pulao Bowl", price: "₹260", description: "Aged premium basmati rice tempered with cumin seeds and tender green peas.", time: "Dinner", category: "Side Dish", diet: "veg" },
  { id: 60, name: "Sirka Onion Salad Wheel", price: "₹95", description: "Sliced red onion rings pickling in red wine vinegar and whole peppercorns.", time: "Dinner", category: "Side Dish", diet: "veg" },

  { id: 62, name: "Amritsari Fish Fry", price: "₹480", description: "Crispy caraway-scented (ajwain) batter-fried river fish strips served with lemon.", time: "Dinner", category: "Snacks", diet: "non-veg" },
  { id: 63, name: "Tandoori Broccoli Gratin", price: "₹395", description: "Broccoli florets marinated in cream cheese and cardamoms, baked with a golden cheddar crust.", time: "Dinner", category: "Snacks", diet: "veg" },
  { id: 64, name: "Mutton Galouti Kebab", price: "₹520", description: "Smoky, ultra-fine minced lamb patties that literally melt in your mouth, served over mini parathas.", time: "Dinner", category: "Snacks", diet: "non-veg" },

  { id: 66, name: "Saffron Smoked Old Fashioned", price: "₹350", description: "Zero-alcohol premium bourbon alternative infused with Kashmiri saffron strands and apple-wood smoke.", time: "Dinner", category: "Drinks", diet: "veg" },
  { id: 67, name: "Kokum Cumin Fizz", price: "₹210", description: "Tangy Konkan coastal kokum fruit extract combined with roasted spices and soda.", time: "Dinner", category: "Drinks", diet: "veg" },
  { id: 68, name: "Kala Khatta Mojito", price: "₹230", description: "Indian nostalgia meets Cuban classic—muddled mint, lime, black salt, and tart blackberry syrup.", time: "Dinner", category: "Drinks", diet: "veg" },

  { id: 70, name: "Pomegranate Mint Elixir", price: "₹265", description: "Freshly pressed ruby red pomegranate seeds balanced with wild garden mint.", time: "Dinner", category: "Juices", diet: "veg" },
  { id: 71, name: "Kiwi Lime Zest Craze", price: "₹245", description: "Thick crushed green kiwi juice with freshly squeezed lime and sparkling tonic water.", time: "Dinner", category: "Juices", diet: "veg" },
  { id: 72, name: "Spiced Cranberry Sangria Shot", price: "₹230", description: "Pure cranberry reduction simmered with cinnamon sticks, cloves, and star anise.", time: "Dinner", category: "Juices", diet: "veg" },

  { id: 73, name: "Sweet Corn Chicken Velouté", price: "₹280", description: "Smooth cream-style corn soup base mixed with tender chicken shreds and egg drop clouds.", time: "Dinner", category: "Soups", diet: "non-veg" },
  { id: 74, name: "Seafood Lemon Coriander Soup", price: "₹340", description: "Zesty clear vegetable broth infused with prawns, calamari, lemongrass, and fresh coriander foliage.", time: "Dinner", category: "Soups", diet: "non-veg" },

  { id: 76, name: "Peri-Peri Chicken Tikka Pizza", price: "₹560", description: "Thick crust sourdough pizza loaded with spicy peri-peri spiced chicken chunks, capsicum, and mozzarella.", time: "Dinner", category: "Fast Foods", diet: "non-veg" },
  { id: 77, name: "Korean Fried Chicken Bao", price: "₹440", description: "Crisp, twice-fried chicken glazed in sweet sticky gochujang sauce inside a fluffy white bao.", time: "Dinner", category: "Fast Foods", diet: "non-veg" },
  { id: 78, name: "Double Cheese Paneer Burger", price: "₹380", description: "Crispy herbed paneer slab topped with makhani relish and double cheese sheets in a sesame bun.", time: "Dinner", category: "Fast Foods", diet: "veg" }
];

const MenuItems = () => {
  const [activeTime, setActiveTime] = useState("Lunch");
  const [activeCategory, setActiveCategory] = useState("Main Dish");

  const timeModules = [
    { name: "Breakfast", icon: <Icons.Breakfast /> },
    { name: "Lunch", icon: <Icons.Lunch /> },
    { name: "Dinner", icon: <Icons.Dinner /> }
  ];

  const categoryModules = [
    { name: "Main Dish", icon: <Icons.MainDish /> },
    { name: "Side Dish", icon: <Icons.SideDish /> },
    { name: "Snacks", icon: <Icons.Snacks /> },
    { name: "Drinks", icon: <Icons.Drinks /> },
    { name: "Juices", icon: <Icons.Juices /> },
    { name: "Soups", icon: <Icons.Soups /> },
    { name: "Fast Foods", icon: <Icons.FastFoods /> }
  ];

  const filteredItems = menuData.filter(
    (item) => item.time === activeTime && item.category === activeCategory
  );

  return (
    <section className="bg-[#050505] min-h-screen text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <p className="text-[#FFB000] uppercase tracking-[0.25em] font-semibold text-xs sm:text-sm mb-4">
            Delicious Masterpieces
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold tracking-tight">
            Our Culinary Menu
          </h2>
          <div className="w-24 h-1 bg-[#FFB000] mt-6 rounded-full opacity-80" />
        </div>
        <div className="flex justify-center items-center gap-3 md:gap-4 mb-8 flex-wrap">
          {timeModules.map((time) => (
            <button
              key={time.name}
              onClick={() => setActiveTime(time.name)}
              className="relative px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-colors duration-300 z-10 flex items-center gap-2"
              style={{ color: activeTime === time.name ? '#0B0B0B' : '#A3A3A3' }}
            >
              <span className={`transition-colors duration-300 shrink-0 ${activeTime === time.name ? 'text-black' : 'text-gray-400'}`}>
                {time.icon}
              </span>
              {time.name}
              {activeTime === time.name && (
                <motion.div
                  layoutId="activeTimeBackground"
                  className="absolute inset-0 bg-[#FFB000] rounded-full -z-10 shadow-[0_4px_20px_rgba(255,176,0,0.3)]"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-start md:justify-center items-center gap-2 md:gap-5 mb-14 overflow-x-auto pb-4 max-w-full no-scrollbar px-2 border-b border-white/5">
          {categoryModules.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-lg tracking-wider transition-all duration-200 flex items-center gap-2 ${
                activeCategory === category.name 
                  ? "text-[#FFB000] border-b-2 border-[#FFB000]" 
                  : "text-gray-500 hover:text-gray-400 border-b-2 border-transparent"
              }`}
            >
              <span className={`transition-colors duration-200 shrink-0 ${activeCategory === category.name ? 'text-[#FFB000]' : 'text-gray-500'}`}>
                {category.icon}
              </span>
              {category.name}
            </button>
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto bg-[#101010] shadow-[0_30px_60px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="absolute inset-3 border border-[#FFB000]/30 rounded-lg pointer-events-none z-10" />
          <div className="absolute inset-4 border border-[#FFB000]/10 rounded-lg pointer-events-none z-10" />
          <div className="relative z-20 flex flex-col lg:flex-row gap-10 lg:gap-16">
            <motion.div layout className="flex-1 flex flex-col gap-8 lg:gap-10 py-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex flex-col"
                    >
                      <div className="flex items-end justify-between gap-3 mb-2 w-full">
                        <div className="flex items-center gap-3 shrink-0">
                          {item.diet === 'veg' ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-500 border border-green-500/50 rounded bg-green-500/10 shrink-0 select-none">VEG</span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-500 border border-red-500/50 rounded bg-red-500/10 shrink-0 select-none">NON-VEG</span>
                          )}
                          <h4 className="text-xl sm:text-2xl font-serif text-white group-hover:text-[#FFB000] transition-colors duration-300">
                            {item.name}
                          </h4>
                        </div>
                        <div className="hidden sm:block grow border-b-2 border-dotted border-white/20 mb-2 group-hover:border-[#FFB000]/40 transition-colors" />
                        <span className="text-xl sm:text-2xl font-serif text-[#FFB000] shrink-0 -mb-0.5">
                          {item.price}
                        </span>
                      </div>
                      <div className="pl-14 lg:pl-16 pr-4 sm:pr-0">
                        <p className="text-gray-400 text-sm sm:text-base font-sans font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full text-center py-20 text-gray-500 font-medium tracking-wide text-base"
                  >
                    New dishes for this selection are being curated by our chefs.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="hidden lg:block w-[320px] xl:w-95 shrink-0">
              <motion.div 
                key={activeCategory} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="sticky top-24 w-full aspect-3/4 rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-2 bg-[#1A1A1A]"
              >
                <img 
                  src={categoryFeatureImages[activeCategory]} 
                  alt={`${activeCategory} Feature`}
                  className="w-full h-full object-cover rounded-xl filter brightness-90 hover:brightness-105 transition-all duration-500"
                />
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                  <p className="text-[#FFB000] font-serif font-bold text-sm uppercase tracking-widest">
                    {activeCategory}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuItems;