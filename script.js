// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var synth = window.speechSynthesis;

const mainCanvas = document.getElementById('user-image');
const canvasContext = mainCanvas.getContext('2d');
const imageFile = document.getElementById("image-input");
const submitButton = document.getElementById('generate-meme');
const clearButton = document.querySelector("[type='reset']");
const readButton = document.querySelector("[type='button']");
const volume = document.getElementById('volume-group');
const voiceSelection = document.getElementById('voice-selection');
var voices = speechSynthesis.getVoices();

populateVoiceList();
if(speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

readButton.addEventListener('click', (event) => {
  var topText = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  var text = topText.concat(' ');
  var text = text.concat(bottomText);
  var utterance = new SpeechSynthesisUtterance(text);

  speechSynthesis.speak(utterance);
});

volume.addEventListener('input', (event) => {
  var volumeIcon = volume.getElementsByTagName('img');
  var volumeLevel = volume.getElementsByTagName('input');
  console.log(volumeLevel.value);

  if(volumeLevel == 0) {
    volumeIcon.src = "icons/volume-level-0.svg";
  }

  else if(volumeLevel > 0 && volumeLevel <= 33) {
    volumeIcon.src = "icons/volume-level-1.svg";
  }

  else if(volumeLevel > 33 && volumeLevel <= 66) {
    volumeIcon.src = "icons/volume-level-2.svg";
  }

  else if(volumeLevel > 66 && volumeLevel <= 100) {
    volumeIcon.src = "icons/volume-level-3.svg";
  }
});

submitButton.addEventListener('submit', (event) => {
  event.preventDefault();

  var topText = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  var generateButton = document.querySelector("[type='submit']");

  canvasContext.font = '30px Comic Sans MS';
  canvasContext.textAlign = 'center';
  canvasContext.fillStyle = 'red';
  canvasContext.fillText(topText, 200, 50);
  canvasContext.fillText(bottomText, 200, 370);

  document.getElementById('text-top').value = '';
  document.getElementById('text-bottom').value = '';

  clearButton.disabled = false;
  readButton.disabled = false;
  voiceSelection.disabled = false;
  generateButton.disabled = true; 
});

imageFile.addEventListener('change', (event) => {
  const objectURL = URL.createObjectURL(event.target.files[0]);
  img.src = objectURL;

  img.alt = event.target.files[0].name;
});

clearButton.addEventListener('click', (event) => {
  var generateButton = document.querySelector("[type='submit']");

  canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

  clearButton.disabled = true;
  readButton.disabled = true;
  voiceSelection.disabled = true;
  generateButton.disabled = false;

});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', (event) => {
  var dimensions = getDimensions(400, 400, img.width, img.height);
  var generateButton = document.querySelector("[type='submit']");

  canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, 400, 400);
  canvasContext.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);

  clearButton.disabled = true;
  readButton.disabled = true;
  voiceSelection.disabled = true;
  generateButton.disabled = false;
});



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelection.appendChild(option);
  }
}