
var initialized = false;
var initialPos;

export function getOriginalPosition(){
	return initialPos;
}

export function isInitialized(){
	return initialized;
}

export function initialize(pos){
	initialPos = pos;
}

let nextpage = document.getElementById("nextpage");
if(nextpage){
  nextpage.addEventListener("click", function() {
		console.log('helo');
				var audio = new Audio('./Zymbel.mp3');
				audio.play();
        initialized = true;
    });
}
