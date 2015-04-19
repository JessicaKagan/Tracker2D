//All the glue that holds this project together.    

//UI constants:
var FILE_SIZE = [30,23]; //This is how many tiles are on the screen right now. It will eventually change.
var TILE_SIZE = 24; //This is more cumbersome early on, but I will eventually need to implement zooming, and this might help
var LEFT_VERTICAL_BAR = [0,0,80,800];
var BOTTOM_HORIZONTAL_BAR = [80,552,720,48];
var FIELD_PIXELS = [80,0,800,552];

var PAUSE_PLAY_BUTTON_AREA = [80,576,24,24];
var PENCIL_BUTTON_AREA = [104,576,24,24];
var ERASER_BUTTON_AREA = [128,576,24,24];
var SELECTBOX_BUTTON_AREA = [152,576,24,24];
var PASTE_BUTTON_AREA = [176,576,24,24];

var SAVE_BUTTON_AREA = [752,576,24,24];
var LOAD_BUTTON_AREA = [776,576,24,24];

var fieldContents = new Array(30);
//Everything is undefined by default.
for(var i = 0; i < FILE_SIZE[0]; ++i) {
    fieldContents[i] = new Array(23);
}

//var fieldBackup = fieldContents; //When we implement saving, this will come in handy. We'll need a header, too.

//Globals for now. Deglobalize as implementation permits. 
var soundFont, audioEngine, audioLoader, selectBoxStage;
//For synch.
var lastTime, updateFrequency, timeToUpdate;

var currentPitch = 36;
var currentInstrument = 0;
var currentDSPValue = 0;
var currentDSP = "none";
var currentFlowControl = "none";
var UIImages = new Array(8);
var tileOverlayImages = new Array(5); //Used for flow control.


var bugImage = new Image();
var bugImage2 = new Image();
bugImage.src = 'images/placeholder_bug.png';
bugImage2.src = 'images/placeholder_bug_2.png';

//Needs generalization.
for(var i = 0; i < UIImages.length; i++) {
    UIImages[i] = new Image();
}

for(var i = 0; i < tileOverlayImages.length; i++) {
    tileOverlayImages[i] = new Image();
}

getImages(); //See image_loader.js

var testSoundArray = ['./sounds/Ach.wav','./sounds/OrchestraHit.wav', './sounds/sawtooth.wav'];
var fieldBoundaries = [80,0,800,552]; //This is the area not covered by the UI; x-coords 80-> 800, y-coords 0->552

//Set up a canvas to draw on. All the drawing functions should be in render() now.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


//Kludge. Rewrite this to start after making sure all the images actually loaded.
UIImages[(UIImages.length - 1)].onload = function() {
    init();
}

function init() {
    //Set up the audio engine and a system for playing sounds.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioEngine = new AudioContext();
    audioLoader = new BufferLoader(audioEngine, testSoundArray, soundsAreReady);
    audioLoader.load();
    //Draw the grid.
    ctx.fillStyle = "#000000";
    ctx.fillRect(LEFT_VERTICAL_BAR[0],LEFT_VERTICAL_BAR[1],LEFT_VERTICAL_BAR[2],LEFT_VERTICAL_BAR[3]); 
    ctx.fillStyle = "#888888";
    ctx.fillRect(BOTTOM_HORIZONTAL_BAR[0],BOTTOM_HORIZONTAL_BAR[1],BOTTOM_HORIZONTAL_BAR[2],BOTTOM_HORIZONTAL_BAR[3]);
    ctx.fillStyle = "#BBBBBB";

    //Set up the UI.
    document.addEventListener("click", interact);
    pauseUI = new pauseButton(PAUSE_PLAY_BUTTON_AREA);
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
            if($('#instrumentInput').val() === -1) {currentInstrument = -1 ;}
            else if($('#instrumentInput').val() < testSoundArray.length) { currentInstrument = $('#instrumentInput').val();}
            else { console.log("There are only " + testSoundArray.length + " instruments right now. Remind me to turn this into a list.");}
            console.log(currentInstrument);
            $('#instrumentInput').val('');
        }
    })
    //This handles the audio FX menu.
    for(var i = 0; i < possibleDSPEffects.length; ++i){
        $('#DSPInput').append('<option value="' + possibleDSPEffects[i] + '">' + possibleDSPEffects[i] + '</option>');
    }
    $( "#DSPInput" ).change(function() {
        currentDSP = $(this).find('option:selected').attr('value');
        console.log(currentDSP);
    });
    //Definitely functionalize. This handles input for Audio FX.    
    $('#dspValueInput').keydown(function(event){
        if (event.keyCode == 13) {
            currentDSPValue = $('#dspValueInput').val(); //Unlike the others, this needs to be interpreted based on the current DSP.
            console.log(currentDSPValue);
            $('#dspValueInput').val('');
        }
    })
    //This handles the flow control menu.
    for(var i = 0; i < possibleFlowEffects.length; ++i){
        $('#controlInput').append('<option value="' + possibleFlowEffects[i] + '">' + possibleFlowEffects[i] + '</option>');
    }
    $( "#controlInput" ).change(function() {
        currentFlowControl = $(this).find('option:selected').attr('value');
        console.log(currentFlowControl);
    });
    //Left bar menu stuff ends here.

    //Draws a test bug, spawning at tile [0,1] with a test behavior.
    bug1 = new Bug(bugImage, fieldBoundaries[0] + (TILE_SIZE*0),fieldBoundaries[1] + (TILE_SIZE*1),'moveRight','George');
    bug2 = new Bug(bugImage2, fieldBoundaries[0] + (TILE_SIZE*0),fieldBoundaries[1] + (TILE_SIZE*3),'moveRight','Steve');
    //console.log(bug1);

    lastTime = Date.now();
    updateFrequency = 12.5/TEMPO; //Currently, 8 'ticks' every beat?
    timeToUpdate = updateFrequency;
    window.requestAnimationFrame(main);
}

function interact(e) {
    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    //Displays debug messages for now based on where you click.
    //When we make more, we'll need some sort of 2D switch statement, because this is just getting ugly.
    if(cursorX <= 80 && cursorX > 0) { console.log("LEFT_VERTICAL_BAR"); }
    if(cursorY >= 540 && cursorY <= 600 && cursorX >= 80) { 
        console.log("BOTTOM_HORIZONTAL_BAR");
        //UI buttons on 
        if(cursorY >= 576 && cursorX < 104) { 
            console.log("PAUSE_PLAY_BUTTON_AREA");
            if(pauseState == true || undefined) { pauseState = false; }
            else pauseState = true;
            console.log(pauseState);
        } else if(cursorY >= 576 && cursorX >= 104 && cursorX < 128) { 
            console.log("PENCIL_BUTTON_AREA");
            selectedTool = "pencil";
        } else if(cursorY >= 576 && cursorX >= 128 && cursorX < 152) { 
            console.log("ERASER_BUTTON_AREA");
            selectedTool = "eraser";
        } else if(cursorY >= 576 && cursorX >= 152 && cursorX < 176) { 
            console.log("SELECTBOX_BUTTON_AREA");
            selectedTool = "selectBox";
            selectBoxStage = 1; //Start the selection process.
        } else if(cursorY >= 576 && cursorX >= 176 && cursorX < 204) {
            console.log("PASTE_BUTTON_AREA");
            selectedTool = "paste";
        } else if(cursorY >= 576 && cursorX >= 752 && cursorX < 776) {
            console.log('SAVE_BUTTON_AREA');
            if($("#loadExport").hasClass("currentlyHidden") === true) { saveFile(); } //Kludge against UI clash.
        } else if(cursorY >= 576 && cursorX >= 776 && cursorX < 800) {
            console.log('LOAD_BUTTON_AREA');
            if($("#saveExport").hasClass("currentlyHidden") === true) { $("#loadExport").removeClass("currentlyHidden"); }
        }
        //Idea for 'scrolling' - Have a 48x48 low precision miniature of the entire field.
        //Try to center on an area corresponding to where the user clicks.
        //If not possible, move the 'camera' gradually towards the center until this can be done before centering.
        //Possibly overlay a translucent rectangle indicating boundaries.
    }
    //If we're inside the playfield, convert to a tile. Functionalize this!
    //The logic for this is going to become a great deal more complex with time, I think.
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        console.log("In the playfield");
        var currentTile = getTile(cursorX, cursorY);
        console.log(currentTile);
        
        //This statement reduces painting with UI elements open but doesn't remove it entirely.
            if($("#saveExport").hasClass("currentlyHidden") === true &&
               $("#loadExport").hasClass("currentlyHidden") === true){
                switch(selectedTool){
                    case "pencil":
                        fieldContents[currentTile[0]][currentTile[1]] = new Tile(pitchTable[currentPitch], currentInstrument, currentDSP, currentFlowControl, 0.6, currentDSPValue, 0);
                        break;
                    case "eraser":
                        fieldContents[currentTile[0]][currentTile[1]] = undefined;
                        break;
                    case "selectBox":
                        if(selectBoxStage === 1) {
                            //Get the first pair for the buffer.
                            selectBoxCoords[0] = currentTile[0];
                            selectBoxCoords[2] = currentTile[1];
                            selectBoxStage = 2;
                            alert("Placeholder for a better way to tell you that you need to select a second tile now. I'd close this with the Enter key if I were you, because we might have a clickthrough problem otherwise.");
                        } else if(selectBoxStage === 2) {
                            //A second click gets the second pair. 
                            selectBoxCoords[1] = currentTile[0];
                            selectBoxCoords[3] = currentTile[1];
                            /* If the user selected something above or to the left of their first selection,
                             * swap the coordinates. X values first, then Y.
                             * This uses a functional but inelegant temporary swapping variable.
                             */
                            if(selectBoxCoords[0] > selectBoxCoords[1]) {
                                var selectBoxBuffer = selectBoxCoords[0];
                                selectBoxCoords[0] = selectBoxCoords[1];
                                selectBoxCoords[1] = selectBoxBuffer;
                            }
                            if(selectBoxCoords[2] > selectBoxCoords[3]) {
                                var selectBoxBuffer = selectBoxCoords[2];
                                selectBoxCoords[2] = selectBoxCoords[3];
                                selectBoxCoords[3] = selectBoxBuffer;
                            }
                            //Finally, we send these coords to the buffer filler.
                            fillBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3],'selectBox');
                            //And this allows the user to select something again.
                            selectBoxStage = 1;
                        } else console.log("selectBox() in interact() failed.");
                        break;
                    case "paste":
                    //Paste doesn't work if there's no tilebuffer.
                        if(tileBuffer !== undefined) {
                            //But it also doesn't work if the tilebuffer is too big.
                            //There might be other conditions; I'll implement them if I can think of them.
                            if(tileBuffer.length !== FILE_SIZE[0] ||
                               tileBuffer[0].length !== FILE_SIZE[1]) {
                                //We include offset for where the user clicked.
                                pasteBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3], 
                                            currentTile[0], currentTile[1]);
                            } else { console.log("Can't paste that. It's too damn big!")};
                        } else { console.log("Select something first, then try pasting it.");} 
                        break;
                    default:
                        break;
                }
            }
        console.log(fieldContents[currentTile[0]][currentTile[1]]);
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

function playSound(buffer, pitch, dspEffect, dspValue) {
    console.log(dspEffect + ": " + dspValue);
    var source = audioEngine.createBufferSource();  
    source.buffer = buffer;
    source.playbackRate.value = pitch;
    //console.log(source.playbackRate.value*44100);

    /*EXTREMELY IMPORTANT! This might be where filter code goes when those are added. */
    //Decide how to handle audio when page isn't visible, see http://www.w3.org/TR/page-visibility/?csw=1
    switch(dspEffect){
        case 'lowpass':
            var createLowPass = audioEngine.createBiquadFilter();
            source.connect(createLowPass);
            createLowPass.connect(audioEngine.destination);
            createLowPass.type = 'lowpass';
            createLowPass.frequency.value = dspValue;
            break;
        case 'hipass':
            var createHighPass = audioEngine.createBiquadFilter();
            source.connect(createHighPass);
            createHighPass.connect(audioEngine.destination);
            createHighPass.type = 'highpass';
            createHighPass.frequency.value = dspValue;
            break;
        default:
            source.connect(audioEngine.destination);
            break;
    }
    source.start(0);
}

function main(){
    /* This is our main loop! It updates the internal model of bug positions and such when the game is unpaused.
     * Then it calls the render function to update the view so that the user sees the actual state of this toy.
     * This needs to link partially into the tempo variable. Bug positions only need to update on tempo ticks.
     * However, rendering needs to be as fast and responsive as possible, so it's independent of our timing function.
     */
    var now = Date.now();
    var delta = (now - lastTime) / 1000.0;
    lastTime = now;
    //console.log(timeToUpdate);
    //Use the delta as a timeOut surrogate.
    timeToUpdate = timeToUpdate - delta;
    //When it hits zero, we update.
    if(timeToUpdate <= 0) { 
        if(pauseState == false) { 
            bug1.updateBug();
            bug2.updateBug();
        }
        timeToUpdate = updateFrequency; 
    }
    render();
    window.requestAnimationFrame(main);
    

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
    //Tiles need to eventually be extended with a user defined color value. 
    for(var i = 0; i < FILE_SIZE[0]; ++i){
        for(var j = 0; j < FILE_SIZE[1]; ++j){
            if(typeof fieldContents[i][j] === 'object'){
                //console.log(fieldContents[i][j].note);
                var currentColor = "#444444";
                //console.log(color);
                paintTile(i,j, currentColor);
            }   
        }
    }

    //3. Bugs
    bug1.drawBug();
    bug2.drawBug();
    //4. UI (Seems trivial, but I plan to have translucent popups in the near future.)
    //ctx.fillRect(PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1],PAUSE_PLAY_BUTTON_AREA[2],PAUSE_PLAY_BUTTON_AREA[3]);
    
    drawButtons();
  
}

//This is a rendering function, anyways.
function paintTile(tileX, tileY, color){
    //Fill in the basics.
    ctx.fillStyle = color; 
    ctx.fillRect(fieldBoundaries[0] + (TILE_SIZE*tileX), 
                 fieldBoundaries[1] + (TILE_SIZE*tileY),
                (TILE_SIZE*1), 
                (TILE_SIZE*1));
    //Add overlays as needed.
    var currentOverlay = fieldContents[tileX][tileY].flowEffect;
    if(currentOverlay !== "none") {
        switch(currentOverlay) {
            //Currently, only turn signals are implemented.
            case "turn_west":
                ctx.drawImage(tileOverlayImages[0],fieldBoundaries[0] + (TILE_SIZE*tileX),fieldBoundaries[1] + (TILE_SIZE*tileY));
                break;
            case "turn_north":
                ctx.drawImage(tileOverlayImages[1],fieldBoundaries[0] + (TILE_SIZE*tileX),fieldBoundaries[1] + (TILE_SIZE*tileY));
                break;
            case "turn_east":
                ctx.drawImage(tileOverlayImages[2],fieldBoundaries[0] + (TILE_SIZE*tileX),fieldBoundaries[1] + (TILE_SIZE*tileY));
                break;
            case "turn_south":
                ctx.drawImage(tileOverlayImages[3],fieldBoundaries[0] + (TILE_SIZE*tileX),fieldBoundaries[1] + (TILE_SIZE*tileY));
                break;
            case "freeze":
                ctx.drawImage(tileOverlayImages[4],fieldBoundaries[0] + (TILE_SIZE*tileX),fieldBoundaries[1] + (TILE_SIZE*tileY));
                break;

            default:
                break;
        }
    }



}