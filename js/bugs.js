/*
 * Bug functionality here! What attributes can bugs have?
 * 1. Image used to represent it
 * 2. Current action, which needs a function to change it as needed..
 */

//Just a reference for whatever I can think of.
//For now, bugs start with a direction and only change directions when a tile tells them to.
var bugActions = ['moveLeft', 'moveRight', 'moveUp', 'moveDown', 'teleportToTile'];

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
    //console.log(this.action);
    //Eventually we need to rewrite this so that if a bug slams into the edge of the playfield (not just tiles), it changes direction.
    var bugTile = [(this.x - 80)/24, this.y/24];
        if(this.x > 799) {
            this.x = 80;
        } else if(this.x <= 79) {
            this.x = 776;
        }
        else {

            //Play sounds BEFORE moving the bug.
            if(fieldContents[bugTile[0]][bugTile[1]] != undefined){
                if(fieldContents[bugTile[0]][bugTile[1]].instrument != -1){
                    playSound(soundFont[fieldContents[bugTile[0]][bugTile[1]].instrument], 
                                        fieldContents[bugTile[0]][bugTile[1]].note);
                }
            }

            //Change the behavior of the bug based on what it's standing on.
            console.log(fieldContents[bugTile[0]][bugTile[1]]);
            if(fieldContents[bugTile[0]][bugTile[1]] != undefined){
                console.log(fieldContents[bugTile[0]][bugTile[1]].flowEffect);
                switch(fieldContents[bugTile[0]][bugTile[1]].flowEffect){
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

            

        }

    
    

}
