//Welcome to our (no longer new) graphics rendering file!

var bugHoverState = false; //If the user isn't hovering over a bug, no indicator rendering happens
//These variables store UI colors for user customization.
var backgroundColor = '255,255,255,1';
var leftBarColor = '0,0,0,1';
var bottomBarColor = '128,128,128,1';
var tileBoundaryColor = '64,64,64,1';

function render(){
    ctx.clearRect(FIELD_PIXELS[0],FIELD_PIXELS[1],FIELD_PIXELS[2],FIELD_PIXELS[3]); //Use this to refresh everything.
    //Render things in this order:
    //1. Background
    ctx.fillStyle = 'rgba(' + backgroundColor + ')';
    ctx.fillRect(0,0,800,600); //Not drawing this causes problems on backgrounds that aren't white.

    //Draw boundaries between tiles. This may need adjustment if we implement a zoom feature.

    ctx.strokeStyle = 'rgba(' + tileBoundaryColor + ')';
    for(var i = FIELD_PIXELS[0]; i < FIELD_PIXELS[2]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i,0); //Horizontal lines
        ctx.lineTo(i,FIELD_PIXELS[3]);
        ctx.stroke();
    }
    for(var i = FIELD_PIXELS[1]; i < FIELD_PIXELS[3]; i += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0,i); //Vertical lines
        ctx.lineTo(FIELD_PIXELS[2],i);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(' + leftBarColor + ')';
    ctx.fillRect(LEFT_VERTICAL_BAR[0],LEFT_VERTICAL_BAR[1],LEFT_VERTICAL_BAR[2],LEFT_VERTICAL_BAR[3]); 
    ctx.fillStyle = 'rgba(' + bottomBarColor + ')';
    ctx.fillRect(BOTTOM_HORIZONTAL_BAR[0],BOTTOM_HORIZONTAL_BAR[1],BOTTOM_HORIZONTAL_BAR[2],BOTTOM_HORIZONTAL_BAR[3]);
    
    //2. Painted tiles
    //Painting squares! From an MVC stance this is the "view", I guess.
    for(var i = 0; i < (FIELD_SIZE[0]); ++i){
        for(var j = 0; j < (FIELD_SIZE[1]); ++j){
            if(typeof fieldContents[i + fieldOffset[0]][j + fieldOffset[1]] === 'object'){
                //Color's been added. See music_instructions.js for more info.
                paintTile(i,j, fieldContents[i + fieldOffset[0]][j + fieldOffset[1]].color);
            }
            //Experimental tile buffer overlay that draws a translucent box over the tile buffer.
            //Reserved for when the user is actively selecting or pasting things.
            if(defaultBuffer.array !== undefined && defaultBuffer.array.length < fieldContents.length && 
               defaultBuffer.array[0].length < fieldContents[0].length && selectBoxStage === 1) {
                if(selectedTool === 'selectBox' || selectedTool === 'paste') {
                //Check to see if the tile is in the tile buffer.
                    if(i + fieldOffset[0] >= selectBoxCoords[0] && j + fieldOffset[1] >= selectBoxCoords[2] &&
                       i + fieldOffset[0] <= selectBoxCoords[1] && j + fieldOffset[1] <= selectBoxCoords[3]){
                        ctx.fillStyle = 'rgba(0,0,0,0.2)'; //Preps the overlay. 
                        ctx.fillRect(FIELD_PIXELS[0] + (TILE_SIZE*i), 
                                     FIELD_PIXELS[1] + (TILE_SIZE*j),
                                    (TILE_SIZE*1), 
                                    (TILE_SIZE*1));
                    }
                }
            }
            //A similar overlay (slightly different color) for the arrowpen tool.
            if(selectedTool === 'arrowPen' && currentArrowPenTile !== undefined){
                //This conditional isn't working yet.
                if(i + fieldOffset[0] === currentArrowPenTile[0] && j + fieldOffset[1] === currentArrowPenTile[1]){
                    ctx.fillStyle = 'rgba(255,255,0,0.3)';
                    ctx.fillRect(FIELD_PIXELS[0] + (TILE_SIZE*i), 
                                 FIELD_PIXELS[1] + (TILE_SIZE*j),
                                (TILE_SIZE*1), 
                                (TILE_SIZE*1));
                    
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
    drawSelectedToolOverlay();
    paintMiniMap();  
    highlightSelectedBug();
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
                ctx.fillStyle = 'rgba(255,255,255,1)'; 
                //For contrast.
                if(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].note > 1) { 
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                }
                ctx.fillText(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].flowValue, FIELD_PIXELS[0] + (TILE_SIZE*tileX) + 2, FIELD_PIXELS[1] + (TILE_SIZE*tileY) + 16, 22);
                ctx.fillText(fieldContents[tileX + fieldOffset[0]][tileY + fieldOffset[1]].flowValue, FIELD_PIXELS[0] + (TILE_SIZE*tileX) + 1, FIELD_PIXELS[1] + (TILE_SIZE*tileY) + 16, 22);
                break;
            case "revert":
                //Use a modified version of this icon or something instead!
                ctx.drawImage(UIImages[11],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;
            case "incrementer":
                ctx.drawImage(tileOverlayImages[11],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;            
            case "randomjump":
                ctx.drawImage(tileOverlayImages[12],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
                break;            
            case "move_camera":
                ctx.drawImage(tileOverlayImages[13],FIELD_PIXELS[0] + (TILE_SIZE*tileX),FIELD_PIXELS[1] + (TILE_SIZE*tileY));
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

//Paints the minimap in the upper left corner. 
function paintMiniMap(){
    var currentMiniMapPixel;
    var miniMapImage = ctx.createImageData(64, 64); //Constant size, with zoom based on file_size.
    var miniMapContents = new Array(64);
    //Make a separate array with our color data and pixels.
    //This part specifically needs an overhaul to get better results from larger maps.
    for(var i = 0; i < 64; ++i){
        miniMapContents[i] = new Array(64);
        for(var j = 0; j < 64; ++j) {
            if(fieldContents[i*PLAYFIELD_SIZE][j*PLAYFIELD_SIZE] !== undefined){
                miniMapContents[i][j] = tinycolor(fieldContents[i*PLAYFIELD_SIZE][j*PLAYFIELD_SIZE].color).toRgb();
            }
        }
    }

    //miniMapImage is a one-dimensional array that needs to be mapped to a 2D one, and each pixel takes up 4 values (RGBA)
    for(var i = 0; i < 64; ++i){
        for(var j = 0; j < 64; ++j){
            var miniMapIndex = ((j*64 + i)) * 4; //Multiply or divide by undetermined value
            //Maybe we can use transparencies effectively at higher zoom levels.
            if(miniMapContents[i][j] !== undefined) {
                miniMapImage.data[miniMapIndex + 0] = miniMapContents[i][j].r;
                miniMapImage.data[miniMapIndex + 1] = miniMapContents[i][j].g;
                miniMapImage.data[miniMapIndex + 2] = miniMapContents[i][j].b;
                miniMapImage.data[miniMapIndex + 3] = 255; //(255/PLAYFIELD_SIZE) eventually
            } else {
                miniMapImage.data[miniMapIndex + 0] = 255;
                miniMapImage.data[miniMapIndex + 1] = 255;
                miniMapImage.data[miniMapIndex + 2] = 255;
                miniMapImage.data[miniMapIndex + 3] = 255;
            }
        }
    }
    //Paint the image once it's complete.
    ctx.putImageData(miniMapImage, 8, 8);
    //Draw an unfilled rectangle over the player's view.
    //This makes it more apparent that there is a minimap and that the player can use it to look around.
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.rect(8 + (fieldOffset[0]/PLAYFIELD_SIZE), 8 + (fieldOffset[1]/PLAYFIELD_SIZE),
            (FIELD_SIZE[0]/PLAYFIELD_SIZE),(FIELD_SIZE[1]/PLAYFIELD_SIZE));
    ctx.strokeStyle = 'rgba(64,64,64,1)';
    ctx.stroke(); 
}

//Used for the minimap.
function moveViewingField(X,Y) {
    //Adjust what the user put in to centralize it.
    var adjustedX = (X * PLAYFIELD_SIZE) - Math.floor(FIELD_SIZE[0]/2);
    var adjustedY = (Y * PLAYFIELD_SIZE) - Math.floor(FIELD_SIZE[1]/2);
    //If this means part of the view would go offscreen, center as close to the edge as possible.
    if(adjustedX + FIELD_SIZE[0] > FILE_SIZE[0]) {
        adjustedX = FILE_SIZE[0] - FIELD_SIZE[0]; 
    } else if(adjustedX < 0) {
        adjustedX = 0;
    }

    if(adjustedY + FIELD_SIZE[1] > FILE_SIZE[1]) {
        adjustedY = FILE_SIZE[1] - FIELD_SIZE[1];
    } else if(adjustedY < 0) {
        adjustedY = 0;
    }

    fieldOffset = [adjustedX,adjustedY];
    //console.log(fieldOffset);
}

//Draws an image on the minimap when the user hovers over a bug.
function highlightSelectedBug() {
    if(bugHoverState === true && hoverBug >= 0){
        //Get the coords of our needed bug, convert to minimap coords with offsets.
        //(bugList[hoverBug].bugTile[0]/PLAYFIELD_SIZE) + 8
        var bugMiniMapCoords = [(bugList[hoverBug].bugTile[0]/PLAYFIELD_SIZE) + 8,(bugList[hoverBug].bugTile[1]/PLAYFIELD_SIZE) + 8];
        //Use these to prevent the icon from going off the minimap.
        if(bugMiniMapCoords[0] > 66) { bugMiniMapCoords[0] = 66; }
        if(bugMiniMapCoords[1] > 66) { bugMiniMapCoords[1] = 66; }
        //Then draw the icon.
        ctx.drawImage(UIImages[23], bugMiniMapCoords[0], bugMiniMapCoords[1]);

    }
}

//See image_loader.js for the UI images, although maybe we should move this to the rendering bloc.
var drawButtons = function() {
    //Pause button with 2 states
    if(pauseState == false) { ctx.drawImage(UIImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else if(pauseState == true) { ctx.drawImage(UIImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    //Most buttons, though, do not change function when clicked.
    ctx.drawImage(UIImages[2],PENCIL_BUTTON_AREA[0],PENCIL_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[31],FXPENCIL_BUTTON_AREA[0],FXPENCIL_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[3],ERASER_BUTTON_AREA[0],ERASER_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[6],SELECTBOX_BUTTON_AREA[0],SELECTBOX_BUTTON_AREA[1]);
    //Actually putting the second menu row to use.
    ctx.drawImage(UIImages[30],FILL_BUTTON_AREA[0],FILL_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[17],HORIFLIP_BUTTON_AREA[0],HORIFLIP_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[18],VERTFLIP_BUTTON_AREA[0],VERTFLIP_BUTTON_AREA[1]);
    //Draw a different paste button based on which type of paste is selected in the options pages.
    if(pasteStyle === 1){
        ctx.drawImage(UIImages[7],PASTE_BUTTON_AREA[0],PASTE_BUTTON_AREA[1]); //Default overwrite paste.
    } else if(pasteStyle === 2){ ctx.drawImage(UIImages[16],PASTE_BUTTON_AREA[0],PASTE_BUTTON_AREA[1]); } //Mixpaste.

    ctx.drawImage(UIImages[8],QUERY_BUTTON_AREA[0],QUERY_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[9],MOVEBUG_BUTTON_AREA[0],MOVEBUG_BUTTON_AREA[1]);     
    ctx.drawImage(UIImages[10],STOREBUG_BUTTON_AREA[0],STOREBUG_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[11],RESTOREBUG_BUTTON_AREA[0],RESTOREBUG_BUTTON_AREA[1]); 
    //Calling the windowbuttons together.
    ctx.drawImage(UIImages[24],BUGPROPS_BUTTON_AREA[0],BUGPROPS_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[12],SONGPROPS_BUTTON_AREA[0],SONGPROPS_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[13],EDIT_TILE_BUTTON_AREA[0],EDIT_TILE_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[27],UIPROPS_BUTTON_AREA[0],UIPROPS_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[14],HELP_BUTTON_AREA[0],HELP_BUTTON_AREA[1]);

    ctx.drawImage(UIImages[15],TURNBUG_BUTTON_AREA[0],TURNBUG_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[19],EYEDROPPER_BUTTON_AREA[0],EYEDROPPER_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[20],ADJUSTPOINTER_BUTTON_AREA[0],ADJUSTPOINTER_BUTTON_AREA[1]);
    //ctx.drawImage(UIImages[21],ROTATELEFT_BUTTON_AREA[0],ROTATELEFT_BUTTON_AREA[1]);
    //ctx.drawImage(UIImages[22],ROTATERIGHT_BUTTON_AREA[0],ROTATERIGHT_BUTTON_AREA[1]);
    
    ctx.drawImage(UIImages[25],REVERT_BUTTON_AREA[0],REVERT_BUTTON_AREA[1]);
    ctx.drawImage(UIImages[26],ARROWPEN_BUTTON_AREA[0],ARROWPEN_BUTTON_AREA[1]);
    
    ctx.drawImage(UIImages[28],EXTRAPOLATE_BUTTON_AREA[0],EXTRAPOLATE_BUTTON_AREA[1]);

    //Save and load functions
    ctx.drawImage(UIImages[4],SAVE_BUTTON_AREA[0],SAVE_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[5],LOAD_BUTTON_AREA[0],LOAD_BUTTON_AREA[1]); 
    

}

//This contains a lot of duplicated code.
var drawSelectedToolOverlay = function() {
    //console.log("Test");
    ctx.fillStyle = 'rgba(64,64,255,0.4)'; //Slightly blue and mostly transparent.
    switch(selectedTool) {
                    case "pencil":
                    ctx.fillRect(PENCIL_BUTTON_AREA[0], PENCIL_BUTTON_AREA[1],PENCIL_BUTTON_AREA[2],PENCIL_BUTTON_AREA[3]);
                        break;                    
                    case "audioFXPen":
                    ctx.fillRect(FXPENCIL_BUTTON_AREA[0], FXPENCIL_BUTTON_AREA[1],FXPENCIL_BUTTON_AREA[2],FXPENCIL_BUTTON_AREA[3]);
                        break;
                    case "eraser":
                    ctx.fillRect(ERASER_BUTTON_AREA[0], ERASER_BUTTON_AREA[1],ERASER_BUTTON_AREA[2],ERASER_BUTTON_AREA[3]);
                        break;
                    case "selectBox":
                    ctx.fillRect(SELECTBOX_BUTTON_AREA[0], SELECTBOX_BUTTON_AREA[1],SELECTBOX_BUTTON_AREA[2],SELECTBOX_BUTTON_AREA[3]);
                        break;
                    case "paste":
                    ctx.fillRect(PASTE_BUTTON_AREA[0], PASTE_BUTTON_AREA[1],PASTE_BUTTON_AREA[2],PASTE_BUTTON_AREA[3]);
                        break;
                    case "query":
                    ctx.fillRect(QUERY_BUTTON_AREA[0], QUERY_BUTTON_AREA[1],QUERY_BUTTON_AREA[2],QUERY_BUTTON_AREA[3]);
                        break;
                    case "moveBug":
                    ctx.fillRect(MOVEBUG_BUTTON_AREA[0], MOVEBUG_BUTTON_AREA[1],MOVEBUG_BUTTON_AREA[2],MOVEBUG_BUTTON_AREA[3]);
                        break;
                    case "turnBug":
                    ctx.fillRect(TURNBUG_BUTTON_AREA[0], TURNBUG_BUTTON_AREA[1],TURNBUG_BUTTON_AREA[2],TURNBUG_BUTTON_AREA[3]);
                        break;                    
                    case "editTile":
                    ctx.fillRect(EDIT_TILE_BUTTON_AREA[0], EDIT_TILE_BUTTON_AREA[1],EDIT_TILE_BUTTON_AREA[2],EDIT_TILE_BUTTON_AREA[3]);
                        break;
                    case "eyeDropper":
                    ctx.fillRect(EYEDROPPER_BUTTON_AREA[0], EYEDROPPER_BUTTON_AREA[1],EYEDROPPER_BUTTON_AREA[2],EYEDROPPER_BUTTON_AREA[3]);
                        break;
                    case "adjustPointer":
                    ctx.fillRect(ADJUSTPOINTER_BUTTON_AREA[0], ADJUSTPOINTER_BUTTON_AREA[1],ADJUSTPOINTER_BUTTON_AREA[2],ADJUSTPOINTER_BUTTON_AREA[3]);
                        break;                    
                    case "arrowPen":
                    ctx.fillRect(ARROWPEN_BUTTON_AREA[0], ARROWPEN_BUTTON_AREA[1],ARROWPEN_BUTTON_AREA[2],ARROWPEN_BUTTON_AREA[3]);
                        break;
                    case "extrapolate":
                    ctx.fillRect(EXTRAPOLATE_BUTTON_AREA[0], EXTRAPOLATE_BUTTON_AREA[1],EXTRAPOLATE_BUTTON_AREA[2],EXTRAPOLATE_BUTTON_AREA[3]);
                        break;
        default:
            break;
    }
}

//These could technically go in ui_behavior.js
function resetUIColors(){
    backgroundColor = '255,255,255,1';
    leftBarColor = '0,0,0,1';
    bottomBarColor = '128,128,128,1';
    tileBoundaryColor = '64,64,64,1';
    //Clear out the input fields for sanity's sake.
    $('#bgColorInput').val(backgroundColor);
    $('#leftBarColorInput').val(leftBarColor);
    $('#bottomBarColorInput').val(bottomBarColor);
    $('#boundaryColorInput').val(tileBoundaryColor);
}

function updateUIColors(property , value){
    //console.log(property, value);

    //Start by verifying the user's value string. This takes a lot of conditionals.
    if(value === (null || undefined)) {
        alert("Terminating color update because we didn't recieve a value at all.");
        return;
    }

    var colorInput = value.split(",");
    //console.log(colorInput);
    if(colorInput.length != 4){
        alert("Terminating color update due to incorrect amount of color values.");
        return;
    }
    for(var i = 0; i < colorInput.length; ++i){
        if(isNaN(colorInput[i])) {
            alert("Terminating color update because value #" + (i + 1) + " doesn't seem to be a number at all.");
            return;
        }
        switch(i){
            case 0:
            case 1:
            case 2:
                if( (parseFloat(colorInput[i]) > 255 || parseFloat(colorInput[i]) < 0) ){
                    alert("Terminating color update because value #" + (i + 1) + 
                        " doesn't seem to be between 0 and 255. (It's " + colorInput[i] + ")");
                    return;
                }
                break;
            case 3:
                if( (parseFloat(colorInput[i]) > 1 || parseFloat(colorInput[i]) < 0) ){
                    alert("Terminating color update because value #" + (i + 1) + 
                        " doesn't seem to be between 0 and 1. (It's " + colorInput[i] + ")");
                    return;
                }
                break;
            default:
                return; //Something went VERY wrong.
        }
    }
    //If all of those conditionals passed, we should have valid input, which we format into a string.
    var formattedColorString = colorInput[0] + "," 
                             + colorInput[1] + ","                                        
                             + colorInput[2] + ","                                        
                             + colorInput[3];
    window[property] = formattedColorString; //Changes the value of the variable whose name was passed in as "property".
}