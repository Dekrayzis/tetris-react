import { Howl } from 'howler';

// Use to control Track Instances.
let trackOne, trackTwo;

export const musicPlayer = (setTrackInstance1, setTrackInstance2, trackInstance1, trackInstance2, track1, track2) => {

    let soundDuration;

    // Singleton helper to build similar instances
    let createHowlerInstance = function (track, onload) {
        return new Howl({
            src: track,
            loop: true,
            volume: 1,
            onload: onload
        });
    };

    // Create "slave" instance. This instance is meant
    // to be played after the first one is done.
    if (trackInstance2){

        trackInstance2 = createHowlerInstance([track2]);
        trackTwo = trackInstance2;
        setTrackInstance2(trackTwo);

    }

    // Create "master" instance. The onload function passed to
    // the single on create will coordinate the crossfaded loop.
    trackInstance1 = createHowlerInstance([track1], () => {

        // Get the sound duration in ms from the Howler engine
        soundDuration = Math.floor(trackInstance1._duration * 1000);
        crossfadedLoop(trackInstance1, null, soundDuration);

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
        
        enteringInstance.pos(0).play()
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

    crossfadedLoop(track, null, fadeDuration, crossfadeDuration)
    setTimeout(() => {
        track.stop();
    }, 6000);
    
};