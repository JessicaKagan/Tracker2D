//All the glue that holds this project together. 
//UI constants:
var FILE_SIZE = [64,64]; //Starting the expansion process! This will eventually be something you can alter.
var FIELD_SIZE = [30,23]; //The amount of horizontal and vertical tiles in the view.
var TILE_SIZE = 24; //This is more cumbersome early on, but I will eventually need to implement zooming, and this might help.
var LEFT_VERTICAL_BAR = [0,0,80,800];
var BOTTOM_HORIZONTAL_BAR = [80,552,720,48];
var FIELD_PIXELS = [80,0,800,552];

var PAUSE_PLAY_BUTTON_AREA = [80,576,24,24];
var PENCIL_BUTTON_AREA = [104,576,24,24];
var ERASER_BUTTON_AREA = [128,576,24,24];
var SELECTBOX_BUTTON_AREA = [152,576,24,24];
var PASTE_BUTTON_AREA = [176,576,24,24];
var QUERY_BUTTON_AREA = [200,576,24,24];
var MOVEBUG_BUTTON_AREA = [224,576,24,24];
var TURNBUG_BUTTON_AREA = [248,576,24,24];

var HELP_BUTTON_AREA = [560,576,24,24];

var EDIT_TILE_BUTTON_AREA = [608,576,24,24];
var SONGPROPS_BUTTON_AREA = [632,576,24,24];

var STOREBUG_BUTTON_AREA = [680,576,24,24];
var RESTOREBUG_BUTTON_AREA = [704,576,24,24];

var SAVE_BUTTON_AREA = [752,576,24,24];
var LOAD_BUTTON_AREA = [776,576,24,24];

var fieldContents = new Array(FILE_SIZE[0]);
//Everything is undefined by default.
for(var i = 0; i < FILE_SIZE[0]; ++i) {
    fieldContents[i] = new Array(FILE_SIZE[1]);
}

//Globals for now. Deglobalize as implementation permits. 
var soundFont, audioEngine, audioLoader; 
var selectBoxStage, moveBugStage, selectedBug, currentlyEditedTile;
//For synch.
var lastTime, updateFrequency, timeToUpdate; 
var elapsedTime = 0;
var tickMultiplier = 12.5;

//Used in keyboard_shortcuts to adjust currentPitch;
var scaleNote = 0;
var currentOctave = 3;
var currentPitch = 36;
var currentInstrument = 0;
var currentDSPValue = 0;
var currentVolume = 0.6;
var currentDSP = "none";
var currentFlowControl = "none";
var fieldBoundaries = [80,0,800,552]; //This is the area not covered by the UI; x-coords 80-> 800, y-coords 0->552

//Image arrays used in image_loader.js
var UIImages = new Array(16);
var tileOverlayImages = new Array(11); //Used for flow control and anything that needs to be drawn above a bug or tile.
var bugImages = new Array(8);
//Define the bug arrays.
var bugList = new Array(8);

//Initialize the image arrays properly.
for(var i = 0; i < tileOverlayImages.length; i++) {
    tileOverlayImages[i] = new Image();
}

for(var i = 0; i < UIImages.length; i++) {
    UIImages[i] = new Image();
}

for(var i = 0; i < bugImages.length; i++) {
    bugImages[i] = new Image();
}

getImages(); //See image_loader.js

//Make the buffer array for Web Audio! If we don't have a sound yet, fill with silence.
//Apparently this can't handle FLACs, so convert to wavs or mp3s?
var soundArray = new Array(soundSet.length);
for(var i = 0; i < soundSet.length; ++i){
    if(soundSet[i] !== undefined){
        soundArray[i] = soundSet[i][1]; //If we do have a sound, get its filename from here.
    } else soundArray[i] = './sounds/00.mp3';
}

//Set up a canvas to draw on. All the drawing functions should be in render() now.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Set up the audio engine and a system for playing sounds.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
audioEngine = new AudioContext();
audioLoader = new BufferLoader(audioEngine, soundArray, soundsAreReady);
audioLoader.load(); //This sequence calls soundsAreReady when it's done, which calls init().

function init() {
    console.log("Tracker2D needs documentation! Here's a start.");
    console.log("Only audio FX that work are bendpitch, lowpass, and highpass. Bendpitch takes values between 0-16; the passes take values from 0-20000.");
    console.log("Adjust input pitch with the QWERTY row and +/-, although you'll need a QWERTY layout keyboard for that to really make sense.");
    //Since this running means everything's loading, dispel the load notice.
    $("#loadScreen").addClass("alwaysHidden");

    //Move the bottom bar to the render function, at the very least.


    //Set up HTML5 Canvas.
    var bindCanvas = document.getElementById("canvas");
    bindCanvas.addEventListener("click", interact); //Binding to the canvas instead of the entire document fixes some strange bugs.
    
    //Set up keyboard shortcuts.
    hookKeyboard();

    //Populate the instrument menu. The undefined check is VERY important.
    for(var i = 0; i < soundSet.length; ++i){
        if(soundSet[i] !== undefined){
            $('#instrumentInput').append('<option value="' + soundSet[i] + '">' + soundSet[i][0] + '</option>');
        }
    }
    $('#instrumentInput').change(function() {
        for(var i = 0; i < soundSet.length; ++i){
            if(soundSet[i] !== undefined){
                //We should parse the input from the instrument menu so that we can use strict equivalence.
                if(soundSet[i] == $(this).find('option:selected').attr('value')) {
                    currentInstrument = i;
                }
            }
        }
    });

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
            //$('#dspValueInput').val('');
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
    //Define the bugs. The names are for flavor.
    bugList[0] = new Bug(bugImages[0], 1,1,'moveRight','George', false);
    bugList[1] = new Bug(bugImages[1], 1,3,'moveRight','Steve', false);
    bugList[2] = new Bug(bugImages[2], 1,5,'moveRight','Edgar', true);
    bugList[3] = new Bug(bugImages[3], 1,7,'moveRight','Armripper Bludgeonface', true);    
    bugList[4] = new Bug(bugImages[4], 1,9,'moveRight','Mary', true);
    bugList[5] = new Bug(bugImages[5], 1,11,'moveRight','Jessica', true);
    bugList[6] = new Bug(bugImages[6], 1,13,'moveRight','Aedryn', true);
    bugList[7] = new Bug(bugImages[7], 1,15,'moveRight','Asami', true);
    //Puts bugs in storage as needed.
    for(var i = 0; i < bugList.length; ++i) {
        checkBug(i);
    }
    //Populating this will prevent unsolicited load errors.
    storeBugPositions();

    lastTime = Date.now();
    updateFrequency = tickMultiplier/TEMPO; //Currently, 8 'ticks' every beat?
    timeToUpdate = updateFrequency;
    window.requestAnimationFrame(main);
}

function interact(e) {
    //queryInfo's hide routine probably needs to be merged with the rest of hideUI().
    $("#queryInfo").addClass("currentlyHidden"); 

    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    //Displays debug messages for now based on where you click.
    //When we make more, we'll need some sort of 2D switch statement, because this is just getting ugly.
    if(cursorX <= 80 && cursorX > 0) { 
        console.log("LEFT_VERTICAL_BAR"); 
        //Minimap usage.
        if(cursorX >= 8 && cursorX <= 72 && cursorY >=8 && cursorY <= 72) {
            console.log("MINIMAP");
            moveViewingField((cursorX - 8),(cursorY - 8)); //Compensating for the offsets.
        }
    }
    if(cursorY >= 540 && cursorY <= 600 && cursorX >= 80) { 
        console.log("BOTTOM_HORIZONTAL_BAR");
        //UI buttons on the bottom horizontal bar.
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
        } else if(cursorY >= 576 && cursorX >= 176 && cursorX < 200) {
            console.log("PASTE_BUTTON_AREA");
            selectedTool = "paste";
        } else if(cursorY >= 576 && cursorX >= 200 && cursorX < 224) {
            console.log("QUERY_BUTTON_AREA");
            selectedTool = "query";
        } else if(cursorY >= 576 && cursorX >= 224 && cursorX < 248) {
            console.log("MOVE_BUG_BUTTON_AREA");
            selectedTool = "moveBug";
            moveBugStage = 1; //Like selecting a box, this is a two step process.
        } else if(cursorY >= 576 && cursorX >= 248 && cursorX < 272) {
            console.log("TURNBUG_BUTTON_AREA");
            selectedTool = "turnBug";
        } else if(cursorY >= 576 && cursorX >= 560 && cursorX < 588) {
            console.log("HELP_BUTTON_AREA");
            hideUI();
            if($("#helpPage").hasClass("currentlyHidden") === true){
                $("#helpPage").removeClass("currentlyHidden");
            }
        } else if(cursorY >= 576 && cursorX >= 608 && cursorX < 632) {
            selectedTool = "editTile";
            console.log("EDIT_TILE_BUTTON_AREA");
        } else if(cursorY >= 576 && cursorX >= 632 && cursorX < 656) {
            console.log('SONGPROPS_BUTTON_AREA');
            hideUI();
            //Fill the UI elements with data from the song properties.
            $("#tempoSpinner").val(TEMPO);
            $("#authorName").val(author);
            $("#songName").val(songTitle);
            $("#songDesc").val(songDescription);
            $("#modifySongProperties").removeClass("currentlyHidden");
        } else if(cursorY >= 576 && cursorX >= 680 && cursorX < 704) {
            console.log('STOREBUG_BUTTON_AREA');
            storeBugPositions();
        } else if(cursorY >= 576 && cursorX >= 704 && cursorX < 728) {
            console.log('RESTOREBUG_BUTTON_AREA');
            restoreBugPositions(true);
        } else if(cursorY >= 576 && cursorX >= 752 && cursorX < 776) {
            console.log('SAVE_BUTTON_AREA');
            hideUI();
            saveFile();
        } else if(cursorY >= 576 && cursorX >= 776 && cursorX < 800) {
            console.log('LOAD_BUTTON_AREA');
            hideUI();
            $("#loadExport").removeClass("currentlyHidden");
        }
    }
    //If we're inside the playfield, convert the coordinates to a tile.
    //The logic for this is going to become a great deal more complex with time, I think.
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        console.log("In the playfield");
        var currentTile = getTile(cursorX, cursorY);
        console.log(currentTile);
        
        //This statement reduces painting with UI elements open; timeouts handle the rest.
            if($("#saveExport").hasClass("currentlyHidden") === true &&
               $("#loadExport").hasClass("currentlyHidden") === true){
                
                switch(selectedTool){
                    case "pencil":
                        fieldContents[currentTile[0]][currentTile[1]] = new Tile(pitchTable[currentPitch], currentInstrument, currentDSP, currentFlowControl, currentVolume, currentDSPValue, 0);
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
                    //Paste doesn't work if there's no tilebuffer, or if the tilebuffer is too large.
                        if(tileBuffer !== undefined) {
                            //There might be other conditions; I'll implement them if I can think of them.
                            if(tileBuffer.length !== FIELD_SIZE[0] ||
                               tileBuffer[0].length !== FIELD_SIZE[1]) {
                                //We include offset for where the user clicked.
                                pasteBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3], 
                                            currentTile[0], currentTile[1]);
                            } else { console.log("Can't paste that. It's too damn big!")};
                        } else { console.log("Select something first, then try pasting it.");} 
                        break;
                    case "query":
                        $("#queryInfo").removeClass("currentlyHidden");
                        respondToQuery(currentTile[0],currentTile[1]);
                        break;
                    case "moveBug":
                    //Only try to move a bug if the user selected one.
                        if(moveBugStage === 1) {
                            for(var i = 0; i < bugList.length; ++i){
                                if((bugList[i].bugTile[0]) === currentTile[0] && 
                                    bugList[i].bugTile[1] === currentTile[1]) {
                                    selectedBug = i;
                                    pauseState = true; //I recommend against trying to move bugs during playback, though.
                                    moveBugStage = 2;
                                    alert("Now click where in the field you want to move the bug. This won't work if you try to scroll the field first.");
                                }
                            }
                        } else if (moveBugStage === 2) {
                            var newBugCoords = convertTiletoPixels(currentTile[0],currentTile[1]);
                            //These conversions are redundant, but necessary to make things work.
                            bugList[selectedBug].x = newBugCoords[0];
                            bugList[selectedBug].y = newBugCoords[1];
                            moveBugStage = 1;
                            bugList[selectedBug].bugTile = getTile(bugList[selectedBug].x,bugList[selectedBug].y);
                        } else console.log("moveBug() in interact() failed.");
                        break;
                    case "turnBug":
                        for(var i = 0; i < bugList.length; ++i){
                                if( (bugList[i].bugTile[0]) === currentTile[0] && 
                                     bugList[i].bugTile[1] === currentTile[1]) { 
                                    //Check for a bug in the chosen tile; if there is one, rotate its heading 90 degrees clockwise.
                                    switch(bugList[i].action) {
                                        case 'moveLeft':
                                            bugList[i].action = 'moveUp';
                                            break;
                                        case 'moveUp':
                                            bugList[i].action = 'moveRight';
                                            break;
                                        case 'moveRight':
                                            bugList[i].action = 'moveDown';
                                            break;
                                        case 'moveDown':
                                            bugList[i].action = 'moveLeft';
                                            break;            
                                        default:
                                            break;
                                    }
                                }
                            }
                        
                        break;
                    case "editTile":
                        //currentlyEditedTile is used when we need global scope. Probably not optimal.
                        currentlyEditedTile = currentTile; 

                        $("#modifyTileTarget").html(currentTile[0] + " , " + currentTile[1]);
                        //Fill the window with the values from the tile if relevant. Substitute defaults if it's empty.
                        if(fieldContents[currentTile[0]][currentTile[1]] !== undefined) {                     
                            if(fieldContents[currentTile[0]][currentTile[1]].note !== undefined) {
                                //The tile's frequency multiplier needs to be converted to the correct pitch before we can use this.
                                $("#modifyTilePitchSpinner").val(fieldContents[currentTile[0]][currentTile[1]].note);
                            }
                            if(fieldContents[currentTile[0]][currentTile[1]].instrument !== undefined) {  
                                $("#modifyTileInstrumentSpinner").val(fieldContents[currentTile[0]][currentTile[1]].instrument);
                            }                            
                            if(fieldContents[currentTile[0]][currentTile[1]].flowValue !== undefined) {  
                                $("#modifyTileFlowSpinner").val(fieldContents[currentTile[0]][currentTile[1]].flowValue);
                            }
                            if(fieldContents[currentTile[0]][currentTile[1]].xPointer !== undefined) {
                                $("#modifyPointerTileX").val(fieldContents[currentTile[0]][currentTile[1]].xPointer)
                            } 
                            if(fieldContents[currentTile[0]][currentTile[1]].yPointer !== undefined) {
                                $("#modifyPointerTileY").val(fieldContents[currentTile[0]][currentTile[1]].yPointer)
                            }
                        //If the tile's undefined, we need some default values!
                        } else {
                            $("#modifyTilePitchSpinner").val(36);
                            $("#modifyTileInstrumentSpinner").val(0);
                            $("#modifyTileFlowSpinner").val(0);
                            $("#modifyPointerTileX").val(0);
                            $("#modifyPointerTileY").val(0);
                        }

                        //Then show the window to the user.
                        $("#modifyTile").removeClass("currentlyHidden");
                        break;
                    default:
                        break;
                }
            }
        console.log(fieldContents[currentTile[0]][currentTile[1]]);
    }
}

//Graphics functions. It might be wise to make these subfunctions of something tile related.
//fieldOffset changes the logic!
function getTile(x,y) {
    var tileX = Math.floor((x - 80)/TILE_SIZE) + fieldOffset[0];
    var tileY = Math.floor(y/TILE_SIZE) + fieldOffset[1];
    return [tileX, tileY];
}

function convertTiletoPixels(x,y){
    var pixelX = (x*24) + 80;
    var pixelY = y*24;
    return [pixelX, pixelY];
}

//Maybe move the audio playback routines into a seperate file?
function soundsAreReady(soundList) {
    soundsAreReady.called = true;
    //console.log(soundList);
    //Populate soundFont with all the sounds we need.
    soundFont = [];
    for(var i = 0; i < soundList.length; ++i) {
        soundFont.push(soundList[i]); //We fill up SoundFont with sounds...
    }
    $("#initButton").html("Loaded, click to play");
    //init(); //Program's not going to be much use until the sounds have loaded.
}

function playSound(buffer, pitch, dspEffect, dspValue, volume) {
    //console.log(dspEffect + ": " + dspValue);
    var source = audioEngine.createBufferSource();  
    source.buffer = buffer;
    source.playbackRate.value = pitch;
    //console.log(source.playbackRate.value*44100);

    //Volume adjustment is handled before effects are added.
    var volumeAdjustment = audioEngine.createGain();
    source.connect(volumeAdjustment);
    //Very basic error trapping in case we get nasty input that might potentially cause clipping.
    if(volume >= 0 && volume <= 1) { 
        volumeAdjustment.gain.value = volume; 
    } else { volumeAdjustment.gain.value = 0.6; }

    //Decide how to handle audio when page isn't visible, see http://www.w3.org/TR/page-visibility/?csw=1
    /*  To extend the sound system to take at least two audio effects at a time, 
     *  we'll need some sort of intermediate filter. (Source -> filter1 -> filter2 -> destination)
     *  Also necessary - a null filter that doesn't do anything that we can pass through as needed.
     *  Arpeggiation should not be handled through the DSP switch statement, but by a seperate playback linked into tempo?
     *
     */
    switch(dspEffect){
        case 'lowpass':
            var createLowPass = audioEngine.createBiquadFilter();
            volumeAdjustment.connect(createLowPass);
            createLowPass.connect(audioEngine.destination);
            createLowPass.type = 'lowpass';
            createLowPass.frequency.value = dspValue;
            break;
        case 'hipass':
            var createHighPass = audioEngine.createBiquadFilter();
            volumeAdjustment.connect(createHighPass);
            createHighPass.connect(audioEngine.destination);
            createHighPass.type = 'highpass';
            createHighPass.frequency.value = dspValue;
            break;
        case 'bendpitch':
            if(dspValue <= 16 && dspValue >= 0) { source.playbackRate.value *= dspValue; } 
            else { console.log('bendpitch only takes values between 0 and 16, for the sake of sanity. Effect not applied.'); }
            volumeAdjustment.connect(audioEngine.destination);
            break;
        default:
            volumeAdjustment.connect(audioEngine.destination);
            break;
    }
    source.start(0);
    //Write a conditional that allows us to cut off a sound if we have a certain DSP effect.
}

function main(){
    /* This is our main loop! It updates the internal model of bug positions and such when the game is unpaused.
     * Then it calls the render function to update the view so that the user sees the actual state of this toy.
     * This needs to link partially into the tempo variable. Bug positions only need to update on tempo ticks.
     * However, rendering needs to be as fast and responsive as possible, so it's independent of our timing function.
     */
    updateFrequency = tickMultiplier/TEMPO; //Recomputing this here will come in handy when the user changes the tempo.
    var now = Date.now();
    var delta = (now - lastTime) / 1000.0;
    lastTime = now;
    //console.log(timeToUpdate);
    //Use the delta as a timeOut surrogate.
    timeToUpdate = timeToUpdate - delta;
    //When it hits zero, we update.
    if(timeToUpdate <= 0) { 
        if(pauseState == false) { 
            for(var i = 0; i < bugList.length; ++i) {
                if(bugList[i].inStorage === false) { bugList[i].updateBug(); }
            }
            //Once we've updated positions, update the timer as well.
            elapsedTime += 1;
            $("#elapsedTime").html(elapsedTime);
        }
        timeToUpdate = updateFrequency; 

    }

    render();

    window.requestAnimationFrame(main);
    

}

function render(){
    ctx.clearRect(FIELD_PIXELS[0],FIELD_PIXELS[1],FIELD_PIXELS[2],FIELD_PIXELS[3]); //Use this to refresh everything.
    //Render things in this order:
    //1. Background (Which didn't have to be redrawn a lot but now does?)
    ctx.fillStyle = "#000000";
    ctx.fillRect(LEFT_VERTICAL_BAR[0],LEFT_VERTICAL_BAR[1],LEFT_VERTICAL_BAR[2],LEFT_VERTICAL_BAR[3]); 
    ctx.fillStyle = "#888888";
    ctx.fillRect(BOTTOM_HORIZONTAL_BAR[0],BOTTOM_HORIZONTAL_BAR[1],BOTTOM_HORIZONTAL_BAR[2],BOTTOM_HORIZONTAL_BAR[3]);
    ctx.fillStyle = "#BBBBBB";
    //2. Painted tiles

    //Draw boundaries between tiles.
    //This may need adjustment if we implement a zoom feature.
    for(var i = 80; i < FIELD_PIXELS[2]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i,0); //Horizontal lines
        ctx.lineTo(i,552);
        ctx.stroke();
    }
    for(var i = 0; i < FIELD_PIXELS[3]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0,i); //Vertical lines
        ctx.lineTo(800,i);
        ctx.stroke();
    }
    //Painting squares! From an MVC stance this is the "view", I guess.
    for(var i = 0; i < (FIELD_SIZE[0]); ++i){
        for(var j = 0; j < (FIELD_SIZE[1]); ++j){
            if(typeof fieldContents[i + fieldOffset[0]][j + fieldOffset[1]] === 'object'){
                //Color's been added. See music_instructions.js for more info.
                paintTile(i,j, fieldContents[i + fieldOffset[0]][j + fieldOffset[1]].color);
            }
            //Experimental tile buffer overlay that draws a translucent box over the tile buffer.
            //Reserved for when the user is actively selecting or pasting things.
            if(tileBuffer !== undefined && tileBuffer.length < fieldContents.length && 
               tileBuffer[0].length < fieldContents[0].length && selectBoxStage === 1) {
                if(selectedTool === 'selectBox' || selectedTool === 'paste') {
                //Check to see if the tile is in the tile buffer.
                    if(i + fieldOffset[0] >= selectBoxCoords[0] && j + fieldOffset[1] >= selectBoxCoords[2] &&
                       i + fieldOffset[0] <= selectBoxCoords[1] && j + fieldOffset[1] <= selectBoxCoords[3]){
                        //console.log(selectBoxCoords);
                        ctx.fillStyle = 'rgba(0,0,0,0.2)'; //Preps the overlay. 
                        ctx.fillRect(FIELD_PIXELS[0] + (TILE_SIZE*i), 
                                     FIELD_PIXELS[1] + (TILE_SIZE*j),
                                    (TILE_SIZE*1), 
                                    (TILE_SIZE*1));
                    }
                }
            }
        }
    }
    //3. Bugs and actual bug overlays.
    for(var i = 0; i < bugList.length; ++i){
        if(bugList[i].inStorage === false) { 
            bugList[i].drawBug(); 
        }   
    }
    //4. UI Elements that don't use HTML (those that do are handled seperately)
    drawButtons();
    paintMiniMap();  
}

//This is a rendering function, anyways.
function paintTile(tileX, tileY, color){
    //Fill in the basics.
    ctx.fillStyle = color; 
    ctx.fillRect(FIELD_PIXELS[0] + (TILE_SIZE*tileX), 
                 FIELD_PIXELS[1] + (TILE_SIZE*tileY),
                (TILE_SIZE*1), 
                (TILE_SIZE*1));
    //Add overlays to tiles as needed.
    var currentOverlay = fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]];
    //The first layer is for turnsignals.
    if(currentOverlay.flowEffect !== "none") {
        switch(currentOverlay.flowEffect) {
            case "turn_west":
                ctx.drawImage(tileOverlayImages[0],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "turn_north":
                ctx.drawImage(tileOverlayImages[1],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "turn_east":
                ctx.drawImage(tileOverlayImages[2],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "turn_south":
                ctx.drawImage(tileOverlayImages[3],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "freeze":
                ctx.drawImage(tileOverlayImages[4],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "teleport":
                ctx.drawImage(tileOverlayImages[10],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "counter":
                ctx.font = "10px Tahoma";
                ctx.fillStyle = "#FFFFFF"; 
                //For contrast.
                if(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].note > 1) { 
                    ctx.fillStyle = "#000000";
                }
                ctx.fillText(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].flowValue, FIELD_PIXELS[0] + (TILE_SIZE*tileX) + 2, FIELD_PIXELS[1] + (TILE_SIZE*tileY) + 16, 22);
                ctx.fillText(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].flowValue, FIELD_PIXELS[0] + (TILE_SIZE*tileX) + 1, FIELD_PIXELS[1] + (TILE_SIZE*tileY) + 16, 22);
                break;
            case "revert":
                //Use a modified version of this icon or something instead!
                ctx.drawImage(UIImages[11],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            default:
                break;
        }
    }
    //The second layer tells us which part of the soundbank we're looking at.
    //0-128 is the General MIDI melodic bank and has no extra overlay.
    //128-174 is the percussion bank and has a little "P" in the top left.
    //A sound effect bank and a 'synthesizer' bank are planned, but they do not have sounds or overlays yet.
    if(currentOverlay.instrument > 128 && currentOverlay.instrument < 174) {
        ctx.drawImage(tileOverlayImages[9],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
    }
}