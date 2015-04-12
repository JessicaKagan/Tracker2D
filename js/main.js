    

//UI constants:
var FILE_SIZE = [30,23]; //This is how many tiles are on the screen right now. It will eventually change.
var TILE_SIZE = 24; //This is more cumbersome early on, but I will eventually need to implement zooming, and this might help
var LEFT_VERTICAL_BAR = [0,0,80,800];
var BOTTOM_HORIZONTAL_BAR = [80,552,720,48];
var FIELD_PIXELS = [80,0,800,552];
var PAUSE_PLAY_BUTTON_AREA = [80,576,24,24];

var fieldContents = new Array(30);
var rows = FILE_SIZE[0];
//Everything is undefined by default.
for(var i = 0; i < rows; ++i) {
    fieldContents[i] = new Array(23);
}

//Globals for now. Deglobalize as implementation permits.
var bug1, soundFont, audioEngine, audioLoader;
var currentPitch = 36;
var currentInstrument = 0;
var pauseImages = [];


var bugImage = new Image();
bugImage.src = 'images/placeholder_bug.png';

//Needs generalization.
pauseImages[0] = new Image();
pauseImages[1] = new Image();
pauseImages[0].src = 'images/pause_button.png';
pauseImages[1].src = 'images/play_button.png';

var testSoundArray = ['/sounds/Ach.wav','/sounds/OrchestraHit.wav'];

var fieldBoundaries = [80,0,800,552]; //This is the area not covered by the AI; x-coords 80-> 800, y-coords 0->552

//Set up a canvas to draw on.
//All these drawing steps need to be functionalized since they'll get repeated a ton. 
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Kludge. Rewrite this to start when ALL images are loaded.
pauseImages[1].onload = function() {
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
    //In the not so distant future, we'll initialize the entire array as empty, but not undefined?
    fieldContents[1][1] = new Tile(36, 0, undefined, undefined);
    fieldContents[5][1] = new Tile(35, 1, undefined, undefined);
    fieldContents[8][1] = new Tile(34, 1, undefined, undefined);
    fieldContents[13][1] = new Tile(33, 1, undefined, undefined);
    fieldContents[17][1] = new Tile(31, 1, undefined, undefined);
    fieldContents[20][1] = new Tile(29, 1, undefined, undefined);
    fieldContents[25][1] = new Tile(26, 1, undefined, undefined);

    document.addEventListener("click", interact);
    pauseUI = new pauseButton(PAUSE_PLAY_BUTTON_AREA);

    //Draws a test bug, spawning at tile [0,1] without any behavior.
    bug1 = new Bug(fieldBoundaries[0] + (TILE_SIZE*0),fieldBoundaries[1] + (TILE_SIZE*1),null,'George');
    //console.log(bug1);

    //Experimentally moving the bug. Adding experimental pause implementation that will need generalization.
    setInterval(function(){
        if(pauseState == false) {
        var bugTile = [(bug1.x - 80)/24, bug1.y/24];
            if(bug1.x < 800) {
                //console.log(bugTile);
                bug1.x += 24;
                bug1.drawBug();
                //Plays whatever sound this is at a pitch determined by the note value. 
                //Might be nice to alias soundfont names somehow?
                if(fieldContents[bugTile[0]][bugTile[1]] != undefined){
                    playSound(soundFont[fieldContents[bugTile[0]][bugTile[1]].instrument], fieldContents[bugTile[0]][bugTile[1]].note);
                    //Primitive flow control experiment.
                    if(fieldContents[bugTile[0]][bugTile[1]].note == "green") {bug1.y -=24;}
                    if(fieldContents[bugTile[0]][bugTile[1]].note == "red") {bug1.y +=24;}
                }
            } else bug1.x = 80;
        }
    }, 200)

    //Setting up text input. Functionalize?
    $('#pitchInput').keydown(function(event){
        if (event.keyCode == 13) {
            if($('#pitchInput').val() <= 72 && $('#pitchInput').val() > 0) { currentPitch = $('#pitchInput').val();}
            else { console.log("Please input a note between 0 and 72"); }
            console.log(currentPitch);
            $('#pitchInput').val('');
        }
    })
    //Definitely functionalize. This handles instruments.
    $('#instrumentInput').keydown(function(event){
        if (event.keyCode == 13) {
            if($('#instrumentInput').val() < testSoundArray.length) { currentInstrument = $('#instrumentInput').val();}
            else { console.log("There are only " + testSoundArray.length + " instruments right now. Remind me to turn this into a list.");}
            console.log(currentInstrument);
            $('#instrumentInput').val('');
        }
    })

    window.requestAnimationFrame(main);


}

function interact(e) {
    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    //Displays debug messages for now based on where you click.
    //When we find buttons, we'll need some sort of 2D switch statement.
    if(cursorX <= 80 && cursorX > 0) { console.log("LEFT_VERTICAL_BAR"); }
    if(cursorY >= 540 && cursorY <= 600 && cursorX >= 80) { 
        console.log("BOTTOM_HORIZONTAL_BAR");
        //If you click the pause button, it switches between paused and unpaused modes.
        if(cursorY >= 576 && cursorX <= 104) { 
            console.log("PAUSE_PLAY_BUTTON_AREA");
            if(pauseState == true || undefined) { pauseState = false; }
            else pauseState = true;
            console.log(pauseState);
        }
    }
    //If we're inside the playfield, convert to a tile. Functionalize this!
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        console.log("In the playfield");
        var currentTile = getTile(cursorX, cursorY);
        console.log(currentTile);
        //The logic for this is going to become a great deal more complex with time, I think.
        //if(fieldContents[currentTile[0]][currentTile[1]] == undefined) { 
            fieldContents[currentTile[0]][currentTile[1]] = new Tile(currentPitch, currentInstrument, undefined, undefined);
        //}
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

//Maybe move the audio routines into a seperate file?
function soundsAreReady(soundList) {
    console.log("Sounds loaded");
    //console.log(soundList);
    //Populate soundFont with all the sounds we need.
    soundFont = [];
    for(var i = 0; i < soundList.length; ++i) {
        soundFont.push(soundList[i]); //We fill up SoundFont with sounds...
    }

}

function playSound(buffer, pitch) {
    //console.log("playSound() triggered.");
    var source = audioEngine.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch;
    console.log(source.playbackRate.value*44100);
    source.connect(audioEngine.destination);

    /*EXTREMELY IMPORTANT! This might be where filter code goes when those are added. */
    //Decide how to handle audio when page isn't visible, see http://www.w3.org/TR/page-visibility/?csw=1
    source.start(0);
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
    //Experimenting with color based on note pitch.
    for(var i = 0; i < FILE_SIZE[0]; ++i){
        for(var j = 0; j < FILE_SIZE[1]; ++j){
            if(typeof fieldContents[i][j] === 'object'){
                //console.log(fieldContents[i][j].note);
                //var currentColor = 'rgb(255,0,0)';
                var currentColor = "#444444";
                //console.log(color);
                paintTile(i,j, currentColor);
            }   
        }
    }

    //3. Bugs
    bug1.drawBug();
    //4. UI (Seems trivial, but I plan to have translucent popups in the near future.)
    ctx.fillRect(PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1],PAUSE_PLAY_BUTTON_AREA[2],PAUSE_PLAY_BUTTON_AREA[3]);
    /*
    if(pauseState = true) { 
        ctx.drawImage(pauseImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); 
    } else { 
        ctx.drawImage(pauseImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); 
    }
    */
    //pauseUI.drawButton();
  
}

//This is a rendering function, anyways.
function paintTile(tileX, tileY, color){
    ctx.fillStyle = color; 
    ctx.fillRect(fieldBoundaries[0] + (TILE_SIZE*tileX), 
                 fieldBoundaries[1] + (TILE_SIZE*tileY),
                (TILE_SIZE*1), 
                (TILE_SIZE*1));

}