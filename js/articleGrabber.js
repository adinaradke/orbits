const nasaURLS = [
  "https://www.nasa.gov/feature/does-new-horizons-next-target-have-a-moon/index.html"
];

const cheerio = require('cheerio');
const request = require('request');

function grab(url, targetElement) {
  request({ encoding: 'utf8', method: "GET", uri: url},
    function(error, response, html){
      console.log(response);
      console.log(html);
      if(!error){
        var $ = cheerio.load(html);

      }
  });
}

module.exports = {
  grab
}
