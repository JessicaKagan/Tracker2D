/*
 * saveFile() and loadFile() used to live in ui_behavior.js.
 */

var saveContent; //A string representing the contents of the map.
var numberOfPropertiesSaved = storedBugPositions.length + AMOUNT_OF_SONG_PROPERTIES; //Simplifies reading some saveload logic

//Under constant extension. I think I fixed the pointer saving bug, but send me a message if I didn't.
function saveFile() {
    pauseState = true;
    storeBugPositions(); //This may or may not be a useful addition.
    defaultBuffer.fillBuffer(0, FILE_SIZE[0], 0, FILE_SIZE[1], 'save');
    selectBoxCoords = [0,0,0,0]; //Clear the selection to prevent a pastebug.
    if(defaultBuffer.array === fieldContents) { 
        //console.log("We're ready to save now."); 
    } else { console.log("Something went wrong in saveFile() or fillBuffer(). Real error trapping later."); }
    //Put our latest revision in the revert buffer, too.
    loadedTiles = jQuery.extend(true, {}, fieldContents);
    //Bake everything into a string.
    saveContent = "";
    //console.log(tileBuffer.length);
    //The very first line contains the amount of tiles.
    saveContent += FILE_SIZE[0] + "," + FILE_SIZE[1] + '\n';
    //Dump all tiles to a string. Parses top to bottom before moving left to right.
    for(var i = 0; i < defaultBuffer.array.length; ++i){
        for(var j = 0; j < defaultBuffer.array[i].length; ++j){
            if(defaultBuffer.array[i][j] !== undefined) { 
                saveContent += defaultBuffer.array[i][j].toString();
            } else saveContent += "undefined"; //In the load function, lines with only the word "undefined" on them will not become tiles.
            saveContent += '\n';
        }

    }
    //Dump the bug properties! Extends the file by 40 (8 * the amount of bug properties) lines.
    for(var i = 0; i < storedBugPositions.length; ++i) {
        saveContent += storedBugPositions[i] + '\n';
    }

    //Dump song properties next.
    saveContent += TEMPO + '\n' + PLAYFIELD_SIZE + '\n' + author + '\n' + songDescription + '\n' + songTitle;
    var encodeToFile = new Blob([saveContent]); 
    saveAs(encodeToFile, songTitle + ".txt");
}

function loadFile(evt) {
    pauseState = true;
    renderMinimap = false;
    hideUI();
    //We need to implement error trapping at some point.
    var file = evt.target.files[0];
    //Only parse if valid. For now, this just means if the file is a file at all.
    if(file){
        var reader = new FileReader();
        reader.onload = function(e) { 
            var fileContents = e.target.result;
            saveContent = fileContents;
            //Actual save parsing begins here.
            var loadingWorkArray = saveContent.split("\n");
            var loadDimensions = loadingWorkArray[0].split(",");
            var tileLength = loadDimensions[0]*loadDimensions[1];
            FILE_SIZE = [loadDimensions[0],loadDimensions[1]];
            //Kludge.
            PLAYFIELD_SIZE = loadDimensions[0]/64; 
            resizeFile();

            //From the first indice to the index of tileLength.
            //Dump the tiles to fieldContents.
            for(var i = 0; i < loadDimensions[0]; ++i){
                for(var j = 0; j < loadDimensions[1]; ++j) {
                    var currentIndex = (j*loadDimensions[1]) + i;

                    //console.log(loadingWorkArray[currentIndex + 1]); //Always a string.
                    /*
                    if(loadingWorkArray[currentIndex + 1] === "undefined"){
                        fieldContents[j][i] = undefined;
                    } else if(loadingWorkArray[currentIndex + 1] !== "undefined") {
                    */
                    //Kludgetastic.
                    var currentTile = loadingWorkArray[currentIndex + 1].split(",");
                    if(isNaN(currentTile[0]) === true){
                        fieldContents[j][i] = undefined;
                    } else if(isNaN(currentTile[0]) === false){
                        fieldContents[j][i] = new Tile(currentTile[0],currentTile[1],
                                                   currentTile[2],currentTile[3],
                                                   currentTile[4],currentTile[5],
                                                   currentTile[6],undefined,
                                                   currentTile[7],currentTile[8]);
                    }
                    //console.log(fieldContents[j][i]);
                    //}
                }
            }
            //Load bug properties. There's a serious offset here; might need tweaking.
            //Eventually, it might be a good idea to put all bug properties on one line.
            for(var i = 0; i < (loadingWorkArray.length - tileLength - AMOUNT_OF_SONG_PROPERTIES - 4); i+=5){
                //console.log(loadingWorkArray[i + tileLength + 1]);
                bugList[(i/5)].bugTile[0] = $.parseJSON(loadingWorkArray[i + tileLength + 1]);
                bugList[(i/5)].bugTile[1] = $.parseJSON(loadingWorkArray[i + tileLength + 2]);
                bugList[(i/5)].action = loadingWorkArray[i + tileLength + 3];
                bugList[(i/5)].inStorage = $.parseJSON(loadingWorkArray[i + tileLength + 4]);
                bugList[(i/5)].volume = $.parseJSON(loadingWorkArray[i + tileLength + 5]);
                console.log(bugList[i/5]);
            }
            //Run the obligatory bug checking loop and store the loaded bug positions in the buffer.
            for(var i = 0; i < bugList.length; ++i) {
                checkBug(i);
            }
            storeBugPositions();
            restoreBugPositions(true); //The program will pause automatically when the bugs have been restored to their positions.
            //Song properties are stored at the very end of the file.
            TEMPO = loadingWorkArray[loadingWorkArray.length - 5];
            updateFrequency = TICK_MULTIPLIER/TEMPO; //Important that we derive this value.
            $("#tempoSpinner").attr('value', TEMPO);
            console.log($("#tempoSpinner"));
            PLAYFIELD_SIZE = loadingWorkArray[loadingWorkArray.length - 4];
            $("#fieldSizeSpinner").val = PLAYFIELD_SIZE*64;
            author = loadingWorkArray[loadingWorkArray.length - 3];
            songDescription = loadingWorkArray[loadingWorkArray.length - 2];
            songTitle = loadingWorkArray[loadingWorkArray.length - 1];
            loadedTiles = jQuery.extend(true, {}, fieldContents);
        }

        reader.readAsText(file);
        renderMinimap = true;
    } else {
        alert("File load failed for some reason. If you exited out of your browser's file uploader manually, please disregard this.");
        renderMinimap = true;
        return;
    }
}

function loadUserSettings() {
    if(pasteStyle === ("1" || "2")) {
        pasteStyle = parseInt(localStorage.getItem("pasteStyle"));
        localStorage.pasteStyle = pasteStyle;
    } else { 
        pasteStyle = 1;
        localStorage.pasteStyle = "1";
    }
    //I think these need to be nulled for safety.
    $('#extrapolatePitch').prop('checked' , false);
    $('#extrapolateVolume').prop('checked' , false);
    $('#extrapolateFXValue').prop('checked' , false);
    switch(localStorage.extrapolateStyle){
        case "note":
            $('#extrapolatePitch').prop('checked' , true);
            break;
        case "volume":
            $('#extrapolateVolume').prop('checked' , true);
            break;
        case "dspValue":
            $('#extrapolateFXValue').prop('checked' , true);
            break;
        //If the data is malformed or nonexistent (due to, for instance, 1st runtime), set these fallback values.
        default:
            $('#extrapolatePitch').prop('checked' , true);
            localStorage.extrapolateStyle = "note";
            break;
    }
    //Same here. Localstorage doesn't like booleans, so we use strings instead.
    $('#samplePlayback').prop('checked', false);
    switch(localStorage.samplePlayback){
        case "true":
            $('#samplePlayback').prop('checked', true);
            break;        
        case "false":
            $('#samplePlayback').prop('checked', false);
            break;
        default:
            localStorage.samplePlayback = "true";
            $('#samplePlayback').prop('checked', true);
            break;
    }
}
