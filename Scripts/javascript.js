


// lager objecter
var befolkning;
var sysselsatte;
var utdannede;



//testing getting all the JSON documents with the same function at the start

//creates an array of the identifications for the JSON documents
var indexUrl = ["104857.json", "100145.json", "85432.json"];
    for (var i = 0; i < indexUrl.length; i++) {

    var url = "http://wildboy.uib.no/~tpe056/folk/" + indexUrl[i];
        let request = new XMLHttpRequest();

        //kjører alle requestene individuelt og ikke sequensially
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



  //Funksjonen returnerer listen av alle kommunenummerene.
  function getIDs(){

	    //Oppretter tabell for visning av data
		var kommune_nummer ="<table><tr><td><b>Kommunenummer</b></td></tr>";

		//Legger elementer i tabell
		for(var id in datasett.elementer){
			 kommune_nummer += "<tr><td>"+datasett.elementer[id].kommunenummer+"</td></tr>";
		}
		kommune_nummer += "</table>";

	   // document.getElementById("info").innerHTML = kommune_nummer;
	    return kommune_nummer;
	}




  //Funksjonen henter navn på kommuner i datasettet
 	function getNames(){
       //Oppretter tabell for visning av data
 		var names = "<table><tr><td><b>Kommunenavn</b></td></tr>";
  		for(name in datasett.elementer){
 			names+="<tr><td>" + name + "</td>";//Legger elementer i tabell
 		}
 		 names += "</table>";

  	   // document.getElementById("info").innerHTML = names;
 		return names;
 	}
}



//en test
function test(){
    console.log("test begynner")
    console.log(utdannede);
    console.log(befolkning);
    console.log(sysselsatte);
    console.log("test ferdig")
};
setTimeout(test, 2000);
