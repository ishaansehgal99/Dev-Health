
var initialized = false;
var initialPos;
var currentPos;

export function getOriginalPosition(){
	return initialPos;
}

export function isInitialized(){
	return initialized;
}

export function update(pos){
	currentPos = pos;
}

let nextpage = document.getElementById("nextpage");
if(nextpage){
  nextpage.addEventListener("click", function() {
		console.log('helo');
				var audio = new Audio('./Zymbel.mp3');
				audio.play();
        initialized = true;
        initialPos = currentPos;
    });
}
