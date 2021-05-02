// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const generateButton = document.forms["submit"];
const imageFile = document.getElementById("image-input");

/*generateButton.addEventListener('click', () => {

});*/

imageFile.addEventListener('change', (event) => {
  var input = document.getElementById("image-input");
  const objectURL = URL.createObjectURL(event.target.files[0]);
  img.src = objectURL;

  img.alt = event.target.files[0].name;
});

/*clearButton.addEventListener('click', (event) => {
  var mainCanvas = document.getElementById('user-image');
  var canvasContext = mainCanvas.getContext('2d');

  canvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
});*/

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', (event) => {
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  var mainCanvas = document.getElementById('user-image');
  var canvasContext = mainCanvas.getContext('2d');
  var dimensions = getDimensions(400, 400, img.width, img.height);
  var clearButton = document.querySelector("[type='reset']");

  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, 400, 400);
  canvasContext.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);

  clearButton.disabled = false;
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

