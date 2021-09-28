import React, { Component } from 'react';
//import './music-player.css';

const AudioPlayer = function({track}) {

    return (
        <audio id="audio_player">
            <source id="src_mp3" type="audio/mp3" src={track}/>
            <source id="src_ogg" type="audio/ogg" src=""/>
            <object id="audio_object" type="audio/x-mpeg" width="200px" height="45px" data={track}>
                <param id="param_src" name="src" value={track} />
                <param id="param_src" name="src" value={track} />
                <param name="autoPlay" value="true" />
                <param name="controls" value="true" />
            </object>
        </audio>
    );

}
export default AudioPlayer;