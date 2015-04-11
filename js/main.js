    

//UI constants:
var FILE_SIZE = [30,23]; //This is how many tiles are on the screen right now. It will eventually change.
var TILE_SIZE = 24; //This is more cumbersome early on, but I will eventually need to implement zooming, and this might help
var LEFT_VERTICAL_BAR = [0,0,80,800];
var BOTTOM_HORIZONTAL_BAR = [80,552,720,48];
var FIELD_PIXELS = [80,0,800,552];

var fieldContents = new Array(30);
var rows = FILE_SIZE[0];
//Everything is undefined by default.
for(var i = 0; i < rows; ++i) {
    fieldContents[i] = new Array(23);
}

//Globals for now. Deglobalize as implementation permits.
var bug1, soundFont, audioEngine, audioLoader;


//Use Web Audio API or something to actually play audio.
var testSound = new Audio('Ach.wav');
var bugImage = new Image();
bugImage.src = 'images/placeholder_bug.png';
var testSoundArray = ['/sounds/Ach.wav','/sounds/OrchestraHit.wav'];

var fieldBoundaries = [80,0,800,552]; //This is the area not covered by the AI; x-coords 80-> 800, y-coords 0->552

//Set up a canvas to draw on.
//All these drawing steps need to be functionalized since they'll get repeated a ton. 
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Kludge. Extend to involve all 'bug' images and then work from there. I guess.
bugImage.onload = function() {
    init();
}

function init() {

    //Set up the audio engine and a system for playing sounds.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioEngine = new AudioContext();
    audioLoader = new BufferLoader(audioEngine, testSoundArray, soundsAreReady);
    audioLoader.load();

    ctx.fillStyle = "#000000";
    //There has to be a better way to handle the names. Apparently apply() in JS might be usable?
    ctx.fillRect(LEFT_VERTICAL_BAR[0],LEFT_VERTICAL_BAR[1],LEFT_VERTICAL_BAR[2],LEFT_VERTICAL_BAR[3]); 
    ctx.fillStyle = "#888888";
    ctx.fillRect(BOTTOM_HORIZONTAL_BAR[0],BOTTOM_HORIZONTAL_BAR[1],BOTTOM_HORIZONTAL_BAR[2],BOTTOM_HORIZONTAL_BAR[3]);
    ctx.fillStyle = "#BBBBBB";

    //In the future, we'll pull this information from a save file, if we can.
    //In the not so distant future, we'll initialize the entire array as empty.
    fieldContents[1][1] = new Tile("blue", undefined, undefined, undefined);
    fieldContents[6][1] = new Tile("blue", undefined, undefined, undefined);
    fieldContents[11][1] = new Tile("blue", undefined, undefined, undefined);
    fieldContents[16][1] = new Tile("blue", undefined, undefined, undefined);
    fieldContents[21][1] = new Tile("blue", undefined, undefined, undefined);
    fieldContents[26][1] = new Tile("blue", undefined, undefined, undefined);

    document.addEventListener("click", interact);

    //Draws a test bug, spawning at tile [0,1] without any behavior.
    bug1 = new Bug(fieldBoundaries[0] + (TILE_SIZE*0),fieldBoundaries[1] + (TILE_SIZE*1),null,'George');
    //console.log(bug1);
    //Experimentally moving the bug. Needs an implementation that wipes the screen as needed.
    /*
    setInterval(function(){
        var bugTile = [(bug1.x - 80)/24, bug1.y/24];
        if(bug1.x < 800) {
            //console.log(bugTile);
            bug1.x += 24;
            bug1.drawBug();
            //If the bug is on a blue tile, play ach.wav
            if(fieldContents[bugTile[0]][bugTile[1]] != undefined){
                soundFont[0].start(0); //Plays the sound
                if(fieldContents[bugTile[0]][bugTile[1]].note == "green") {bug1.y -=24;}
                if(fieldContents[bugTile[0]][bugTile[1]].note == "red") {bug1.y +=24;}
            }
            //Experiment with turn logic.

        } else bug1.x = 80;
    }, 200)
    */
    
    window.requestAnimationFrame(main);

}

function interact(e) {
    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    if(cursorX <= 80 && cursorX > 0) { console.log("LEFT_VERTICAL_BAR"); }
    if(cursorY >= 540 && cursorY <= 600 && cursorX >= 80) { console.log("BOTTOM_HORIZONTAL_BAR"); }
    //If we're inside the playfield, convert to a tile.
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        console.log("In the playfield");
        var currentTile = getTile(cursorX, cursorY);
        console.log(currentTile);
        //The logic for this is going to become a great deal more complex with time, I think.
        if(fieldContents[currentTile[0]][currentTile[1]] == undefined) { 
            fieldContents[currentTile[0]][currentTile[1]] = new Tile("red", undefined, undefined, undefined);
        } else fieldContents[currentTile[0]][currentTile[1]].note = "green";
        console.log(fieldContents[currentTile[0]][currentTile[1]]);
        //paintTile(currentTile[0],currentTile[1], "#00BB00"); //Simple painting test
    }
}

//Graphics functions.
//It might be wise to make these subfunctions of something tile related.
function getTile(x,y) {
    var tileX = Math.floor((x - 80)/TILE_SIZE);
    var tileY = Math.floor(y/TILE_SIZE);
    return [tileX, tileY];
}

function convertTiletoPixels(x,y){
    var pixelX = (x*24) + 80;
    var pixelY = y*24;
    return [pixelX, pixelY];
}

//Move this where it's needed
function paintTile(tileX, tileY, color){
    ctx.fillStyle = color //Pass in #hexadecimal for best results.
    ctx.fillRect(fieldBoundaries[0] + (TILE_SIZE*tileX), 
                 fieldBoundaries[1] + (TILE_SIZE*tileY),
                (TILE_SIZE*1), 
                (TILE_SIZE*1));

}

//Maybe move the audio routines into a seperate file?
function soundsAreReady(soundList) {
    console.log("Sounds loaded, or so I'm told.");
    //console.log(soundList);
    //Populate soundFont with all the sounds we need.
    soundFont = [];
    for(var i = 0; i < soundList.length; ++i) {
        soundFont.push(soundList[i]); //We fill up SoundFont with sounds...
        soundFont[i] = audioEngine.createBufferSource(); 
        soundFont[i].buffer = soundList[i];
        //console.log(soundFont[i]);
        soundFont[i].connect(audioEngine.destination); //And route them to audio.
    }

}

function main(){
    //This is our main loop!
    //updateBugPositions(); //Needs to be written.
    render();
    window.requestAnimationFrame(main);
    

    //Implement a basic delta function later for smooth operation regardless of FPS and speed.
    //This needs to link partially into Tempo. Bug positions only need to update on tempo ticks.
    //However, rendering needs to be as fast and responsive as possible.
    //Init:
    //var lastTime = Date.now();
    //Loop:
    //var now = Date.now();
    //var delta = (now - lastTime) / 1000.0;
    //lastTime = now;
}

function render(){
    ctx.clearRect(FIELD_PIXELS[0],FIELD_PIXELS[1],FIELD_PIXELS[2],FIELD_PIXELS[3]); //Use this to refresh everything.
    //Render things in this order:
    //1. Background (Probably doesn't need to be redrawn very often)
    //2. Painted tiles

    //Draw boundaries between tiles.
    for(var i = 80; i < fieldBoundaries[2]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i,0);
        ctx.lineTo(i,552);
        ctx.stroke();
    }
    for(var i = 0; i < fieldBoundaries[3]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0,i);
        ctx.lineTo(800,i);
        ctx.stroke();
    }
    //Painting squares! From an MVC stance this is the "view", I guess.
    //paintTile eventually needs to choose colors first based on tile properties, and then a subset of it based on user's viewmode.
    for(var i = 0; i < FILE_SIZE[0]; ++i){
        for(var j = 0; j < FILE_SIZE[1]; ++j){
            if(typeof fieldContents[i][j] === 'object'){
                paintTile(i,j, fieldContents[i][j].note);
            }   
        }
    }

    //3. Bugs
    bug1.drawBug();
    //4. UI (Seems trivial, but I plan to have translucent popups in the near future.)
    //2 & 3 are going to take up most of our time.

    //Then call a new frame of animation.
   
}