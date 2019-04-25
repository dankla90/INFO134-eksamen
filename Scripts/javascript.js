console.log("test if test");

function startProgram() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://wildboy.uib.no/~tpe056/folk/104857.json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Type", xhr.getResponseHeader("Content-Type"));
            console.log("Text", xhr.responseText);
        }
    };
    xhr.send();
}


window.onload = startProgram;


//testing getting all the JSON documents with the same function at the start

//creates an array of the identifications for the JSON documents
var index = ["104857.json", "100145.json", "85432.json"];

for (var i = 0; i < index.length; i++) {

    var url = "http://wildboy.uib.no/~tpe056/folk/" + index[i];

    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            var data = JSON.parse(request.responseText);
            console.log(data);
        }
    }
    request.send();
}
