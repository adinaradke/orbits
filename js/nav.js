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

var articleIndex = 1;
showArticles(articleIndex);

function plusArticles(n) {
    showArticles(articleIndex += n);
}

function currentArticle(n) {
    showArticles(articleIndex = n);
}

function showArticles(n) {
    var i;
    var articles = document.getElementsByClassName("section");
    if (n > articles.length) {articleIndex = 1}    
    if (n < 1) {articleIndex = articles.length}
    for (i = 0; i < articles.length; i++) {
        articles[i].style.display = "none"; 
    }
    
    articles[articleIndex-1].style.display = "block"; 
  }



