const SimplexNoise = require('simplex-noise');
// initializing a simplex instance
// do this only once it's relatively expensive
var simplex = new SimplexNoise();

var clouds = {};
var then;
var BROWNIAN_MODIFIER = 0.0001;

function addCloud(id) {
  var cloudElement = document.getElementById(id);
  var cloudChild = cloudElement.children[0];
  var text = cloudChild.textContent;
  cloudChild.textContent = "";
  var words = [];
  text = text.trim();
  console.log(text);
  text.trim().split(" ").forEach(function(word) {
    if (word.split('').length > 0) {
      var wordSpan = document.createElement("span");
      wordSpan.textContent = word + String.fromCharCode(0x00A0);
      cloudChild.appendChild(wordSpan);
      words.push(wordSpan);
    }
  });
  var newCloud = new Cloud(cloudElement, words);
  clouds[id] = newCloud;
}

function init() {
  window.requestAnimationFrame(update);
}

function update(timeStamp) {
  var deltaTime = 0;
	if (then !== undefined) {
		deltaTime = timeStamp - then;
	}
	then = timeStamp;
  Object.keys(clouds).forEach(function(cloudId) {
    clouds[cloudId].update(timeStamp, deltaTime);
  });
  window.requestAnimationFrame(update);
}

function setTargetDelta(id, dm, duration) {
  var cloud = clouds[id];
  if (cloud) {
    cloud.setTargetDelta(dm, duration);
    console.log("setting target delta", id, dm, duration);
  }
}

class Cloud {
  constructor(element, words) {
    this.element = element;
    this.delta = 0;
    this.targetDelta = 0;
    this.words = words;
    this.restDuration = 0;
  }

  update(timeStamp, deltaTime) {

    var f = deltaTime / this.restDuration;
    if (this.restDuration === 0) {
      f = 0;
    }
    f = Math.min(f, 1.0);
    var d = this.targetDelta - this.delta;
    this.delta += d * f;
    if (Number.isNaN(this.delta)) {
      this.delta = 0;
      console.log(timeStamp, deltaTime, this.restDuration);
    }
    this.restDuration -= deltaTime;
    this.restDuration = Math.max(0, this.restDuration);

    var that = this;
    this.words.forEach(function(word,i) {
        var x = (simplex.noise3D(i, 0, timeStamp * BROWNIAN_MODIFIER) - 0.5) * 2;
        var y = (simplex.noise3D(i, 1, timeStamp * BROWNIAN_MODIFIER) - 0.5) * 2;
        var z = (simplex.noise3D(i, 2, timeStamp * BROWNIAN_MODIFIER) - 0.5) * 2;
        word.style.transform = "translate3d("  + (x * that.delta) + "px, " + (y * that.delta) + "px, " + (z * that.delta) + "px)";
    });
    //console.log(this);
  }

  setTargetDelta(dm, duration) {
    this.targetDelta = dm;
    this.restDuration = duration;
  }
}

module.exports = {
  init,
  update,
  addCloud,
  setTargetDelta
}
