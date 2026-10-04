import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const LoadingContext = createContext();

/**
 * LoadingProvider — Global Reusable Loading Manager for Sports & MICE
 * 
 * Features:
 * - Multi-key concurrent loading support (e.g. 'site-config', 'page-transition', 'data-fetch')
 * - Prevents flickering with smooth state handling
 * - Built-in safety timeout (~3s) so the loader never hangs indefinitely
 * - Reusable across initial load, page navigation, and genuine data fetching
 */
export const LoadingProvider = ({ children }) => {
  const [activeLoaders, setActiveLoaders] = useState(new Set(['initial-boot']));
  const safetyTimeoutRef = useRef(null);

  const isLoading = activeLoaders.size > 0;

  // Clear all loaders in case of emergency / safety fallback
  const clearAllLoaders = useCallback(() => {
    setActiveLoaders(new Set());
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Start a named or general loading process
  const startLoading = useCallback((key = 'default') => {
    setActiveLoaders(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    // Reset safety timer whenever loading starts/extends
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    safetyTimeoutRef.current = setTimeout(() => {
      console.warn('[LoadingContext] Safety timeout reached (3000ms) — releasing loader.');
      clearAllLoaders();
    }, 3000);
  }, [clearAllLoaders]);

  // Stop a named or general loading process
  const stopLoading = useCallback((key = 'default') => {
    setActiveLoaders(prev => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  // Direct boolean setter helper
  const setLoading = useCallback((val) => {
    if (val) {
      startLoading('manual');
    } else {
      stopLoading('manual');
    }
  }, [startLoading, stopLoading]);

  // Cleanup safety timer on unmount
  useEffect(() => {
    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      activeLoaders: Array.from(activeLoaders),
      startLoading,
      stopLoading,
      setLoading,
      clearAllLoaders
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    // Fallback if rendered outside LoadingProvider
    return {
      isLoading: false,
      startLoading: () => {},
      stopLoading: () => {},
      setLoading: () => {},
      clearAllLoaders: () => {}
    };
  }
  return context;
};

export default LoadingContext;
