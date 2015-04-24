function hookKeyboard(){
    $(window).keypress(function(e){
        var keyboardInput = event.keyCode;
        console.log(keyboardInput);
        switch(keyboardInput){
            case 61:
                if(currentOctave < 5) {
                    currentOctave += 1;
                    currentPitch += 12;
                    $('#pitchInput').val(currentPitch);
                }
                break;
            case 45:
                if(currentOctave > 0) {
                    currentOctave -= 1;
                    currentPitch -= 12;
                    $('#pitchInput').val(currentPitch);
                }
                $('#pitchInput').val(currentPitch);
                break;

            case 113:
                scaleNote = 0;
                break;
            case 119:
                scaleNote = 1;
                break;
            case 101:
                scaleNote = 2;
                break;
            case 114:
                scaleNote = 3;
                break;
            case 116:
                scaleNote = 4;
                break;
            case 121:
                scaleNote = 5;
                break;
            case 117:
                scaleNote = 6;
                break;
            case 105:
                scaleNote = 7;
                break;
            case 111:
                scaleNote = 8;
                break;
            case 112:
                scaleNote = 9;
                break;
            case 91:
                scaleNote = 10;
                break;
            case 93:
                scaleNote = 11;
                break;
            default:
                break;   
        }
        if(keyboardInput !== 61 && keyboardInput !== 45) { 
            currentPitch = currentOctave*12 + scaleNote; 
            $('#pitchInput').val(currentPitch);
        }
       
    });
}