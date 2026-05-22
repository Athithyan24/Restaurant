import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Fallback endpoint; overrides dynamically via system environment profiles (.env)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verification pass: Ensures stored tokens are active and match authentic backend structures
  const verifySessionToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns: { success: true, user: { name, email, role } }
        setUser(data.user);
      } else {
        // Token has expired or is invalid, perform clean sweep
        logout();
      }
    } catch (error) {
      console.error("Operational gate network error during handshake:", error);
      // In case of safe network dropout, do not immediately boot if session exists, 
      // but for absolute security hygiene, we clear state if backend cannot check clearance.
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('location_secure_token');
    if (token) {
      verifySessionToken(token);
    } else {
      setLoading(false);
    }
  }, [verifySessionToken]);

  // Live Login Action
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Bubbles up clear, descriptive server errors (e.g. "Incorrect Password", "Deactivated Account")
        throw new Error(data.message || 'Authentication rejection encountered.');
      }

      // Expected response structure: { token: "JWT_STRING...", user: { name, email, role } }
      localStorage.setItem('location_secure_token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Server connection timeout. Please verify network routing.');
    }
  };

  // Clean Logout Action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('location_secure_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, apiBaseUrl: API_BASE_URL }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);