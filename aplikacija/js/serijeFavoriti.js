let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
	ucitajSerije();
});

async function ucitajSerije() {
	let parametri = { method: "POST" };
	parametri = await dodajToken(parametri);
	// let odgovor = await fetch("/baza/favoriti");
	let odgovor = await fetch("/baza/favoriti");
	if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		console.log("tu sam")
		console.log(podaci)
		podaci = JSON.parse(podaci);
		console.log(podaci)
		prikaziSerije(podaci);
		document.getElementById("vratiMe").hidden = true
	} else if (odgovor.status == 401) {
		document.getElementById("sadrzaj").innerHTML = "";
		document.getElementById("vratiMe").hidden = false
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
		 	"<th>Naslov</th>" +
		 	"<th>Opis</th>" +
		 	"<th>Broj sezona</th>" +
		 	"<th>Broj epizoda</th>" +
			"<th>Poster</th>" +
			"<th>Popularnost</th>" +
			"<th>Ocjena serije</th>" +
			"<th>Broj glasova</th>" +
		"</tr>";
	for (let s of serije) {
		tablica += "<tr>";
		//Id
		tablica += "<td>" + s.tmdb_id + "</td>";
		//Naslov
		tablica += "<td>" + s.naziv + "</td>";
		//Opis
		tablica += "<td>" + s.opis + "</td>";
		//Broj sezona
		tablica += "<td>" + s.broj_sezona + "</td>";
		//Broj epizoda
		tablica += "<td>" + s.broj_epizoda + "</td>";
		//Poster
		tablica +=
			"<td><a href=" + s.stranica + "><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			s.slika +
			"' width='100' alt='slika_" +
			s.naziv +
			"'/></a></td>";
		//Popularnost
		tablica += "<td>" + s.popularnost + "</td>";
		//Ocjena serije
		tablica += "<td>" + s.ocjena_serije + "</td>";
		//Broj glasova
		tablica += "<td>" + s.broj_glasova + "</td>";
		//gumb daj detalje
		tablica +=
			"<td><button id=\"d" +
				s.tmdb_id +
			"\">Detalji serije</button></td>";
		//gumb makni iz favorita
			tablica +=
			"<td><button id=\"f" +
				s.tmdb_id +
			"\">Makni favorita</button></td>";
		tablica += "</tr>";
		gumbi.push(s.tmdb_id);
	}
	tablica += "</table>";
	glavna.innerHTML = tablica;

	for (let i = 0; i < gumbi.length; i++) {
		document.getElementById("d"+gumbi[i]).addEventListener('click', function() {
			dajDetalje(gumbi[i]);
		});
		document.getElementById("f"+gumbi[i]).addEventListener('click', function() {
			makniFavorita(gumbi[i]);
		});
	}
}

async function dajDetalje(idSerije) {
	console.log("/prikaziDetaljeFavoritSerije?id=" + idSerije)
	window.location.href = "/prikaziDetaljeFavoritSerije?id=" + idSerije
}

async function makniFavorita(idSerije) {
	let paramteri = {method: "DELETE"}
	// await fetch("/baza/favoriti/" + idSerije, paramteri)
	await fetch("/baza/favoriti/" + idSerije, paramteri)
	ucitajSerije()
}

function dajFilter() {
	return document.getElementById("trazilica").value;
}
