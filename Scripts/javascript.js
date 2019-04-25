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

//Test
