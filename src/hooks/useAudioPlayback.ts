import { useCallback, useRef } from 'react';
import { useAppStore } from '../stores/appStore';

export function useAudioPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const { setMouthAmplitude, setAnimationState, setIsPlaying } = useAppStore();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    return { ctx: audioContextRef.current, analyser: analyserRef.current! };
  }, []);

  const updateAmplitude = useCallback((analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      // Calculate RMS amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const normalized = Math.min(1, rms * 3); // Amplify for visible mouth movement
      setMouthAmplitude(normalized);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [setMouthAmplitude]);

  const playAudio = useCallback(async (arrayBuffer: ArrayBuffer) => {
    const { ctx, analyser } = getAudioContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(ctx.destination);

    setAnimationState('talking');
    setIsPlaying(true);

    updateAmplitude(analyser);

    return new Promise<void>((resolve) => {
      source.onended = () => {
        cancelAnimationFrame(rafRef.current);
        setMouthAmplitude(0);
        setIsPlaying(false);
        setAnimationState('happy');
        setTimeout(() => setAnimationState('idle'), 2000);
        resolve();
      };
      source.start(0);
    });
  }, [getAudioContext, updateAmplitude, setAnimationState, setIsPlaying, setMouthAmplitude]);

  return { playAudio };
}
