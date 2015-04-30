
//Each instrument is going to have at least one sound in it, but some will definitely have more.
//Drumkits and the planned "funny SFX" module, in particular, will have a bunch.
//I'll have to rewrite parts of the audio routine to support that.


//Some of these sounds need tweaking. 1 and 5 come to mind.
//Are there any other parameters that might come in handy?
var soundSet = new Array(129); //128 sounds for the general MIDI instruments; index 0 is silence.
soundSet[0] = ["00 - Silence", './sounds/00.mp3'];
soundSet[1] = ["01 - Grand Piano", './sounds/01.mp3']; //Name and reference sound for a simple one-sound instrument.
soundSet[5] = ["05 - DX7", './sounds/05.mp3']; 
soundSet[6] = ["06 - Harpsichord", './sounds/06.mp3'];
soundSet[24] = ["24 - Nylon String Guitar", './sounds/24.mp3']; 
soundSet[30] = ["30 - Overdriven Guitar", './sounds/30.mp3'];
soundSet[31] = ["31 - Distorted Guitar", './sounds/31.mp3'];
//soundSet[i][1] can either be a string, or an array. If it's an array, we'll need to override the pitchtable logic.