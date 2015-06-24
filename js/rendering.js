//Welcome to our new graphics rendering file!

var bugHoverState = false; //If the user isn't hovering over a bug, no indicator rendering happens

function render(){
    ctx.clearRect(FIELD_PIXELS[0],FIELD_PIXELS[1],FIELD_PIXELS[2],FIELD_PIXELS[3]); //Use this to refresh everything.
    //Render things in this order:
    //1. Background (Which didn't have to be redrawn a lot but now does?)
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0,0,800,600); //Not drawing this causes problems on backgrounds that aren't white.
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(LEFT_VERTICAL_BAR[0],LEFT_VERTICAL_BAR[1],LEFT_VERTICAL_BAR[2],LEFT_VERTICAL_BAR[3]); 
    ctx.fillStyle = 'rgba(128,128,128,1)';
    ctx.fillRect(BOTTOM_HORIZONTAL_BAR[0],BOTTOM_HORIZONTAL_BAR[1],BOTTOM_HORIZONTAL_BAR[2],BOTTOM_HORIZONTAL_BAR[3]);
    
    //2. Painted tiles

    //Draw boundaries between tiles.
    //This may need adjustment if we implement a zoom feature.
    //Replacing some constants with variables in order to make it easier to rebuild (although readability might be a pain).
    ctx.fillStyle = 'rgba(192,192,192,1)';
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

//Paints the minimap in the upper left corner. Should be moved to rendering bloc.
function paintMiniMap(){
    var currentMiniMapPixel;
    var miniMapImage = ctx.createImageData(64, 64); //Constant size, with zoom based on file_size.
    var miniMapContents = new Array(64);
    //Make a separate array with our color data and pixels.
    for(var i = 0; i < 64; ++i){
        miniMapContents[i] = new Array(64);
        for(var j = 0; j < 64; ++j) {
            if(fieldContents[i*PLAYFIELD_SIZE][j*PLAYFIELD_SIZE] !== undefined){
                miniMapContents[i][j] = tinycolor(fieldContents[i*PLAYFIELD_SIZE][j*PLAYFIELD_SIZE].color).toRgb();
            }
        }
    }

    //miniMapImage is a one-dimensional array that needs to be mapped to a 2D one, and each pixel takes up 4 values (RGBA)
    //When large fields are implemented, we need to multiply some of these fields by the multipliers.
    for(var i = 0; i < 64; ++i){
        for(var j = 0; j < 64; ++j){
            var miniMapIndex = ((j*64 + i)) * 4; //Multiply or divide by undetermined value
            //Build our image. For now, we use grey pixels, but we'll add color here when it's in the actual field.
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
    //This will make it more apparent that there is a minimap and that the player can use it to look around.
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.rect(8 + (fieldOffset[0]/PLAYFIELD_SIZE), 8 + (fieldOffset[1]/PLAYFIELD_SIZE),
            (FIELD_SIZE[0]/PLAYFIELD_SIZE),(FIELD_SIZE[1]/PLAYFIELD_SIZE));
    ctx.stroke(); 
}

//Used for the minimap.
//This should be extended so that the user can scroll by clicking and dragging.
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
    console.log(fieldOffset);
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