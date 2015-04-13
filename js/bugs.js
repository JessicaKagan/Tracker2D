/*
 * Bug functionality here! What attributes can bugs have?
 * 1. Image used to represent it
 * 2. Current action, which needs a function to change it as needed..
 */

//Just a reference for whatever I can think of.
//For now, bugs start with a direction and only change directions when a tile tells them to.
var bugActions = ['moveLeft', 'moveRight', 'moveUp', 'moveDown', 'teleportToTile'];

var Bug = function(x,y, action,name){
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


