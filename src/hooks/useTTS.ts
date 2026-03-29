import { useCallback, useRef } from 'react';
import { fetchTTSAudio } from '../utils/api';
import { useAudioPlayback } from './useAudioPlayback';
import { useAppStore } from '../stores/appStore';

export function useTTS() {
  const { playAudio } = useAudioPlayback();
  const speakingRef = useRef(false);
  const setAnimationState = useAppStore((s) => s.setAnimationState);

  const speak = useCallback(async (text: string) => {
    if (speakingRef.current) return;
    speakingRef.current = true;

    try {
      const audioBuffer = await fetchTTSAudio(text);
      await playAudio(audioBuffer);
    } catch (error) {
      console.error('TTS error:', error);
      setAnimationState('happy');
      setTimeout(() => {
        setAnimationState('idle');
      }, 2000);
    } finally {
      speakingRef.current = false;
    }
  }, [playAudio, setAnimationState]);

  return { speak };
}
