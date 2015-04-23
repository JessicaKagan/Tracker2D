/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
*/

/*
    Medium term useful thing: Extrapolation feature.
*/

var isOverlayShowing = false; //Used to handle some pointer events CSS.
var pauseState = true;
//We can add a bunch more. Use these to label buttons?
//singleStep executes a single update and then pauses.
var toolList = ['pencil', 'line', 'eraser', 'pause', 'selectBox','paste', 'query', 'moveBug','storeBug','singleStep']; 
var selectedTool = 'pencil'; //Change as needed, default to pencil.
var tileBuffer; //An array representing a rectangle of selected tiles.
var saveContent; //A string representing the contents of the map.
var encodedContent; //Stores the base64 equivalent of saveContent.
var selectBoxCoords = new Array(4); //Stores two coordinate pairs.

var fieldOffset = [0,0] //Changed via interaction with the minimap, used to decide which part of the field's showing.

var bottomUIButton = function(coords) {
    this.coords = coords;
}

//Deprecate this?
var pauseButton = function(coords) {
    this.coords = coords;
}

//See main.js for the UI images, although maybe we should move that here.
//Extend this to draw all buttons?
var drawButtons = function() {

    //Pause button with 2 states
    if(pauseState == false) { ctx.drawImage(UIImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else if(pauseState == true) { ctx.drawImage(UIImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }

    ctx.drawImage(UIImages[2],PENCIL_BUTTON_AREA[0],PENCIL_BUTTON_AREA[1]); //Pencil
    ctx.drawImage(UIImages[3],ERASER_BUTTON_AREA[0],ERASER_BUTTON_AREA[1]); //Eraser
    ctx.drawImage(UIImages[6],SELECTBOX_BUTTON_AREA[0],SELECTBOX_BUTTON_AREA[1]); //Box select
    ctx.drawImage(UIImages[7],PASTE_BUTTON_AREA[0],PASTE_BUTTON_AREA[1]); //Paste
    ctx.drawImage(UIImages[8],QUERY_BUTTON_AREA[0],QUERY_BUTTON_AREA[1]); //Query
    ctx.drawImage(UIImages[9],MOVEBUG_BUTTON_AREA[0],MOVEBUG_BUTTON_AREA[1]); //Move Bug

    //Save and load functions
    ctx.drawImage(UIImages[4],SAVE_BUTTON_AREA[0],SAVE_BUTTON_AREA[1]); 
    ctx.drawImage(UIImages[5],LOAD_BUTTON_AREA[0],LOAD_BUTTON_AREA[1]); 
    

}

function fillBuffer(fromX, toX, fromY, toY, command) {
    //Stores a rectangle of tiles (a subset of the entire field). 
    //When saving, it fills up with the entire field. Otherwise, it probably covers a bit less.
    console.log("Filling the buffer");
    switch(command) {
        case 'save':
            tileBuffer = fieldContents;
            //console.log(tileBuffer);
            break;
        case 'selectBox':
            //In this case, tileBuffer has to actually be defined.
            tileBuffer = new Array((toX - fromX) + 1);
            for(var i = 0; i < tileBuffer.length; ++i) {
                tileBuffer[i] = new Array((toY - fromY) + 1);
            }
            //Only then can it be populated properly.
            for(var i = 0; i < tileBuffer.length; ++i){
                for(var j = 0; j < tileBuffer[i].length; ++j){
                    tileBuffer[i][j] = fieldContents[fromX + i][fromY + j];
                }
            }
            console.log(tileBuffer);
            break;
        default:
            break;
    }
}

//toX and toY are derived from the size of tileBuffer.
//TileX and tileY are where the user clicked.
//currentTile is an optional instruction for interpolation, which will be defined later.
function pasteBuffer(fromX, toX, fromY, toY, tileX, tileY, currentTile) {
    //This is an overlap paste that replaces all contents.
    //Maybe we can make a mixpaste later?
    for(var i = 0; i < tileBuffer.length; ++i){
        for(var j = 0; j < tileBuffer[i].length; ++j){
            //Conditional to prevent accidental writes outside the file, which could get crashy.
            //Horizontal overflows cause errors,  but don't break everything. I still consider this a bug.
            if((i + tileX) < FILE_SIZE[0] || (j + tileY) < FILE_SIZE[1]) {
                fieldContents[(i + tileX)][(j + tileY)] = tileBuffer[i][j];
            }
        }
    }
}

//Prettyprints some data to the queryInfo div, which should only show up when the query tool's selected.
function respondToQuery(X, Y) {
    var queryResponse = "";
    //Starting with the coordinates...
    queryResponse += "<p>Tile Coordinates: " + X + " , " + Y + "</p>";
    if(fieldContents[X][Y] !== undefined) {
        //We iterate through the tile properties.
        if(fieldContents[X][Y].note !== undefined ) { queryResponse += "<p>Pitch: " + Math.floor(fieldContents[X][Y].note * 44100);}
        else { queryResponse += "Does not reference a pitch."; }
        queryResponse += "<p> Instrument: " +  fieldContents[X][Y].instrument + "</p>";
        queryResponse += "<p> Audio Effect: " +  fieldContents[X][Y].dspEffect + "</p>";
        queryResponse += "<p> Audio Effect Parameter: " +  fieldContents[X][Y].dspValue + "</p>";        
        queryResponse += "<p> Flow Effect: " +  fieldContents[X][Y].flowEffect + "</p>";
        //queryResponse += "<p> Flow Effect Parameter: " +  fieldContents[X][Y].flowValue + "</p>"; //Uncomment when relevant.
        queryResponse += "<p> Volume: " + (fieldContents[X][Y].volume * 100) + "%</p>";
    } else queryResponse += "No data in this tile.";
    //If there's a bug here, describe the one on top. This assumes that bugs should be allowed to overlap...
    for(var i = 0; i < bugList.length; ++i){
        //console.log(bugList[i].bugTile[0] + " , " + bugList[i].bugTile[1]);
        //console.log(X + " , " + Y);
        if( (bugList[i].bugTile[0]) === X && 
             bugList[i].bugTile[1] === Y) { 
            queryResponse += "<p>Bug name: " + bugList[i].name + "<p>";
            queryResponse += "<p>Current behavior: " + bugList[i].action + "<p>";
            break;
        }
    }

    //We may want to call the playSound routine on this tile.
    $('#queryInfo').html(queryResponse);
}

//This needs to be extended with more properties and the desired bug (musician) values.
function saveFile() {
    pauseState = true;
    fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1], 'save');
    if(tileBuffer === fieldContents) { 
        console.log("We're ready to save now."); 
    } else { console.log("Something went wrong in saveFile() or fillBuffer(). Real error trapping later."); }
    //Bake everything into a string.
    saveContent = "";
    //console.log(tileBuffer.length);
    //The very first line contains the amount of tiles.
    saveContent += FILE_SIZE[0] + "," + FILE_SIZE[1] + '\n';

    //Dump all tiles to a string. Parses top to bottom before moving left to right.
    for(var i = 0; i < tileBuffer.length; ++i){
        for(var j = 0; j < tileBuffer[i].length; ++j){
            if(tileBuffer[i][j] !== undefined) { 
                saveContent += tileBuffer[i][j].toString();
            } else saveContent += "undefined"; //In the load function, lines with only the word "undefined" on them will not become tiles.
            saveContent += '\n';
        }

    }
    //Dump song properties next.
    saveContent += TEMPO + '\n' + PLAYFIELD_SIZE + '\n' + author + '\n' + songDescription + '\n';
    //Convert the entire thing to base64.
    encodedContent = window.btoa(saveContent);
    $("#saveText").html(encodedContent);
    $("#saveExport").removeClass("currentlyHidden")
    //It will be some time before we can actually get this to a user.
}

//Will need rebuilding to work with large files.
function loadFile() {
    pauseState = true;
    closeLoadWindow();
    //Convert the input from base64. We need to implement error trapping at some point.
    encodedContent = $("#loadText").val();
    if(encodedContent !== undefined) {
        encodedContent = window.atob(encodedContent);
    }
    console.log(encodedContent);
    var loadingWorkArray = encodedContent.split("\n");
    var loadDimensions = loadingWorkArray[0].split(",");
    
    //console.log(loadDimensions);
    //1 to (max index - 4) for now
    //Dump the tiles to fieldContents.
    for(var i = 0; i < loadDimensions[0]; ++i){
        for(var j = 0; j < loadDimensions[1]; ++j) {
            var currentIndex = (j*loadDimensions[1]) + i; //Flow control seems to be right.

            if(loadingWorkArray[currentIndex + 1] !== "undefined") {
                console.log(j + " , " + i);
                var currentTile = loadingWorkArray[currentIndex + 1].split(",");
                fieldContents[j][i] = new Tile(currentTile[0],currentTile[1],
                                               currentTile[2],currentTile[3],
                                               currentTile[4],currentTile[5],
                                               currentTile[6]);

                console.log(fieldContents[j][i]);
            } else fieldContents[j][i] = undefined;
        }
    }
    //We can still make song properties work. This will require editing in the future.
    TEMPO = loadingWorkArray[loadingWorkArray.length - 5];
    //PLAYFIELD_SIZE = loadingWorkArray[loadingWorkArray.length - 4]; //Dummied out for now because it doesn't matter.
    author = loadingWorkArray[loadingWorkArray.length - 3];
    songDescription = loadingWorkArray[loadingWorkArray.length - 2];
    //We need to add bug parameters to this format. Here's another kludge. Don't you love kludging?
    bugList[0].x = 80; 
    bugList[0].y = 24;
    bugList[0].action = "moveRight";
    bugList[1].x = 80; 
    bugList[1].y = 72;
    bugList[1].action = "moveRight";
}

function closeSaveWindow(){
    setTimeout(function() {$("#saveExport").addClass("currentlyHidden");}, 50);

}

function closeLoadWindow(){
    setTimeout(function() {$("#loadExport").addClass("currentlyHidden");}, 50);
}

function getBug(bugVal){
    var getBugHTML = "";
    pauseState = true; //If the user starts putting bugs in storage, it might play havoc with playback.
    console.log(bugList[bugVal]);
    console.log(getBugHTML);
    if(bugList[bugVal].inStorage === false && bugList[bugVal] !== undefined) { 
        bugList[bugVal].inStorage = true;
        
        //Functionalize this, so that if a bug starts off in storage, it reflects properly in the storage HTML.
        getBugHTML = '<button type="button" onclick="getBug(' + bugVal + ')">' + bugList[bugVal].image.outerHTML + '</button>';
        console.log(getBugHTML);
        switch(bugVal) {
            case 0:
                $('#bugStorageUnit1').html(getBugHTML);
                break;
            case 1:
                $('#bugStorageUnit2').html(getBugHTML);
                break;
            default:
                break;
        }

    } else if(bugList[bugVal].inStorage === true) {
        bugList[bugVal].inStorage = false;
        switch(bugVal) {
            case 0:
                $('#bugStorageUnit1').html('<button type="button" onclick="getBug(0)">1</button>');
                break;
            case 1:
                $('#bugStorageUnit2').html('<button type="button" onclick="getBug(1)">2</button>');
                break;
            default:
                break;
        } 
    }

}

//Paints the minimap in the lower left corner. 
//The user will be able to scroll around by clicking and dragging on the thing.
function paintMiniMap(){
    var currentMiniMapPixel;
    var miniMapImage = ctx.createImageData(FILE_SIZE[0], FILE_SIZE[1]);
    //This is a one-dimensional array that needs to be mapped to a 2D one, and each pixel takes up 4 values (RGBA)
    for(var i = 0; i < FILE_SIZE[0]; ++i ){
        for(var j = 0; j < FILE_SIZE[1]; ++j ){
            var miniMapIndex = ((j*FILE_SIZE[1] + i)* 4); 
            //Build our image. For now, we use grey pixels, but we'll add color here when it's in the actual field.
            if(fieldContents[i][j] !== undefined) {
                miniMapImage.data[miniMapIndex + 0] = 64;
                miniMapImage.data[miniMapIndex + 1] = 64;
                miniMapImage.data[miniMapIndex + 2] = 64;
                miniMapImage.data[miniMapIndex + 3] = 255;
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
}

//This should be extended so that the user can scroll by clicking and dragging.
function moveViewingField(X,Y) {
    //Adjust what the user put in to centralize it.
    var adjustedX = X - Math.floor(FIELD_SIZE[0]/2);
    var adjustedY = Y - Math.floor(FIELD_SIZE[1]/2);

    //Where the user clicked becomes the leftmost corner of the view.
    //Change this so it goes for the center, instead.
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