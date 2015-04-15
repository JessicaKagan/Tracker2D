/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
*/

/*
    Short term important stuff: Save, load, copy, paste
    Medium term useful thing: Extrapolation feature.
*/

var pauseState = true;
var toolList = ['pencil', 'line', 'eraser', 'pause']; //We can add a bunch more. Use these to label buttons?
var selectedTool = 'pencil'; //Change as needed, default to painting.
var tileBuffer; //This is probably the key to not only saving, but all sorts of data manipulation.

var bottomUIButton = function(coords) {
    this.coords = coords;
}

//Deprecate this?
var pauseButton = function(coords) {
    this.coords = coords;
}

//See main.js for the UI images, although maybe we should move that here.
//Extend this to draw all buttons?
var drawButtons = function() {

    //Pause button with 2 states
    if(pauseState == false) { ctx.drawImage(UIImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else if(pauseState == true) { ctx.drawImage(UIImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    //Pencil
    ctx.drawImage(UIImages[2],PENCIL_BUTTON_AREA[0],PENCIL_BUTTON_AREA[1]);
    //Eraser
    ctx.drawImage(UIImages[3],ERASER_BUTTON_AREA[0],ERASER_BUTTON_AREA[1]);   
    ctx.drawImage(UIImages[4],SAVE_BUTTON_AREA[0],SAVE_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[5],LOAD_BUTTON_AREA[0],LOAD_BUTTON_AREA[1]);   
}

function fillBuffer(fromX, toX, fromY, toY, command) {
    console.log("Filling the buffer");
    //Stores a rectangle of tiles (a subset of the entire field). 
    //When saving, it fills up with the entire field. Otherwise, it probably covers a bit less.
    //What's the most efficient way to copy an array, or part of an array in jQuery?
}

function pasteBuffer(fromX, toX, fromY, toY, tile) {

}

//We need a standard save format.
//1. Start with a header containing values from song_properties.js
//2. Then the entire playfield with JSON.

function saveFile() {
    //console.log("Save dialog? Use fillBuffer.");
    fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1]);
}

function loadFile() {
    console.log("Not implemented yet. Won't be useful until loadFile exists.");
    //Pull up a file loading dialogue, and then run our functions on that.
}