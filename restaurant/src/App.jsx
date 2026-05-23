import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Global Authentication Providers & Gateways
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Structure Layout Elements
import Header from './Main/Header';
import Footer from './Main/Footer';

// Public Customer Facing Pages
import HomePage from './HomeSection/HomePage';
import AboutPage from './AboutComponents/AboutPage';
import GalleryPages from './Gallery/GalleryPages';
import MenuPage from './Menu/MenuPage';
import BlogsPage from './Blogs/BlogsPage';
import ContactUsPage from './ContactusComponents/ContactUsPage';
import BookingPage from './Booking/BookingPage';

// Operational Portal Authentication Page
import Login from './pages/Login'; // Adjust path based on your folder setup

import AdminDashboard from './pages/admin/AdminDashboard';

// Temporary Operational Dashboards (Replace with your actual standalone files later)
const KitchenTerminal = () => <div className="min-h-screen bg-[#060606] text-white p-20 font-serif text-3xl">Kitchen Live Order Matrix Queue</div>;
const BillingTerminal = () => <div className="min-h-screen bg-[#060606] text-white p-20 font-serif text-3xl">Point of Sale & Invoicing Terminal</div>;
const UnauthorizedPage = () => <div className="min-h-screen bg-[#060606] text-red-500 p-20 font-serif text-3xl text-center">403 - Clearance Denied for this Department</div>;

// Layout Wrapper to confine Header & Footer strictly to customer pathways
const CustomerLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

// Layout Wrapper for Admins - Includes the Smart Header, but NO Footer
const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className="pt-20 min-h-screen bg-[#060606]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* 1. PUBLIC CUSTOMER-FACING CHANNELS (With Header & Footer) */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPages />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/reserve" element={<BookingPage />} />
          </Route>

          {/* 2. AUTHENTICATION HUB (Isolated Framework Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* 3. PROTECTED ENTERPRISE OPERATIONS SEGMENTS */}
          
          {/* Admin Panel Routes Wrapped in AdminLayout */}
          <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<div className="p-20 text-white font-serif text-3xl">Live Bookings Console</div>} />
            <Route path="/admin/offers" element={<div className="p-20 text-white font-serif text-3xl">Promotions Console</div>} />
          </Route>
          
          {/* Kitchen & Billing (No Header/Footer, pure isolated terminal logic) */}
          <Route 
            path="/kitchen/orders" 
            element={
              <ProtectedRoute allowedRoles={['kitchen']}>
                <KitchenTerminal />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/billing/counter" 
            element={
              <ProtectedRoute allowedRoles={['billing']}>
                <BillingTerminal />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;