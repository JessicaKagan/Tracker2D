//Under construction.
//The goal here is to create some JSON representing all the audio effects

//An array of audio effects are what we need.
function audioEffect(type){
    this.type = type;
    switch(type){
        case "lowpass":
        case "highpass":
            this.requiredOptions = ['frequency','range','gain'];
            this.frequency = "200";
            this.range = "200";
            this.gain = "4.0";
            break;
        default:
            break;
    }
}

/*
audioEffect.prototype.toString = function() {
    
}
*/

//Possible syntax for the new audio FX.
/*fieldContents[0][1].audioEffects = [audioEffect {type: "lowpass", requiredOptions: Array[3], frequency: "200", range: "200", gain: "4.0"},
                                      audioEffect {type: "hipass", requiredOptions: Array[3], frequency: "800", range: "200", gain: "2.0"}]
*/
