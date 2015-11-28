var drawingStatus, miniMapScrollingStatus, currentTile, pointeeX, pointeeY;
var currentArrowPenTile = [0,0];
var arrowPenDrawingActivated = true;
var extrapolateTiles = [0,0,0,0];

//This is our mouse listeners go!
function interact(action, e) {
    //console.log(e);
    //queryInfo's hide routine probably needs to be merged with the rest of hideUI().
    $("#queryInfo").addClass("currentlyHidden"); 

    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    //Displays debug messages for now based on where you click.
    if(cursorX >= 8 && cursorX <= 72 && cursorY >=8 && cursorY <= 72) {
            //console.log("MINIMAP");
            setMiniMapScrollingStatus();
            if(miniMapScrollingStatus === true){
                moveViewingField((cursorX - 8),(cursorY - 8)); //Compensating for the offsets in the UI.
            }
    }

    //Dummied out for now, but I'm keeping it in the off chance we need something in the left bar later.
    /*
    if(cursorX <= 80 && cursorX > 0 && action === "click") { 
        console.log("LEFT_VERTICAL_BAR"); 
    }
    */
    if(cursorY >= 540 && cursorY <= 600 && cursorX >= 80 && action === "click") { 
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
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 104 && cursorX < 128) {
            console.log("FXPEN_BUTTON_AREA");
            selectedTool = "audioFXPen";
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 128 && cursorX < 152) {
            console.log("FILL_BUTTON_AREA"); 
            if( (selectBoxCoords[0] == selectBoxCoords[1]) && (selectBoxCoords[2] == selectBoxCoords[3]) ) { 
                alert("You must select some tiles (not just one) before you can use the fill tool."); 
            } else {
                for(var i = selectBoxCoords[0]; i <= selectBoxCoords[1]; ++i){
                    for(var j = selectBoxCoords[2]; j <= selectBoxCoords[3]; ++j){
                        //Remember to update this if the tile data structure is changed.
                        fieldContents[i][j] = new Tile(pitchTable[currentPitch], currentInstrument, currentDSP, currentFlowControl, currentVolume, currentDSPValue, 0);
                    }
                }
            }
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 152 && cursorX < 176) {
            console.log("HORIFLIP_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("horizontalFlip");
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 176 && cursorX < 200) { 
            console.log("VERTFLIP_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("verticalFlip");     
        /*   
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 200 && cursorX < 224) { 
            console.log("ROTATELEFT_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("rotateLeft");        
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 224 && cursorX < 248) { 
            console.log("ROTATERIGHT_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("rotateRight");
        */
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
        } else if(cursorY >= 576 && cursorX >= 272 && cursorX < 296) {
            console.log("EYEDROPPER_BUTTON_AREA");
            selectedTool = "eyeDropper";
        } else if(cursorY >= 576 && cursorX >= 296 && cursorX < 320) {
            console.log("ADJUSTPOINTER_BUTTON_AREA");
            selectedTool = "adjustPointer";
            adjustPointerStage = 1;
        } else if(cursorY >= 576 && cursorX >= 320 && cursorX < 344) {
            console.log("ARROWPEN_BUTTON_AREA");
            selectedTool = "arrowPen";
            alert("To use this tool, press the numpad arrow keys (2/4/6/8), and click where you want to start. Each keypress will paint one tile in the relevant direction. Rephrase this.")
        }else if(cursorY >= 576 && cursorX >= 344 && cursorX < 368) {
            console.log("EXTRAPOLATE_BUTTON_AREA");
            selectedTool = "extrapolate";
            extrapolateStage = 1;
        } else if(cursorY >= 576 && cursorX >= 560 && cursorX < 588) {
            console.log("HELP_BUTTON_AREA");
            hideUI();
            if($("#helpPage").hasClass("currentlyHidden") === true){
                $("#helpPage").removeClass("currentlyHidden");
            }
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 608 && cursorX < 632) {
            console.log("BUGPROPS_BUTTON_AREA");
            hideUI();
            if($("#modifyBugProperties").hasClass("currentlyHidden") === true){
                $("#modifyBugProperties").removeClass("currentlyHidden");
                $("#bugPropsVolume").val(bugList[$("#bugSelectionMenu").val()].volume);
                $("#currentBugVolume").html($("#bugPropsVolume").val());
            //Bug property stuff will be necessary at some point.
            }
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 632 && cursorX < 656) {
            console.log("UIPROPS_BUTTON_AREA");
            hideUI();
            $("#modifyUIProperties").removeClass("currentlyHidden");
            //Fill the UI color changers with the current color values.
            //$('#bgColorInput').val(backgroundColor.substring(5,backgroundColor.length - 1));
            $('#bgColorInput').val(backgroundColor);
            $('#leftBarColorInput').val(leftBarColor);
            $('#bottomBarColorInput').val(bottomBarColor);
            $('#boundaryColorInput').val(tileBoundaryColor);
        } else if(cursorY >= 576 && cursorX >= 608 && cursorX < 632) {
            selectedTool = "editTile";
            console.log("EDIT_TILE_BUTTON_AREA");
            hideUI();
        } else if(cursorY >= 576 && cursorX >= 632 && cursorX < 656) {
            console.log('SONGPROPS_BUTTON_AREA');
            hideUI();
            //Fill the UI elements with data from the song properties.
            $("#tempoSpinner").val(TEMPO);
            $("#fieldSizeSpinner").val(PLAYFIELD_SIZE*64);
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
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 776 && cursorX < 800) {
            console.log("REVERT_BUTTON_AREA");
            if(loadedTiles !== undefined){
                var continueReverting = confirm("Revert restores the most recent copy of the field from your latest save or load operation. Your bugs' positions and headings will not be affected.");
                if(continueReverting === true) {
                    if(fieldContents === loadedTiles) { alert("Your field is the same as it was during the last file I/O operation.");} //This shouldn't be the case right now!
                    fieldContents = jQuery.extend(true, {}, loadedTiles);
                }
            } else { alert("Can't revert because you haven't attempted to save or load a file yet.");}
        }
    }
    //If we're inside the playfield, convert the coordinates to a tile.
    //The logic for this is going to become a great deal more complex with time, I think.
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        //console.log("In the playfield");
        currentTile = getTile(cursorX, cursorY);
        //console.log(currentTile);
            switch(selectedTool){
                case "pencil":
                    setDrawingStatus();
                    if(drawingStatus === true){
                        //Something is wrong with the audioFX parameter (the last one).
                        //It doesn't seem to properly deep clone.
                        //Therefore, modifying currentAudioEffects sometimes (but unreliably) changes the tile.
                        //Mess around and then add a new effect, and the new effect doesn't get added to said tiles.
                        //Paint new tiles, though, and the new effect also gets modified when modifying them?
                        fieldContents[currentTile[0]][currentTile[1]] = new Tile(pitchTable[currentPitch], currentInstrument, undefined, 
                            currentFlowControl, currentVolume, undefined, 0, 0, 0, 0, 
                            $.extend(true, [], currentAudioEffects )); 
                    
                    }
                    break;
                case "audioFXPen":
                //This has the same pointer problem as the regular pen.
                    setDrawingStatus();
                    if(drawingStatus === true && fieldContents[currentTile[0]][currentTile[1]] !== undefined){
                        fieldContents[currentTile[0]][currentTile[1]].audioEffectList = $.extend(true, [], currentAudioEffects); 
                    }
                    break;
                case "eraser":
                    setDrawingStatus();
                    if(drawingStatus === true){
                        fieldContents[currentTile[0]][currentTile[1]] = undefined;
                    }
                    break;
                case "selectBox":
                    if(action === "click") {
                        if(selectBoxStage === 1) {
                            //Get the first pair for the buffer.
                            selectBoxCoords[0] = currentTile[0];
                            selectBoxCoords[2] = currentTile[1];
                            selectBoxStage = 2;
                            alert("Click a second tile (or the same tile) to define a selection rectangle.");
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
                            defaultBuffer.fillBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3],'selectBox');
                            //And this allows the user to select something again.
                            selectBoxStage = 1;
                        } else console.log("selectBox() in interact() failed.");
                    }
                    break;
                case "paste":
                //For now, you can use a paste as a brush, which can actually look kind of cool.
                    setDrawingStatus();
                    if(drawingStatus === true){
                    //Paste doesn't work if there's no tilebuffer, or if the tilebuffer is too large.
                        if(defaultBuffer.array !== undefined) {
                            //There might be other conditions; I'll implement them if I can think of them.
                            if(defaultBuffer.array.length !== FIELD_SIZE[0] ||
                               defaultBuffer.array.length !== FIELD_SIZE[1]) {
                                //We include offset for where the user clicked.
                                defaultBuffer.pasteBuffer(selectBoxCoords[0],selectBoxCoords[1],selectBoxCoords[2],selectBoxCoords[3], 
                                            currentTile[0], currentTile[1]);
                            } else { console.log("Can't paste that. It's too damn big!")};
                        } else { console.log("Select something first, then try pasting it.");}
                    } 
                    break;
                case "query":
                    $("#queryInfo").removeClass("currentlyHidden");
                    respondToQuery(currentTile[0],currentTile[1]);
                    break;
                case "moveBug":
                //Move bug should eventually be upgraded to support click and drag like the pen and eraser features.
                    pauseState = true; //I recommend against trying to manually move bugs during playback.
                    if(action === "click") {
                        if(moveBugStage === 1) {
                            for(var i = 0; i < bugList.length; ++i){
                                if((bugList[i].bugTile[0]) === currentTile[0] && 
                                    bugList[i].bugTile[1] === currentTile[1]) {
                                    selectedBug = i;
                                    moveBugStage = 2;
                                    alert("Now click where in the field you want to move the bug. You can move the field with the minimap during this process.");
                                }
                            }
                        } else if (moveBugStage === 2) {
                            //console.log(currentTile[0],currentTile[1]);
                            moveBugStage = 1;
                            bugList[selectedBug].bugTile = [currentTile[0],currentTile[1]];
                        } else {
                            console.log("moveBug() in interact() failed.");
                            moveBugStage = 1;
                        }
                    }
                    break;
                case "turnBug":
                    for(var i = 0; i < bugList.length; ++i){
                            if( (bugList[i].bugTile[0]) === currentTile[0] && 
                                 bugList[i].bugTile[1] === currentTile[1] &&
                                 action === "click") { 
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
                    if(action === "click") {
                        currentlyEditedTile = currentTile; 
                        $("#modifyTileTarget").html(currentTile[0] + " , " + currentTile[1]);
                        //Fill the window with the values from the tile if relevant. Substitute defaults if it's empty.
                        if(fieldContents[currentTile[0]][currentTile[1]] !== undefined) {                     
                            if(fieldContents[currentTile[0]][currentTile[1]].note !== undefined) {
                            //The tile's frequency multiplier needs to be converted to the correct pitch before we can use this.
                                $("#modifyTilePitchSpinner").val(pitchTable.indexOf(fieldContents[currentTile[0]][currentTile[1]].note));
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
                    }
                    break;
                case "eyeDropper":
                    if(action === "click") {
                        if(fieldContents[currentTile[0]][currentTile[1]] !== undefined){
                            //alert("Eyedropper needs to be overhauled for the new Audio Effects engine");
                            //console.log(fieldContents[currentTile[0]][currentTile[1]]);
                            //I thought I had to do a logarithm to figure this out! I was so wrong.
                            currentPitch = pitchTable.indexOf(fieldContents[currentTile[0]][currentTile[1]].note);
                            updatePitchDescription();
                            //When we change the value being painted, we also need to inform the user by updating UI elements.
                            currentInstrument = fieldContents[currentTile[0]][currentTile[1]].instrument;
                            $('#instrumentInput').val(currentInstrument);
                            //Needs to scroll and change the highlighted element. Look this up!
                            //JQuery has a scrollTop() method.

                            //Legacy DSP filters probably shouldn't be eyedropped; it used to be in earlier versions.

                            //Specific flow control values and pointers aren't eyedropped, since you can't set them by painting. 
                            currentFlowControl = fieldContents[currentTile[0]][currentTile[1]].flowEffect;
                            $('#controlInput').val(currentFlowControl);
                            currentVolume = fieldContents[currentTile[0]][currentTile[1]].volume;
                            $('#adjustInputVolume').val(currentVolume*100);

                            //Color value should be added later, at least if user-defined color is added.
                            
                            //Used to determine whether to play an animation later.
                            if(currentAudioEffects.length != fieldContents[currentTile[0]][currentTile[1]].audioEffectList.length){
                                var effectListChanged = true;
                            }
                            currentAudioEffects = fieldContents[currentTile[0]][currentTile[1]].audioEffectList;
                            //currentAudioEffects = jQuery.extend(true, [], fieldContents[currentTile[0]][currentTile[1]].audioEffectList);

                            //Then, Rebuild the entire FXInstance array.
                            while($(".audioFXInstance").length > 0){
                                $(".audioFXInstance").last().remove();  
                            }

                            while($(".audioFXInstance").length < currentAudioEffects.length){
                                //Similar to addAudioFXToList() in ui_behavior, except that it doesn't change the underlying array.
                                //It still sets up an instance and its ID.
                                var ID = $(".audioFXInstance").length;
                                //console.log(ID);
                                genericAudioFXDiv.clone().appendTo("#audioFXPropertiesBox");
                                var instanceSelector = $(".audioFXInstance").last();
                                $(".audioFXInstance").last().attr("id","audioFXInstance" + (ID + 1) ); 
                                var selectMenu = instanceSelector.children('select'); //Find the select menu...
                                //And change the selected option to match the corresponding type.   
                                selectMenu.val(currentAudioEffects[ID].type).change();
                                //console.log(selectMenu);

                                //With that available, we can correctly update the fields.
                                adjustAudioEffectOptions(instanceSelector.children('select'));
                            }
                            $("#FXAppliedNumber").html(currentAudioEffects.length); //"X active" on the left bar.
                            //If the effects are different, animate the Audio FX area on the menu to show this.
                            if(effectListChanged === true){
                                //Animation doesn't work yet, but the function gets
                                $("#UIShifter3").animate(
                                    {left:"20px"}, 100, function(){
                                $("#UIShifter3").animate({left:"0px"}, 100); 
                                });
                            }

                        }
                        else {
                            alert("You can't use the eyedropper on an empty tile.");
                        }
                    }
                    break;
                case "adjustPointer":
                    if(action === "click") {
                        if(adjustPointerStage === 1) {
                            //Get one tile. 
                            pointeeX = currentTile[0];
                            pointeeY = currentTile[1];
                            adjustPointerStage = 2;
                            alert("Select the tile you want your previous selection to point to.");
                        } else if(adjustPointerStage === 2) {
                            //Get the coords yet again.
                            var pointToX = currentTile[0];
                            var pointToY = currentTile[1];
                            //Use this pair to adjust data in the first pair.
                            fieldContents[pointeeX][pointeeY].xPointer = pointToX;
                            fieldContents[pointeeX][pointeeY].yPointer = pointToY;
                            adjustPointerStage = 1;
                        } else console.log("adjustPointer() in interact() failed.");
                    }
                    break;
                //This simply moves the arrowPen location around.
                case "arrowPen":
                    if(action === "click") {
                        currentArrowPenTile = currentTile;
                        console.log(currentArrowPenTile);
                    }
                    break;
                case "extrapolate":
                    if(action === "click") {
                        if(extrapolateStage === 1){
                            extrapolateTiles[0] = currentTile[0];
                            extrapolateTiles[1] = currentTile[1];
                            extrapolateStage = 2;
                            //console.log(extrapolateTiles);
                        } else if(extrapolateStage === 2){
                            //Extrapolate takes values from two tiles and paints the area between said tiles with their averages.
                            extrapolateTiles[2] = currentTile[0];
                            extrapolateTiles[3] = currentTile[1];
                            //If the tiles are equivalent, stop executing.
                            if(extrapolateTiles[0] === extrapolateTiles[2] &&
                               extrapolateTiles[1] === extrapolateTiles[3]){
                                extrapolateStage = 1;
                                alert("You have to click different tiles for the Extrapolator to work properly.");
                                break;
                            }
                            //Once we have two tiles, behavior diverges based on what the user has selected in the relevant UI props.
                            if($('#extrapolatePitch').is(':checked')){
                                extrapolateTileData("note");
                            } else if($('#extrapolateVolume').is(':checked')){
                                extrapolateTileData("volume");
                            } else if($('#extrapolateFXValue').is(':checked')){
                                extrapolateTileData("dspValue"); //The capitalization on this is actually important!
                            }
                            extrapolateStage = 1;
                        }
                    }
                    break;
                default:
                    break;
            }
        
    }
    //Used for the pen and eraser tools and anything with a standard draw mechanism.
    //These need refining to make the buttons less 'sticky'.
    function setDrawingStatus(){
        if(action === 'mousedown') {
            drawingStatus = true;
        } else if (action === 'mouseup') {
            drawingStatus = false;
        }
    }
    //Similar to setDrawingStatus(), but for scrolling the minimap.
    function setMiniMapScrollingStatus(){
        if(action === 'mousedown') {
            miniMapScrollingStatus = true;
        } else if (action === 'mouseup') {
            miniMapScrollingStatus = false;
        }
    }
    //Called when you have an extrapolation. Probably contains more duplicated code than is healthy.
    //Each case makes sure the data it needs to extrapolate is valid at both ends.
    //Then it draws a (low precision) line between the tiles.
    function extrapolateTileData(type){
        //ALWAYS think left to right and adjust the order of coords as necessary.
        if(extrapolateTiles[2] < extrapolateTiles[0]) {
            extrapolateTiles[2] = [extrapolateTiles[0], extrapolateTiles[0] = extrapolateTiles[2]][0]; //Kludge swap.
            extrapolateTiles[3] = [extrapolateTiles[1], extrapolateTiles[1] = extrapolateTiles[3]][0]; //Also necessary to swap the Y coords.
        }
        //Then compute the range of values we need.
        var dataRange; 
        var amountOfTilesPainted = 0;
        switch(type){
            case "note":
                dataRange = [pitchTable.indexOf(fieldContents[extrapolateTiles[0]][extrapolateTiles[1]].note),
                             pitchTable.indexOf(fieldContents[extrapolateTiles[2]][extrapolateTiles[3]].note)];
                break;
            case "volume":
                dataRange = [fieldContents[extrapolateTiles[0]][extrapolateTiles[1]].volume,
                             fieldContents[extrapolateTiles[2]][extrapolateTiles[3]].volume];
                break;
            case "dspValue":
                //Parsefloat fixes an as-of-yet unidentified bug in DSPValue's type.
                dataRange = [parseFloat(fieldContents[extrapolateTiles[0]][extrapolateTiles[1]].dspValue),
                             parseFloat(fieldContents[extrapolateTiles[2]][extrapolateTiles[3]].dspValue)];
                break;
            default:
                alert("Somehow, the extrapolator didn't get a valid data type.");
                return;
        }
        //console.log(dataRange);
        
        //Bresenham's line drawing algorithm; might need some debugging.
        //I use two loops - one to determine the "length" of the line, and one to actually paint it.
        var deltaX = extrapolateTiles[2] - extrapolateTiles[0];
        var deltaY = extrapolateTiles[3] - extrapolateTiles[1];
        var error = 0;
        var deltaError = Math.abs(deltaY/deltaX);
        var differenceBetweenTiles = 0;
        var paintValue;
        var currentExtrapolationValue;


        //If the line is vertical, we need special code. Too much of this is duplicated and unfunctionalized to really be kosher.
        if(deltaError === Infinity) {
            //alert("Due to implementation problems, completely vertical lines are not yet possible. Pretty lame, right?");
            //We need to store our single X-coord for easy access.
            var baseX = extrapolateTiles[0];

            differenceBetweenTiles = Math.abs(dataRange[0] - dataRange[1])/(extrapolateTiles[3] - extrapolateTiles[1]);
            currentExtrapolationValue = dataRange[0];
            for(var i = extrapolateTiles[1]; i < extrapolateTiles[3]; ++i){

                console.log(i);

                if(dataRange[0] <= dataRange[1]) { currentExtrapolationValue += differenceBetweenTiles; }
                else { currentExtrapolationValue -= differenceBetweenTiles; }

                switch(type){
                    case "note":
                        //Convert to the pitch we need using the pitchTable.
                        paintValue = pitchTable[Math.floor(currentExtrapolationValue)];
                        break;
                    case "dspValue":
                    case "volume":
                        //Otherwise, we shouldn't have to do any mathematical conversions. 
                        paintValue = currentExtrapolationValue;
                        break;
                    default:
                        break;
                }
                //Computing the coordinates of the next tile is easier here since we don't have to really deal with slopes.
                if(type === "note"){
                    fieldContents[baseX][i] = jQuery.extend(true, {}, fieldContents[extrapolateTiles[0]][extrapolateTiles[1]]);
                }

                if(fieldContents[baseX][i] !== undefined || type === "note"){ 
                    fieldContents[baseX][i][type] = paintValue; 
                    fieldContents[baseX][i].updateColor();
                }
            }
            
            return;
        }

        /* NORMAL BRESENHAM FOR LINES WITH NON-VERTICAL SLOPE BEGINS HERE. */

        var baseY = extrapolateTiles[1];
        //We need a fix for vertical lines. Apparently this requires a different algorithm.
        for(var i = extrapolateTiles[0]; i < extrapolateTiles[2]; ++i){
            error += deltaError;
            ++amountOfTilesPainted; //This needs to be measured in order to properly compute interpolation values. Surprisingly, adding it to the differential corrector isn't necessary.
            while(error >= 0.5){
                baseY += Math.sign(extrapolateTiles[3] - extrapolateTiles[1]);
                error -= 1;
            }
        }
        differenceBetweenTiles = Math.abs(dataRange[0] - dataRange[1])/amountOfTilesPainted;
        //console.log(differenceBetweenTiles);

        //Reset extra counters for the second loop.
        error = 0;
        baseY = extrapolateTiles[1];

        
        //Loop through the line again; this time extrapolating the data as needed.
        console.log(dataRange);
        currentExtrapolationValue = dataRange[0];
        for(var i = (extrapolateTiles[0]); i < extrapolateTiles[2]; ++i){
            
            if(dataRange[0] <= dataRange[1]) { currentExtrapolationValue += differenceBetweenTiles; }
            else { currentExtrapolationValue -= differenceBetweenTiles; }

            switch(type){
                case "note":
                    //Convert to the pitch we need using the pitchTable.
                    paintValue = pitchTable[Math.floor(currentExtrapolationValue)];
                    break;
                case "dspValue":
                case "volume":
                    //Otherwise, we shouldn't have to do any mathematical conversions. 
                    paintValue = currentExtrapolationValue;
                    break;
                default:
                    break;
            }
            //We should not replace pitches unless we're extrapolating pitch.
            if(type === "note"){
                fieldContents[i][baseY] = jQuery.extend(true, {}, fieldContents[extrapolateTiles[0]][extrapolateTiles[1]]);
            }

            //Object and array equivalence is very interesting in Javascript.
            //This SHOULD pass the data to the parameter requested by the user.
            if((fieldContents[i][baseY] !== undefined || type === "note") && 
                (i != extrapolateTiles[0] && baseY != extrapolateTiles[1]) ){ 
                fieldContents[i][baseY][type] = paintValue; 
                fieldContents[i][baseY].updateColor();
            }
             //Color doesn't update properly without this (which just computes the new color)
            //console.log(type + " = " + fieldContents[i][baseY][type]);
            error += deltaError;

            //Extrapolation values don't propogate too well on near-vertical lines.
            while(error >= 0.5){

                if(type === "note"){
                    fieldContents[i][baseY] = jQuery.extend(true, {}, fieldContents[extrapolateTiles[0]][extrapolateTiles[1]]);
                }

                if((fieldContents[i][baseY] !== undefined || type === "note") && 
                    (i != extrapolateTiles[0] && baseY != extrapolateTiles[1]) ){ 
                    fieldContents[i][baseY][type] = paintValue; 
                    fieldContents[i][baseY].updateColor();
                }
                console.log(type + " = " + fieldContents[i][baseY][type]);
                baseY += Math.sign(extrapolateTiles[3] - extrapolateTiles[1]);
                error -= 1;
            }
        }
    //We might need some error trapping or something at the end of this function.
    }
}


