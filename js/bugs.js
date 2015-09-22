/*
 * Bug functionality here! What attributes can bugs have?
 * 1. Image used to represent it
 * 2. Current action, which needs a function to change it as needed..
 */

//Just a reference for whatever I can think of.
//For now, bugs start with a direction and only change directions when a tile tells them to.
//holdPosition means the bug will not move and is basically a debug thing.
//inStorage is for bugs that currently aren't being used on the field, and it prevents the bug from updating at all.
var bugActions = ['moveLeft', 'moveRight', 'moveUp', 'moveDown', 'teleportToTile', 'holdPosition', 'inStorage'];

var Bug = function(image, x,y, action,name, inStorage, volume){
    this.image = image;
    this.action = action;
    this.x = x;
    this.y = y;
    this.name = name; //Long term idea: Create naming function for bugs, might come in handy.
    this.bugTile = [this.x, this.y];
    //this.bugTile = getTile(this.x, this.y);
    this.inStorage = inStorage;
    this.previousAction = this.action; //In case we need to buffer an action.
    if(volume === undefined) { this.volume = 100;
    } else { this.volume = volume; }
}

Bug.prototype.drawBug = function(){
    //This might not need to be its own function unless we can change the bug stuff?
    //Adjust bug drawing routine further!
    var derivedBugTile = [this.bugTile[0] - fieldOffset[0] , this.bugTile[1] - fieldOffset[1]];
    if(derivedBugTile[0] >= 0 && derivedBugTile[1] >= 0) { 
        ctx.drawImage(this.image,(derivedBugTile[0]*24) + 80, (derivedBugTile[1]*24)); 
        //Bug overlays (currently just to indicate which direction they are moving)
        currentOverlay = this.action;
            switch(currentOverlay) {
                case "moveLeft":
                ctx.drawImage(tileOverlayImages[5],(derivedBugTile[0]*24) + 80, (derivedBugTile[1]*24));
                    break;
                case "moveUp":
                ctx.drawImage(tileOverlayImages[6],(derivedBugTile[0]*24) + 80, (derivedBugTile[1]*24));
                    break;
                case "moveRight":
                ctx.drawImage(tileOverlayImages[7],(derivedBugTile[0]*24) + 80, (derivedBugTile[1]*24));
                    break;
                case "moveDown":
                ctx.drawImage(tileOverlayImages[8],(derivedBugTile[0]*24) + 80, (derivedBugTile[1]*24));
                    break;
                default:
                    break;
            }
    }

}

Bug.prototype.updateBug = function() {
    //this.bugTile = getTile(this.x, this.y); //Updates our derivative. Might be obsolete.

    //Play sounds BEFORE attempting to move the bug.
    if(fieldContents[this.bugTile[0]][this.bugTile[1]] !== undefined){
        //Right now, sounds have separate playback routines if they have effects.
        //Frozen bugs only play their tile's sound once. Anything else would be detrimental to your sanity.
        if(fieldContents[this.bugTile[0]][this.bugTile[1]].instrument != -1 && this.action !== "holdPosition"){
            //console.log(fieldContents[bugTile[0]][bugTile[1]].dspValue);
            playSound(soundFont[fieldContents[this.bugTile[0]][this.bugTile[1]].instrument],
                                fieldContents[this.bugTile[0]][this.bugTile[1]].note,
                                fieldContents[this.bugTile[0]][this.bugTile[1]].dspEffect,
                                fieldContents[this.bugTile[0]][this.bugTile[1]].dspValue,
                                (fieldContents[this.bugTile[0]][this.bugTile[1]].volume * (this.volume/100))
                                );
        }
    }

    //Change the behavior of the bug, or the entire field based on what the bug is standing on.
    if(fieldContents[this.bugTile[0]][this.bugTile[1]] !== undefined){
        switch(fieldContents[this.bugTile[0]][this.bugTile[1]].flowEffect){
            case "turn_west":
                this.action = 'moveLeft';
                break;
            case "turn_north":
                this.action = 'moveUp';
                break;
            case "turn_east":
                this.action = 'moveRight';
                break;    
            case "turn_south":
                this.action = 'moveDown';
                break;
            case "freeze":
            //There are some questionable interactions, so freeze should only be used at the very end of a song.
                pauseState = true; 
                return;
            //teleportToRandomTile is a variant of the regular teleport. Someday, these should share more code.
            case "teleport": 
                this.previousAction = this.action;
                this.action = 'teleportToTile';
                break;
            case "randomjump":
                if(fieldContents[this.bugTile[0]][this.bugTile[1]].flowValue != 0){
                    this.previousAction = this.action;
                    this.action = 'teleportToRandomTile';
                }
                break;
            case "counter":
            //Counters are cool. Bugs decrement them until they hit 0 and turn into whatever tile they point to.
            //The pointer tile can change during execution, too. 
                if(fieldContents[this.bugTile[0]][this.bugTile[1]].flowValue > 0) {
                    fieldContents[this.bugTile[0]][this.bugTile[1]].flowValue -= 1;
                    break;
                }
                if(fieldContents[this.bugTile[0]][this.bugTile[1]].flowValue === 0) {
                    //First, get the tile we're pointing to.
                    //We're using the coordinates stored here to copy the ENTIRE tile (not just its coordinates) into memory.
                    var XCoord = fieldContents[this.bugTile[0]][this.bugTile[1]].xPointer;
                    var YCoord = fieldContents[this.bugTile[0]][this.bugTile[1]].yPointer;
                    fieldContents[this.bugTile[0]][this.bugTile[1]] = jQuery.extend(true, {}, fieldContents[XCoord][YCoord]);
                }
                break;
            case "incrementer":
            //Incrementers increase the value of the counter they point to by 1 every time a bug walks over them.
            //Get the coords we're pointing to, then increment that tile's flowvalue.
                var XCoord = fieldContents[this.bugTile[0]][this.bugTile[1]].xPointer;
                var YCoord = fieldContents[this.bugTile[0]][this.bugTile[1]].yPointer;
                //console.log(fieldContents[XCoord][YCoord]);
                if(fieldContents[XCoord][YCoord].flowValue < 999 && 
                   fieldContents[XCoord][YCoord].flowEffect === "counter"){
                    fieldContents[XCoord][YCoord].flowValue += 1;
                }
                break;
            case "revert":
            //Queue up a revert operation for the main() loop.
                revertCalled = true;
                return;
            default:
                break;
        }
    }

    //If the bug is about to leave the map, make it turn around.
    if((this.bugTile[0] + 1) >= FILE_SIZE[0] && this.action === 'moveRight') { this.action = 'moveLeft'; }
    if(this.bugTile[0] === 0 && this.action === 'moveLeft') { this.action = 'moveRight'; }
    if((this.bugTile[1] + 1) >= FILE_SIZE[1] && this.action === 'moveDown') { this.action = 'moveUp'; }
    if(this.bugTile[1] === 0 && this.action === 'moveUp') { this.action = 'moveDown'; }

    //Then move the bug based on its behavior value.
    switch(this.action){
        case 'moveLeft':
            this.bugTile[0] -= 1;
            break;
        case 'moveRight':
            this.bugTile[0] += 1;
            break;
        case 'moveUp':
            this.bugTile[1] -= 1;
            break;
        case 'moveDown':
            this.bugTile[1] += 1;
            break;
        case 'teleportToTile':
            //Special case.
            if(fieldContents[this.bugTile[0]][this.bugTile[1]].xPointer !== undefined && 
               fieldContents[this.bugTile[0]][this.bugTile[1]].yPointer !== undefined){
                this.bugTile = [parseInt(fieldContents[this.bugTile[0]][this.bugTile[1]].xPointer) , 
                                parseInt(fieldContents[this.bugTile[0]][this.bugTile[1]].yPointer)]; 
                //console.log(this.bugTile);
                this.action = this.previousAction; //Restore the previous action once we have teleported the bug.
                //console.log(this.action + " , " + this.previousAction);
            }
            break;
        case 'teleportToRandomTile':
            //Define offsets. These need to eventually stop being 0.
            var randomXOffSet = 0;
            var randomYOffSet = 0;
            var randomRange = fieldContents[this.bugTile[0]][this.bugTile[1]].flowValue;  
            //Generate valid values for the offsets.
            while(randomXOffSet === 0) { randomXOffSet = Math.floor(Math.random() * (randomRange - (-randomRange) + 1)) + (-randomRange);}
            while(randomYOffSet === 0) { randomYOffSet = Math.floor(Math.random() * (randomRange - (-randomRange) + 1)) + (-randomRange);}
            //console.log(randomXOffSet, randomYOffSet);
            //Then, if necessary, adjust the offset so that bugs do not fall off the map.
            while(randomXOffSet + this.bugTile[0] < 0) { ++randomXOffSet; }
            while(randomYOffSet + this.bugTile[1] < 0) { ++randomYOffSet; }
            while(randomXOffSet + this.bugTile[0] > (parseInt(FILE_SIZE[0]) - 1) ) { --randomXOffSet; }
            while(randomYOffSet + this.bugTile[1] > (parseInt(FILE_SIZE[1]) - 1) ) { --randomYOffSet; }
            console.log( (randomXOffSet + this.bugTile[0]) + " , " + (randomYOffSet + this.bugTile[1]) );
            //Finally, move the bug.
            this.bugTile[0] += randomXOffSet;
            this.bugTile[1] += randomYOffSet;
            //And since this is a teleport, restore the previous action.
            this.action = this.previousAction;
            break;
        default:
            break;
    }
    //this.bugTile = getTile(this.x, this.y); //Updates our derivative.
}

function updateBugVolume(volume,bug){
    bugList[bug].volume = volume;
}