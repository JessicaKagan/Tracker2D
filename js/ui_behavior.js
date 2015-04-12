/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
 * Long term thoughts: At some point in the near future, we might want to add a synchronization feature to help people create more complicated interlocking
*/
var pauseState = true;
var toolList = ['paint', 'line', 'eraser']; //We can add a bunch more.
var selectedTool = 'paint'; //Change as needed, default to painting.

var pauseButton = function(coords) {
    this.coords = coords;
}

//pauseImages[0] is a pause sign, pauseImages[1] is a play sign.
//Extend this to draw all buttons?
pauseButton.prototype.drawButton = function() {
    if(pauseState = true) { ctx.drawImage(pauseImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else { ctx.drawImage(pauseImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    
}