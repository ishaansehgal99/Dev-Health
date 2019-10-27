import {getOriginalPosition} from './initialization';
import {dim, undim, sound} from "./notification";

// Variables for functions
var currentLeftEye;
var currentRightEye;
var currentLeftShoulder;
var currentRightShoulder;
var initialLeftEye;
var initialRightEye;
var initialLeftShoulder;
var initialRightShoulder;

var use202020 = true;
var usePosture = true;

// Add listeners to on off switches

let switch202020 = document.getElementById("switch202020");
if(switch202020){
    switch202020.addEventListener("click", function() {
        use202020 = !use202020;
    });
}

let switchPosture = document.getElementById("switchPosture");
if(switchPosture){
    switchPosture.addEventListener("click", function() {
        usePosture = !usePosture;
    });
}


// Main function that gets called to deal with a new position
export async function monitor(pos){

  currentLeftEye = pos[1]
  currentRightEye = pos[2];
  currentLeftShoulder = pos[5];
  currentRightShoulder = pos[6];
  var initialPos = getOriginalPosition();
  initialLeftEye = initialPos[1]
  initialRightEye = initialPos[2];
  initialLeftShoulder = initialPos[5];
  initialRightShoulder = initialPos[6];

    /* Setup alert if-statemtn */
  if (use202020) {
    monitor202020();
  }
  if (usePosture) {
    monitorPosture();
  }

}


// 20 20 20 logic
var lastLookAway = Date.now();
var lastLookScreen = Date.now();
//var maxScreenLookMS = 20 * 60 * 1000;
var maxScreenLookMS = 20 * 1000;
var minLookAwayMS = 20 * 1000;
var lastSound20 = Date.now();
async function monitor202020(){
  if(Date.now() - lastLookScreen > minLookAwayMS) {
    lastLookAway = Date.now();
    lastLookScreen = Date.now();
  }
  else{
    lastLookScreen = Date.now();
    if (lastLookScreen > lastLookAway + maxScreenLookMS && lastSound20 + 20 * 1000 < Date.now()) {
      sound();
      lastSound20 = Date.now();
    }
  }
}


// Posture logic
var badCount = 0;
var goodCount = 0;
var goodBadQueue = [];
var lastSoundPosture = Date.now();
async function monitorPosture(){

  var currentRatio = (currentRightShoulder["position"]["x"] - currentLeftShoulder["position"]["x"]) /
    (currentRightEye["position"]["x"] - currentLeftEye["position"]["x"]);
  var initialRatio = (initialRightShoulder["position"]["x"] - initialLeftShoulder["position"]["x"]) /
    (initialRightEye["position"]["x"] - initialLeftEye["position"]["x"]);



  // Keeps track of goodCount and badCount
  if (currentRatio < initialRatio * 0.95) {
    goodBadQueue.push(0);
    badCount += 1;
  } else {
    goodBadQueue.push(1);
    goodCount += 1;
  }
  if (goodCount + badCount > 100) {
    var last = goodBadQueue.shift();
    if (last == 1) {
      goodCount -= 1;
    } else {
      badCount -= 1;
    }
  }

  if (badCount > 80 && Date.now() > lastSoundPosture + 5000) {
      dim();
      lastSoundPosture = Date.now();
  }
}