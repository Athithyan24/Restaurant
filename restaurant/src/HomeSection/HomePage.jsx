import React from 'react';
import Hero from './Hero';
import Content from './HomeContent';
import HomeMenu from './HomeMenu';
import HomeReview from './HomeReview';
import HomeBooking from './HomeBooking';
export default function App() {
  return (
    <div>
     <Hero />
     <HomeMenu />
     <Content />
     <HomeBooking />
     <HomeReview />
    </div>
  );
}