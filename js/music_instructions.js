/* This file defines the instructions and parameters on every tile.
 * Currently the following are available:
 * 1. Note indicator
 * 2. Instrument indicator
 * 3. Audio effects (DSP stuff, the names of which will alias to various audio functions)
 * 4. Flow control effects (Things like teleports, turn signals, etc.)
 *
 * There are various overlays and coloring techniques used to distinguish tiles based on their contents.
 * However, most of them are handled by the render() function in main.js. 
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

//It might be good to improve the DSP menu simular to how Flow control was improved. We need more of these. 
//Allpass doesn't work yet.
var possibleDSPEffects = ['none','bendpitch', 'lowpass', 'bandpass', 'highpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'stopplayback', 'startfromlater'];
var possibleFlowEffects =['none','turn_west', 'turn_north', 'turn_east', 'turn_south', 'counter','incrementer','teleport', 'freeze', 'revert'];
//To be implemented: "random_tile", which will send the bug to a random tile within a user defined range.


//Possible extension: Tiles that only affect certain bugs. For N bugs we will need 2^N intspace to handle it.
//For instance: 10000001 would change the behavior of bugs 1 and 8 (equivalent to 129).
var Tile = function(note, instrument, dspEffect, flowEffect, volume, dspValue, flowValue, color, xPointer, yPointer, audioEffectList) {
    this.note = note; //Note ID to relative pitch conversion now takes place when the tile is instanced, for save-load compatibility
    this.instrument = instrument;
    this.dspEffect = dspEffect; //dspEfect and flowEffect are only for backwards compatibility.
    this.flowEffect = flowEffect;
    this.volume = volume;
    this.dspValue = dspValue;
    this.flowValue = flowValue;
    this.audioEffectList = audioEffectList; //A list of up to 8 audioEffect objects.
    if(this.volume === undefined) { this.volume = 0.6; }
    if(this.dspValue === undefined) { this.dspValue = 0; }
    if(this.flowValue === undefined) { this.flowValue = 0; }
    this.color = this.updateColor();
    //xPointer and yPointer have to be set after the tile is instanced through the tile editing window, but they default to 0,0.
    if(xPointer !== undefined) { this.xPointer = xPointer; } else { this.xPointer = 0; }
    if(yPointer !== undefined) { this.yPointer = yPointer; } else { this.yPointer = 0; }

}

//Eventually add a 4th parameter to choose the visualization method?
Tile.prototype.updateColor = function updateColor() {
    //A basic coloration script using HSL and TinyColor.
    //Using generic variables for this allows me to switch things around to make different visualizations.
    //For now, color is derived from tile properties. Eventually, we'll add cosmetic color.
    var colorInstrumentDerivative = ((this.instrument)/128)*360;
    if(colorInstrumentDerivative >= 360) { colorInstrumentDerivative %= 360; } //Hues above 360 are invalid.
    var colorVolumeDerivative = (this.volume)*100; //Saturation.
    var colorPitchDerivative = Math.log2((this.note)*8)*(80/6); //(80/6) instead of (100/6) to improve overlay visibility.
    this.color = tinycolor("hsl " + colorInstrumentDerivative + 
                 " " + colorVolumeDerivative +
                 " " + colorPitchDerivative).toHexString();
    return this.color;
}

//Used in the save function.
Tile.prototype.toString = function exportTile() {
    var tileToString = this.note + "," + 
                       this.instrument  + "," + 
                       this.dspEffect  + "," + 
                       this.flowEffect + "," + 
                       this.volume  + "," + 
                       this.dspValue + "," + 
                       this.flowValue + "," +
                       this.xPointer + "," +
                       this.yPointer + "!!" +
                       JSON.stringify(this.audioEffectList);
    return tileToString;
}