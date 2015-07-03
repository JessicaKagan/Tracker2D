//All the glue that holds this project together. 
//UI constants:
var FILE_SIZE = [64,64]; //The field is 64*64 at the start, but can be expanded in the song properties.
var FIELD_SIZE = [30,23]; //The amount of horizontal and vertical tiles in the view.
var TILE_SIZE = 24; //This is more cumbersome early on, but I will eventually need to implement zooming, and this might help.
var LEFT_VERTICAL_BAR = [0,0,80,800];
var BOTTOM_HORIZONTAL_BAR = [80,552,720,48];
var FIELD_PIXELS = [80,0,800,552]; //This is the area not covered by the UI; x-coords 80-> 800, y-coords 0->552

var PAUSE_PLAY_BUTTON_AREA = [80,576,24,24];
var PENCIL_BUTTON_AREA = [104,576,24,24];
var ERASER_BUTTON_AREA = [128,576,24,24];
var SELECTBOX_BUTTON_AREA = [152,576,24,24];
var PASTE_BUTTON_AREA = [176,576,24,24];

var HORIFLIP_BUTTON_AREA = [152,552,24,24];
var VERTFLIP_BUTTON_AREA = [176,552,24,24];
var ROTATELEFT_BUTTON_AREA = [200,552,24,24];
var ROTATERIGHT_BUTTON_AREA = [224,552,24,24];

var BUGPROPS_BUTTON_AREA = [608,552,24,24];

var QUERY_BUTTON_AREA = [200,576,24,24];
var MOVEBUG_BUTTON_AREA = [224,576,24,24];
var TURNBUG_BUTTON_AREA = [248,576,24,24];

var EYEDROPPER_BUTTON_AREA = [272,576,24,24];
var ADJUSTPOINTER_BUTTON_AREA = [296,576,24,24];

var HELP_BUTTON_AREA = [560,576,24,24];

var EDIT_TILE_BUTTON_AREA = [608,576,24,24];
var SONGPROPS_BUTTON_AREA = [632,576,24,24];

var STOREBUG_BUTTON_AREA = [680,576,24,24];
var RESTOREBUG_BUTTON_AREA = [704,576,24,24];

var SAVE_BUTTON_AREA = [752,576,24,24];
var LOAD_BUTTON_AREA = [776,576,24,24];
var REVERT_BUTTON_AREA = [776,552,24,24];

var fieldContents = new Array(FILE_SIZE[0]);
//Everything is undefined by default.
for(var i = 0; i < FILE_SIZE[0]; ++i) {
    fieldContents[i] = new Array(FILE_SIZE[1]);
}

//Globals for now. Deglobalize as implementation permits. 
var soundFont, audioEngine, audioLoader, defaultBuffer; 
var selectBoxStage, moveBugStage, selectedBug, currentlyEditedTile, adjustPointerStage;
var hoverBug = -1; //This one is similar to selectedBug but can't be merged. Maybe localize it at some point?
var revertCalled = false;

//These values are used to run the timer.
var lastTime, updateFrequency, timeToUpdate; 
var elapsedTime = 0;
var TICK_MULTIPLIER = 12.5;
var estimatedSongLength; //Not implemented yet.

var scaleNote = 0; //Used in keyboard_shortcuts to adjust currentPitch;
var currentOctave = 3;
var currentPitch = 36;
var currentInstrument = 1;
var currentDSPValue = 0;
var currentVolume = 0.6;
var currentDSP = "none";
var currentFlowControl = "none";


//Image arrays used in image_loader.js
var UIImages = new Array(26);
var tileOverlayImages = new Array(12); //Used for flow control and anything that needs to be drawn above a bug or tile.
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
//Apparently this can't handle FLACs, so convert to wavs, mp3s, or Vorbis?
var soundArray = new Array(soundSet.length);
for(var i = 0; i < soundSet.length; ++i){
    if(soundSet[i] !== undefined){
        soundArray[i] = soundSet[i][1]; //If we do have a sound, get its filename from here.
    } else soundArray[i] = './sounds/00.mp3'; //Otherwise, silence.
}

//Set up a canvas to draw on. All the drawing functions should be in render() now.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Set up the audio engine and a system for playing sounds.
window.AudioContext = window.AudioContext || window.webkitAudioContext; //The second part is used to support Chrome and Safari.
audioEngine = new AudioContext();
audioLoader = new BufferLoader(audioEngine, soundArray, soundsAreReady);
audioLoader.load(); //This sequence calls soundsAreReady() when it's done.

function init() {
    console.log("Tracker2D needs documentation! Here's a start.");
    console.log("Only audio FX that work are bendpitch, lowpass, and highpass. Bendpitch takes values between 0-16; the passes take values from 0-20000.");
    console.log("Adjust input pitch with the QWERTY row and +/-, although you'll need a QWERTY layout keyboard for that to really make sense.");
    //Since this running means everything's loaded, dispel the load notice.
    $("#loadScreen").addClass("alwaysHidden");
    //Set up HTML5 Canvas and mouse input. interact() is now in mouse_input.js
    var bindCanvas = document.getElementById("canvas");
    bindCanvas.addEventListener("click", function (e) { interact('click',e) }, false); //Binding to the canvas instead of the entire document fixes some strange bugs.
    bindCanvas.addEventListener("mousedown",function (e) { interact('mousedown',e) }, false);
    bindCanvas.addEventListener("mouseup", function (e) { interact('mouseup',e) }, false);
    bindCanvas.addEventListener("mousemove", function (e) { interact('mousemove',e) }, false);
    //Then set up file I/O for when the user loads a file off their computer.
    document.getElementById('loadFileUI').addEventListener('change', loadFile, false);

    //Set up keyboard shortcuts.
    hookKeyboard();

    //Populate the instrument menu. The undefined check is VERY important.
    for(var i = 0; i < soundSet.length; ++i){
        if(soundSet[i] !== undefined){
            //Highlight the Grand Piano, which is selected at the beginning.
            if(i === 1){
                $('#instrumentInput').append('<option value="' + soundSet[i] + '" selected>' + soundSet[i][0] + '</option>');
            } else {
                $('#instrumentInput').append('<option value="' + soundSet[i] + '">' + soundSet[i][0] + '</option>');
            }
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
        getBug(i, false);
    }
    //Populating this will prevent unsolicited load errors.
    storeBugPositions();

    //Add an event listener for hovering in the bug storage divs.
    //This is going to be kind of inefficient, but we'll live.
    //Finish this.
    $("#bugStorageUnit1").hover(
        function(){
            bugHoverState = true;
            hoverBug = 0;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit2").hover(
        function(){
            bugHoverState = true;
            hoverBug = 1;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit3").hover(
        function(){
            bugHoverState = true;
            hoverBug = 2;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit4").hover(
        function(){
            bugHoverState = true;
            hoverBug = 3;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit5").hover(
        function(){
            bugHoverState = true;
            hoverBug = 4;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit6").hover(
        function(){
            bugHoverState = true;
            hoverBug = 5;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit7").hover(
        function(){
            bugHoverState = true;
            hoverBug = 6;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );    
    $("#bugStorageUnit8").hover(
        function(){
            bugHoverState = true;
            hoverBug = 7;
        }, 
        function() {
            bugHoverState = false;
            hoverBug = -1;
        }
    );

    //Create the buffer.
    defaultBuffer = new TileBuffer(0,0,0,0);
    //console.log(defaultBuffer);

    //Create timing information, and then begin the mainloop.
    lastTime = Date.now();
    updateFrequency = TICK_MULTIPLIER/TEMPO; //Currently, 8 'ticks' every beat?
    timeToUpdate = updateFrequency;
    window.requestAnimationFrame(main);
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
    $("#initButton").html("Loaded, click to play"); //Clicking this calls init().
}

function playSound(buffer, pitch, dspEffect, dspValue, volume) {

    var source = audioEngine.createBufferSource();  
    source.buffer = buffer;
    var playbackMidPoint = source.buffer.duration; //Fallback.
    source.playbackRate.value = pitch; //Samples do not play back fully in Chrome when slowed down.

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
        case 'stopplayback': //These share some logic and operate on start() accordingly.
        case 'startfromlater':
            //Takes values between 0-100 (floating point) and converts them into percentages of the file's length.
            if(dspValue >= 0 && dspValue < 100) {
                playbackMidPoint = source.buffer.duration * (dspValue/100);
            }
            volumeAdjustment.connect(audioEngine.destination);
            break;
        default:
            volumeAdjustment.connect(audioEngine.destination);
            break;
    }
    //console.log(playbackMidPoint);
    if(dspEffect == 'stopplayback'){
        source.start(0,0,playbackMidPoint); //Stops playing after a percentage of the duration.
    } else if(dspEffect == 'startfromlater') {
        source.start(0,playbackMidPoint); //Starts playing in the middle of the sound.
    } else {
        source.start();
    } //Add the ability to start later in a sound or end it prematurely. Somehow.
    //Write a conditional that allows us to cut off a sound if we have a certain DSP effect.
}

function main(){
    /* This is our main loop! It updates the internal model of bug positions and such when the game is unpaused.
     * Then it calls the render function to update the view so that the user sees the actual state of this toy.
     * This needs to link partially into the tempo variable. Bug positions only need to update on tempo ticks.
     * However, rendering needs to be as fast and responsive as possible, so it's independent of our timing function.
     */
    updateFrequency = TICK_MULTIPLIER/TEMPO; //Recomputing this here will come in handy when the user changes the tempo.
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
                //If any of the bugs tripped a revert tile, run the revert.
            }
            if(revertCalled === true){
                restoreBugPositions(false);
                revertCalled = false;
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
