import { create } from 'zustand';
import type { AnimationState, ChatMessage } from '../types';

interface AppState {
  // Animation
  animationState: AnimationState;
  mouthAmplitude: number;
  setAnimationState: (state: AnimationState) => void;
  setMouthAmplitude: (v: number) => void;

  // Chat
  messages: ChatMessage[];
  currentResponse: string;
  isLoading: boolean;
  addMessage: (msg: ChatMessage) => void;
  setCurrentResponse: (text: string) => void;
  setIsLoading: (v: boolean) => void;

  // Audio
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  animationState: 'waving',
  mouthAmplitude: 0,
  setAnimationState: (animationState) => set({ animationState }),
  setMouthAmplitude: (mouthAmplitude) => set({ mouthAmplitude }),

  messages: [],
  currentResponse: '',
  isLoading: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setCurrentResponse: (currentResponse) => set({ currentResponse }),
  setIsLoading: (isLoading) => set({ isLoading }),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
