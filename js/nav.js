const $ = require('jquery');

// main anvigation
$(document).ready(function(){
    $(".navOne").click(function(){
        $(".revealOne").toggle();
        $(".revealTwo").hide();
        $(".revealThree").hide();
        $(".revealFour").hide();
        });
      });

    $(document).ready(function(){
    $(".navTwo").click(function(){
        $(".revealTwo").toggle();
        $(".revealOne").hide();
        $(".revealThree").hide();
        $(".revealFour").hide();
        });
      });

    $(document).ready(function(){
    $(".navThree").click(function(){
        $(".revealThree").toggle();
        $(".revealOne").hide();
        $(".revealTwo").hide();
        $(".revealFour").hide();
        });
      });

    $(document).ready(function(){
    $(".navFour").click(function(){
        $(".revealFour").toggle();
        $(".revealOne").hide();
        $(".revealTwo").hide();
        $(".revealThree").hide();
        });
      });


// navigating through articles

var articleIndex = 0;

function plusArticles(n) {
    showArticles(articleIndex + n);
}

function currentArticle(n) {
    showArticles(n);
}

function showArticles(nextArticleIndex) {
    var articles = document.getElementsByClassName("section");
    while (nextArticleIndex < 0) {
      nextArticleIndex += articles.length;
    }
    articleIndex = nextArticleIndex % articles.length;
    /*
    if (n > articles.length) {
      articleIndex = 1;
    }
    if (n < 1) {
      articleIndex = articles.length;
    }
    */
    //console.log(articles);
    //console.log(articleIndex);
    //console.log(articles[0]);
    for (var i = 0; i < articles.length; i++) {
        articles[i].style.display = "none";
    }
    //part for background switch
    var bgPath = articles[articleIndex].getAttribute("data-bg-path");
    if (bgPath == null) {
      bgPath = "img/17-04341_agu_meeting2017_binarykbo-4_5mb_duotone.png";
    }
    var bgElement = document.querySelector("figure.cover img.background");
    bgElement.setAttribute("src", bgPath);
    //console.log(bgElement);
    articles[articleIndex].style.display = "block";
  }

  module.exports = {
    plusArticles,
    currentArticle,
    showArticles
  }
