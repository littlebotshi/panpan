import { useSpeechInput } from '../hooks/useSpeechInput';

export function MicButton({ onResult }: { onResult: (text: string) => void }) {
  const { isListening, isSupported, startListening, stopListening } = useSpeechInput(onResult);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      className={`mic-button ${isListening ? 'listening' : ''}`}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Stop listening' : 'Speak to Panpan'}
    >
      {isListening ? '⏹' : '🎤'}
    </button>
  );
}
