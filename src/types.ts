export type AnimationState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'talking'
  | 'happy'
  | 'waving'
  | 'dancing'
  | 'celebrating';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
