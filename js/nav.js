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