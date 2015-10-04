//Under construction.
//The goal here is to create some JSON representing all the audio effects?

var currentAudioEffects = new Array(new audioEffect("none")); //Used for painting tools, too. Extensible up to 8 effects.

//An array of audio effects are what we need.
function audioEffect(type){
    this.type = type;
    switch(type){
        case "lowpass":
        case "highpass":
        case "bandpass":
            this.frequency = 200;
            this.range = 200;
            this.gain = 4.0;
            break;
        case "bendpitch":
            this.multiplier = 1;
        case "none":
            //Any sort of code needed here? Not sure.
            break;
        default:
            break;
    }
}

/*
audioEffect.prototype.toString = function() {
    
}
*/
