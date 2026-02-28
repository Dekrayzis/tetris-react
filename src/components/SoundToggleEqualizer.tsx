import React, { useEffect, useMemo, useRef } from 'react';
import { Howler } from 'howler';

import styles from './SoundToggle.module.scss';

type SoundToggleEqualizerProps = {
  muted: boolean;
  columns?: number;
};

const peakHeights = [2, 8, 5, 14, 7, 3] as const;
const delayPatternMs = [0, 210, 80, 330, 140, 270, 40, 300, 110, 240, 20, 360] as const;

const SoundToggleEqualizer = ({ muted, columns = 18 }: SoundToggleEqualizerProps) => {
  const eqRef = useRef<HTMLDivElement | null>(null);
  const peaksRef = useRef<number[]>(Array.from({ length: columns }).map(() => 0));
  const syncedRef = useRef(false);

  useEffect(() => {
    peaksRef.current = Array.from({ length: columns }).map(() => 0);
  }, [columns]);

  const colStyles = useMemo(() => {
    return Array.from({ length: columns }).map((_, i) => {
      const a = peakHeights[i % peakHeights.length];
      const b = peakHeights[(i + 2) % peakHeights.length];
      const c = peakHeights[(i + 4) % peakHeights.length];

      return {
        ['--delay' as any]: `${delayPatternMs[i % delayPatternMs.length]}ms`,
        ['--p0' as any]: '2px',
        ['--p1' as any]: `${12 + a}px`,
        ['--p2' as any]: `${6 + b}px`,
        ['--p3' as any]: `${16 + c}px`,
        ['--p4' as any]: `${8 + a}px`,
        ['--p5' as any]: `${3 + (b % 4)}px`,
      } as React.CSSProperties;
    });
  }, [columns]);

  useEffect(() => {
    const root = eqRef.current;
    if (!root) return;

    if (muted) {
      syncedRef.current = false;
      try {
        root.classList.remove(styles.synced);
        root.classList.remove(styles.playing);
      } catch {
        // ignore
      }

      try {
        const cols = Array.from(root.querySelectorAll<HTMLElement>('[data-sound-col]'));
        for (let i = 0; i < cols.length; i += 1) {
          cols[i]!.style.setProperty('--bar', '0.0');
          cols[i]!.style.setProperty('--peak', '0px');
        }
      } catch {
        // ignore
      }

      return;
    }

    const audioCtx: AudioContext | undefined = (Howler as any).ctx;
    const masterGain: GainNode | undefined = (Howler as any).masterGain;

    if (audioCtx) {
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch {
        // ignore
      }
    }

    let analyser: AnalyserNode | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    if (audioCtx && masterGain) {
      try {
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.7;
        masterGain.connect(analyser);
      } catch {
        analyser = null;
      }
    }

    const cols = Array.from(root.querySelectorAll<HTMLElement>('[data-sound-col]'));
    const freq = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const setStatic = () => {
      for (let i = 0; i < cols.length; i += 1) {
        cols[i]!.style.setProperty('--bar', '0.0');
        cols[i]!.style.setProperty('--peak', '0px');
      }
    };

    let consecutiveEnergyFrames = 0;
    let consecutiveSilentFrames = 0;
    const setSyncedMode = (next: boolean) => {
      if (syncedRef.current === next) return;
      syncedRef.current = next;
      try {
        root.classList.toggle(styles.synced, next);
      } catch {
        // ignore
      }
    };

    const isAnyHowlPlaying = () => {
      const howls: any[] = (Howler as any)._howls ?? [];
      return Array.isArray(howls) && howls.some((h) => {
        try {
          return typeof h?.playing === 'function' ? h.playing() : false;
        } catch {
          return false;
        }
      });
    };

    const setPlayingMode = (next: boolean) => {
      try {
        root.classList.toggle(styles.playing, next);
      } catch {
        // ignore
      }
    };

    const tick = () => {
      if (cancelled) return;
      let hasEnergy = false;

      const anyPlaying = isAnyHowlPlaying();
      setPlayingMode(anyPlaying);

      if (!anyPlaying) {
        consecutiveEnergyFrames = 0;
        consecutiveSilentFrames += 1;
        if (consecutiveSilentFrames >= 2) {
          setSyncedMode(false);
          setStatic();
        }
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      if (!analyser || !freq) {
        setSyncedMode(false);
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      try {
        analyser.getByteFrequencyData(freq);
      } catch {
        // ignore
      }

      const usableBins = Math.max(1, Math.floor(freq.length * 0.85));
      const binsPerCol = Math.max(1, Math.floor(usableBins / cols.length));

      for (let i = 0; i < cols.length; i += 1) {
        const start = i * binsPerCol;
        const end = Math.min(usableBins, start + binsPerCol);

        let sum = 0;
        for (let j = start; j < end; j += 1) sum += freq[j] ?? 0;
        const avg = sum / Math.max(1, end - start);

        const level = Math.min(1, Math.max(0, avg / 255));

        const peakPx = Math.round(level * 18);
        const prevPeak = peaksRef.current[i] ?? 0;
        const nextPeak = peakPx > prevPeak ? peakPx : Math.max(0, prevPeak - 1);
        peaksRef.current[i] = nextPeak;

        cols[i]!.style.setProperty('--bar', String(level));
        cols[i]!.style.setProperty('--peak', `${nextPeak}px`);

        if (avg > 18) hasEnergy = true;
      }

      if (hasEnergy) {
        consecutiveEnergyFrames += 1;
        consecutiveSilentFrames = 0;
        if (consecutiveEnergyFrames >= 6) {
          setSyncedMode(true);
        }
      } else {
        consecutiveEnergyFrames = 0;
        consecutiveSilentFrames += 1;
        if (consecutiveSilentFrames >= 3) {
          setSyncedMode(false);
          setStatic();
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId != null) window.cancelAnimationFrame(rafId);

      if (masterGain && analyser) {
        try {
          masterGain.disconnect(analyser);
        } catch {
          // ignore
        }
      }

      if (analyser) {
        try {
          analyser.disconnect();
        } catch {
          // ignore
        }
      }

      setSyncedMode(false);
      setStatic();
    };
  }, [columns, muted]);

  return (
    <div ref={eqRef} className={`${styles.eq} ${muted ? styles.muted : ''}`.trim()} aria-hidden="true">
      {colStyles.map((style, i) => (
        <div key={i} className={styles.col} style={style} data-sound-col>
          <div className={styles.bar} />
          <div className={styles.peak} />
        </div>
      ))}
    </div>
  );
};

export default SoundToggleEqualizer;
