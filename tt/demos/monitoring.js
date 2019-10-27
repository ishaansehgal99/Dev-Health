import {getOriginalPosition} from './initialization';


// Variables for functions
var currentLeftEye;
var currentRightEye;
var currentLeftShoulder;
var currentRightShoulder;
var initialLeftEye;
var initialRightEye;
var initialLeftShoulder;
var initialRightShoulder;

var use202020 = false;
var usePosture = true;
var useBreaks = false;

// Add listeners to on off switches
if(document.getElementById("switch202020")){
    document.getElementById("switch202020").addEventListener("click", function() {
        use202020 = !use202020;
    });
}
if(document.getElementById("switchPosture")){
    document.getElementById("switchPosture").addEventListener("click", function() {
        usePosture = !usePosture;
    });
}
if(document.getElementById("breaksPosture")){
    document.getElementById("breaksPosture").addEventListener("click", function() {
        useBreaks = !useBreaks;
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
  if (useBreaks) {
    monitorBreaks();
  }

}

async function monitor202020(){

}

var badCount = 0;
var goodCount = 0;
var goodBadQueue = []
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

  if (badCount > 80) {
      console.log("Bad Posture");
  } else {
      console.log("Good Posture");
  }
}

var workLength = 1800;
var breakLength = 60;
var startOfSession = Date.now();
var lastTimeUsed = Date.now();
async function monitorBreaks(){

  if(currentLeftEye["score"] > 0.5 && currentRightEye["score"] > 0.5){
      if (lastTimeUsed + 1000 * breakLength < Date.now()) {
          startOfSession = Date.now();
      }
      lastTimeUsed = Date.now();
      console.log(lastTimeUsed - startOfSession);
  }
  if (((lastTimeUsed - startOfSession) / 1000) > workLength) {
      console.log("Take a break!");
  }
}
