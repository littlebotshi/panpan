// Disney animation principles as utility functions

/** Squash & stretch: returns scale [x, y, z] based on a 0-1 squash factor */
export function squashStretch(factor: number, intensity = 0.3): [number, number, number] {
  // factor: 0 = neutral, -1 = max squash, +1 = max stretch
  const yScale = 1 + factor * intensity;
  // Volume preservation: when Y stretches, X/Z compress
  const xzScale = 1 / Math.sqrt(yScale);
  return [xzScale, yScale, xzScale];
}

/** Anticipation curve: dips negative before reaching target */
export function anticipation(t: number, overshoot = 0.2): number {
  if (t < 0.2) {
    // Pull back phase
    return -overshoot * Math.sin((t / 0.2) * Math.PI);
  }
  // Forward phase with overshoot settle
  const phase = (t - 0.2) / 0.8;
  return phase + overshoot * Math.sin(phase * Math.PI) * (1 - phase);
}

/** Bounce ease: like a ball bouncing to rest */
export function bounceEase(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    const t2 = t - 1.5 / 2.75;
    return 7.5625 * t2 * t2 + 0.75;
  } else if (t < 2.5 / 2.75) {
    const t2 = t - 2.25 / 2.75;
    return 7.5625 * t2 * t2 + 0.9375;
  } else {
    const t2 = t - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  }
}

/** Smooth step for eased transitions */
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Overshoot oscillation for follow-through */
export function followThrough(t: number, frequency = 3, decay = 4): number {
  return 1 - Math.exp(-decay * t) * Math.cos(frequency * Math.PI * t);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
