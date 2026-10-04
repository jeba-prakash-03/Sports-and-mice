import React, { useRef, useEffect } from 'react';

/**
 * UI ANCHOR COMPONENT (PeachWeb-style 2D/3D Bridge)
 * Synchronizes HTML UI elements (Headlines, Telemetry Badges, CTA buttons)
 * with the 3D WebGL animation timeline.
 */
export const UIAnchor = ({
  id,
  children,
  className = '',
  onVisible,
  threshold = 0.2
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onVisible) {
          onVisible(id, entry.intersectionRatio);
        }
      },
      { threshold: [0.1, 0.5, 0.9] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, onVisible, threshold]);

  return (
    <div
      ref={ref}
      id={id}
      className={`experience-3d-ui-anchor ${className}`}
      data-ui-anchor={id}
    >
      {children}
    </div>
  );
};
