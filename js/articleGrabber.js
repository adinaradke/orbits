
var myHeaders = new Headers({'Content-Type': 'text/plain'});
var myInit = { method: 'get',
               headers: myHeaders,
               mode: 'no-cors',
               cache: 'default',
               credentials: 'omit',
               redirect: 'follow',
               referrer: "no-referrer" };

function grabArticle(url, targetElementId) {
  fetch(url, myInit).then(function(responseObj) {
    console.log('status: ', responseObj.status);
    return responseObj;
  }).then(function(responseText) {
    // var objectURL = URL.createObjectURL(myBlob);
    // myImage.src = objectURL;
    console.log("response", responseText);
  });
}

grabArticle("https://www.nasa.gov/feature/does-new-horizons-next-target-have-a-moon/index.html", "grabTest");

/*
fetch('https://davidwalsh.name/demo/arsenal.json', myInit).then(function(response) {
  // Convert to JSON
  return response.json();
}).then(function(j) {
  // Yay, `j` is a JavaScript object
  console.log(j);
});
*/

/*
function httpGet(theUrl)
{
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);
            return xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();
}
*/
