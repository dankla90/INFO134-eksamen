


// creates new Folk objects and runs the load method of thos objects.
window.onload = function() {
	befolkning = new Folk("http://wildboy.uib.no/%7Etpe056/folk/104857.json");
	sysselsatte = new Folk("http://wildboy.uib.no/%7Etpe056/folk/100145.json");
	utdannede= new Folk("http://wildboy.uib.no/%7Etpe056/folk/85432.json");
	utdannede.load();
	befolkning.load();
	sysselsatte.load();
	befolkning.onload = function() {
		console.log("onload kjører");
	};
};


//Konstruktøren virker som grensesnitt mot hvert datasett
function Folk(url) {

 	//lager onload men setter den til null slik oppgaven ber om
	this.onload = null;

	//dette er for å lagre den parsede JSON dataen som datasett, og unngå this problematikk.
	var data = this;
	var datasett = {};
	datasett = data;


	//Funksjonen henter informasjon for angitte kommunenummer.
	this.getInfo = function getInfo(kommune_nr){

		var innhold;
		var kommune_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

		for(var indeks in datasett.datasett.elementer){
			let kom_nummer = datasett.datasett.elementer[indeks].kommunenummer;

			//Sammenligner kommunenr.
			if(kommune_nr == kom_nummer){
				//Henter informasjon fra kommune
				innhold += indeks+"<tr><td> kommune</td></tr>"+"<tr><td>"+JSON.stringify(datasett.elementer[indeks])+"</td></tr>";
			}
		}
		console.log(innhold);
		return innhold;
	}
	//Henter navn på kommuner i datasettet
	this.getNames = function getNames(){
		console.log("getnames kjører");
	 	//Oppretter tabell for visning av data
	    let names = "<table><tr><td><b>Navn</b></td></tr>";
		for(let name in this.datasett.elementer){
		   names+="<tr><td>" + name + "</td></tr>";//Legger elementer i tabell
		   console.log("itererergetNames");
	    }
		names += "</table>";

		document.getElementsByClassName('show')[0].innerHTML = names;
	  	 return names;
   }


	//Metoden henter alle kommunenavn og kommunenummer.
	this.getIDs = function getIDs(){
		//Oppretter tabell for visning av data
			let kommune_nummer ="<table><tr><td><b>Kommunenr.</b></td></tr>";
			for(var id in datasett.datasett.elementer){
				console.log("iterererDet ID");
				kommune_nummer += "<tr><td>"+datasett.datasett.elementer[id].kommunenummer+"</td></tr>";
			}
			kommune_nummer += "</table>";
			document.getElementsByClassName('show')[0].innerHTML = kommune_nummer;
			return kommune_nummer;
	}

	//Funksjonen returnerer en oversikt over kommunenummer, kommunenavn og siste befolkningstall(2018)
	this.getOversikt = function getOversikt(){

		let innhold = "<table style=width:50%><b>Siste måling av total befolkning - 2018</b><br><br>";
		innhold+= "<tr><td>"+this.getIDs() + "</td><td>"+this.getNames() + "</td><td>"+ this.getBefolkning()+"</td></tr>"

		document.getElementsByClassName("show")[0].innerHTML = innhold;
	}


	//Funksjonen returnerer samlet befolkningstall for kvinner og menn
	this.getBefolkning = function getBefolkning(){

		var tabell_samlet = [];
		var tabell_kvinner = [];
		var tabell_menn = [];


		let innhold = "<table><b>Befolkning</b>";//tabell for visning av data
		for(var indeks in datasett.datasett.elementer){
			tabell_menn.push([this.datasett.elementer[indeks]["Menn"][2018]]);//Legger til tall for menn
			tabell_kvinner.push([this.datasett.elementer[indeks]["Kvinner"][2018]]);//Legger til tall for kvinner
		}

		//Legger summen av antall kvinner og menn i en samlet tabell
		for(var i=0; i<tabell_kvinner.length; i++){
			tabell_samlet =  tabell_kvinner[i].shift() + tabell_menn[i].shift();//Summerer første indeks fra hver tabell
			innhold +=  "<tr><td>"+tabell_samlet+"</td></tr>";//samlet befolkningstall 2018
		}
		innhold += "</table>";

		return innhold;
	}







	this.load = function load() {

		let xhttp = new XMLHttpRequest();
		xhttp.open('GET', url);
		xhttp.onreadystatechange = function () {

			if (xhttp.readyState === 4 && xhttp.status === 200) {
				info = JSON.parse(this.responseText);
				data.datasett = info;
				if (this.onload){
					this.onload();
				};
			}
		};
		xhttp.send();
	};

}





//endret til this for å se om det funket, men må laste ned JSON dokumentene og fylle objectene først
//Funksjonen returnerer listen av alle kommunenummerene.






//Funksjonen henter siste tall for sysselsetting for begge kjønn.
function sisteSysselsetting(){

	 let pstBeggeKjonn;// Prosent for begge kjønn
		let antallSysselsatte;//Antall sysselsatte kvinner og menn

		let hentSamletTall18 = befolkningstall(kom_nr);//henter tall for angitt kommune
		let tallSamlet = hentSamletTall18[3]; //Befolkningstall kvinner og menn 2018

		for(var indeks in sysselsatte.datasett.elementer){
		  let kommune_nr = sysselsatte.datasett.elementer[indeks].kommunenummer;
		    if(kom_nr == kommune_nr){
		      pstBeggeKjonn = sysselsatte.datasett.elementer[indeks]["Begge kjønn"][2018];
		    }
		}
		  //Regner ut antall sysselsatte kvinner og menn
		  antallSysselsatte = (tallSamlet*pstBeggeKjonn) / 100;

		 // return [antallSysselsatte, pstBeggeKjonn];
		  console.log("Hei");
		  		document.getElementsByClassName("show")[0].innerHTML = antallSysselsatte + pstBeggeKjonn;
		  		console.log(antallSysselsatte);

					console.log("HALLO");

}



//Funksjonen henter tall for høyre utdanning(lang)
function sisteHoyereUtdanning(){
	var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

	let hentTall_17 = befolkningstall(kom_nr);//henter tall for 2017
	let tallMenn = hentTall_17[0]; //befolkning menn 2017
	let tallKvinner = hentTall_17[1]; // befolkning kvinner 2017
	let tallSamlet = hentTall_17[2]; //befolkning samlet 2017

	let pstKvinner04a;// % kvinner høyre utdanning(lang)
	let pstMenn04a;   // % menn høyre utdanning(lang)
	let pstKvinner03a; // % kvinner høyre utdanning(kort)
	let pstMenn03a; // % menn høyre utdanning(kort)

	let pstKvinnerSamlet; //samlet prosent for kvinner lang+kort
	let pstMennSamlet; // samlet prosent for menn lang+kort

	let tallKvinnerSamlet;//Antall kvinner med høyre utdanning(kort + lang)
	let tallMennSamlet; // Antall menn med høyre utdanning(kort + lang)

	let pstKvinnerOgMenn;//Samlet prosent for kvinner og menn.

	for(var indeks in datasett.datasett.elementer){
		pstKvinner04a = datasett.datasett.elementer[indeks]["04a"]["Kvinner"][2017];
		pstMenn04a = datasett.datasett.elementer[indeks]["04a"]["Menn"][2017];
		pstKvinner03a =  datasett.datasett.elementer[indeks]["03a"]["Kvinner"][2017];
		pstMenn03a = datasett.datasett.elementer[indeks]["03a"]["Menn"][2017];

	 pstKvinnerSamlet = pstKvinner04a + pstKvinner03a; //Samlet prosent kvinner for høyere utdanning (lang og kort)
	 pstMennSamlet = pstMenn04a + pstMenn03a; //Samlet prosent menn for høyere utdanning (lang og kort)
	}

	//Regner ut antall kvinner med høyere utdanning(kort + lang)
	tallKvinnerSamlet = (tallKvinner*pstKvinnerSamlet) / 100;

	//Regner ut antall menn med høyere utdanning(kort + lang)
	tallMennSamlet = (tallMenn*pstMennSamlet) / 100;

	//Regner ut samlet prosent for kvinner og menn med høyere utdanning
	pstKvinnerOgMenn = ((tallKvinnerSamlet + tallMennSamlet)/(tallKvinner+tallMenn)) * 100;

	return [pstMennSamlet, tallMennSamlet, pstKvinnerSamlet, tallKvinnerSamlet, pstKvinnerOgMenn, tallSamlet];
}



//Funksjonen er en hjelpe funksjon for sisteHoyereUtdanning og sisteSysselsetting funksjonene
//Funksjonen returnerer befolkningstall for angitt kommunenummer for 2017.
function befolkningstall(kom_nr){

		let tallMenn18;// Befolkning menn 2018
		let tallKvinner18;//Befolkning kvinner 2018
		let samletTall18;// samlet befolkning for 2018

		let tall_menn17; // Befolkning menn 2017
		let tall_kvinner17;//Befolkning kvinner 2017
		let samletTall17; // samlet befolkning for 2017

			for(var indeks in datasett.datasett.elementer){
		      let kommune_nr = datasett.datasett.elementer[indeks].kommunenummer;

			     //Finner riktig kommune og legger til tall
				if(kom_nr == kommune_nr){
				  tallMenn18 = datasett.datasett.elementer[indeks]["Menn"][2018];
				  tallKvinner18 = datasett.datasett.elementer[indeks]["Kvinner"][2018];

				  tall_menn17 = datasett.datasett.elementer[indeks]["Menn"][2017];
				  tall_kvinner17 = datasett.datasett.elementer[indeks]["Kvinner"][2017];
				}
			}

	    samletTall17 = befolkning_menn + befolkning_kvinner;//Kvinner og menn samlet tall 2017
		samletTall18 = tallMenn18 + tallKvinner18;//Kvinner og menn samlet tall 2018

	    return [tall_menn17, tall_kvinner17, samletTall17, samletTall18];
}





/*
Oppgave 1.1:"detaljer"
Funksjonen returnerer kommunens navn, kommunenummer, siste målte befolkning,
siste målte statistikk for sysselsetting og høyere utdanning (antall og prosent) for angitt kommunenummer.
Metoden er ikke helt ferdig!.
*/
function getDetaljer(){

	let innhold;
	let sysselsetting = sisteSysselsetting(kom_nr);
	let antallSysselsatte = sysselsetting[0]; //tall for begge kjønn
	let pstBeggeKjonn = sysselsetting[1]; //prosent for begge kjønn

	let hentTall = befolkningstall(kom_nr);//hent befolkningstall 2018 for angitt kommune
	let befolkning_2018 = hentTall[3]; // henter ut tall fra tabell(array)

	//var kommune_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet
	for(var indeks in datasett.datasett.datasett.elementer){
		let kom_nummer = datasett.datasett.elementer[indeks].kommunenummer;

		//Sammenligner kommunenr.
		if(kom_nr == kom_nummer){

			innhold = "Kommune: "+kom_nummer+ ", "+indeks +" - befolkning: "+befolkning_2018+", sysselsetting antall: "
			+antallSysselsatte + ", Begge kjønn: "+ pstBeggeKjonn+", Høyere utdanning: "+sisteHoyereUtdanning();
		}
	}
		document.getElementsByClassName("show")[0].innerHTML = innhold;
}




//en test
function test(){
	console.log("test begynner")
	console.log(utdannede.datasett);
	console.log(befolkning.datasett);
	console.log(sysselsatte.datasett);


	console.log("test ferdig")
};
setTimeout(test, 2000);

//Vise og skjule divs






function introfunk() {
	document.getElementById("introduksjon").className = "show";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "hidden";
	getBefolkningsTall17("0101");
};

function oversiktfunk() {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "show";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "hidden";
	//befolkning.getNames(befolkning);
//	befolkning.getNames();
	//befolkning.onload();
	sisteSysselsetting("0101");
};

function detaljfunk () {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "show";
	document.getElementById("sammenligning").className = "hidden";
	befolkning.getIDs();
};

function sammenfunk() {
	document.getElementById("introduksjon").className = "hidden";
	document.getElementById("oversikt").className = "hidden";
	document.getElementById("detaljer").className = "hidden";
	document.getElementById("sammenligning").className = "show";
	befolkning.getOversikt();

}
