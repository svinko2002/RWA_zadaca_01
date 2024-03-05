let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");
let session
let serija

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
    var currentURL = window.location.href;
    console.log("Id dobivene serije = " + currentURL.split("?id=")[1])
    console.log(session)
	// session = await fetch("/getSESSION")
	session = await fetch("/getSESSION")
    idSerije = currentURL.split("?id=")[1]
    detaljiSerije(idSerije)
});

async function detaljiSerije(idSerije) {
	let parametri = { method: "POST" };
    // let odgovor = await fetch("/dajDetaljeSerije?id=" + idSerije, parametri);
    let odgovor = await fetch("/dajDetaljeSerije?id=" + idSerije, parametri);
    if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		this.serija = JSON.parse(podaci);
        console.log(this.serija)
		prikaziSeriju();
	}
}

function prikaziSeriju() {
	let glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	tablica +=
		"<tr>"+
		 	"<th>TMDB id</th>" +
		 	"<th>Naslov original</th>" +
		 	"<th>Naslov</th>" +
		 	"<th>Opis</th>" +
		 	"<th>Broj sezona</th>" +
		 	"<th>Broj epizoda</th>" +
			"<th>Jezik</th>" +
			"<th>Poster</th>" +
			"<th>Popularnost</th>" +
			"<th>Ocjena serije</th>" +
			"<th>Broj glasova</th>" +
		"</tr>";
    tablica += "<tr>";
    //Id
    tablica += "<td>" + this.serija.id + "</td>";
    //Naslov original
    tablica += "<td>" + this.serija.original_name + "</td>";
    //Naslov
    tablica += "<td>" + this.serija.name + "</td>";
    //Opis
    tablica += "<td>" + this.serija.overview + "</td>";
    //Broj sezona
    tablica += "<td>" + this.serija.number_of_seasons + "</td>";
    //Broj epizoda
    tablica += "<td>" + this.serija.number_of_episodes + "</td>";
    //Jezik
    tablica += "<td>" + this.serija.original_language  + "</td>";
    //Poster
    tablica +=
        "<td><a href=" + this.serija.homepage + "><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
        this.serija.poster_path +
        "' width='100' alt='slika_" +
        this.serija.title +
        "'/></a></td>";
    //Popularnost
    tablica += "<td>" + this.serija.popularity + "</td>";
    //Ocjena serije
    tablica += "<td>" + this.serija.vote_average + "</td>";
    //Broj glasova
    tablica += "<td>" + this.serija.vote_count + "</td>";
    if(session.status == 200){
		//gumb dodaj u favorite
		tablica +=
		"<td><button id=\"favorit\">Dodaj u favorite</button></td>";
    }
    tablica += "</tr>";
	tablica += "</table>";

	sessionStorage.dohvacenaSerija = JSON.stringify(serija);

	glavna.innerHTML = tablica;

	try{
		document.getElementById("favorit").addEventListener('click', function() {
			dodajUFavorite();
		});
	}catch{}
}

async function dodajUFavorite() {
	let tijelo = {
        serija: this.serija
    };
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
	let parametri = {
		headers: zaglavlje,
		method: "POST",
		body: JSON.stringify(tijelo),
	};
	parametri = await dodajToken(parametri);
	console.log(parametri)
	// let odgovor = await fetch("/baza/favoriti", parametri);
	let odgovor = await fetch("/baza/favoriti", parametri);
	if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		//console.log(podaci);
		poruka.innerHTML = "Serija dodana u favorite!";
	} else if (odgovor.status == 401) {
		poruka.innerHTML = "Neautorizirani pristup! Prijavite se!";
	} else {
		poruka.innerHTML = "Greška u dodavanju filmva!";
	}
}
