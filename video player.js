"use strict";

console.clear();

const video = document.getElementById("player");
const source = document.createElement("source");

function loadVideo(element, src) {
  source.src = src;
  element.appendChild(source);
  element.load();
  element.play();
}


document.getElementById("beach").addEventListener(
  'click',
  () => loadVideo(
    video,
    "beach.mp4"
  )
)

document.getElementById("driving").addEventListener(
  'click',
  () => loadVideo(
    video,
    "driving.mp4"
  )
)

document.getElementById("rain").addEventListener(
  'click',
  () => loadVideo(
    video,
    "rain.mp4"
  )
)
document.getElementById("forest").addEventListener(
  'click',
  () => loadVideo(
    video,
    "forest.mp4"
  )
)

document.getElementById("space").addEventListener(
  'click',
  () => loadVideo(
    video,
    "space.mp4"
  )
)
document.getElementById("fire").addEventListener(
  'click',
  () => loadVideo(
    video,
    "fire.mp4"
  )
)

