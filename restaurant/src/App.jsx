import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Main/Header';
import Footer from './Main/Footer';

import HomePage from './HomeSection/HomePage';
import AboutPage from './AboutComponents/AboutPage';
import GalleryPages from './Gallery/GalleryPages';
import MenuPage from './Menu/MenuPage';
import BlogsPage from './Blogs/BlogsPage';
import ContactUsPage from './ContactusComponents/ContactUsPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPages />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;