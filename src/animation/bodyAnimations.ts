import type { AnimationState } from '../types';

export interface BodyPose {
  bodyPosition: [number, number, number];
  bodyScale: [number, number, number];
  bodyRotation: [number, number, number];
  headRotation: [number, number, number];
  leftArmRotation: [number, number, number];
  rightArmRotation: [number, number, number];
  tailRotation: [number, number, number];
  eyeScale: number;
  mouthOpen: number;
}

const DEFAULT_POSE: BodyPose = {
  bodyPosition: [0, 0, 0],
  bodyScale: [1, 1, 1],
  bodyRotation: [0, 0, 0],
  headRotation: [0, 0, 0],
  leftArmRotation: [0, 0, 0.3],
  rightArmRotation: [0, 0, -0.3],
  tailRotation: [0, 0, 0],
  eyeScale: 1,
  mouthOpen: 0,
};

export const STATE_POSES: Record<AnimationState, BodyPose> = {
  idle: {
    ...DEFAULT_POSE,
  },
  listening: {
    ...DEFAULT_POSE,
    bodyRotation: [0.05, 0, 0],
    headRotation: [0, 0, 0.1],
    eyeScale: 1.2,
    rightArmRotation: [0.3, 0, -0.8],
  },
  thinking: {
    ...DEFAULT_POSE,
    headRotation: [0.15, -0.2, 0],
    rightArmRotation: [0.8, 0.3, -0.2],
    bodyRotation: [0, 0, 0.03],
  },
  talking: {
    ...DEFAULT_POSE,
    bodyScale: [1, 1.02, 1],
    leftArmRotation: [-0.3, 0, 0.6],
    rightArmRotation: [-0.3, 0, -0.6],
  },
  happy: {
    ...DEFAULT_POSE,
    bodyPosition: [0, 0.3, 0],
    bodyScale: [1.05, 0.95, 1.05],
    leftArmRotation: [-1.2, 0, 0.8],
    rightArmRotation: [-1.2, 0, -0.8],
    eyeScale: 0.7,
    mouthOpen: 0.8,
  },
  waving: {
    ...DEFAULT_POSE,
    rightArmRotation: [-2.2, 0, -0.3],
    headRotation: [0, 0.1, 0.05],
    eyeScale: 0.8,
    mouthOpen: 0.5,
  },
  dancing: {
    ...DEFAULT_POSE,
    bodyPosition: [0, 0.2, 0],
    bodyRotation: [0, 0.2, 0.05],
    leftArmRotation: [-1, 0.3, 0.5],
    rightArmRotation: [-1, -0.3, -0.5],
  },
  celebrating: {
    ...DEFAULT_POSE,
    bodyPosition: [0, 0.5, 0],
    bodyScale: [0.9, 1.15, 0.9],
    leftArmRotation: [-2.5, 0, 0.5],
    rightArmRotation: [-2.5, 0, -0.5],
    eyeScale: 0.6,
    mouthOpen: 1,
  },
};
