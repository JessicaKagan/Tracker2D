/*
 * Not going to be constructed properly for some time.
 * Two sections, for mouse input and keyboard input.
 * What sorts of each should we recognize?
 * We'll also need states for buttons.
*/
var pauseState = true;

var pauseButton = function(coords) {
    this.coords = coords;
}

//pauseImages[0] is a pause sign, pauseImages[1] is a play sign.
pauseButton.prototype.drawButton = function() {
    if(pauseState = true) { ctx.drawImage(pauseImages[0],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    else { ctx.drawImage(pauseImages[1],PAUSE_PLAY_BUTTON_AREA[0],PAUSE_PLAY_BUTTON_AREA[1]); }
    
}