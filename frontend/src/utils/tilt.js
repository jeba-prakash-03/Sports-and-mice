/**
 * Lightweight 3D card tilt via direct DOM style mutation — no React state,
 * no re-renders, just CSS custom properties consumed by a `transform:
 * perspective(...) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` rule on
 * the target class. Keep the max angle small (8-10deg) so it reads as
 * "this card has depth" rather than "the page is shaking".
 */
export const handleTiltMove = (e, maxDeg = 8) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  card.style.setProperty('--tilt-x', `${(py - 0.5) * -maxDeg}deg`);
  card.style.setProperty('--tilt-y', `${(px - 0.5) * maxDeg}deg`);
};

export const handleTiltLeave = (e) => {
  const card = e.currentTarget;
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
};
