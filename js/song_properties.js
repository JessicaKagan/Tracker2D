/* Under construction.
*/

var AMOUNT_OF_SONG_PROPERTIES = 4; //Update if we add more. Change to 5 and adjust in UI behavior too.

var TEMPO = 120; //Hardcoded for now, represents tempo in BPM. Use mathematical wizardry to make sure this is accurate.
var PLAYFIELD_SIZE = 1; //The user will eventually be able to choose how large their field is in tiles. Maxes out at 8 (64*8).
var ZOOM_MULTIPLIER = [1, 2, 4, 8]; //Derived from the playfield size, and will eventually be used for a graphical zoom feature.

//It should reflect badly on the user not to put any attribution data in their files.
var author = "Nooblet";
var songTitle = "Noob Song";
var songDescription = "If you see this, the author couldn't be bothered to say anything about his work.";