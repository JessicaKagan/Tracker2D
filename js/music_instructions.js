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
//We need more of these. 'Counter' will turn into another effect after a bug steps on it enough.
var possibleDSPEffects = ['none','bendpitch', 'arpeggio'];
var possibleFlowEffects =['none','turn_west', 'turn_north', 'turn_east', 'turn_south', 'teleport', 'counter'];



var Tile = function(note, instrument, dspEffect, flowEffect) {
    this.note = pitchTable[note]; //If we make colors correspond to pitches, we'll need logarithms or something.
    this.instrument = instrument;
    this.dspEffect = dspEffect;
    this.FlowEffect = flowEffect;

    function updateValues(note, instrument, dspEffect, flowEffect) {
        console.log("Not implemented yet");
    }
}

