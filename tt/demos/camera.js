/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as posenet from '@tensorflow-models/posenet';
import { monitor } from "./monitoring";
import { isInitialized, initialize, getOriginalPosition } from "./initialization";
import {drawBoundingBox, drawKeypoints, drawSkeleton, isMobile, toggleLoadingUI, tryResNetButtonName, tryResNetButtonText, updateTryResNetButtonDatGuiCss} from './demo_util';


const videoWidth = 600;
const videoHeight = 513;

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = videoWidth;
  video.height = videoHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();
  return video;
}

const defaultQuantBytes = 2;

const defaultMobileNetMultiplier = 0.75;
const defaultMobileNetStride = 16;
const defaultMobileNetInputResolution = 513;

const defaultResNetMultiplier = 1.0;
const defaultResNetStride = 32;
const defaultResNetInputResolution = 250;

const defaultMinPoseConfidence = 0.15;
const defaultMinPartConfidence = 0.15;


/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {

  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;
  canvas.style.borderRadius = "20px";
  canvas.style.border = "5px solid white";
  canvas.style.margin = "0 auto";

  const main = document.getElementById('main');
  main.style.border = "transparent";

  async function poseDetectionFrame() {


    let minPoseConfidence = 0.15;
    let minPartConfidence = 0.1;
    const pose = await net.estimatePoses(video, {
      flipHorizontal: flipPoseHorizontal,
      decodingMethod: 'multi-person',
      maxDetections: 5,
      scoreThreshold: 0.1,
      nmsRadius: 30
    });

    var currentPose = pose[0];

    if (currentPose["score"] > defaultMinPoseConfidence) {

      if (isInitialized()){
        monitor(currentPose["keypoints"]);
      } else {

        // Print video
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();
        drawKeypoints(currentPose["keypoints"], minPartConfidence, ctx);
        drawSkeleton(currentPose["keypoints"], minPartConfidence, ctx);

        initialize(currentPose["keypoints"]);
      }
    }
  }

  window.setInterval(function(){requestAnimationFrame(poseDetectionFrame)}, 100);
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: defaultMobileNetStride,
    inputResolution: defaultMobileNetInputResolution,
    multiplier: defaultMobileNetMultiplier,
    quantBytes: defaultQuantBytes
  });

  toggleLoadingUI(false);

  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    throw e;
  }

  detectPoseInRealTime(video, net);

}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
