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
var possibleDSPEffects = ['none','bendpitch', 'arpeggio', 'lowpass', 'hipass', 'resonance', 'stopplayback', 'pauseresume'];
var possibleFlowEffects =['none','turn_west', 'turn_north', 'turn_east', 'turn_south', 'turn_around', "freeze"];
//To be implemented: "teleport" and "counter". 'Counter' will turn into another tile after a bug steps on it enough.
//Also: "random_tile", which will send the bug to a random tile within a user defined range.


//Planned extension: Tile color.
//Possible extension: Tiles that only affect certain bugs. For N bugs we will need 2^N intspace to handle it.
//For instance: 10000001 would change the behavior of bugs 1 and 8 (equivalent to 129).
var Tile = function(note, instrument, dspEffect, flowEffect, volume, dspValue, flowValue, color) {
    this.note = note; //Note ID to relative pitch conversion now takes place when the tile is instanced, for save-load compatibility
    this.instrument = instrument;
    this.dspEffect = dspEffect;
    this.flowEffect = flowEffect;
    this.volume = volume;
    this.dspValue = dspValue;
    this.flowValue = flowValue;
    if(this.volume === undefined) { this.volume = 0.6; }
    if(this.dspValue === undefined) { this.dspValue = 0; }
    if(this.flowValue === undefined) { this.flowValue = 0; }
    //A basic coloration script using HSL and TinyColor.
    //Using generic variables for this allows me to switch things around to make different visualizations.
    //For now, color is derived from tile properties. Eventually, we'll add cosmetic color.
    var colorInstrumentDerivative = ((this.instrument)/soundSet.length)*360;
    if(colorInstrumentDerivative >= 360) { colorInstrumentDerivative %= 360; } //Hues above 360 are invalid.
    //Not 100 because I don't want to get too bright.
    var colorVolumeDerivative = (this.volume)*80; 
    var colorPitchDerivative = Math.log2((this.note)*8)*(100/6);
    this.color = tinycolor("hsl " + colorInstrumentDerivative + 
                 " " + colorVolumeDerivative +
                 " " + colorPitchDerivative).toHexString();
}

//Used in the save function.
Tile.prototype.toString = function exportTile() {
    var tileToString = this.note + "," + 
                       this.instrument  + "," + 
                       this.dspEffect  + "," + 
                       this.flowEffect + "," + 
                       this.volume  + "," + 
                       this.dspValue + "," + 
                       this.flowValue;
    return tileToString;
}