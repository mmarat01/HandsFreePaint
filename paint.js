/*
 * paint.js
 * Mijael Maratuech & Maya Scandinaro
 * COMP86 Non-WIMP project: "Hands-off Paint"
 * December, 2020
 */

//global for selector callbacks, initially red
var drawingColor = "#FF0000";

//globals for color tracking
var currColor;
var customYellow = true; // > 200, > 200, < 150
var customGreen = false; // < 140, > 160, 40 < x < 145
var customPurple = false; // 60 < x < 140, < 120, 100 < x < 160

// draw grey canvas
function drawBackground() {
  var c = document.getElementById("drawingCanvas");
  var gc = c.getContext("2d");
  gc.fillStyle = "#EEEEEE";
  gc.fillRect(0, 0, c.width, c.height);
}

// action on 'clear' button
function clearCanvas() {
  drawBackground();
}

// action on RGB drawing color selection
function changeDrawingColor(e) {
  drawingColor = e.value;
}

// action on stylus color selection
function changeStylusColor(e) {
  switch (e.id) {
    case "y":
      customYellow = true;
      customGreen = false;
      customPurple = false;
      currColor = 'customYellow';
      trackColor();
      break;
    case "g":
      customGreen = true;
      customYellow = false;
      customPurple = false
      currColor = 'customGreen';
      trackColor();
      break;
    case "p":
      customPurple = true;
      customYellow = false;
      customGreen = false;
      currColor = 'customPurple';
      trackColor();
      break;
  }
}

// sets color tracking
function trackColor() {

  // register all colors
  tracking.ColorTracker.registerColor("customYellow", (r, g, b) => r > 200 && g > 200 && b < 150);
  tracking.ColorTracker.registerColor("customGreen", (r, g, b) => r < 140 && g > 160 && b < 145 && b > 40);
  tracking.ColorTracker.registerColor("customPurple", (r, g, b) => r > 60 && r < 140 && g < 120 && b > 100 & b < 160);

  var tracker;
  var myColor;

  // set tracker to detect only one color
  if (customYellow) {
    tracker = new tracking.ColorTracker('customYellow');
    myColor = 'customYellow';
  } else if (customGreen) {
    tracker = new tracking.ColorTracker('customGreen');
    myColor = 'customGreen';
  } else {
    tracker = new tracking.ColorTracker('customPurple');
    myColor = 'customPurple';
  }

  tracking.track("#video", tracker, { camera: true });
  tracker.on("track", function (event) {
    document.getElementById("result").innerHTML = "Stylus not calibrated";
    for (var rect of event.data) {
      if (myColor != currColor) {
        return;
      }
      document.getElementById("result").innerHTML = "OK!";
      draw(rect.x, rect.y, drawingColor);
    }
  });
}

// draw using coordinates from tracking.js
function draw(x, y, drawingColor) {
  var c = document.getElementById("drawingCanvas");
  var gc = c.getContext("2d");
  gc.fillStyle = drawingColor;
  gc.beginPath();
  gc.arc(x * 2, y * 2, 13, 0, 2 * Math.PI);
  gc.fill();
}

//onload: set up canvas, user sets stylus color tracker
window.onload = function () {
  drawBackground();
  trackColor();
};
