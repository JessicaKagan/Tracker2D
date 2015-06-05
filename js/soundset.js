
//Each instrument is going to have at least one sound in it, but some will definitely have more.
//Drumkits and the planned "funny SFX" module, in particular, will have a bunch.
//I'll have to rewrite parts of the audio routine to support that.


//Some of these sounds need tweaking. 1 and 5 come to mind.
//Are there any other parameters that might come in handy?
var soundSet = new Array(175); //128 sounds for the general MIDI instruments, 46 more for the base percussion map; index 0 is silence.

soundSet[0] = ["00 - Silence", './sounds/00.mp3']; //Name and reference sound for a simple one-sound instrument.
//Pianos
soundSet[1] = ["01 - Grand Piano", './sounds/01.ogg']; 
soundSet[2] = ["02 - Bright Piano", './sounds/02.ogg']; 
soundSet[3] = ["03 - Electric Piano", './sounds/03.ogg']; 
soundSet[4] = ["04 - Honky-Tonk", './sounds/04.ogg'];
soundSet[5] = ["05 - Rhodes", './sounds/05.ogg']; 
soundSet[6] = ["06 - Cheesy DX7", './sounds/06.ogg'];
soundSet[7] = ["07 - Harpsichord", './sounds/07.ogg']; 
soundSet[8] = ["08 - Clavinet", './sounds/08.ogg'];  
//Chromatic Percussion
soundSet[9] = ["09 - Celesta", './sounds/09.ogg'];
soundSet[10] = ["10 - Glockenspiel", './sounds/10.ogg']; 
soundSet[11] = ["11 - Music Box", './sounds/11.ogg']; 
soundSet[12] = ["12 - Vibraphone", './sounds/12.ogg']; 
soundSet[13] = ["13 - Marimba", './sounds/13.ogg']; 
soundSet[14] = ["14 - Xylophone", './sounds/14.ogg'];
soundSet[15] = ["15 - Tubular Bells", './sounds/15.ogg']; 
soundSet[16] = ["16 - Dulcimer", './sounds/16.ogg'];
//Organ
soundSet[17] = ["17 - Drawbar Organ", './sounds/17.ogg'];
soundSet[18] = ["18 - Percussive Organ", './sounds/18.ogg']; 
soundSet[19] = ["19 - Rock Organ", './sounds/19.ogg']; 
soundSet[20] = ["20 - Church Organ", './sounds/20.ogg']; 
soundSet[21] = ["21 - Reed Organ", './sounds/21.ogg']; 
soundSet[22] = ["22 - Accordion", './sounds/22.ogg'];
soundSet[23] = ["23 - Harmonica", './sounds/23.ogg']; 
soundSet[24] = ["24 - Tangoccordion", './sounds/24.ogg'];
//Guitar
soundSet[25] = ["25 - Nylon String Guitar", './sounds/25.ogg']; 
soundSet[26] = ["26 - Steel String Guitar", './sounds/26.ogg']; 
soundSet[27] = ["27 - Jazz Guitar", './sounds/27.ogg']; 
soundSet[28] = ["28 - Clean Electric Guitar", './sounds/28.ogg']; 
soundSet[29] = ["29 - Palm Muted Guitar", './sounds/29.ogg']; 
soundSet[30] = ["30 - Overdriven Guitar", './sounds/30.ogg'];
soundSet[31] = ["31 - Distorted Guitar", './sounds/31.ogg'];
soundSet[32] = ["32 - Guitar Harmonics", './sounds/32.ogg'];
//Bass
soundSet[33] = ["33 - Acoustic Bass", './sounds/33.ogg'];
soundSet[34] = ["34 - Fingered Bass", './sounds/34.ogg'];
soundSet[35] = ["35 - Picked Bass", './sounds/35.ogg'];
soundSet[36] = ["36 - Fretless", './sounds/36.ogg'];
soundSet[37] = ["37 - Slap Bass 1", './sounds/37.ogg'];
soundSet[38] = ["38 - Slap Bass 2", './sounds/38.ogg'];
soundSet[39] = ["39 - Synth Bass", './sounds/39.ogg'];
soundSet[40] = ["40 - YM2612 Amp Bass", './sounds/40.ogg'];

soundSet[46] = ["46 - Harp", './sounds/46.mp3'];
soundSet[48] = ["48 - String Section", './sounds/48.mp3'];
soundSet[56] = ["56 - Trumpet", './sounds/56.mp3'];
soundSet[80] = ["80 - Square Waveform", './sounds/80.mp3'];
soundSet[81] = ["81 - Sawtooth Waveform", './sounds/81.mp3'];
soundSet[127] = ["127 - Gunshot", './sounds/127.mp3'];
//These headercomments will be expanded as I get to them.

//Strings
//Ensemble
//Brass
//Reed
//Pipe
//Synth Lead
//Synth Pad
//Synth Effects
//"Ethnic"
//Percussion
//GM Sound Effects

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