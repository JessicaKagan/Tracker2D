/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
*/

/*
    Short term important stuff: Save, load, copy, paste, general rectangle-based selector.
    Medium term useful thing: Extrapolation feature.
*/

var pauseState = true;
var toolList = ['pencil', 'line', 'eraser', 'pause']; //We can add a bunch more. Use these to label buttons?
var selectedTool = 'pencil'; //Change as needed, default to painting.
var tileBuffer; //This is probably the key to not only saving, but all sorts of data manipulation.
var saveContent; //Whatever we save organized in the form of a string?

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
    //Stores a rectangle of tiles (a subset of the entire field). 
    //When saving, it fills up with the entire field. Otherwise, it probably covers a bit less.
    console.log("Filling the buffer");
    switch(command) {
        case 'save':
            tileBuffer = fieldContents;
            console.log(tileBuffer);
            break;
        default:
            break;
    }

    //What's the most efficient way to copy an array, or part of an array in jQuery?
}

function pasteBuffer(fromX, toX, fromY, toY, tile) {

}

//We need a standard save format. Make the JSON array, then follow up with a footer to simplify extension of song properties.

function saveFile() {

    fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1], 'save');
    if(tileBuffer === fieldContents) { 
        console.log("We're ready to save now."); 
    } else { console.log("Something went wrong in saveFile() or fillBuffer(). Real error trapping later."); }
    //Bake everything into a string.
    saveContent = "";
    //console.log(tileBuffer.length);
    //The very first line contains the amount of tiles.
    saveContent += FILE_SIZE[0]*FILE_SIZE[1] + '\n';

    //Dump all tiles to a string. Parses top to bottom before moving left to right.
    for(var i = 0; i < tileBuffer.length; ++i){
        for(var j = 0; j < tileBuffer[i].length; ++j){
            if(tileBuffer[i][j] !== undefined) { 
                saveContent += tileBuffer[i][j].toString();
            } else saveContent += "undefined"; //In the load function, lines with only the word "undefined" on them will not become tiles.
            saveContent += '\n';
        }

    }
    //Dump song properties next, and we're done.
    saveContent += TEMPO + '\n' + PLAYFIELD_SIZE + '\n' + author + '\n' + songDescription + '\n';
    console.log(saveContent);
    //Now we need to get this to the user, somehow.
    //See http://www.html5rocks.com/en/tutorials/file/dndfiles/
    //We may need HTML DOM elements.
    //See if we can get a .tracker2D extension or something.

}

function loadFile() {
    console.log("Not implemented yet. Won't be useful until saveFile works.");
    //Pull up a file loading dialogue, and then run our functions on that.
    //The dialogue needs to prefer the extension we used earlier.
    //We'll have to turn the file into an array, I think.
    //Iterate through every line in the file, with some caveats.
    //All lines from the second line to a line with (max index - AMOUNT_OF_SONG_PROPERTIES).
    //Currently, there are 4 properties, so the last 4 lines will be song properties.
}