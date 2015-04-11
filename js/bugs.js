/*
 * Bug functionality here! What attributes can bugs have?
 * 1. Image used to represent it
 * 2. Current action, which needs a function to change it as needed..
 */

var Bug = function(x,y, action){
    this.image = bugImage;
    this.action = action;
    this.x = x;
    this.y = y;

}

Bug.prototype.drawBug = function(){
    //This gets called but doesn't execute right.
    ctx.drawImage(this.image,this.x,this.y);

}


//Just a reference for whatever I can think of.
//For now, bugs start with a direction and only change directions when a tile tells them to.
var Actions = ['moveLeft', 'moveRight', 'moveUp', 'moveDown', 'teleportToTile'];