import { useCallback, useState } from 'react';
import { useInterval } from './useInterval';
import { useZoneProgress } from './useZoneProgress';

type UseZoneArgs = {
  rowsCleared: number;
  onPauseGameTimer: () => void;
  onResumeGameTimer: () => void;
};

export function useZone({ rowsCleared, onPauseGameTimer, onResumeGameTimer }: UseZoneArgs) {
  const [zoneProgress, setZoneProgress] = useState(100);
  const [zoneActive, setZoneActive] = useState(false);
  const [zoneIntervalMs, setZoneIntervalMs] = useState<number | null>(null);

  const [zoneRowCount, setZoneRows, zoneRowHeight, setHeight] = useZoneProgress(rowsCleared, zoneActive);

  const resetZone = useCallback(() => {
    setZoneActive((prev) => {
      if (prev) onResumeGameTimer();
      return false;
    });
    setZoneProgress(100);
    setZoneIntervalMs(null);
    setZoneRows(0);
    setHeight(0);
  }, [onResumeGameTimer, setHeight, setZoneRows]);

  const activateZone = useCallback(() => {
    if (zoneActive) return;
    if (zoneProgress !== 100) return;
    setZoneActive(true);
    setZoneIntervalMs(178);
    onPauseGameTimer();
  }, [onPauseGameTimer, zoneActive, zoneProgress]);

  useInterval(() => {
    if (!zoneActive || zoneIntervalMs == null) return;

    setZoneProgress((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setZoneActive(false);
        setZoneIntervalMs(null);
        onResumeGameTimer();
        setZoneRows(0);
        setHeight(0);
        return 0;
      }
      return next;
    });
  }, zoneIntervalMs);

  return {
    zoneProgress,
    setZoneProgress,
    zoneActive,
    zoneIntervalMs,
    resetZone,
    activateZone,
    zoneRowCount,
    zoneRowHeight,
  };
}
