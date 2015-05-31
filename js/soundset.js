
//Each instrument is going to have at least one sound in it, but some will definitely have more.
//Drumkits and the planned "funny SFX" module, in particular, will have a bunch.
//I'll have to rewrite parts of the audio routine to support that.


//Some of these sounds need tweaking. 1 and 5 come to mind.
//Are there any other parameters that might come in handy?
var soundSet = new Array(175); //128 sounds for the general MIDI instruments, 46 more for the base percussion map; index 0 is silence.
soundSet[0] = ["00 - Silence", './sounds/00.mp3'];
soundSet[1] = ["01 - Grand Piano", './sounds/01.ogg']; //Name and reference sound for a simple one-sound instrument.
soundSet[2] = ["02 - Bright Piano", './sounds/02.ogg']; 
soundSet[3] = ["03 - Ultrabright Piano", './sounds/03.ogg']; 
soundSet[4] = ["04 - Honky-Tonk", './sounds/04.ogg'];
soundSet[5] = ["05 - Rhodes", './sounds/05.ogg']; 
soundSet[6] = ["06 - Cheesy DX7", './sounds/06.ogg'];
soundSet[7] = ["07 - Harpsichord", './sounds/07.ogg']; 
soundSet[8] = ["08 - Clavinet", './sounds/08.ogg'];  
soundSet[11] = ["11 - Vibraphone", './sounds/11.mp3'];
soundSet[24] = ["24 - Nylon String Guitar", './sounds/24.mp3']; 
soundSet[30] = ["30 - Overdriven Guitar", './sounds/30.mp3'];
soundSet[31] = ["31 - Distorted Guitar", './sounds/31.mp3'];
soundSet[39] = ["39 - YM2612 Amp Bass", './sounds/39.mp3'];
soundSet[46] = ["46 - Harp", './sounds/46.mp3'];
soundSet[48] = ["48 - String Section", './sounds/48.mp3'];
soundSet[56] = ["56 - Trumpet", './sounds/56.mp3'];
soundSet[80] = ["80 - Square Waveform", './sounds/80.mp3'];
soundSet[81] = ["81 - Sawtooth Waveform", './sounds/81.mp3'];
soundSet[127] = ["127 - Gunshot", './sounds/127.mp3'];
//Beginning of the percussion map
soundSet[128] = ["P01 - Acoustic Bass Drum", './sounds/128.mp3'];
soundSet[131] = ["P04 - Acoustic Snare", './sounds/131.mp3'];
soundSet[132] = ["P05 - Hand Clap", './sounds/132.mp3'];
soundSet[133] = ["P06 - Electric Snare", './sounds/133.mp3'];
soundSet[135] = ["P08 - Closed Hi Hat", './sounds/135.mp3'];
soundSet[137] = ["P10 - Pedal Hi Hat", './sounds/137.mp3'];
soundSet[139] = ["P12 - Open Hi Hat", './sounds/139.mp3'];
soundSet[142] = ["P15 - Crash Cymbal 1", './sounds/142.mp3'];

//soundSet[i][1] can either be a string, or an array. If it's an array, we'll need to override the pitchtable logic.