function hookKeyboard(){

    //Start with the canvas keys.
    $(window).keypress(function(e){
        //Multiple cases for multiple browser implementations.
        var keyboardInput = (e.charCode) ? e.charCode : ((e.which) ? e.which : e.keyCode);
        console.log(keyboardInput);
        var pressedNoteKey = true;
        var pressedArrowKey = false;
        switch(keyboardInput){
            //Pitch adjustment. This should perhaps be disabled when a window requiring text input is open.
            //It might be good to play the current instrument at the selected pitch when the user triggers hotkeys.
            case 61:
                if(currentOctave < 5) {
                    currentOctave += 1;
                    currentPitch += 12;
                    //$('#pitchInput').val(currentPitch);
                }
                break;
            case 45:
                if(currentOctave > 0) {
                    currentOctave -= 1;
                    currentPitch -= 12;
                    //$('#pitchInput').val(currentPitch);
                }
                //$('#pitchInput').val(currentPitch);
                break;
            //QWERTY row - 12 tone scale
            case 113:
                scaleNote = 0;
                break;
            case 119:
                scaleNote = 1;
                break;
            case 101:
                scaleNote = 2;
                break;
            case 114:
                scaleNote = 3;
                break;
            case 116:
                scaleNote = 4;
                break;
            case 121:
                scaleNote = 5;
                break;
            case 117:
                scaleNote = 6;
                break;
            case 105:
                scaleNote = 7;
                break;
            case 111:
                scaleNote = 8;
                break;
            case 112:
                scaleNote = 9;
                break;
            case 91:
                scaleNote = 10;
                break;
            case 93:
                scaleNote = 11;
                break;
            //2, 4, 6, 8 (arrow keys on the numpad)
            //For sanity, you can't move off the field, although you can move out of the viewing window.
            case 50: //Down
                pressedArrowKey = true;
                pressedNoteKey = false; 
                if((currentArrowPenTile[1] + 1) < FILE_SIZE[1] && selectedTool === "arrowPen") {currentArrowPenTile[1] += 1;}
                break;            
            case 52: //Left
                pressedArrowKey = true;
                pressedNoteKey = false;
                if(currentArrowPenTile[0] > 0 && selectedTool === "arrowPen") {currentArrowPenTile[0] -= 1;}
                break;            
            case 54: //Right
                pressedArrowKey = true;
                pressedNoteKey = false;
                if((currentArrowPenTile[0] + 1) < FILE_SIZE[0] && selectedTool === "arrowPen") {currentArrowPenTile[0] += 1;} 
                break;           
            case 56: //Up
                pressedArrowKey = true;
                pressedNoteKey = false; 
                if(currentArrowPenTile[1] > 0 && selectedTool === "arrowPen") {currentArrowPenTile[1] -= 1;}
                break;
            case 53: //Toggle actual drawing
                pressedArrowKey = true;
                pressedNoteKey = false;
                if(arrowPenDrawingActivated === false && selectedTool === "arrowPen"){
                    arrowPenDrawingActivated = true;
                } else if(arrowPenDrawingActivated === true && selectedTool === "arrowPen") {
                    arrowPenDrawingActivated = false;
                }
                //console.log(arrowPenDrawingActivated);
                break;
            default:
                pressedNoteKey = false; 
                break;   
        }
        //If the user pressed a note key, change the current pitch.
        if(keyboardInput !== 61 && keyboardInput !== 45) { 
            currentPitch = currentOctave*12 + scaleNote; 
            //UI function to demonstrate sounds to the user. Make this optional.
            if(pressedNoteKey === true && $("#modifySongProperties").hasClass("currentlyHidden") === true &&
                $('#samplePlayback').prop('checked') === true ) {
                //playSound(soundFont[currentInstrument],pitchTable[currentPitch],currentDSP,currentDSPValue,currentVolume);
                if(currentDSP != undefined){
                    playSound(soundFont[currentInstrument],pitchTable[currentPitch],currentDSP,currentDSPValue,currentVolume);
                } else {
                    playSound2(soundFont[currentInstrument],pitchTable[currentPitch],currentVolume, currentAudioEffects);
                }
            };
        }
        updatePitchDescription(); //Prettyprint the current pitch value.
        //If the user pressed an arrow key while using the arrow pen, paint in the direction they pressed.
        if(pressedArrowKey === true && selectedTool === "arrowPen" && arrowPenDrawingActivated === true){
            fieldContents[currentArrowPenTile[0]][currentArrowPenTile[1]] = new Tile(pitchTable[currentPitch], currentInstrument, currentDSP, currentFlowControl, currentVolume, currentDSPValue, 0);
        }
    });

    

    //Input sanitization for number only fields ("spinners"). Thanks, Stackoverflow!
    //http://stackoverflow.com/questions/891696/jquery-what-is-the-best-way-to-restrict-number-only-input-for-textboxes-all
    //I might be able to dummy this out due to number inputs being an option in HTML5.
    $( "#box" ).on("change", ".numbersOnly", function() {
    //jQuery('.numbersOnly').keypress(function (){  
        this.value = this.value.replace(/[^0-9\.]/g,'');
    });

    //UI hooks for the Song Properties and Tile Properties windows
    jQuery('#tempoSpinner').change(function (){
        //console.log(this.value);
        if(this.value >= 1 && this.value <= 999) {
            TEMPO = this.value;
        } else if(this.value < 1 || this.value > 999) {
            this.value.replace(TEMPO);
        }
        //Reset this timing value to recalibrate the main loop on tempo change.
        timeToUpdate = 0;
        updateFrequency = TICK_MULTIPLIER/TEMPO;
        
    });

    jQuery('#authorName').change(function (){
        author = this.value;
    });
    jQuery('#songName').change(function (){
        songTitle = this.value;
    });
    jQuery('#songDesc').change(function (){
        songDescription = this.value;
    });

    jQuery('#fieldSizeSpinner').change(function (){
        //First, make sure the value is a multiple of 64, and between 64*1 and 64*8 (512).
        //if(this.value !== parseInt(this.value)) { this.value = 64; }
        if(this.value > 512 || this.value < 64 ) { this.value = 64; }
        if(this.value%64 != 0) { this.value = this.value - this.value%64; }
        //Only then do we adjust the filesize, if at all.
        PLAYFIELD_SIZE = this.value/64;
        FILE_SIZE = [this.value, this.value];
        resizeFile();
    });

    jQuery('#modifyTilePitchSpinner').change(function (){
        if(this.value >= 0 && this.value <= 71) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].note = pitchTable[parseInt(this.value)]; 
        } else if(this.value < 0 || this.value > 71) {
            this.value.replace(pitchTable.indexOf(fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].note));
        }
        fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].updateColor(); 
    });

    //Instrument adjuster in Tile Properties
    jQuery('#modifyTileInstrumentSpinner').change(function (){
        //currentlyEditedTile gets around scoping...
        if(this.value >= 0 && this.value <= soundSet.length) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].instrument = parseInt(this.value);
        } else if(this.value < 0 || this.value > soundSet.length) {
            this.value.replace(fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].instrument);
        }
        fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].updateColor();   
    });    
    //Flow Control Value adjuster in Tile Properties
    jQuery('#modifyTileFlowSpinner').change(function (){
        if(this.value >= 0 && this.value <= 999) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].flowValue = parseInt(this.value);
        } else if(this.value < 0 || this.value > 999) {
            this.value.replace(fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].flowValue);
        } 
    });
    //Pointer adjusters for much the same purpose.
    jQuery('#modifyPointerTileX').change(function (){
        if(this.value >= 0 && this.value <= FILE_SIZE[0]) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].xPointer = parseInt(this.value);
        } else if(this.value < 0 || this.value > FILE_SIZE[0]) {
            this.value.replace(xPointer);
        }
    });
    jQuery('#modifyPointerTileY').change(function (){
        if(this.value >= 0 && this.value <= FILE_SIZE[1]) {
            fieldContents[currentlyEditedTile[0]][currentlyEditedTile[1]].yPointer = parseInt(this.value);
        } else if(this.value < 0 || this.value > FILE_SIZE[1]) {
            this.value.replace(yPointer);
        }
    });
    //Adjusts the target of the bug volume adjust function.
    jQuery('#bugSelectionMenu').change(function (){
        //First, set the volume slider's value to that of the selected bug.
        //$("#bugPropsVolume").val(bugList[this.value].volume); //Redundant?
        $("#currentBugVolume").html(bugList[this.value].volume);
        //Then tweak the HTML of our onChange function.
        //This is kind of janky in a vanillaJS way, but it should do the trick.
        $("#bugVolumeFunction").html('<input id="bugPropsVolume" type="range" min="0" max="100" value="' 
            + bugList[this.value].volume + 
            '"onchange="updateBugVolume(value,' 
            + this.value + 
            ') "></input>');
        //This seems like a really unhealthy kludge, but it works. 
        //If you know how to do it more elegantly, please make a pull request.
        jQuery('#bugPropsVolume').change(function (){
            $("#currentBugVolume").html(this.value);
        });

    });
    //This only handles the HTML adjustment side. See updateBugVolume() in bugs.js for the meat of the code.
    jQuery('#bugPropsVolume').change(function (){
        $("#currentBugVolume").html(this.value);
    });

    //Colors for the UI properties! These call a function in rendering.js
    jQuery('#bgColorInput').change(function (){
        updateUIColors("backgroundColor",this.value);
    });
    jQuery('#leftBarColorInput').change(function (){
        updateUIColors("leftBarColor",this.value);
    });    
    jQuery('#bottomBarColorInput').change(function (){
        updateUIColors("bottomBarColor",this.value);
    });    
    jQuery('#boundaryColorInput').change(function (){
        updateUIColors("tileBoundaryColor",this.value);
    });



}