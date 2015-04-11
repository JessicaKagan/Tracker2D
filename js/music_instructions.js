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

var Tile = function(note, instrument, dspEffect, flowEffect) {
    this.note = note;
    this.instrument = instrument;
    this.dspEffect = dspEffect;
    this.FlowEffect = flowEffect;

    function updateValues(note, instrument, dspEffect, flowEffect) {
        console.log("Not implemented yet");
    }
}


