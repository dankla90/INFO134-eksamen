//testing getting all the JSON documents with the same function at the start

//creates an array of the identifications for the JSON documents
var indexUrl = ["104857.json", "100145.json", "85432.json"];
    for (var i = 0; i < indexUrl.length; i++) {
     
    var url = "http://wildboy.uib.no/~tpe056/folk/" + indexUrl[i];
      
        let request = new XMLHttpRequest(); 
        request.onreadystatechange = function() {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                var content = this.responseText;
                var data = JSON.parse(content);
                console.log(data);
                lagre_data(data);
            }
        }
    request.open("GET", url);
    request.send();
}



// lager objecter
var befolkning;
var sysselsatte;
var utdannede;

//en test
function test(){
    console.log("test begynner")
    console.log(utdannede);
    console.log(befolkning);
    console.log(sysselsatte);
    console.log("test ferdig")
};
setTimeout(test, 2000);


//lagrer Parsed JSON data på det tilsvarende objectet
function lagre_data(data){
    if(data.datasett.opphav == "http://data.ssb.no/api/v0/dataset/85432?lang=no"){
        utdannede = data;
        console.log("works");
    } else if(data.datasett.opphav == "http://data.ssb.no/api/v0/dataset/104857?lang=no") {
        befolkning = data;
    } else {
        sysselsatte = data;
    };
    console.log("works");
    console.log(utdannede);
}	
