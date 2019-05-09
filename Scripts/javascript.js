
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


/*Konstruktøren virker som grensesnitt mot hvert datasett*/ //class delen var bare for å teste noe
function Folk(url) {


	this.onload = null;


	var data = this;
	var datasett = {};
	datasett = data;

	this.targetUrl = url;


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

		let pstBeggeKjonn;
		let tallForBegge;

		var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

		let tallSamlet = oversiktKommune(kom_nr);
	

		for(var indeks in datasett.elementer){
		  let kommune_nr = datasett.elementer[indeks].kommunenummer;
		  if(kom_nr == kommune_nr){
		      pstBeggeKjonn = datasett.elementer[indeks]["Begge kjønn"][2018];
		  }
		}
		  tallForBegge = (tallSamlet*pstBeggeKjonn) / 100;
			//document.getElementById("info").innerHTML = "Tall: "+ tallBeggeKjonn + "Prosent: "+pstBeggeKjonn+" %" + ", Samlet: "+tallSamlet;
			return [tallForBegge, pstBeggeKjonn];
}



//Funksjonen returnerer befolkningstall for kvinner og menn for 2017 for angitt kommune.
	function getBefolkningsTall17(kom_nr){

	var kom_nr = document.getElementById("kom_nr").value;
			let befolkning_kvinner;//Befolkning for 2017
			let befolkning_menn; // Befolkning for 2017
			let befolkning_samlet; // samlet befolkning for 2017

			for(let indeks in datasett.elementer){
				let kommune_nr = datasett.elementer[indeks].kommunenummer;
					if(kom_nr == kommune_nr){
					befolkning_menn = datasett.elementer[indeks]["Menn"][2017];
					befolkning_kvinner = datasett.elementer[indeks]["Kvinner"][2017];
					befolkning_samlet = befolkning_menn + befolkning_kvinner;
					}
			}
			return [befolkning_menn, befolkning_kvinner, befolkning_samlet];
	}




//Funksjonen henter tall for høyre utdanning(lang)
function sisteHoyereUtdanning(){
	var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet

				let hentTall2017 = getBefolkningsTall17(kom_nr);//henter tall for 2017
				let tallMenn = hentTall2017[0]; //befolkning menn 2017
				let tallKvinner = hentTall2017[1]; // befolkning kvinner 2017
				let tallSamlet = hentTall2017[2]; //befolkning samlet 2017

				let pstKvinner04a;// % kvinner høyre utdanning(lang)
				let pstMenn04a;   // % menn høyre utdanning(lang)
				let pstKvinner03a; // % kvinner høyre utdanning(kort)
				let pstMenn03a; // % menn høyre utdanning(kort)

				let pstKvinnerSamlet; //samlet prosent for kvinner lang+kort
				let pstMennSamlet; // samlet prosent for menn lang+kort

				let tallKvinnerSamlet;//Antall kvinner med høyre utdanning(kort + lang)
				let tallMennSamlet; // Antall menn med høyre utdanning(kort + lang)


				let pstKvinnerOgMenn;//Samlet prosent for kvinner og menn.

				for(var indeks in datasett.elementer){
				  pstKvinner04a = datasett.elementer[indeks]["04a"]["Kvinner"][2017];
				  pstMenn04a = datasett.elementer[indeks]["04a"]["Menn"][2017];
				  pstKvinner03a =  datasett.elementer[indeks]["03a"]["Kvinner"][2017];
				  pstMenn03a = datasett.elementer[indeks]["03a"]["Menn"][2017];

				 pstKvinnerSamlet = pstKvinner04a + pstKvinner03a; //Samlet prosent kvinner for høyere utdanning (lang og kort)
				 pstMennSamlet = pstMenn04a + pstMenn03a; //Samlet prosent menn for høyere utdanning (lang og kort)
				}

				//Regner ut antall kvinner med høyere utdanning
				tallKvinnerSamlet = (tallKvinner*pstKvinnerSamlet) / 100;

				//Regner ut antall menn med høyere utdanning
				tallMennSamlet = (tallMenn*pstMennSamlet) / 100;

				//Regner ut samlet prosent for kvinner og menn
				pstKvinnerOgMenn = ((tallKvinnerSamlet + tallMennSamlet)/(tallKvinner+tallMenn)) * 100;

				return [pstMennSamlet, tallMennSamlet, pstKvinnerSamlet, tallKvinnerSamlet, pstKvinnerOgMenn, tallSamlet];

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
	for(var indeks in datasett.datasett.elementer){
		let kom_nummer = datasett.elementer[indeks].kommunenummer;

		//Sammenligner kommunenr.
		if(kommune_nr == kom_nummer){
			innhold = "Kommune: "+kom_nummer+ ", "+indeks +" - befolkning: "+ oversiktKommune(kommune_nr)+", sysselsetting: "
			+ sisteSysselsetting() + ", Høyere utdanning: "+sisteHoyereUtdanning();
		}
	}
	document.getElementsByClassName('show')[0].innerHTML = innhold;
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
	befolkning.getNames();
	befolkning.onload();
		
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
