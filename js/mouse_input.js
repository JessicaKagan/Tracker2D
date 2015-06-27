var drawingStatus, miniMapScrollingStatus, currentTile, pointeeX, pointeeY;
//This is our mouse listeners go!
//Needs rewriting in order to take advantage of the new event listeners.
function interact(action, e) {
    //console.log(e);
    //queryInfo's hide routine probably needs to be merged with the rest of hideUI().
    $("#queryInfo").addClass("currentlyHidden"); 

    var cursorX = e.pageX - $('#canvas').offset().left;
    var cursorY = e.pageY - $('#canvas').offset().top;
    //Displays debug messages for now based on where you click.
    //When we make more, we'll need some sort of 2D switch statement, because this is just getting ugly.
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
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 152 && cursorX < 176) {
            console.log("HORIFLIP_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("horizontalFlip");
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 176 && cursorX < 200) { 
            console.log("VERTFLIP_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("verticalFlip");        
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 200 && cursorX < 224) { 
            console.log("ROTATELEFT_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("rotateLeft");        
        } else if(cursorY >= 552 && cursorY < 576 && cursorX >= 224 && cursorX < 248) { 
            console.log("ROTATERIGHT_BUTTON_AREA"); 
            defaultBuffer.transformBuffer("rotateRight");
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
            //Bug property stuff will be necessary at some point.
            }
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
        }
    }
    //If we're inside the playfield, convert the coordinates to a tile.
    //The logic for this is going to become a great deal more complex with time, I think.
    if(cursorX >= 80 && cursorX <= 800 && cursorY >= 0 && cursorY <= 540){
        //console.log("In the playfield");
        currentTile = getTile(cursorX, cursorY);
        //console.log(currentTile);
        
        //This statement reduces painting with UI elements open; timeouts handle the rest.
        //Update it for the new UI elements.
            if($("#saveExport").hasClass("currentlyHidden") === true &&
               $("#loadExport").hasClass("currentlyHidden") === true){
                
                switch(selectedTool){
                    case "pencil":
                        setDrawingStatus();
                        if(drawingStatus === true){
                            fieldContents[currentTile[0]][currentTile[1]] = new Tile(pitchTable[currentPitch], currentInstrument, currentDSP, currentFlowControl, currentVolume, currentDSPValue, 0);
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
                        }
                        break;
                    case "eyeDropper":
                        if(action === "click" && fieldContents[currentTile[0]][currentTile[1]] !== undefined) {
                            console.log(fieldContents[currentTile[0]][currentTile[1]]);
                            //I thought I had to do a logarithm to figure this out! I was so wrong.
                            currentPitch = pitchTable.indexOf(fieldContents[currentTile[0]][currentTile[1]].note);
                            $('#pitchInput').val(currentPitch);
                            //When we change the value being painted, we also need to inform the user by updating UI elements.

                            //currentPitch = fieldContents[currentTile[0]][currentTile[1]].note; //Once we figure it out.
                            //$('#pitchInput').val(currentPitch);
                            currentInstrument = fieldContents[currentTile[0]][currentTile[1]].instrument;
                            $('#instrumentInput').val(currentInstrument);
                            //Needs to scroll and change the highlighted element. Look this up!
                            //JQuery has a scrollTop() method.

                            currentDSP = fieldContents[currentTile[0]][currentTile[1]].dspEffect;
                            $('#DSPInput').val(currentDSP);

                            currentFlowControl = fieldContents[currentTile[0]][currentTile[1]].flowEffect;
                            $('#controlInput').val(currentFlowControl);
                            currentVolume = fieldContents[currentTile[0]][currentTile[1]].volume;
                            $('#adjustInputVolume').val(currentVolume*100);
                            currentDSPValue = fieldContents[currentTile[0]][currentTile[1]].dspValue;
                            $('#dspValueInput').val(currentDSPValue);
                            //Color value should be added later.
                            //Flow control specifics are not eyedropped yet.   
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
                    default:
                        break;
                }
            }
        //console.log(fieldContents[currentTile[0]][currentTile[1]]);
    }
    //Used for the pen and eraser tools and anything with a standard draw mechanism.
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
}

