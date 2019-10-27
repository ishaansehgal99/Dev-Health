
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

if(document.getElementById("nextpage")){
    document.getElementById("nextpage").addEventListener("click", function() {
        initialized = true;
        document.getElementById('output').style.display = "none";
        document.getElementById('nextpage').style.display = "none";
    });
}
