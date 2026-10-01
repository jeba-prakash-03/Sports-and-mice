/**
 * Subtle "magnetic" pull on CTA buttons — the button drifts a few px toward
 * the cursor while hovered. Same technique as tilt.js: direct
 * style.setProperty on CSS custom properties, no React state, no
 * re-renders. Max pull is deliberately small (6px) — this should read as
 * "the button feels alive," not an obvious gimmick.
 */
export const handleMagnetMove = (e, maxPx = 6) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;
  btn.style.setProperty('--magnet-x', `${px * maxPx * 2}px`);
  btn.style.setProperty('--magnet-y', `${py * maxPx * 2}px`);
};

export const handleMagnetLeave = (e) => {
  const btn = e.currentTarget;
  btn.style.setProperty('--magnet-x', '0px');
  btn.style.setProperty('--magnet-y', '0px');
};
