




function lastNedJsons(){
	befolkning = new Folk("http://wildboy.uib.no/%7Etpe056/folk/85432.json");
	sysselsatte = new Folk("http://wildboy.uib.no/%7Etpe056/folk/100145.json");
	utdannede= new Folk("http://wildboy.uib.no/%7Etpe056/folk/104857.json");
};


/*Konstruktøren virker som grensesnitt mot hvert datasett*/
class Folk {
	constructor(url) {
		this.url = url;
		this.getInfo = function () { getInfo(); };
		this.getNames = function () { getNames(); };
		this.getIDs = function () { getIDs(); };
		this.load = function () { load(url); };
	}
}





//testing getting all the JSON documents with the same function at the start
//creates an array of the identifications for the JSON documents
function load(url)
{
	//kjører alle requestene individuelt og ikke sequensially
	let request = new XMLHttpRequest();
	request.open("GET", url);
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			var content = this.responseText;
			var data = JSON.parse(content);
		}
	};
	request.send();
	
}


/*

//lagrer Parsed JSON data på det tilsvarende objectet
function lagre_data(data, url){
	this.test = url;
	if(test == "http://wildboy.uib.no/~tpe056/folk/85432.json"){
	  utdannede = data;
	  console.log("utdannede er lagret");
	} else if(test == "http://wildboy.uib.no/~tpe056/folk/104857.json") {
	  befolkning = data;
	  console.log("befolkning er lagret");
	} else if (test == "http://wildboy.uib.no/~tpe056/folk/100145.json"){
	  sysselsatte = data;
	  console.log("sysselsatte er lagret");
	};
	console.log("lagra data blir kjørt works");
  }
*/


//Funksjonen returnerer listen av alle kommunenummerene.
function getIDs(){
	//Oppretter tabell for visning av data
	let kommune_nummer ="<table><tr><td><b>Kommunenr.</b></td></tr>";
	for(var id in this.elementer){
		kommune_nummer += "<tr><td>"+this.elementer[id].kommunenummer+"</td></tr>";
	}
	kommune_nummer += "</table>";
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
}


//Funksjonen henter informasjon for angitte kommunenummer.
function getInfo(kommune_nr){

	var innhold;
	var kommune_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

	for(var indeks in datasett.elementer){
		let kom_nummer = datasett.elementer[indeks].kommunenummer;

		//Sammenligner kommunenr.
		if(kommune_nr == kom_nummer){
			//Henter informasjon fra kommune
			innhold += indeks+"<tr><td> kommune</td></tr>"+"<tr><td>"+JSON.stringify(datasett.elementer[indeks])+"</td></tr>";
		}
	}
	console.log(innhold);
	return innhold;
}



//Funksjonen henter siste tall for sysselsetting for begge kjønn.
function sisteSysselsetting(){

	let beggeKjonn;
	var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

	for(var indeks in datasett.elementer){
		let kommune_nr = datasett.elementer[indeks].kommunenummer;
		if(kom_nr == kommune_nr){
			beggeKjonn = datasett.elementer[indeks]["Begge kjønn"][2018];
		}
	}
	//document.getElementById("detaljer").innerHTML = beggeKjonn+"%";
	return beggeKjonn+" %";
}




//Funksjonen henter tall for høyre utdanning(lang)
function sisteHoyereUtdanning(){

	var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

	let tall_kvinner;
	let tall_menn;
	let samlet_tall;

	for(var indeks in datasett.elementer){
		let kommune_nr = datasett.elementer[indeks].kommunenummer;
		if(kom_nr == kommune_nr){
			tall_menn = datasett.elementer[indeks]["04a"].Menn[2017];
			tall_kvinner = datasett.elementer[indeks]["04a"].Kvinner[2017];
			samlet_tall = tall_menn + tall_kvinner;
		}
	}
	return samlet_tall;
}



//Funksjonen returnerer befolkningstall for angitt kommunenummer.
function oversiktKommune(kom_nr){

	let tallMenn;
	let tallKvinner;
	let innhold;

	for(var indeks in datasett.elementer){
		let kommune_nr = datasett.elementer[indeks].kommunenummer;

		if(kom_nr == kommune_nr){

			tallMenn = datasett.elementer[indeks]["Menn"][2018];
			tallKvinner = datasett.elementer[indeks]["Kvinner"][2018];
		}
	}
	innhold = tallMenn + tallKvinner;//Legger sammen tall for kvinner og menn
	return innhold;
}




/*
Oppgave 1.1:"detaljer"
Funksjonen returnerer kommunens navn, kommunenummer, siste målte befolkning,
siste målte statistikk for sysselsetting og høyere utdanning (antall og prosent) for angitt kommunenummer.
Metoden er ikke helt ferdig!.
*/
function getDetaljer(){

	let innhold;

	var kommune_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet
	for(var indeks in datasett.elementer){
		let kom_nummer = datasett.elementer[indeks].kommunenummer;

		//Sammenligner kommunenr.
		if(kommune_nr == kom_nummer){
			innhold = "Kommune: "+kom_nummer+ ", "+indeks +" - befolkning: "+ oversiktKommune(kommune_nr)+", sysselsetting: "
			+ sisteSysselsetting() + ", Høyere utdanning: "+sisteHoyereUtdanning();
		}
	}
	document.getElementById("detaljer").innerHTML = innhold;
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

//Vise og skjule divs

function introfunk() {
	document.getElementById("introduksjon").className = "show";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "hidden";
	lastNedJsons();
};

function oversiktfunk() {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "show";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "hidden";
	getIDs(utdannede);
	console.log(utdannede.getIDs())
};

function detaljfunk () {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "show";
	document.getElementById("sammenligning").className = "hidden";
};

function sammenfunk() {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "show";
}
