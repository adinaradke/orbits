const orbitAnimator = require('./orbitAnimation.js');
const clouds = require('./clouds.js');
const articleGrabber = require('./articleGrabber.js');
const nav = require('./nav.js');

window.orbitAnimator = orbitAnimator.init;
window.setOrbitState = orbitAnimator.setState;
window.clouds = clouds;
window.currentArticle = nav.currentArticle;
window.plusArticles = nav.plusArticles;
window.showArticles = nav.showArticles;
