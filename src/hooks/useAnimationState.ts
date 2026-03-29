import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/appStore';
import type { AnimationState } from '../types';

export function useAnimationState() {
  const { animationState, setAnimationState } = useAppStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transition = (to: AnimationState, autoReturnMs?: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnimationState(to);

    if (autoReturnMs) {
      timeoutRef.current = setTimeout(() => {
        setAnimationState('idle');
      }, autoReturnMs);
    }
  };

  // Auto-return from waving on mount
  useEffect(() => {
    if (animationState === 'waving') {
      timeoutRef.current = setTimeout(() => {
        setAnimationState('idle');
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { animationState, transition };
}
