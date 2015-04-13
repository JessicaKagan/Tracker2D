/*
 * Bug functionality here! What attributes can bugs have?
 * 1. Image used to represent it
 * 2. Current action, which needs a function to change it as needed..
 */

//Just a reference for whatever I can think of.
//For now, bugs start with a direction and only change directions when a tile tells them to.
//reverseDirection is to simplify the implementation of walls.
var bugActions = ['moveLeft', 'moveRight', 'moveUp', 'moveDown', 'teleportToTile','reverseDirection'];

var Bug = function(image, x,y, action,name){
    this.image = bugImage;
    this.action = action;
    this.x = x;
    this.y = y;
    this.name = name; //Long term idea: Create naming function for bugs, might come in handy.

}

Bug.prototype.drawBug = function(){
    //This might not need to be its own function unless we can change the bug stuff?
    ctx.drawImage(this.image,this.x,this.y);

}

Bug.prototype.updateBug = function() {
    //Adjust this!
    //
    //setInterval(function(){}, TEMPO)

    var bugTile = [(bug1.x - 80)/24, bug1.y/24];
        if(bug1.x < 800) {
            //Play sounds BEFORE moving the bug.
            if(fieldContents[bugTile[0]][bugTile[1]] != undefined){
                playSound(soundFont[fieldContents[bugTile[0]][bugTile[1]].instrument], fieldContents[bugTile[0]][bugTile[1]].note);
            }
            bug1.x += TILE_SIZE;
            //Plays whatever sound this is at a pitch determined by the note value. 
            //Might be nice to alias soundfont names somehow?

        } else bug1.x = 80;

    
    

}
