import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token') || null);
  const [loading, setLoading] = useState(true);

  const verifySession = async (currentToken = token) => {
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me.php`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setLoading(false);
          return true;
        } else {
          logout();
          setLoading(false);
          return false;
        }
      } else {
        logout();
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Session verify failed:', err);
      // In case of network outage while token exists, keep loading false
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    verifySession(token);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok && data.success && data.token) {
        localStorage.setItem('sm_admin_token', data.token);
        localStorage.setItem('sports_admin_token', data.token);
        if (data.user) {
          localStorage.setItem('sm_admin_user', JSON.stringify(data.user));
        }
        setToken(data.token);
        setUser(data.user || { id: 1, email, name: 'Admin', role: 'admin' });
        setLoading(false);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, error: 'Network error. Please check backend server.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('sm_admin_token');
    localStorage.removeItem('sports_admin_token');
    localStorage.removeItem('sm_admin_user');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updateUserProfile = (updatedUser) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedUser };
      localStorage.setItem('sm_admin_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      verifySession,
      updateUserProfile, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
