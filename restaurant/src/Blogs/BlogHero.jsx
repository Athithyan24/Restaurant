import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Indian-themed blog posts & events dataset
const blogPosts = [
  // --- ROW 1: THE CHEF's JOURNAL ---
  {
    id: 1,
    row: 1,
    tag: "Culinary Heritage",
    title: "The Sacred Art of Awadhi Dum Biryani: 36 Hours of Tradition",
    description: "Explore the deep history, secret spice compositions, and precise sealed-handi dough techniques used by our master chefs to preserve India's most celebrated grand dining masterpiece.",
    date: "May 18, 2026",
    author: "Chef Sanjay Ranaut",
    authorImg: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80",
    coverImg: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80",
    content: [
      { type: "p", text: "At Plateria, our Awadhi Dum Biryani isn’t just a menu item—it’s an inherited legacy. Originating from the royal kitchens of the Nawabs of Awadh, this dish demands absolute devotion to the ancient 'Dum Pukht' style of cooking, where meat and parboiled rice are layered and slowly cooked in a heavy bottomed handi sealed hermetically with dough." },
      { type: "h3", text: "The Master Spice Formulation" },
      { type: "p", text: "True Awadhi cooking relies on a bouquet of delicate, fragrant spices rather than overpowering heat. We blend a custom 'potli masala' featuring Mace (Javitri), Ittar (edible perfume), Stone Flower (Kalpasi), and high-grade Kashmiri saffron threads soaked in warm milk. This ensures every grain of long-grain basmati absorbs aroma uniformly without losing structural integrity." },
      { type: "quote", text: "A perfect biryani is recognized by two laws: every grain of rice must stay completely separate, yet every single grain must hold the absolute deep concentration of the broth." }
    ]
  },
  {
    id: 2,
    row: 1,
    tag: "Aroma Chemistry",
    title: "Sourcing Saffron: From Pampore Fields to Plate",
    description: "We travel deep into the absolute heart of Jammu & Kashmir to sustainably source pure, hand-plucked Mongra saffron stigmas.",
    date: "May 12, 2026",
    author: "Ananya Iyer",
    authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    coverImg: "https://images.unsplash.com/photo-1595295333158-4742f28fbe85?auto=format&fit=crop&w=600&q=80",
    content: [
      { type: "p", text: "Saffron is arguably the most precious commodity in the culinary ecosystem. To secure a continuous supply of unadulterated Mongra grade saffron, we build straight farm-level alliances with cultivators across the high-altitude fields of Pampore, Kashmir." },
      { type: "h3", text: "Why Mongra Grade Matters" },
      { type: "p", text: "Unlike standard commercially accessible grades that mix yellow styles into the packaging to add weight, Mongra consists purely of the deep crimson top tips of the Crocus sativus flower." }
    ]
  },
  {
    id: 3,
    row: 1,
    tag: "Fusion Culinary",
    title: "Engineering the Perfect Masala Croissant",
    description: "Combining flaky French laminated pastry folds with highly spiced Mumbai street egg bhurji culture.",
    date: "May 04, 2026",
    author: "Chef Pierre Mehta",
    authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    coverImg: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    content: [
      { type: "p", text: "Cross-cultural culinary engineering is a balancing act of textures and moisture. When we decided to design a high-end breakfast option, we wanted to marry the buttery, shattered-glass texture of an authentic Parisian croissant with the intensely robust kick of an Indian morning street stall." }
    ]
  },
  {
    id: 4,
    row: 1,
    tag: "Slow Crafting",
    title: "Dal Makhani: Mechanics of a 24-Hour Simmer",
    description: "A look inside the continuous agitation and clay tandoor physics required to yield our velvet-textured black lentils.",
    date: "April 29, 2026",
    author: "Chef Sanjay Ranaut",
    authorImg: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80",
    coverImg: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    content: [
      { type: "p", text: "A truly memorable Dal Makhani cannot be rushed with pressure cookers. At Plateria, the black urad lentils and kidney beans undergo a rigorous 24-hour cycle of cleaning, overnight soaking, and uninterrupted cooking over fading tandoor ash blocks." }
    ]
  },

  // --- ROW 2: EXCLUSIVE EXPERIENCES ---
  {
    id: 5,
    row: 2,
    tag: "Exclusive Gastronomy",
    title: "The Rajputana Royal Feast: Reviving Lost Banquets",
    description: "An immersive evening uncovering long-forgotten royal hunting recipes, slow-smoked pit barbecue mechanics, and traditional silver-leafed dessert chemistry.",
    date: "June 02, 2026",
    author: "Maharani Gayatri Singh",
    authorImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    coverImg: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    content: [
      { type: "p", text: "Our upcoming seasonal gala aims to replicate the opulent durbars of Jaipur and Udaipur. This edition explores the intense meat preparation techniques required by royal houses before modern refrigeration altered traditional curing methodologies." },
      { type: "h3", text: "The Physics of the Underground Earth Pit" },
      { type: "p", text: "For our centerpiece 'Khad Murg', the entire chicken is wrapped in spice-soaked organic linen, encased in layers of local river clay, and buried directly inside an active underground pit lined with burning charcoal and neem leaves for over six continuous hours." }
    ]
  },
  {
    id: 6,
    row: 2,
    tag: "Masterclass",
    title: "Vedic Fire Cooking: Embers & Clay",
    description: "Join our master culinary artisans for an open-hearth masterclass exploring wood embers, structural clay vessels, and organic cold-pressed ghee transformations.",
    date: "June 14, 2026",
    author: "Chef Raghav Chawla",
    authorImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    coverImg: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    content: [
      { type: "p", text: "Modern stoves eliminate the complex flavor variables that organic fire smoke introduces. In this experimental lab setup, participants will learn to read fire states based on ash colors and manage cooking vessels made completely out of terracotta." }
    ]
  },
  {
    id: 7,
    row: 2,
    tag: "Sommelier Gathering",
    title: "The Monsoon Spice Route: Wine Pairings",
    description: "Tracing international trade maps by marrying heavy Kerala coastal black pepper and clove reductions with select crisp European vintage reserves.",
    date: "June 28, 2026",
    author: "Karan Bilimoria",
    authorImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    coverImg: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    content: [
      { type: "p", text: "Pairing robust Indian food with premium wines has long been misunderstood. This master session showcases how high-tannin reds interact gracefully when balanced against natural coconut milks and hand-ground spice pastages." }
    ]
  }
];

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 40, damping: 15 } }
};

const overlayVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.4, ease: "easeInOut" } }
};

const BlogHero = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const row1Main = blogPosts.find(p => p.id === 1);
  const row1Sidebar = blogPosts.slice(1, 4);
  const row2GridPosts = blogPosts.filter(p => p.row === 2);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPost]);

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#FFB000] selection:text-black font-sans relative overflow-hidden">
      
      {/* ======================================================== */}
      {/* MAIN RESTAURANT EDITORIAL VIEW                           */}
      {/* ======================================================== */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col gap-28"
      >
        {/* --- Section Header --- */}
        <motion.div variants={fadeUp} className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-serif font-light tracking-tight text-white mb-4">
            The Chef's Journal
          </h1>
          <p className="text-neutral-400 font-light tracking-wide max-w-xl text-sm sm:text-base">
            Stories of heritage, sourcing, and the culinary philosophy behind our menus.
          </p>
        </motion.div>

        {/* --- ROW 1: ASYMMETRICAL STORY LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* LEFT: Featured Story */}
          <motion.div 
            variants={fadeUp}
            onClick={() => setSelectedPost(row1Main)}
            className="lg:col-span-7 flex flex-col group cursor-pointer"
          >
            <div className="w-full overflow-hidden bg-neutral-900 aspect-[4/3] sm:aspect-[16/10] relative mb-8 rounded-sm">
              <img 
                src={row1Main.coverImg} 
                alt={row1Main.title} 
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            </div>

            <div className="flex flex-col pr-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFB000] mb-4 block font-medium">
                {row1Main.tag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal leading-tight text-white group-hover:text-neutral-200 transition-colors duration-300 mb-5">
                {row1Main.title}
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed line-clamp-2 font-light">
                {row1Main.description}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden grayscale">
                  <img src={row1Main.authorImg} alt={row1Main.author} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-neutral-500 font-light tracking-wide">
                  By {row1Main.author} &mdash; {row1Main.date}
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Compact Stories */}
          <motion.div 
            variants={fadeUp}
            className="lg:col-span-5 flex flex-col gap-10 lg:pl-4 pt-4 lg:pt-0"
          >
            {row1Sidebar.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="flex items-start gap-6 cursor-pointer group"
              >
                <div className="flex-grow flex flex-col pt-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#FFB000] mb-2 block font-medium">
                    {post.tag}
                  </span>
                  <h4 className="text-lg sm:text-xl font-serif font-normal text-white group-hover:text-neutral-300 transition-colors duration-300 leading-snug mb-2">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-neutral-500 font-light tracking-wide block">
                    {post.date}
                  </span>
                </div>

                <div className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-neutral-900 shrink-0 rounded-sm">
                  <img 
                    src={post.coverImg} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                  />
                </div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* --- ROW 2: EXPERIENCES GRID --- */}
        <motion.div variants={fadeUp} className="flex flex-col gap-12 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <h2 className="text-3xl font-serif font-light text-white">Culinary Experiences</h2>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFB000] font-medium">Upcoming Events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {row2GridPosts.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="flex flex-col group cursor-pointer"
              >
                <div className="w-full overflow-hidden bg-neutral-900 aspect-[4/5] relative mb-6 rounded-sm">
                  <img 
                    src={post.coverImg} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#FFB000] mb-3 block font-medium">
                    {post.tag} &mdash; {post.date}
                  </span>
                  <h4 className="text-xl font-serif font-normal text-white group-hover:text-neutral-300 transition-colors duration-300 leading-snug mb-3">
                    {post.title}
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-2 font-light">
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.main>

      {/* ======================================================== */}
      {/* IN-PLACE OVERLAY DETAIL VIEW (JOURNAL READING MODE)      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-[#0a0a0a] z-50 overflow-y-auto overflow-x-hidden"
          >
            {/* Minimal Header Nav */}
            <nav className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-30 w-full px-6 py-6 flex items-center justify-between">
              <button 
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-3 text-xs uppercase tracking-widest font-medium text-neutral-400 hover:text-[#FFB000] transition-colors py-2 group cursor-pointer"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span>
                Close Entry
              </button>
            </nav>

            {/* Reading Container */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
              
              {/* Journal Header Typography */}
              <div className="mb-16 text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#FFB000] block mb-6 font-medium">
                  {selectedPost.tag}
                </span>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] text-white mb-8">
                  {selectedPost.title}
                </h1>

                <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 uppercase tracking-widest">
                  <span>By {selectedPost.author}</span>
                  <span className="text-neutral-700">|</span>
                  <span>{selectedPost.date}</span>
                </div>
              </div>

              {/* Constrained Elegant Image Container */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] rounded-sm overflow-hidden mb-16 bg-neutral-900">
                <img src={selectedPost.coverImg} alt={selectedPost.title} className="w-full h-full object-cover opacity-90" />
              </div>

              {/* Content Formatting */}
              <div className="flex flex-col gap-8 text-neutral-300 text-lg leading-relaxed font-light">
                {selectedPost.content?.map((block, index) => {
                  if (block.type === 'p') {
                    return <p key={index} className="whitespace-normal text-neutral-300 leading-loose">{block.text}</p>;
                  }
                  if (block.type === 'h3') {
                    return (
                      <h3 key={index} className="text-2xl sm:text-3xl font-serif font-normal text-white mt-10 mb-2">
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={index} className="my-10 text-2xl sm:text-3xl font-serif italic text-white text-center leading-snug px-8 border-y border-white/10 py-10">
                        "{block.text}"
                      </blockquote>
                    );
                  }
                  return null;
                })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BlogHero;