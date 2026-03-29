import { useAppStore } from '../stores/appStore';

export function ChatBubble() {
  const currentResponse = useAppStore((s) => s.currentResponse);
  const animationState = useAppStore((s) => s.animationState);
  const isLoading = useAppStore((s) => s.isLoading);

  const getText = () => {
    if (isLoading && animationState === 'thinking') return '🤔 Hmm, let me think...';
    if (currentResponse) return currentResponse;
    return '';
  };

  const text = getText();
  if (!text) return null;

  return (
    <div className="chat-bubble">
      <div className="chat-bubble-content">
        {text}
      </div>
      <div className="chat-bubble-tail" />
    </div>
  );
}
