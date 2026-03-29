import { useEffect } from 'react';
import { Scene } from './components/Scene';
import { ChatPanel } from './components/ChatPanel';
import { ChatBubble } from './components/ChatBubble';
import { StatusIndicator } from './components/StatusIndicator';
import { useAppStore } from './stores/appStore';
import './styles/globals.css';

export default function App() {
  const setCurrentResponse = useAppStore((s) => s.setCurrentResponse);
  const setAnimationState = useAppStore((s) => s.setAnimationState);

  // Auto-greeting on first load
  useEffect(() => {
    setAnimationState('waving');
    setCurrentResponse("Hi there! I'm Panpan! Want to play?");

    const timer = setTimeout(() => {
      setAnimationState('idle');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <Scene />
      <StatusIndicator />
      <ChatBubble />
      <ChatPanel />
    </div>
  );
}
