const orbitAnimator = require('./orbitAnimation.js');
const articleGrabber = require('./articleGrabber.js');

window.addEventListener('load', function() {
  orbitAnimator.init();
  // articleGrabber.grab("https://www.nasa.gov/feature/does-new-horizons-next-target-have-a-moon/index.html");
});
