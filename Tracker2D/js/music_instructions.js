/* This file defines the instructions and parameters on every tile.
 * Currently the following are planned:
 * 1. Note indicator
 * 2. Instrument indicator
 * 3. Audio effects (DSP stuff, the names of which will alias to various audio functions)
 * 4. Flow control effects (Things like teleports, turn signals, etc.)
 *
 * In the future, I might add various art features to style the look of a tile without changing its function.
 *
 * TODO: Look at https://github.com/corbanbrook/dsp.js/
 */

//Defining a basic frequency multiplier for notes. For simplicity's sake, I am going to use 12-TET.
//Later, I may switch to just intonation or (in the distant future) even allow users to switch between tuning systems.
var pitchTable = Array(72);
pitchTable[0] = (1/8); //Chosen so that the midpoint (36) has a rate of "1" (44100 Hz)
for(var i = 1; i < pitchTable.length; ++i){
    pitchTable[i] = pitchTable[i - 1] * Math.pow(2, (1/12));
}

//Might need better names, but this is a way to think about effects. Aliases, I guess.
//We need more of these. 
//How are we going to combine arbitrary DSP filters on one instrument? 
//We might need to rebuild the playback routine for this...
var possibleDSPEffects = ['none','bendpitch', 'arpeggio', 'lowpass', 'hipass', 'resonance'];
var possibleFlowEffects =['none','turn_west', 'turn_north', 'turn_east', 'turn_south', 'turn_around'];
//To be implemented: "teleport" and "counter". 'Counter' will turn into another effect after a bug steps on it enough.
//Also: "random_tile", which will send the bug to a random tile within a user defined range.



var Tile = function(note, instrument, dspEffect, flowEffect, volume, dspValue, flowValue) {
    this.note = pitchTable[note]; //If we make colors correspond to pitches, we'll need logarithms or something.
    this.instrument = instrument;
    this.dspEffect = dspEffect;
    this.flowEffect = flowEffect;
    this.volume = volume;
    this.dspValue = dspValue;
    this.flowValue = flowValue;
    if(this.volume === undefined) { this.volume = 1; }
    if(this.dspValue === undefined) { this.dspValue = 0; }
    if(this.flowValue === undefined) { this.flowValue = 0; }

    //I think this might be residue that needs to be flushed out.
    function updateValues(note, instrument, dspEffect, flowEffect) {
        console.log("Not implemented yet");
    }

}

