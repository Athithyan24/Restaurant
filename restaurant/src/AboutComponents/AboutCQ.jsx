import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutCQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How can I reserve a table or pre-order?",
      answer: "Skip the weekend rush! You can reserve a premier table or pre-order your favorite fusion fast-food combos directly through our booking canvas for seamless dine-in confirmation."
    },
    {
      question: "Are there pure vegetarian options on the menu?",
      answer: "Absolutely. We host an extensive range of pure vegetarian burgers, paneer tikka pizzas, and house sides infused with bold local masalas and premium local sourcing."
    },
    {
      question: "What makes your signature dips and sauces special?",
      answer: "Our sauces are where West meets South! We craft everything in-house daily, blending global fast-food staples with local twists like Chettinad fiery mayo and house-made Guntur chilli glaze."
    },
    {
      question: "Who designs your unique fusion recipes?",
      answer: "Our kitchen is directed by modern flavor architects from Tamil Nadu who masterfully fuse traditional American fast-food architecture with the intense, unmistakable spice chemistry of local street food."
    },
    {
      question: "Do you take bulk party orders for local events?",
      answer: "Yes! From corporate lunch gatherings in local tech parks to birthday bashes, we curate premium, customized fast-food slider boxes and party platters tailored to your crowd."
    },
    {
      question: "Do you offer any millet-based or gluten-free alternatives?",
      answer: "Yes! Staying true to our roots, we offer signature crisp sides and select burger adjustments utilizing native Tamil Nadu millets alongside naturally gluten-free alternatives."
    }
  ];

  // Master container variants to choreograph the staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, 
        delayChildren: 0.1
      }
    }
  };

  // The custom zoom-in & horizontal width expansion animation
  const questionEntryVariants = {
    hidden: { 
      opacity: 0, 
      scaleX: 0.7,  // Starts compressed horizontally (small width)
      scaleY: 0.9,  // Slightly smaller vertically
      scale: 0.85,  // Overall zoom-out state
      y: 30 
    },
    visible: { 
      opacity: 1, 
      scaleX: 1,    // Stretches out dynamically to full width
      scaleY: 1, 
      scale: 1,     // Zooms in smoothly to its true size
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 90,
        damping: 14,
        mass: 0.8
      } 
    }
  };

  return (
    <section className="bg-black text-white py-24 sm:py-32 px-4 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-yellow-500 font-serif text-xs sm:text-sm tracking-[0.3em] uppercase font-medium mb-4"
          >
            Your Questions, Answered
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-clash font-medium tracking-tight text-white leading-tight"
          >
            Answers to your most <br /> common questions
          </motion.h2>
        </div>

        {/* Staggered Accordion Stream Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="space-y-3"
        >
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div 
                key={index}
                variants={questionEntryVariants}
                className="border-b border-white/10 pb-4 pt-1 origin-center"
              >
                {/* Trigger Row Frame */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left group focus:outline-none py-3"
                >
                  <span className="text-lg sm:text-xl font-clash font-light text-gray-200 group-hover:text-yellow-500 transition-colors duration-300 pr-4">
                    {item.question}
                  </span>

                  {/* Interactive Button Circle */}
                  <motion.div
                    animate={{ 
                      rotate: isOpen ? 90 : 0,
                      backgroundColor: isOpen ? '#eab308' : 'rgba(23, 23, 23, 0.6)',
                      color: isOpen ? '#000000' : '#eab308'
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-shrink-0 items-center justify-center cursor-pointer"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </button>

                {/* Smooth Height Reveal Container */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1,
                        marginTop: 8,
                        transition: { height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.25, delay: 0.05 } }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        marginTop: 0,
                        transition: { height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }
                      }}
                      className="overflow-hidden px-1"
                    >
                      <p className="text-sm sm:text-base font-serif text-gray-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutCQ;