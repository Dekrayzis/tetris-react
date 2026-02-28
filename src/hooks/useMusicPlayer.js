import { Howl, Howler } from 'howler';

// Use to control Track Instances.
let trackOne, trackTwo;

let pendingUnloadTimers = [];
let pendingFadeTimers = [];
let pendingMasterFadeTimers = [];

const clearPendingUnloadTimers = () => {

    pendingUnloadTimers.forEach((t) => {
        try {
            clearTimeout(t);
        } catch (e) {
            // ignore
        }
    });
    pendingUnloadTimers = [];

};

const clearPendingFadeTimers = () => {

    pendingFadeTimers.forEach((t) => {
        try {
            clearTimeout(t);
        } catch (e) {
            // ignore
        }
    });

    pendingFadeTimers = [];

};

const clearPendingMasterFadeTimers = () => {

    pendingMasterFadeTimers.forEach((t) => {
        try {
            clearTimeout(t);
            clearInterval(t);
        } catch (e) {
            // ignore
        }
    });

    pendingMasterFadeTimers = [];

};

const hardStopAndUnload = (track) => {

    if (!track) {
        return;
    }

    try {
        if (typeof track.stop === 'function') {
            track.stop();
        }
        if (typeof track.unload === 'function') {
            track.unload();
        }
    } catch (e) {
        // ignore
    }

};

const fadeStopAndUnload = (track, fadeDuration = 500) => {

    if (!track) {
        return;
    }

    try {
        const currentVolume = typeof track.volume === 'function' ? track.volume() : 1;
        if (typeof track.fade === 'function') {
            track.fade(currentVolume, 0, fadeDuration);
        }

        const timerId = setTimeout(() => {
            try {
                if (typeof track.stop === 'function') {
                    track.stop();
                }
                if (typeof track.unload === 'function') {
                    track.unload();
                }
            } catch (e) {
                // ignore
            }
        }, fadeDuration + 25);

        pendingUnloadTimers.push(timerId);
    } catch (e) {
        // ignore
    }

};

export const fadeAudio = (track, toVolume = 0, fadeDuration = 3000) => {

    if (!track) {
        return;
    }

    try {
        const currentVolume = typeof track.volume === 'function' ? track.volume() : 1;
        if (typeof track.fade === 'function') {
            track.fade(currentVolume, toVolume, fadeDuration);
        } else if (typeof track.volume === 'function') {
            track.volume(toVolume);
        }

        // Some browsers / audio backends can leave a tiny residual volume.
        // Snap to exact volume after fade completes.
        const timerId = setTimeout(() => {
            try {
                if (typeof track.volume === 'function') {
                    track.volume(toVolume);
                }
                if (toVolume === 0 && typeof track.mute === 'function') {
                    track.mute(true);
                }
            } catch (e) {
                // ignore
            }
        }, fadeDuration + 25);

        pendingFadeTimers.push(timerId);
    } catch (e) {
        // ignore
    }

};

export const fadeMasterAudio = (toVolume = 0, fadeDuration = 2000) => {

    try {
        clearPendingMasterFadeTimers();

        if (!Howler) {
            return;
        }

        if (typeof Howler.mute === 'function') {
            Howler.mute(false);
        }

        // Use manual stepped fade. This is more reliable than Howler.fade() across
        // different audio backends and avoids abrupt cuts.
        const startVolume = typeof Howler.volume === 'function' ? Howler.volume() : 1;
        const from = (startVolume === 0 || Number.isNaN(startVolume)) ? 1 : startVolume;
        const steps = 24;
        const stepMs = Math.max(16, Math.floor(fadeDuration / steps));
        let i = 0;

        const intervalId = setInterval(() => {
            try {
                i += 1;
                const t = Math.min(1, i / steps);
                const next = from + (toVolume - from) * t;
                if (typeof Howler.volume === 'function') {
                    Howler.volume(next);
                }

                if (t >= 1) {
                    clearInterval(intervalId);
                    if (typeof Howler.volume === 'function') {
                        Howler.volume(toVolume);
                    }
                    if (toVolume === 0 && typeof Howler.mute === 'function') {
                        Howler.mute(true);
                    }
                }
            } catch (e) {
                // ignore
            }
        }, stepMs);

        pendingMasterFadeTimers.push(intervalId);
    } catch (e) {
        // ignore
    }

};

export const silenceMasterAfter = (delayMs = 0) => {

    try {
        clearPendingMasterFadeTimers();

        const timerId = setTimeout(() => {
            try {
                if (!Howler) {
                    return;
                }

                if (typeof Howler.volume === 'function') {
                    Howler.volume(0);
                }
                if (typeof Howler.mute === 'function') {
                    Howler.mute(true);
                }
            } catch (e) {
                // ignore
            }
        }, Math.max(0, delayMs));

        pendingMasterFadeTimers.push(timerId);
    } catch (e) {
        // ignore
    }

};

export const resetMasterAudio = () => {

    try {
        clearPendingMasterFadeTimers();

        if (!Howler) {
            return;
        }

        if (typeof Howler.mute === 'function') {
            Howler.mute(false);
        }
        if (typeof Howler.volume === 'function') {
            Howler.volume(1);
        }
    } catch (e) {
        // ignore
    }

};

export const musicPlayer = (setTrackInstance1, setTrackInstance2, trackInstance1, trackInstance2, track1, track2) => {

    let soundDuration;

    // Singleton helper to build similar instances
    let createHowlerInstance = function (track, onload) {
        return new Howl({
            src: track,
            loop: true,
            volume: 0,
            onload: onload
        });
    };

    // Ensure nothing from the previous level can continue playing.
    clearPendingUnloadTimers();
    clearPendingFadeTimers();
    clearPendingMasterFadeTimers();

    // If we previously faded the global volume to 0 (results screen), restore it
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

    // Create "slave" instance. This instance is meant
    // to be played after the first one is done.
    if (track2) {

        trackInstance2 = createHowlerInstance([track2]);
        trackTwo = trackInstance2;
        setTrackInstance2(trackTwo);

    } else {
        setTrackInstance2(null);
        trackTwo = null;
    }

    // Create "master" instance. The onload function passed to
    // the single on create will coordinate the crossfaded loop.
    trackInstance1 = createHowlerInstance([track1], () => {

        // Ensure the track actually starts playing (reliable under Vite).
        // Use public API duration() instead of private _duration.
        const durationSeconds = typeof trackInstance1.duration === 'function' ? trackInstance1.duration() : 0;
        soundDuration = Math.floor((durationSeconds || 0) * 1000);

        // If duration is unknown (0) we still want the music to play.
        // For now we just loop the current track and fade it in.
        try {
            trackInstance1.play();
            trackInstance1.fade(0, 0.7, 800);
        } catch (e) {
            // ignore
        }

        trackOne = trackInstance1;
        setTrackInstance1(trackOne);

    });

};

/**
 * Fade between two tracks.
 */
const crossfadedLoop = (enteringInstance, leavingInstance, soundDuration, crossfadeDuration) => {

    if (!crossfadeDuration)
        crossfadeDuration = 5000;

    let volume = 0.7;

    // Fade in entering instance
    if (enteringInstance){
        
        // Avoid using this loop if we don't have a duration (it would immediately fade out).
        if (!soundDuration || Number.isNaN(soundDuration)) {
            try {
                enteringInstance.play();
                enteringInstance.fade(0, volume, 800);
            } catch (e) {
                // ignore
            }
            return;
        }

        enteringInstance.pos(0).play();
        enteringInstance.fade(0, volume, crossfadeDuration, 0);

        // Wait for the audio end to fade out entering instance
        // white fading in leaving instance
        setTimeout(() => {

            enteringInstance.fade(volume, 0, crossfadeDuration);
            crossfadedLoop(leavingInstance, enteringInstance);

        }, soundDuration - crossfadeDuration);
    
    }

};

/**
 * Fades out a single track.
 * 
 * @param {object} track - track currently playing.
 * @public
 */
export const stopAudio = (track, fadeDuration, crossfadeDuration) => {

    const options = typeof crossfadeDuration === 'object' && crossfadeDuration !== null ? crossfadeDuration : null;
    const immediate = Boolean(options && options.immediate);
    const stopAll = Boolean(options && options.stopAll);

    if (immediate) {
        clearPendingUnloadTimers();
        clearPendingFadeTimers();
        clearPendingMasterFadeTimers();

        if (stopAll) {
            try {
                if (Howler && typeof Howler.stop === 'function') {
                    Howler.stop();
                }
                if (Howler && typeof Howler.unload === 'function') {
                    Howler.unload();
                }
            } catch (e) {
                // ignore
            }

            hardStopAndUnload(track);
            hardStopAndUnload(trackOne);
            hardStopAndUnload(trackTwo);
            trackOne = null;
            trackTwo = null;
            return;
        }

        hardStopAndUnload(track);
        return;
    }

    fadeStopAndUnload(track, fadeDuration || 800);

};