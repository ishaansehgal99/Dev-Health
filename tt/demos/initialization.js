
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

if(document.getElementById("nextpage")){
    document.getElementById("nextpage").addEventListener("click", function() {
        initialized = true;
        initialPos = currentPos;
    });
}
