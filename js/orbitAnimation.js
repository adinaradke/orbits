const SimplexNoise = require('simplex-noise');

// initializing a simplex instance
// do this only once it's relatively expensive
var simplex = new SimplexNoise();

//var speed = -0.005;
var theta = 0;
// less than one means it has landscape orientation
//var radiusA = 300;
//var radiusB = 100;
var then;
var STATE = "NORMAL";
var HOMECOMING_START;
var HOMECOMING_DURATION = 2000; //in millis
var DIRECTION = -1;
var TWO_PI = Math.PI * 2;
var RADIUS_MODIFIER = 1;
var RADIUS_MODIFIER_MIN = 1;
var RADIUS_MODIFIER_MAX = 4; //higher = end state
var RADIUS_MODIFIER_INC= 0.001; //higher = more speed
var SPEED_MODIFIER = 1;
var SPEED_MODIFIER_MIN = 1;
var SPEED_MODIFIER_MAX = 5; //higher = end state
var SPEED_MODIFIER_INC= 0.004; //higher = more speed
var DEBUG_VIEW = true;
var ELLIPSE_WIDTH_DEFAULT = 0.6;
var ELLIPSE_PROPORTION = 0.4;
var BROWNIAN_MODIFIER = 0.00001;
var PERSPECTIVE = 1000; //the lower, the more dramatic
var DELTA_Z = 100; //defines max and min z

var satellites = {};
var words = {};

function getParentCenter(theChild) {
	var parentBoundingRect = theChild.parentNode.getBoundingClientRect();
	var centerX = parentBoundingRect.left + parentBoundingRect.width * 0.5;
	var centerY = parentBoundingRect.top + parentBoundingRect.height * 0.5;
	//console.log(centerX, centerY);
	return {x: centerX, y: centerY};
}
function getParentSize(theChild) {
	var parentBoundingRect = theChild.parentNode.getBoundingClientRect();
	var w = parentBoundingRect.width;
	var h = parentBoundingRect.height;
	//console.log(centerX, centerY);
	return {width: w, height: h};
}

function getCenter(sat, opt) {
	//TODO: shift center!!!
	var parent = sat.parentNode;
	// console.log(parent);
	var sun = parent.querySelector(opt.originSelector);
	 // console.log(parent.querySelector(opt.originSelector));
	var bb = sun.getBoundingClientRect();
	var centerX = bb.left + bb.width * opt.originCenter[0];
	var centerY = bb.top + bb.height * opt.originCenter[1];
	return {x: centerX, y: centerY};
}
/*
function constrainAngle(angle) {
	while(angle > Math.PI) {
		angle -= Math.PI * 2;
	}
	while(angle < -Math.PI) {
		angle += Math.PI * 2;
	}
	return angle;
}
*/
function init(options) {

	window.addEventListener('keydown', function(e) {
		//e.preventDefault();
		console.log(e);
		switch(e.key) {
			case " ":
				STATE = "HOMECOMING";
			break;
			case "g":
			case "G":
				STATE = "SLINGSHOT";
			break;
		}
	});

	options.forEach(function(opt) {
		var satellite = document.getElementById(opt.id);
		if (!satellite) {
			return;
		}
		satellites[opt.id] = satellite;

		opt.originCenter = opt.originCenter || [0.5, 0.5];
		opt.originSelector = opt.originSelector || ".sun";
		opt.ellipseProportion = opt.ellipseProportion || ELLIPSE_PROPORTION;

		var satBoundingRect = satellite.getBoundingClientRect();

		var container = satellite.parentNode;
		var center = getCenter(satellite, opt);
		//var containerSize = getParentSize(satellite);

		//var startX = satBoundingRect.left + satBoundingRect.width * 0.5;
		//var startY = satBoundingRect.top + satBoundingRect.height * 0.5;
		var startX = satBoundingRect.left;
		var startY = satBoundingRect.top;

		//console.log(center.x, center.y);
		var dx = startX - center.x;
		var dy = startY - center.y;

		var startAngle = Math.atan2(dy / opt.ellipseProportion, dx);
		var radiusB = Math.abs(dy / Math.sin(startAngle));
		var radiusA = Math.abs(dx / Math.cos(startAngle));
		console.log(dx, dy);
		//var ellipseWidthFactor = option.ellipseWidthFactor || ELLIPSE_WIDTH_DEFAULT;
		//var ellipseHeightFactor = option.ellipseHeightFactor || ELLIPSE_HEIGHT_DEFAULT;

		//var radiusA = containerSize.width * 0.5 * ellipseWidthFactor;
		//var radiusB = radiusA * ellipseProportion;
		var angularSpeed = TWO_PI / opt.duration / 1000.0;

		//option.startAngle = startAngle % TWO_PI;
		opt.x0 = startX;
		opt.y0 = startY;
		opt.radiusA = radiusA;
		opt.radiusB = radiusB;
		opt.angularSpeed = angularSpeed;
		opt.startAngle = startAngle;
		opt.currentAngle = opt.startAngle;
		opt.center = center;

		//satellite.style.top = 0;
		//satellite.style.left = 0;
		satellite.style.perspective =  `${PERSPECTIVE}px`;

		var satChild = satellite.children[0];
		if (satChild.tagName !== "img") {
			var text = satChild.textContent;
			satChild.textContent = "";
			console.log(text);
			words[opt.id] = [];
			text = text.trim();
			console.log(text);
			text.trim().split(" ").forEach(function(word) {
				if (word.split('').length > 0) {
					var wordSpan = document.createElement("span");
					wordSpan.textContent = word + String.fromCharCode(0x00A0);
					satChild.appendChild(wordSpan);
					/*
					wordSpan.props = {
						dx: (Math.random() - 0.5)*2.0,
						dy: (Math.random() - 0.5)*2.0,
						dz: (Math.random() - 0.5)*2.0
					};
					*/
					words[opt.id].push(wordSpan);
				}
			});
		}

		if (DEBUG_VIEW) {

			var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			// svgElement.width = Math.abs(radiusA) * 2;
			// svgElement.height = Math.abs(radiusB) * 2;
			document.getElementsByTagName("body")[0].appendChild(svgElement);

			// Place the SVG namespace in a variable to easily reference it.
			var xmlns = "http://www.w3.org/2000/svg";
			var ellipse = document.createElementNS(xmlns, "ellipse");

			ellipse.setAttributeNS(null,"cx",center.x);
			ellipse.setAttributeNS(null,"cy",center.y);
			ellipse.setAttributeNS(null,"rx",radiusA);
			ellipse.setAttributeNS(null,"ry",radiusB);
			ellipse.setAttributeNS(null,"stroke", "white");
			ellipse.setAttributeNS(null,"stroke-width", 0.5);
			ellipse.setAttributeNS(null,"fill", "none");

			svgElement.appendChild(ellipse);

			var cross = document.createElementNS(xmlns, "path");
			var s = 20; //cross size in pixels
			var x0 = center.x;
			var y0 = center.y;
			var x1 = center.x - s * 0.5;
			var y1 = center.y - s * 0.5;

			cross.setAttributeNS(null,"stroke", "white");
			cross.setAttributeNS(null,"stroke-width", 1);
			cross.setAttributeNS(null,"fill", "none");
			cross.setAttributeNS(null,"d","M" + x1 + " " + y0 + " L " + (x1 + s) + " " + y0 + " M " + x0 + " " + y1 + " L " + x0 + " " + (y1 + s) );
			svgElement.appendChild(cross);

		}
	});
	console.log(options);

	window.requestAnimationFrame(animateOrbits);
}

function animateOrbits(timestamp) {
	//console.log(RADIUS_MODIFIER);
	var elapsed = 0;
	if (then !== undefined) {
		elapsed = timestamp - then;
	}
	then = timestamp;
	//console.log(then, elapsed);
	if (STATE === "SLINGSHOT") {
		RADIUS_MODIFIER *= (1 + RADIUS_MODIFIER_INC);
		SPEED_MODIFIER *= (1 + SPEED_MODIFIER_INC);
	} else {
		RADIUS_MODIFIER *= (1 - RADIUS_MODIFIER_INC);
		SPEED_MODIFIER *= (1 - SPEED_MODIFIER_INC);
	}
	if (RADIUS_MODIFIER > RADIUS_MODIFIER_MAX) {
		STATE = "NORMAL";
	}
	RADIUS_MODIFIER = Math.max(RADIUS_MODIFIER, RADIUS_MODIFIER_MIN);
	RADIUS_MODIFIER = Math.min(RADIUS_MODIFIER, RADIUS_MODIFIER_MAX);
	SPEED_MODIFIER = Math.max(SPEED_MODIFIER, SPEED_MODIFIER_MIN);
	SPEED_MODIFIER = Math.min(SPEED_MODIFIER, SPEED_MODIFIER_MAX);

	options.forEach(function(opt) {
		//var element = document.getElementById(opt.id);
		var element = satellites[opt.id];
		// var center = getParentCenter(element);
		var center = opt.center;
		switch(STATE) {
			case "NORMAL":
			  opt.currentAngle += opt.angularSpeed * easedSpeedMod() * elapsed* DIRECTION;
			  opt.currentAngle = (opt.currentAngle + TWO_PI) % TWO_PI;

				opt.homecomingStartAngle = opt.currentAngle;
				var deltaAngle = (opt.startAngle - opt.homecomingStartAngle) * DIRECTION;
				if (DIRECTION === -1) {
					if (opt.startAngle - opt.homecomingStartAngle > 0) {
						deltaAngle = deltaAngle + TWO_PI;
					}
				}
				opt.homecomingSpeed = deltaAngle / HOMECOMING_DURATION;
				//console.log(opt.homecomingSpeed);
				//opt.currentAngle = opt.currentAngle % TWO_PI;
				HOMECOMING_START = timestamp;
			break;
			case "SLINGSHOT":
				opt.currentAngle += opt.angularSpeed * easedRadiusMod() * elapsed* DIRECTION;
				opt.currentAngle = (opt.currentAngle + TWO_PI) % TWO_PI;
				// opt.homecomingStartAngle = opt.currentAngle;
				// //opt.currentAngle = opt.currentAngle % TWO_PI;
				// HOMECOMING_START = timestamp;
			break;
			case "HOMECOMING":
				//console.log("foo");
				/*
				var deltaAngle = opt.startAngle - opt.homecomingStartAngle;
				if (DIRECTION === -1) {
					if (deltaAngle < 0) {
						deltaAngle = opt.startAngle - opt.homecomingStartAngle + TWO_PI;
					}
				}
				*/
				var deltaTime = timestamp - HOMECOMING_START;
				//var deltaTime = elapsed;
				if (deltaTime > HOMECOMING_DURATION - 10) {
					opt.currentAngle = opt.startAngle;
				} else {
					//deltaTime = easeOut(deltaTime, HOMECOMING_DURATION);
					// var angularSpeed = deltaAngle / HOMECOMING_DURATION;
					opt.currentAngle += (opt.homecomingSpeed * elapsed) * DIRECTION;
					//opt.currentAngle = opt.currentAngle % TWO_PI;
					opt.currentAngle = (opt.currentAngle + TWO_PI) % TWO_PI;
				}
				// console.log(deltaTime);
			break;
		}
		var x = center.x + Math.cos(opt.currentAngle) * opt.radiusA * easedRadiusMod() - opt.x0;
		var y = center.y + Math.sin(opt.currentAngle) * opt.radiusB * easedRadiusMod() - opt.y0;

		var offsets = element.getBoundingClientRect();
		// element.style.left = (x - offsets.width * 0.5) + 'px';
		// element.style.top = (y - offsets.height * 0.5) + 'px';

		//element.style.left = x + 'px';
		//element.style.top = y + 'px';
		var z = Math.sin(opt.currentAngle) * DELTA_Z;
		//z = 0;
		element.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
		element.style.zIndex = Math.floor(Math.sin(opt.currentAngle) * 100);

		//var delta = Math.abs(opt.currentAngle - opt.startAngle) / TWO_PI * 200;
		var delta = (1.0 - Math.abs(Math.cos((opt.currentAngle - opt.startAngle)*0.5))) * 200;
		delta = 0;
		//var delta = 200;
		words[opt.id].forEach(function(word,i) {
				//console.log(span.props);
				var x = (simplex.noise3D(i, 0, timestamp * BROWNIAN_MODIFIER) - 0.5) * 2;
				var y = (simplex.noise3D(i, 1, timestamp * BROWNIAN_MODIFIER) - 0.5) * 2;
				var z = (simplex.noise3D(i, 2, timestamp * BROWNIAN_MODIFIER) - 0.5) * 2;
				// console.log(x,y,z);
				word.style.transform = "translate3d("  + (x * delta) + "px, " + (y * delta) + "px, " + (z * delta) + "px)";
				//console.log(x,y,z);
		});

	});


	//console.log(timestamp, HOMECOMING_START + HOMECOMING_DURATION);
	if (STATE === "HOMECOMING" && timestamp >= HOMECOMING_START + HOMECOMING_DURATION) {
		window.setTimeout(function() {
			STATE = "NORMAL";
			console.log("setting back to NORMAL");
		}, 1000);
	}
	//console.log(theta);
	window.requestAnimationFrame(animateOrbits);
}

function easeOut(current, total) {
	//return Math.cos(current/total * Math.PI * 0.5) * total;
	var f = current / total;
	return Math.pow(f, 2) * total;
}
function easeInOut(current, min, max) {
	var f = (current - min) / (max - min);
	var fEased = Math.cos(f*Math.PI + Math.PI)*0.5 + 0.5;
	return fEased * (max - min) + min;
}

function easedRadiusMod() {
	return easeInOut(RADIUS_MODIFIER, RADIUS_MODIFIER_MAX, RADIUS_MODIFIER_MIN);
}
function easedSpeedMod() {
	return easeInOut(SPEED_MODIFIER, SPEED_MODIFIER_MAX, SPEED_MODIFIER_MIN);
}

module.exports = {
	init
}
