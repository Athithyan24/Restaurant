import React, { useState, useRef, useEffect } from 'react';

// Row 1 Testimonials from the video reference
const row1Reviews = [
  {
    id: 1,
    stars: 5,
    date: "12/03/2025",
    text: "Every visit to Plateria feels like a special occasion. The presentation and taste are truly unmatched.",
    name: "Sarah Mendez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    stars: 4,
    date: "19/01/2025",
    text: "We've made Plateria our go-to spot. Their cozy vibe and flavorful dishes make it unforgettable.",
    name: "Aisha Rahman",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    stars: 5,
    date: "27/02/2025",
    text: "From the first bite to the last sip, everything is crafted with care. Plateria never disappoints.",
    name: "Ravi Shah",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

// Row 2 Testimonials from the video reference
const row2Reviews = [
  {
    id: 4,
    stars: 5,
    date: "05/12/2024",
    text: "Fresh ingredients, warm staff, and bold flavors—Plateria checks every box for a perfect meal.",
    name: "Emily Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 5,
    stars: 4,
    date: "22/11/2024",
    text: "Plateria delivers a perfect balance of flavor and atmosphere. It's become our favorite dining spot.",
    name: "Nina Patel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 6,
    stars: 5,
    date: "08/04/2025",
    text: "What sets Plateria apart is the passion in every plate. The service is just as memorable as the food.",
    name: "Luca Romano",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-orange-500 fill-orange-500' : 'text-gray-200 fill-gray-200'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="w-[310px] sm:w-[360px] shrink-0 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between hover:border-orange-500/20 transition-all duration-300 select-none mx-3 whitespace-normal break-words group/card">
    <div>
      <div className="flex justify-between items-center mb-5">
        <StarRating rating={review.stars} />
        <span className="text-xs font-medium text-gray-400 font-sans tracking-wide">{review.date}</span>
      </div>
      <p className="text-gray-600 text-sm sm:text-base font-normal leading-relaxed mb-6 font-sans whitespace-normal break-words">
        "{review.text}"
      </p>
    </div>
    <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-50">
      <img
        src={review.avatar}
        alt={review.name}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover grayscale-[10%] group-hover/card:grayscale-0 transition-all duration-300 border border-gray-100"
      />
      <h4 className="text-sm sm:text-base font-serif font-semibold text-gray-800 tracking-tight">{review.name}</h4>
    </div>
  </div>
);

// High-Performance Interactive Smooth-Lerping Marquee Row
const MarqueeRow = ({ reviews, direction = 'left', baseSpeed = 0.6 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  const xRef = useRef(direction === 'left' ? 0 : -1500);
  const speedRef = useRef(baseSpeed);

  // Buffered array duplication for infinite continuous loop positioning
  const extendedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  useEffect(() => {
    if (!trackRef.current) return;

    let animationFrameId;
    const halfWidth = trackRef.current.scrollWidth / 2;

    if (direction === 'right' && xRef.current === -1500) {
      xRef.current = -halfWidth;
    }

    const updateLoop = () => {
      // Immediately slows down to 15% minimum crawl speed instead of a total freeze layout break
      const targetSpeed = isHovered ? baseSpeed * 0.15 : baseSpeed;
      
      // Linear interpolation (lerp) for buttery smooth transition speed state shifts
      speedRef.current += (targetSpeed - speedRef.current) * 0.12;

      if (direction === 'left') {
        xRef.current -= speedRef.current;
        if (xRef.current <= -halfWidth) {
          xRef.current += halfWidth;
        }
      } else {
        xRef.current += speedRef.current;
        if (xRef.current >= 0) {
          xRef.current -= halfWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, baseSpeed, direction]);

  return (
    <div
      className="relative w-full overflow-hidden flex items-center py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {extendedReviews.map((review, idx) => (
          <ReviewCard key={`${direction}-${review.id}-${idx}`} review={review} />
        ))}
      </div>
    </div>
  );
};

const MenuReview = () => {
  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden border-t border-gray-50 relative">
      <div className="w-full flex flex-col items-center relative">
        
        {/* --- Header Typography Block --- */}
        <p className="text-gray-400 uppercase tracking-[0.25em] text-xs font-sans font-bold mb-4 text-center">
          Real Experiences, Real Satisfaction
        </p>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-center tracking-tight text-neutral-900 mb-20 max-w-2xl leading-[1.15] px-4">
          Customer reviews that speak for themselves
        </h2>

        {/* --- Marquee Track System with Extended Deep Ambient Edge Mask Fades --- */}
        <div className="w-full flex flex-col gap-6 sm:gap-8 relative px-1">
          
          {/* Deep Ambient Mask Layers for organic fading bounds */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-80 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-80 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Row 1 System: Slow Leftward Track */}
          <MarqueeRow reviews={row1Reviews} direction="left" baseSpeed={0.6} />

          {/* Row 2 System: Slow Rightward Track */}
          <MarqueeRow reviews={row2Reviews} direction="right" baseSpeed={0.55} />

        </div>

      </div>
    </section>
  );
};

export default MenuReview;