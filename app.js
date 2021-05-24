let model;
let uNet;
let video;
let segmentedVideo;

const runButton = document.getElementById('run');
runButton.addEventListener('click', modelReady);
const loadingText = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const enableUnetCheckbox = document.getElementById('enableUnet');
let enableUnet = enableUnetCheckbox.checked;

enableUnetCheckbox.addEventListener('change', () => {
  enableUnet = enableUnetCheckbox.checked;
  if (enableUnet) {
    uNet.segment(video, uNetResult);
  }
});

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('sketch');

  video = createCapture(VIDEO);
  video.hide();

  model = ml5.imageClassifier('MobileNet', video, modelReady);
  uNet = ml5.uNet('face');
}

function uNetResult(error, results) {
  if (error) {
    console.log(error);
  } else {
    segmentedVideo = results.backgroundMask;
    if (enableUnet) {
      uNet.segment(video, uNetResult);
    }
  }
}

function modelReady() {
  if (loadingText) {
    loadingText.remove();
  }
  model.classify(gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    // Clear out previous results on page
    resultsDiv.innerHTML = '';
    // Loop through the results from ml5.js
    for (let [i, result] of results.entries()) {
      // Create DOM elements 
      let h2Element = document.createElement('h2');
      let labelElement = document.createElement('span');
      let scoreElement = document.createElement('span');

      // Set label & confidence score
      labelElement.textContent = (i + 1) + ') ' + result.label + ' ';
      scoreElement.textContent = (result.confidence * 100).toFixed(1) + '%';

      // Add class for styling & append to page
      scoreElement.classList.add('pred-score');
      h2Element.append(labelElement, scoreElement);
      resultsDiv.appendChild(h2Element);
    }
  }
}

function draw() {
  background(0);
  if (segmentedVideo && enableUnet) {
    image(segmentedVideo, 0, 0, 640, 480);
  } else {
    image(video, 0, 0);
  }
}
