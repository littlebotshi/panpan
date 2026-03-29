import type { SpringConfig } from '@react-spring/three';

export const SPRING_CONFIGS: Record<string, SpringConfig> = {
  body: { tension: 180, friction: 12 },
  head: { tension: 200, friction: 20 },
  arms: { tension: 120, friction: 14 },
  ears: { tension: 100, friction: 8 },
  tail: { tension: 150, friction: 10 },
  mouth: { tension: 300, friction: 20 },
  bounce: { tension: 200, friction: 10 },
  celebrate: { tension: 250, friction: 8 },
};
