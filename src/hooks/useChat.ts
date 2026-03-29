import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { sendChatMessage } from '../utils/api';
import { useTTS } from './useTTS';

export function useChat() {
  const {
    messages,
    isLoading,
    addMessage,
    setCurrentResponse,
    setIsLoading,
    setAnimationState,
  } = useAppStore();

  const { speak } = useTTS();

  const sendMessage = useCallback(async (text: string) => {
    if (isLoading) return;

    const userMsg = { role: 'user' as const, content: text };
    addMessage(userMsg);
    setAnimationState('thinking');
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMsg];
      const response = await sendChatMessage(allMessages);

      addMessage({ role: 'assistant', content: response });
      setCurrentResponse(response);

      // Speak the response
      await speak(response);
    } catch (error) {
      console.error('Chat error:', error);
      setCurrentResponse("Oops! I got a little confused. Can you try again?");
      setAnimationState('idle');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, addMessage, setCurrentResponse, setIsLoading, setAnimationState, speak]);

  return { messages, isLoading, sendMessage };
}
