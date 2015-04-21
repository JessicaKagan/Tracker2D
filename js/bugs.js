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

var Bug = function(image, x,y, action,name){
    this.image = image;
    this.action = action;
    this.x = x;
    this.y = y;
    this.name = name; //Long term idea: Create naming function for bugs, might come in handy.
    this.bugTile = getTile(this.x, this.y);
}

Bug.prototype.drawBug = function(){
    //This might not need to be its own function unless we can change the bug stuff?
    ctx.drawImage(this.image,this.x,this.y);

}

Bug.prototype.updateBug = function() {
    //console.log(this.action);
    //Eventually we need to rewrite this so that if a bug slams into the edge of the playfield (not just tiles), it changes direction.
    this.bugTile = getTile(this.x, this.y); //Updates our derivative.

    //Play sounds BEFORE attempting to move the bug.
    if(fieldContents[this.bugTile[0]][this.bugTile[1]] != undefined){
        //Right now, sounds have separate playback routines if they have effects.
        //Frozen bugs only play their tile's sound once. Anything else would be detrimental to your sanity.
        if(fieldContents[this.bugTile[0]][this.bugTile[1]].instrument != -1 && this.action !== "holdPosition"){
            //console.log(fieldContents[bugTile[0]][bugTile[1]].dspValue);
            playSound(soundFont[fieldContents[this.bugTile[0]][this.bugTile[1]].instrument],
                                fieldContents[this.bugTile[0]][this.bugTile[1]].note,
                                fieldContents[this.bugTile[0]][this.bugTile[1]].dspEffect,
                                fieldContents[this.bugTile[0]][this.bugTile[1]].dspValue
                                );
        }
    }

    //If the bug is about to leave the map, make it turn around.
    //Based on tiles, in the hopes of scaling gracefully to larger maps.
    if((this.bugTile[0] + 1) >= FILE_SIZE[0] && this.action === 'moveRight') { this.action = 'moveLeft'; }
    if(this.bugTile[0] === 0 && this.action === 'moveLeft') { this.action = 'moveRight'; }
    if((this.bugTile[1] + 1) >= FILE_SIZE[1] && this.action === 'moveDown') { this.action = 'moveUp'; }
    if(this.bugTile[1] === 0 && this.action === 'moveUp') { this.action = 'moveDown'; }


    //Change the behavior of the bug based on what it's standing on.
    if(fieldContents[this.bugTile[0]][this.bugTile[1]] != undefined){
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
                this.action = 'holdPosition';
            default:
                break;
        }
    }

    //Then move the bug based on its behavior.
    switch(this.action){
        case 'moveLeft':
            this.x -= TILE_SIZE;
            break;
        case 'moveRight':
            this.x += TILE_SIZE;
            break;
        case 'moveUp':
            this.y -= TILE_SIZE;
            break;
        case 'moveDown':
            this.y += TILE_SIZE;
            break;
        default:
            break;
    }

    this.bugTile = getTile(this.x, this.y); //Updates our derivative.
}
