import { useAppStore } from '../stores/appStore';

const STATUS_LABELS: Record<string, string> = {
  idle: '',
  listening: '👂 Listening...',
  thinking: '🤔 Thinking...',
  talking: '🗣️ Speaking...',
  happy: '😊',
  waving: '👋 Hi there!',
  dancing: '💃 Dancing!',
  celebrating: '🎉 Yay!',
};

export function StatusIndicator() {
  const animationState = useAppStore((s) => s.animationState);
  const label = STATUS_LABELS[animationState];

  if (!label) return null;

  return (
    <div className="status-indicator">
      {label}
    </div>
  );
}
