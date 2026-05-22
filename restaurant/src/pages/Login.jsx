import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Compute fallback targets based on specialized system authorization codes
  const redirectOrigin = location.state?.from?.pathname;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;
    
    setError('');
    setIsLoggingIn(true);

    try {
      const authenticatedProfile = await login(email, password);
      
      // Dynamic routing allocation according to strict department privileges
      if (redirectOrigin) {
        navigate(redirectOrigin, { replace: true });
      } else {
        switch (authenticatedProfile.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'kitchen':
            navigate('/kitchen/orders');
            break;
          case 'billing':
            navigate('/billing/counter');
            break;
          default:
            navigate('/unauthorized');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Brand Ambient Lighting Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFB000]/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
        className="w-full max-w-md bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 sm:p-10 relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000]/30 to-transparent" />

        {/* Brand Typographic Identity Block */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3 select-none">
            <img src="/logo.png" alt="Location Icon" className="h-8 w-auto object-contain" />
            <img src="/logos.png" alt="Location Logotype" className="h-4 w-auto object-contain" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 block">
            Internal Operations Portal
          </span>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-center font-light tracking-wide"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Departmental Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light"
              placeholder="username@location.com"
              disabled={isLoggingIn}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Security Gate Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 focus:outline-none focus:border-[#FFB000] transition-all duration-300 text-sm font-light"
              placeholder="••••••••••••"
              disabled={isLoggingIn}
            />
          </div>

          <motion.button
            whileHover={{ scale: isLoggingIn ? 1 : 1.01 }}
            whileTap={{ scale: isLoggingIn ? 1 : 0.99 }}
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[#FFB000] text-black py-4 rounded-xl font-bold text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 shadow-[0_4px_25px_rgba(255,176,0,0.15)] flex items-center justify-center disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Initialize Session'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;