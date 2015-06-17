
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
//Strings
soundSet[41] = ["41 - Violin", './sounds/41.ogg'];
soundSet[42] = ["42 - Viola", './sounds/42.ogg'];
soundSet[43] = ["43 - Cello", './sounds/43.ogg'];
soundSet[44] = ["44 - Contrabass", './sounds/44.ogg'];
soundSet[45] = ["45 - Tremolo", './sounds/45.ogg'];
soundSet[46] = ["46 - Pizzicato Section", './sounds/46.ogg'];
soundSet[47] = ["47 - Harp", './sounds/47.ogg'];
soundSet[48] = ["48 - Timpani", './sounds/48.ogg'];
//Ensemble
soundSet[49] = ["49 - String Ensemble", './sounds/49.ogg'];
soundSet[50] = ["50 - Slow Strings", './sounds/50.ogg'];
soundSet[51] = ["51 - Synth Strings", './sounds/51.ogg'];
soundSet[52] = ["52 - Synth Strings 2", './sounds/52.ogg'];
soundSet[53] = ["53 - Choir Aahs", './sounds/53.ogg'];
soundSet[54] = ["54 - Bootleg Egoraptor Chorus", './sounds/54.ogg'];
soundSet[55] = ["55 - Synth Vox", './sounds/55.ogg'];
soundSet[56] = ["56 - Orchestra Hit", './sounds/56.ogg'];
//Brass
soundSet[57] = ["57 - Trumpet", './sounds/57.ogg'];
soundSet[58] = ["58 - Trombone", './sounds/58.ogg'];
soundSet[59] = ["59 - Tuba", './sounds/59.ogg'];
soundSet[60] = ["60 - Muted Trumpet", './sounds/60.ogg'];
soundSet[61] = ["61 - French Horn", './sounds/61.ogg'];
soundSet[62] = ["62 - Generic Brass", './sounds/62.ogg'];
soundSet[63] = ["63 - Synth Brass", './sounds/63.ogg'];
soundSet[64] = ["64 - Synth Brass 2", './sounds/64.ogg'];
//Reed
soundSet[65] = ["65 - Soprano Sax", './sounds/65.ogg'];
soundSet[66] = ["66 - Tenor Sax", './sounds/66.ogg'];
soundSet[67] = ["67 - Alto Sax", './sounds/67.ogg'];
soundSet[68] = ["68 - Baritone Sax", './sounds/68.ogg'];
soundSet[69] = ["69 - Oboe", './sounds/69.ogg'];
soundSet[70] = ["70 - English Horn", './sounds/70.ogg'];
soundSet[71] = ["71 - Bassoon", './sounds/71.ogg'];
soundSet[72] = ["72 - Clarinet", './sounds/72.ogg'];
//Pipe
soundSet[73] = ["73 - Piccolo", './sounds/73.ogg'];
soundSet[74] = ["74 - Flute", './sounds/74.ogg'];
soundSet[75] = ["75 - Recorder", './sounds/75.ogg'];
soundSet[76] = ["76 - Pan Flute", './sounds/76.ogg'];
soundSet[77] = ["77 - Blown Bottle", './sounds/77.ogg'];
soundSet[78] = ["78 - Shakuhachi", './sounds/78.ogg'];
soundSet[79] = ["79 - Whistle", './sounds/79.ogg'];
soundSet[80] = ["80 - Ocarina", './sounds/80.ogg'];
//Synth Lead

soundSet[81] = ["81 - Square Waveform", './sounds/80.mp3'];
soundSet[82] = ["82 - Sawtooth Waveform", './sounds/81.mp3'];
soundSet[127] = ["127 - Gunshot", './sounds/127.mp3'];
//These headercomments will be expanded as I get to them.







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