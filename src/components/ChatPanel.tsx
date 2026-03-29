import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAppStore } from '../stores/appStore';
import { MicButton } from './MicButton';

export function ChatPanel() {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const setAnimationState = useAppStore((s) => s.setAnimationState);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleFocus = () => {
    if (!isLoading) {
      setAnimationState('listening');
    }
  };

  const handleBlur = () => {
    const state = useAppStore.getState();
    if (state.animationState === 'listening') {
      setAnimationState('idle');
    }
  };

  const handleVoiceResult = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="chat-panel">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <span className="message-label">
              {msg.role === 'user' ? '👤' : '🐼'}
            </span>
            <span className="message-text">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isLoading ? 'Panpan is thinking...' : 'Say something to Panpan...'}
          disabled={isLoading}
          className="chat-input"
        />
        <MicButton onResult={handleVoiceResult} />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
}
