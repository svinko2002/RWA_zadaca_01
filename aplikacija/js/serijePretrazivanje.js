let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	dajSerije(1);
	let trazilica = document.getElementById("trazilica")
	trazilica.addEventListener("keyup", (event) => {
		if(trazilica.value.length >= 3){
			dajSerije(1);
		}
	});
});

async function dajSerije(str) {
	let parametri = { method: "POST" };
	parametri = await dodajToken(parametri);
	// let odgovor = await fetch("/serijePretrazivanje?str=" + str + "&filter=" + dajFilter(),parametri);
	let odgovor = await fetch("/serijePretrazivanje?str=" + str + "&filter=" + dajFilter(),parametri);
	if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		podaci = JSON.parse(podaci);
		prikaziSerije(podaci.results);
		prikaziStranicenje(podaci.page, podaci.total_pages, "dajSerije");
	} else if (odgovor.status == 401) {
		document.getElementById("sadrzaj").innerHTML = "";
		poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
	} else {
		poruka.innerHTML = "Greška u dohvatu serija!";
	}
}

function prikaziSerije(serije) {
	let glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	let gumbi = [];
	tablica +=
		"<tr>"+
		 	"<th>TMDB id</th>" +
		 	"<th>Naslov original</th>" +
		 	"<th>Naslov</th>" +
		 	"<th>Opis</th>" +
			"<th>Jezik</th>" +
			"<th>Poster</th>" +
			"<th>Popularnost</th>" +
			"<th>Ocjena serije</th>" +
			"<th>Broj glasova</th>" +
		"</tr>";
	for (let s of serije) {
		tablica += "<tr>";
		//Id
		tablica += "<td>" + s.id + "</td>";
		//Naslov original
		tablica += "<td>" + s.original_name + "</td>";
		//Naslov
		tablica += "<td>" + s.name + "</td>";
		//Opis
		tablica += "<td>" + s.overview + "</td>";
		//Jezik
		tablica += "<td>" + s.original_language  + "</td>";
		//Poster
		tablica +=
			"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			s.poster_path +
			"' width='100' alt='slika_" +
			s.title +
			"'/></td>";
		//Popularnost
		tablica += "<td>" + s.popularity + "</td>";
		//Ocjena serije
		tablica += "<td>" + s.vote_average + "</td>";
		//Broj glasova
		tablica += "<td>" + s.vote_count + "</td>";
		//gumb daj detalje
		tablica +=
			"<td><button id=\"" +
				s.id +
			"\">Detalji serije</button></td>";
		tablica += "</tr>";
		gumbi.push(s.id);
	}
	tablica += "</table>";

	sessionStorage.dohvaceneSerije = JSON.stringify(serije);

	glavna.innerHTML = tablica;

	for (let i = 0; i < gumbi.length; i++) {
		document.getElementById(gumbi[i]).addEventListener('click', function() {
		  dajDetalje(gumbi[i]);
		});
	  }
}

async function dajDetalje(idSerije) {
	window.location.href = "/prikaziDetaljeSerije?id=" + idSerije
}

function dajFilter() {
	return document.getElementById("trazilica").value;
}
