const orbitAnimator = require('./orbitAnimation.js');
const clouds = require('./clouds.js');
const articleGrabber = require('./articleGrabber.js');

window.orbitAnimator = orbitAnimator.init;
window.setOrbitState = orbitAnimator.setState;
window.clouds = clouds;
