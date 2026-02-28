import { useCallback, useMemo, useState } from 'react';
import { useInterval } from './useInterval';
import { formatMmSs } from '../util/formatMmSs';

export function useGameTimer() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [intervalMs, setIntervalMs] = useState<number | null>(null);

  const elapsedTime = useMemo(() => formatMmSs(totalSeconds), [totalSeconds]);

  const reset = useCallback(() => {
    setTotalSeconds(0);
  }, []);

  const pause = useCallback(() => {
    setIntervalMs(null);
  }, []);

  const resume = useCallback((ms: number = 1000) => {
    setIntervalMs(ms);
  }, []);

  useInterval(() => {
    setTotalSeconds((prev) => prev + 1);
  }, intervalMs);

  return {
    totalSeconds,
    elapsedTime,
    intervalMs,
    setIntervalMs,
    reset,
    pause,
    resume,
  };
}
