import { API_BASE_URL } from '../constants';
import type { ChatMessage } from '../types';

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error('Chat request failed');
  const data = await res.json();
  return data.text;
}

export async function fetchTTSAudio(text: string): Promise<ArrayBuffer> {
  const res = await fetch(`${API_BASE_URL}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error('TTS request failed');
  return res.arrayBuffer();
}
