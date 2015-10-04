/* Under construction.
*/

var AMOUNT_OF_SONG_PROPERTIES = 4; //Update if we add more. Change to 5 and adjust in UI behavior too.

var TEMPO = 120; //Represents tempo in BPM. The main loop uses some conversions to make this accurate.
var PLAYFIELD_SIZE = 1; //Maxes out at 8 (64*8).
var ZOOM_MULTIPLIER = [1, 2, 4, 8]; //Derived from the playfield size, and will eventually be used for a graphical zoom feature.

//It should reflect badly on the user not to put any attribution data in their files.
var author = "Nooblet";
var songTitle = "Noob Song";
var songDescription = "If you see this, the author couldn't be bothered to say anything about his work.";
var version = 2;

//Version reference
//1: First versioned... version
//2: AudioFX Chain overhaul