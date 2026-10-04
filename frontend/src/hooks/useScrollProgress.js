import { useState, useEffect } from 'react';

/**
 * Hook to track normalized scroll progress (0 to 1) for an element or whole page
 */
export function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalDistance = rect.height + windowHeight;
        const currentDistance = windowHeight - rect.top;
        const rawProgress = Math.max(0, Math.min(1, currentDistance / totalDistance));
        setProgress(rawProgress);
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const rawProgress = scrollHeight > 0 ? Math.max(0, Math.min(1, scrollTop / scrollHeight)) : 0;
        setProgress(rawProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}
