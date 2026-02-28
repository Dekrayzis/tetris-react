import { Howl, Howler } from 'howler';
import { isMuted } from '../util/isMuted';

export type TrackInstance = Howl | null;
type TimeoutId = ReturnType<typeof window.setTimeout>;
type IntervalId = ReturnType<typeof window.setInterval>;

export interface StopAudioOptions {
    immediate?: boolean;
    stopAll?: boolean;
}

const swallow = (fn: () => void): void => {
    try {
        fn();
    } catch (e) {
        // ignore
    }
};

const DEFAULT_TRACK_VOLUME = 0.7;
const DEFAULT_FADE_IN_MS = 800;

// Used to control Track Instances.
let trackOne: TrackInstance = null;
let trackTwo: TrackInstance = null;

let pendingUnloadTimers: TimeoutId[] = [];
let pendingFadeTimers: TimeoutId[] = [];
let pendingMasterFadeTimers: Array<TimeoutId | IntervalId> = [];

const createHowlerInstance = (track: string[], onload?: () => void): TrackInstance => {
    return new Howl({
        src: track,
        loop: true,
        volume: 0,
        onload: onload,
    });
};

const clearPendingUnloadTimers = (): void => {
    pendingUnloadTimers.forEach((t) => {
        swallow(() => window.clearTimeout(t));
    });
    pendingUnloadTimers = [];
};

const clearPendingFadeTimers = (): void => {
    pendingFadeTimers.forEach((t) => {
        swallow(() => window.clearTimeout(t));
    });
    pendingFadeTimers = [];
};

const clearPendingMasterFadeTimers = (): void => {
    pendingMasterFadeTimers.forEach((t) => {
        swallow(() => {
            window.clearTimeout(t as TimeoutId);
            window.clearInterval(t as IntervalId);
        });
    });
    pendingMasterFadeTimers = [];
};

const stopAndUnload = (track: TrackInstance): void => {
    if (!track) return;
    swallow(() => {
        track.stop();
        track.unload();
    });
};

const hardStopAndUnload = (track: TrackInstance): void => {
    if (!track) {
        return;
    }

    stopAndUnload(track);
};

const fadeStopAndUnload = (track: TrackInstance, fadeDuration: number = 500): void => {
    if (!track) {
        return;
    }

    swallow(() => {
        const currentVolume = track.volume();
        track.fade(currentVolume, 0, fadeDuration);

        const timerId = window.setTimeout(() => stopAndUnload(track), fadeDuration + 25);
        pendingUnloadTimers.push(timerId);
    });
};

export const fadeAudio = (track: TrackInstance, toVolume: number = 0, fadeDuration: number = 3000): void => {
    if (!track) {
        return;
    }

    swallow(() => {
        const currentVolume = track.volume();
        track.fade(currentVolume, toVolume, fadeDuration);

        const timerId = window.setTimeout(() => {
            swallow(() => {
                track.volume(toVolume);
                if (toVolume === 0) {
                    track.mute(true);
                }
            });
        }, fadeDuration + 25);

        pendingFadeTimers.push(timerId);
    });
};

export const fadeMasterAudio = (toVolume: number = 0, fadeDuration: number = 2000): void => {
    swallow(() => {
        clearPendingMasterFadeTimers();

        if (!isMuted()) {
            Howler.mute(false);
        }

        // Manual stepped fade. This is more reliable than Howler.fade() across
        // different audio routes and avoids abrupt cuts.
        const startVolume = Howler.volume();

        const from = (startVolume === 0 || Number.isNaN(startVolume)) ? 1 : startVolume;
        const steps = 24;
        const stepMs = Math.max(16, Math.floor(fadeDuration / steps));
        let i = 0;

        const intervalId = window.setInterval(() => {
            swallow(() => {
                i += 1;
                const t = Math.min(1, i / steps);
                const next = from + (toVolume - from) * t;

                Howler.volume(next);

                if (t >= 1) {
                    window.clearInterval(intervalId);
                    Howler.volume(toVolume);
                    if (toVolume === 0) {
                        Howler.mute(true);
                    }
                }
            });
        }, stepMs);

        pendingMasterFadeTimers.push(intervalId);
    });
};

export const silenceMasterAfter = (delayMs: number = 0): void => {
    swallow(() => {
        clearPendingMasterFadeTimers();

        const timerId = window.setTimeout(() => {
            swallow(() => {
                Howler.volume(0);
                Howler.mute(true);
            });
        }, Math.max(0, delayMs));

        pendingMasterFadeTimers.push(timerId);
    });
};

export const resetMasterAudio = (): void => {
    swallow(() => {
        clearPendingMasterFadeTimers();

        Howler.volume(1);
        Howler.mute(isMuted());
    });
};

export const musicPlayer = (
    setTrackInstance1: (t: TrackInstance) => void,
    setTrackInstance2: (t: TrackInstance) => void,
    trackInstance1: TrackInstance,
    trackInstance2: TrackInstance,
    track1: string,
    track2?: string
): void => {
    let soundDuration;

    // Ensure nothing from the previous level can continue playing.
    clearPendingUnloadTimers();
    clearPendingFadeTimers();
    clearPendingMasterFadeTimers();

    // If previously faded the global volume to 0 (results screen), restore it
    // so the next level track can be heard.
    resetMasterAudio();

    hardStopAndUnload(trackInstance1);
    hardStopAndUnload(trackInstance2);
    hardStopAndUnload(trackOne);
    hardStopAndUnload(trackTwo);

    setTrackInstance1(null);
    setTrackInstance2(null);
    trackOne = null;
    trackTwo = null;

    // Creates "slave" instance. This instance is meant
    // to be played after the first one is done.
    if (track2) {
        trackInstance2 = createHowlerInstance([track2]);
        trackTwo = trackInstance2;
        setTrackInstance2(trackTwo);
    } else {
        setTrackInstance2(null);
        trackTwo = null;
    }

    // Creates "master" instance. The onload function passed to
    // the single on create will coordinate the crossfaded loop.
    const instance1 = createHowlerInstance([track1], () => {
        if (!instance1) return;

        const durationSeconds = instance1.duration();
        soundDuration = Math.floor((durationSeconds || 0) * 1000);

        swallow(() => {
            instance1.play();
            instance1.fade(0, DEFAULT_TRACK_VOLUME, DEFAULT_FADE_IN_MS);
        });

        trackOne = instance1;
        setTrackInstance1(trackOne);
    });

    trackInstance1 = instance1;
};

/**
 * Fade between two tracks.
 */
const crossfadedLoop = (
    enteringInstance: TrackInstance | null,
    leavingInstance: TrackInstance | null,
    soundDuration?: number,
    crossfadeDuration: number = 5000
): void => {

    let volume = DEFAULT_TRACK_VOLUME;

    // Fade in entering instance
    if (enteringInstance) {
        // Avoids using this loop if we don't have a duration (it would immediately fade out).
        if (!soundDuration || Number.isNaN(soundDuration)) {
            swallow(() => {
                enteringInstance.play();
                enteringInstance.fade(0, volume, DEFAULT_FADE_IN_MS);
            });
            return;
        }

        enteringInstance.pos(0).play();
        enteringInstance.fade(0, volume, crossfadeDuration, 0);

        // Wait for the audio end to fade out entering instance
        // white fading in leaving instance
        const timerId = window.setTimeout(() => {
            enteringInstance.fade(volume, 0, crossfadeDuration);
            crossfadedLoop(leavingInstance, enteringInstance, soundDuration, crossfadeDuration);
        }, soundDuration - crossfadeDuration);

        pendingUnloadTimers.push(timerId);
    }
};

/**
 * Fades out a single track.
 * 
 * @param {object} track - track currently playing.
 * @public
 */
export const stopAudio = (
    track: TrackInstance,
    fadeDuration: number,
    crossfadeDuration?: number | StopAudioOptions
): void => {
    const options = (typeof crossfadeDuration === 'object' && crossfadeDuration !== null)
        ? (crossfadeDuration as StopAudioOptions)
        : null;
    const immediate = Boolean(options && options.immediate);
    const stopAll = Boolean(options && options.stopAll);

    if (immediate) {
        clearPendingUnloadTimers();
        clearPendingFadeTimers();
        clearPendingMasterFadeTimers();

        if (stopAll) {
            swallow(() => {
                Howler.stop();
                Howler.unload();
            });

            stopAndUnload(track);
            stopAndUnload(trackOne);
            stopAndUnload(trackTwo);
            trackOne = null;
            trackTwo = null;
            return;
        }

        stopAndUnload(track);
        return;
    }

    fadeStopAndUnload(track, fadeDuration || 800);
};