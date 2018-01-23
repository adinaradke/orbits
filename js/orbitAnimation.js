
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
var RADIUS_MODIFIER_INC= 0.005; //higher = more speed
var SPEED_MODIFIER = 1;
var SPEED_MODIFIER_MIN = 1;
var SPEED_MODIFIER_MAX = 5; //higher = end state
var SPEED_MODIFIER_INC= 0.04; //higher = more speed
var DEBUG_VIEW = true;
var ELLIPSE_WIDTH_DEFAULT = 0.8;
var ELLIPSE_PROPORTION = 0.4;

var options = [
	// {
	// 	id: "satelliteTest",
	// 	duration: "30", //in seconds
	// 	ellipseWidthFactor: 0.8,
	// 	ellipseProportion: ELLIPSE_PROPORTION,
	// 	startAngle: 270 //in degrees! [0°, 360°]
	// },
	{
		id: "navitem--sub--1",
		duration: "10", //in seconds
		ellipseWidthFactor: 0.75,
		ellipseProportion: 0.3,
		startAngle: 20 //in degrees! [0°, 360°]
	},
	{
		id: "navitem--sub--2",
		duration: "30", //in seconds
		ellipseWidthFactor: 0.85,
		ellipseProportion: 0.3,
		startAngle: 270 //in degrees! [0°, 360°]
	}
]

function getParentCenter(element) {
	var parentBoundingRect = element.parentNode.getBoundingClientRect();
	var centerX = parentBoundingRect.left + parentBoundingRect.width * 0.5;
	var centerY = parentBoundingRect.top + parentBoundingRect.height * 0.5;
	//console.log(centerX, centerY);
	return {x: centerX, y: centerY};
}
function getParentSize(element) {
	var parentBoundingRect = element.parentNode.getBoundingClientRect();
	var w = parentBoundingRect.width;
	var h = parentBoundingRect.height;
	//console.log(centerX, centerY);
	return {width: w, height: h};
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
function init() {

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

	options.forEach(function(option) {
		var satellite = document.getElementById(option.id);
		if (!satellite) {
			return;
		}
		var satBoundingRect = satellite.getBoundingClientRect();

		var container = satellite.parentNode;
		var center = getParentCenter(satellite);
		var containerSize = getParentSize(satellite);

		//var startX = satBoundingRect.left + satBoundingRect.width * 0.5;
		//var startY = satBoundingRect.top + satBoundingRect.height * 0.5;
		var startX = satBoundingRect.left;
		var startY = satBoundingRect.top;

		//console.log(center.x, center.y);
		//var dx = startX - center.x;
		//var dy = startY - center.y;

		//var startAngle = Math.atan2(dy / option.ellipseFactor, dx);
		//var radiusB = dy / Math.sin(startAngle);
		//var radiusA = dx / Math.cos(startAngle);

		var ellipseWidthFactor = option.ellipseWidthFactor || ELLIPSE_WIDTH_DEFAULT;
		//var ellipseHeightFactor = option.ellipseHeightFactor || ELLIPSE_HEIGHT_DEFAULT;
		var ellipseProportion = option.ellipseProportion || ELLIPSE_PROPORTION;


		var radiusA = containerSize.width * 0.5 * ellipseWidthFactor;
		var radiusB = radiusA * ellipseProportion;
		var angularSpeed = TWO_PI / option.duration / 1000.0;

		//option.startAngle = startAngle % TWO_PI;
		option.radiusA = radiusA;
		option.radiusB = radiusB;
		option.angularSpeed = angularSpeed;
		option.startAngle = (option.startAngle || 0) / 180.0 * Math.PI;
		option.currentAngle = option.startAngle;

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
		var element = document.getElementById(opt.id);
		var center = getParentCenter(element);
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
				console.log(deltaTime);
			break;
		}
		var x = center.x + Math.cos(opt.currentAngle) * opt.radiusA * easedRadiusMod();
		var y = center.y + Math.sin(opt.currentAngle) * opt.radiusB * easedRadiusMod();

		var offsets = element.getBoundingClientRect();
		// element.style.left = (x - offsets.width * 0.5) + 'px';
		// element.style.top = (y - offsets.height * 0.5) + 'px';
		element.style.left = x + 'px';
		element.style.top = y + 'px';
		element.style.zIndex = Math.floor(Math.sin(opt.currentAngle) * 100);
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
