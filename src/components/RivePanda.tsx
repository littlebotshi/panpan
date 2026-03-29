import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export function RivePanda() {
  const animationState = useAppStore((s) => s.animationState);
  const mouthAmplitude = useAppStore((s) => s.mouthAmplitude);

  const { rive, RiveComponent } = useRive({
    src: '/playing-panda.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  // Try to get state machine inputs (names depend on the .riv file)
  const hoverInput = useStateMachineInput(rive, 'State Machine 1', 'isHover');
  const clickInput = useStateMachineInput(rive, 'State Machine 1', 'isClick');

  // Map our animation states to the Rive inputs
  useEffect(() => {
    if (!rive) return;

    switch (animationState) {
      case 'talking':
      case 'happy':
      case 'celebrating':
      case 'dancing':
        // Simulate hover/click for active states
        if (hoverInput) hoverInput.value = true;
        break;
      case 'thinking':
        if (hoverInput) hoverInput.value = true;
        break;
      case 'waving':
        // Trigger click animation for waving
        if (clickInput) clickInput.fire();
        break;
      case 'idle':
      case 'listening':
      default:
        if (hoverInput) hoverInput.value = false;
        break;
    }
  }, [animationState, rive, hoverInput, clickInput]);

  // Pulse hover on/off with mouth amplitude during talking for liveliness
  useEffect(() => {
    if (animationState !== 'talking' || !hoverInput) return;
    hoverInput.value = mouthAmplitude > 0.15;
  }, [mouthAmplitude, animationState, hoverInput]);

  return (
    <div className="rive-container">
      <RiveComponent
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
