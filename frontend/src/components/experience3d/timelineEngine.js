/**
 * TIMELINE ENGINE (PeachWeb-style Keyframe Interpolation & Velocity System)
 * - Normalized timeline scrubbing (0.0 -> 1.0)
 * - Bi-directional reverse playback on scroll-up
 * - Easing functions: easeOutCubic, easeInOutCubic, easeInOutQuart, spring damping
 * - Scroll velocity calculation & momentum decay
 */

export const easings = {
  linear: (t) => t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
};

/**
 * Interpolates a single scalar or object of numbers between keyframes
 */
export function interpolateKeyframes(keyframes, progress, easingFn = easings.easeInOutCubic) {
  if (!keyframes || keyframes.length === 0) return null;
  if (keyframes.length === 1) return keyframes[0].values;

  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));

  // Find surrounding keyframes
  let prev = keyframes[0];
  let next = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].progress && p <= keyframes[i + 1].progress) {
      prev = keyframes[i];
      next = keyframes[i + 1];
      break;
    }
  }

  const range = next.progress - prev.progress;
  const localT = range === 0 ? 0 : (p - prev.progress) / range;
  const easedT = easingFn(localT);

  return lerpObject(prev.values, next.values, easedT);
}

function lerpObject(a, b, t) {
  if (typeof a === 'number') {
    return a + (b - a) * t;
  }
  if (Array.isArray(a)) {
    return a.map((val, idx) => val + (b[idx] - val) * t);
  }
  if (typeof a === 'object' && a !== null) {
    const result = {};
    for (const key of Object.keys(a)) {
      if (b[key] !== undefined) {
        result[key] = lerpObject(a[key], b[key], t);
      } else {
        result[key] = a[key];
      }
    }
    return result;
  }
  return a;
}

/**
 * Velocity & Physics tracker for scroll & cursor momentum
 */
export class MotionTracker {
  constructor(damping = 0.08) {
    this.current = 0;
    this.target = 0;
    this.velocity = 0;
    this.damping = damping;
    this.lastValue = 0;
  }

  setTarget(val) {
    this.target = val;
  }

  update() {
    const delta = this.target - this.current;
    this.current += delta * this.damping;
    this.velocity = this.current - this.lastValue;
    this.lastValue = this.current;
    return { current: this.current, velocity: this.velocity };
  }
}
