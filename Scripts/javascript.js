


// lager objecter
var befolkning;
var sysselsatte;
var utdannede;



//testing getting all the JSON documents with the same function at the start

//creates an array of the identifications for the JSON documents
var indexUrl = ["104857.json", "100145.json", "85432.json"];
for (var i = 0; i < indexUrl.length; i++) {

  var url = "http://wildboy.uib.no/~tpe056/folk/" + indexUrl[i];


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
  let kommune_nummer ="<table><tr><td><b>Kommunenummer</b></td></tr>";
  for(var id in datasett.elementer){
    kommune_nummer += "<tr><td>"+datasett.elementer[id].kommunenummer+"</td></tr>";
  }
    kommune_nummer += "</table>";
  // document.getElementById("oversikt").innerHTML = kommune_nummer;
  return kommune_nummer;
}




//Funksjonen henter navn på kommuner i datasettet
function getNames(){
  //Oppretter tabell for visning av data
  let names = "<table><tr><td><b>Kommunenavn</b></td></tr>";
  for(name in datasett.elementer){
    names+="<tr><td>" + name + "</td></tr>";//Legger elementer i tabell
  }
  names += "</table>";
  // document.getElementById("oversikt").innerHTML = names;
  return names;
}



//Funksjonen returnerer samlet befolkningstall for kvinner og menn
function getBefolkning(){

  var tabell_samlet = [];
  var tabell_kvinner = [];
  var tabell_menn = [];


  let innhold = "<table><b>Befolkning</b>";//tabell for visning av data
  for(var indeks in datasett.elementer){
    tabell_menn.push([datasett.elementer[indeks]["Menn"][2018]]);//Legger til tall for menn
    tabell_kvinner.push([datasett.elementer[indeks]["Kvinner"][2018]]);//Legger til tall for kvinner
  }

  //Legger summen av antall kvinner og menn i en samlet tabell
  for(var i=0; i<tabell_kvinner.length; i++){
    tabell_samlet =  tabell_kvinner[i].shift() + tabell_menn[i].shift();//Summerer første indeks fra hver tabell
    innhold +=  "<tr><td>"+tabell_samlet+"</td></tr>";//samlet befolkningstall 2018
  }
  innhold += "</table>";

  return innhold;
}



	//Funksjonen returnerer en oversikt over kommunenummer, kommunenavn og siste befolkningstall(2018)
	function getOversikt(){

		let innhold = "<table style=width:50%><b>Siste måling av total befolkning - 2018</b><br><br>";
			innhold+= "<tr><td>"+getIDs() + "</td><td>"+getNames() + "</td><td>"+ getBefolkning()+"</td></tr>"

		    document.getElementById("oversikt").innerHTML = innhold;

            return innhold;
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
