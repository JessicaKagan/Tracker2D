//Actual audio playback is now in its own file, which may increase readability in the long run.

function soundsAreReady(soundList) {
    soundsAreReady.called = true;
    //console.log(soundList);
    //Populate soundFont with all the sounds we need.
    soundFont = [];
    for(var i = 0; i < soundList.length; ++i) {
        soundFont.push(soundList[i]); //We fill up SoundFont with sounds...
    }
    $("#initButton").html("Loaded, click to write music"); //Clicking this button calls init().
}

function playSound(buffer, pitch, dspEffect, dspValue, volume) {

    var source = audioEngine.createBufferSource();  
    source.buffer = buffer;
    var playbackMidPoint = source.buffer.duration; //Fallback.
    source.playbackRate.value = pitch; 

    //Volume adjustment is handled before effects are added.
    var volumeAdjustment = audioEngine.createGain();
    source.connect(volumeAdjustment);
    //Very basic error trapping in case we get nasty input that might potentially cause clipping.
    if(volume >= 0 && volume <= 1) { 
        volumeAdjustment.gain.value = volume; 
    } else { volumeAdjustment.gain.value = 0.6; }

    //Decide how to handle audio when page isn't visible, see http://www.w3.org/TR/page-visibility/?csw=1
    /* To support an arbitrary amount of audio filters (probably limited for UI/save simplicity):
     * Define an array of nodes
     * Fill each one in based on parameters in a tile
     * Connect after defining them?
     */
    var biQuadFilter = audioEngine.createBiquadFilter();
    switch(dspEffect){
        //Removes all pitches above a value
        case 'lowpass':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'lowpass';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Removes all pitches below a value
        case 'hipass':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'highpass';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Removes all pitches that aren't near a value.
        case 'bandpass':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'bandpass';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Boosts frequencies below a value
        case 'lowshelf':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'lowshelf';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.gain.value = 6;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Boosts frequencies above a value
        case 'highshelf':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'highshelf';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.gain.value = 6;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Boosts frequencies between values
        case 'peaking':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'peaking';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.Q.value = 1;
            biQuadFilter.gain.value = 6;
            console.log(biQuadFilter);
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Removes all pitches that ARE near a value
        case 'notch':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'notch';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.Q.value = 1;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Changes the "phase relationship" between frequencies.
        case 'allpass':
            volumeAdjustment.connect(biQuadFilter);
            biQuadFilter.type = 'allpass';
            biQuadFilter.frequency.value = dspValue;
            biQuadFilter.Q.value = 200;
            biQuadFilter.connect(audioEngine.destination);
            break;
        //Separate from all the frequency filters
        case 'bendpitch':
            if(dspValue <= 16 && dspValue > 0) { source.playbackRate.value *= dspValue; } 
            else { console.log('bendpitch only takes values between 0 and 16, for the sake of sanity. Effect not applied.'); }
            volumeAdjustment.connect(audioEngine.destination);
            break;

        case 'stopplayback': //These share some logic and operate on start() accordingly.
        case 'startfromlater':
            //Takes values between 0-100 (floating point) and converts them into percentages of the file's length.
            if(dspValue >= 0 && dspValue < 100) {
                playbackMidPoint = source.buffer.duration * (dspValue/100);
            }
            volumeAdjustment.connect(audioEngine.destination);
            break;
        default:
            volumeAdjustment.connect(audioEngine.destination);
            break;
    }
    //console.log(playbackMidPoint);
    if(dspEffect == 'stopplayback'){
        source.start(0,0,playbackMidPoint); //Stops playing after a percentage of the duration.
    } else if(dspEffect == 'startfromlater') {
        source.start(0,playbackMidPoint); //Starts playing in the middle of the sound.
    } else {
        source.start(); //By default, we play the entire sound.
    } 
    
}
