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
    /*  To extend the sound system to take at least two audio effects at a time, 
     *  we'll need some sort of intermediate filter. (Source -> filter1 -> filter2 -> destination)
     *  Also necessary - a null filter that doesn't do anything that we can pass through as needed.
     *  Arpeggiation should not be handled through the DSP switch statement, but by a seperate playback linked into tempo?
     *
     */
    switch(dspEffect){
        case 'lowpass':
            var createLowPass = audioEngine.createBiquadFilter();
            volumeAdjustment.connect(createLowPass);
            createLowPass.connect(audioEngine.destination);
            createLowPass.type = 'lowpass';
            createLowPass.frequency.value = dspValue;
            break;
        case 'hipass':
            var createHighPass = audioEngine.createBiquadFilter();
            volumeAdjustment.connect(createHighPass);
            createHighPass.connect(audioEngine.destination);
            createHighPass.type = 'highpass';
            createHighPass.frequency.value = dspValue;
            break;
        case 'bandpass':
            var createBandPass = audioEngine.createBiquadFilter();
            volumeAdjustment.connect(createBandPass);
            createBandPass.connect(audioEngine.destination);
            createBandPass.type = 'bandpass';
            createBandPass.frequency.value = dspValue;
            break;
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
