
	// creates new Folk objects and runs the load method of thos objects.
	window.onload = function() {
		befolkning = new Folk("http://wildboy.uib.no/%7Etpe056/folk/104857.json");
		sysselsatte = new Folk("http://wildboy.uib.no/%7Etpe056/folk/100145.json");
		utdannede= new Folk("http://wildboy.uib.no/%7Etpe056/folk/85432.json");
		utdannede.load();
		befolkning.load();
		sysselsatte.load();
		befolkning.onload = function() {
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
			return innhold;
		};

		//Henter navn på kommuner i datasettet
		this.getNames = function getNames(){
		 	//Oppretter tabell for visning av data
		    let names = "<table><tr><th>Navn</th></tr>";
			for(let name in this.datasett.elementer){
			   names+="<tr><td>" + name + "</td></tr>";//Legger elementer i tabell
		    }
			names += "</table>";
			document.getElementsByClassName('info')[0].innerHTML = names;
			return names;
	   };


		//Metoden henter alle kommunenavn og kommunenummer.
		this.getIDs = function getIDs(){
			//Oppretter tabell for visning av data
				let kommune_nummer ="<table><tr><th>Kommunenr.</th></tr>";
				for(var id in datasett.datasett.elementer){
					kommune_nummer += "<tr><td>"+datasett.datasett.elementer[id].kommunenummer+"</td></tr>";
				}
				kommune_nummer += "</table>";

			document.getElementsByClassName('info')[0].innerHTML = kommune_nummer;
			return kommune_nummer;
		};

		//denne må returnere befolkningstall for menn og kvinner sparat!!
		//Funksjonen returnerer en oversikt over kommunenummer, kommunenavn og siste befolkningstall(2018)
		this.getOversikt = function getOversikt(){

			let innhold = "<h2>Siste måling av total befolkning (2018)</h2>";
			innhold += "<table id='oversikt_tabell'>";
				innhold += "<tr><td>"+this.getIDs() + "</td>";
				innhold += "<td>"+this.getNames() + "</td>";
				innhold += "<td>"+ this.getBefolkning()+"</td></tr>";
			innhold += '</table>';

			document.getElementById("oversikt").getElementsByClassName("info")[0].innerHTML = innhold;

		};


		//Funksjonen returnerer samlet befolkningstall for kvinner og menn
		this.getBefolkning = function getBefolkning(){

			var tabell_samlet = [];
			var tabell_kvinner = [];
			var tabell_menn = [];


			let innhold = "<table><th>Befolkning</th>";//tabell for visning av data
			for(var indeks in this.datasett.elementer){
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
		};



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


	//Funksjonen henter siste tall for sysselsetting for begge kjønn.
	function sisteSysselsetting(kom_nr){

		let pstBeggeKjonn;// Prosent for begge kjønn
		let antallSysselsatte;//Antall sysselsatte kvinner og menn

		let antall_menn; // antall menn
		let antall_kvinner;//antall kvinner

		let pst_menn; // menn i prosent
		let pst_kvinner; //kvinner i prosent

		let tabell_menn = []; //Tabell for menn
		let tabell_kvinner = [];//Tabell kvinner


		let hentSamletTall18 = befolkningstall(kom_nr);//henter tall for angitt kommune
		let tallSamlet = hentSamletTall18[3]; //Befolkningstall kvinner og menn 2018

		for(var indeks in sysselsatte.datasett.elementer){
			let kommune_nr = sysselsatte.datasett.elementer[indeks].kommunenummer;
				if(kom_nr == kommune_nr){
					tabell_menn.push(sysselsatte.datasett.elementer[indeks]["Menn"]); //Legger til data for alle årstall i tabell(menn)
					tabell_kvinner.push(sysselsatte.datasett.elementer[indeks]["Kvinner"]); //Legger til data for alle årstall i tabell(kvinner)
					pstBeggeKjonn = sysselsatte.datasett.elementer[indeks]["Begge kjønn"][2018];
				}
		}

			let innhold = "<table><th>Menn</th>";//tabell for visning av data

			//Regner ut antall sysselsatte kvinner og menn
			antallSysselsatte = (tallSamlet*pstBeggeKjonn)/ 100;

					return [antallSysselsatte, pstBeggeKjonn, tabell_menn, tabell_kvinner];

			}



	//Funksjonen henter tall for høyre utdanning(lang)
	function sisteHoyereUtdanning(kom_nr){

		let hentTall_17 = befolkningstall(kom_nr);//henter tall for 2017
					let tallMenn = hentTall_17[0]; //befolkning menn 2017
					let tallKvinner = hentTall_17[1]; // befolkning kvinner 2017
					let befolkningTallSamlet = hentTall_17[2]; //befolkning samlet 2017

					let pstKvinner04a;// % kvinner høyre utdanning(lang)
					let pstMenn04a;   // % menn høyre utdanning(lang)
					let pstKvinner03a; // % kvinner høyre utdanning(kort)
					let pstMenn03a; // % menn høyre utdanning(kort)

					let pstKvinnerSamlet; //samlet prosent for kvinner lang+kort
					let pstMennSamlet; // samlet prosent for menn lang+kort

					let tallKvinnerSamlet;//Antall kvinner med høyre utdanning(kort + lang)
					let tallMennSamlet; // Antall menn med høyre utdanning(kort + lang)

					let pstKvinnerOgMenn;//Samlet prosent for kvinner og menn.

					for(var indeks in utdannede.datasett.elementer){
					let kommune_nr = utdannede.datasett.elementer[indeks].kommunenummer;

					 if(kom_nr == kommune_nr){
					  pstMenn03a = utdannede.datasett.elementer[indeks]["03a"]["Menn"][2017];
					  pstKvinner03a =  utdannede.datasett.elementer[indeks]["03a"]["Kvinner"][2017];
					  pstMenn04a = utdannede.datasett.elementer[indeks]["04a"]["Menn"][2017];
					  pstKvinner04a = utdannede.datasett.elementer[indeks]["04a"]["Kvinner"][2017];

					 pstMennSamlet = pstMenn03a + pstMenn04a; //Samlet prosent menn for høyere utdanning (lang og kort)
					 pstKvinnerSamlet = pstKvinner03a + pstKvinner04a; //Samlet prosent kvinner for høyere utdanning (lang og kort)
					}
					}
					//Regner ut antall kvinner med høyere utdanning(kort + lang)
					tallKvinnerSamlet = (tallKvinner*pstKvinnerSamlet);

					//Regner ut antall menn med høyere utdanning(kort + lang)
					tallMennSamlet = (tallMenn*pstMennSamlet);

					//Regner ut samlet prosent for kvinner og menn med høyere utdanning
					pstKvinnerOgMenn = ((tallKvinnerSamlet + tallMennSamlet)/(tallKvinner+tallMenn));

					//Regner ut hvor mange som er i høyere utdanning ved å gange befokningnen med et prosent
					tallSamlet = (befolkningTallSamlet * (pstKvinnerOgMenn/100));

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

		for(var indeks in befolkning.datasett.elementer){
				let kommune_nr = befolkning.datasett.elementer[indeks].kommunenummer;

				//Finner riktig kommune og legger til tall
			if(kom_nr == kommune_nr){
				tallMenn18 = befolkning.datasett.elementer[indeks]["Menn"][2018];
				tallKvinner18 = befolkning.datasett.elementer[indeks]["Kvinner"][2018];

				tall_menn17 = befolkning.datasett.elementer[indeks]["Menn"][2017];
				tall_kvinner17 = befolkning.datasett.elementer[indeks]["Kvinner"][2017];
			}
		}

		samletTall17 = tall_menn17 + tall_kvinner17;//Kvinner og menn samlet tall 2017
		samletTall18 = tallMenn18 + tallKvinner18;//Kvinner og menn samlet tall 2018

		return [tall_menn17, tall_kvinner17, samletTall17, samletTall18];
		}





	/*
	Oppgave 1.1:"detaljer"
	Funksjonen returnerer kommunens navn, kommunenummer, siste målte befolkning,
	siste målte statistikk for sysselsetting og høyere utdanning (antall og prosent) for angitt kommunenummer.
	Metoden er ikke helt ferdig!.
	*/
	function getDetaljer(kom_nr){

		var kom_nr = document.getElementById("kom_nr").value; //henter ut verdien fra inputfeltet


		//Lager en liste med innhold
		let innhold = '<ul id="kom_detaljer">';

		let sysselsetting = sisteSysselsetting(kom_nr);
		let tallSysselsatte = sysselsetting[0]; //tall for begge kjønn
		let pstBeggeKjonn = sysselsetting[1]; //prosent for begge kjønn

		let hoyereUtdanning = sisteHoyereUtdanning(kom_nr);
		let pstKvinnerOgMenn = hoyereUtdanning[4];
		let tallSamlet = hoyereUtdanning[5];


		let hentTall = befolkningstall(kom_nr);//hent befolkningstall 2018 for angitt kommune
		let befolkning_2018 = hentTall[3]; // henter ut tall fra tabell(array)
		let pstKvinnerOgMenn_rounded = Math.round(pstKvinnerOgMenn);

		//do some math for å runde av desimaler.
		tallSysselsatte = Math.round(tallSysselsatte);
		tallSamlet = Math.round(tallSamlet);


		for(var indeks in utdannede.datasett.elementer){
			let kom_nummer = utdannede.datasett.elementer[indeks].kommunenummer;

			//Sammenligner kommunenr.
			if(kom_nr === kom_nummer){
				//Legger til detaljert data som list items
				innhold += "<li><h3>Kommune: "+indeks+ ", Nummer: "+kom_nummer + "</h3></li>";
				innhold += "<li>Befolknings tall 2018: "+befolkning_2018 + "</li>";
				innhold += "<li>Antall mennesker som er sysselsatt totaltt: " +tallSysselsatte + "</li>";
				innhold += "<li>Prosent av begge kjønn som er sysselsatt: "+ pstBeggeKjonn+ "%" + "</li>";
				innhold += "<li>Prosent begge kjønn som har/tar høyer utdanning: "+pstKvinnerOgMenn_rounded + "%"  + "</li>";
				innhold += "<li>Det totale anntallet mennekser som tar eller har høyere utdanning: " + tallSamlet + "</li>";

			}

		}

		//Fullfører liste
		innhold += "</ul>";
		document.getElementById("detaljer").getElementsByClassName("info")[0].innerHTML = innhold;
	}


	/**
	 * Oppgave 1.1
	 * Som i detaljer skal dere i utgangspunktet ikke vise noen informasjon her, men brukeren skal kunne
	 * skrive inn to gyldige kommunenummer.Når brukeren skriver inn dette, skal dere vise historisk data
	 * for utvikling av sysselsetting for kjønnskategoriene “Menn” og “Kvinner” i begge kommunene.
	 * For hvert år og for hver kjønnskategori, skal dere markere hvilken av kommunene som har høyest vekst i prosentpoeng.
	 */
	function sammenlign() {

		var kommune_nr1 = document.getElementById("kom_nr1").value; //henter ut verdien fra inputfeltet
		 var kommune_nr2 = document.getElementById("kom_nr2").value; //henter ut verdien fra inputfeltet

	 let mennTabell1 = [];
	 let kvinnerTabell1 = [];

	 let mennTabell2 = [];
	 let kvinnerTabell2 = [];



	  //Lager en liste med innhold
	  let innhold = "<table style=width:100%><th>Sammenligning</th>";

	 //Henter data for valgt kommune nr.1
	 var hentTabell1 = sisteSysselsetting(kommune_nr1);
	 mennTabell1 = hentTabell1[2];
	 kvinnerTabell1 = hentTabell1[3];


	 //Henter data for valgt kommune nr.2
	 var hentTabell2 = sisteSysselsetting(kommune_nr2);
	 mennTabell2 = hentTabell2[2];
	 kvinnerTabell2 = hentTabell2[3];

	 for(let i=0; i<mennTabell1.length; i++){

		 innhold += "<tr><td>Kommune: "+kommune_nr1+"</td><td>Kommune: "+kommune_nr2+"</td></tr>"
					 +"<tr><td>Menn</td><td>Kvinner</td><td>Menn</td><td>Kvinner</td><td>prosentpoeng</td></tr>"
					 +"<tr><td>"+mennTabell1[i]+"</td><td>"+kvinnerTabell1[i]+"</td>"
					 +"<td>"+mennTabell2[i]+"</td><td>"+kvinnerTabell2[i]+"</td></tr>";

		 }
		 //Fullfører liste
	 innhold += "</table>";

	 document.getElementById("sammenligning").getElementsByClassName("info")[0].innerHTML = innhold;
	}


	//Funksjoner for å vise og skjule divs og kjøre noen av funksjonene
	function introfunk() {
		document.getElementById("introduksjon").className = "show";
		document.getElementById("oversikt").className = "hidden";
		document.getElementById("detaljer").className = "hidden";
		document.getElementById("sammenligning").className = "hidden";
	};

	function oversiktfunk() {
		document.getElementById("introduksjon").className = "hidden";
		document.getElementById("oversikt").className = "show";
		document.getElementById("detaljer").className = "hidden";
		document.getElementById("sammenligning").className = "hidden";
	    befolkning.getOversikt();
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
		sammenlign();
	};
