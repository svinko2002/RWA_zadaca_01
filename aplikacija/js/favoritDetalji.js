let url = "http://localhost:12000/api";
// let url = "http://spider.foi.hr:12490/api";
let poruka = document.getElementById("poruka");
let session

window.addEventListener("load", async () => {
	poruka = document.getElementById("poruka");
    var currentURL = window.location.href;
    console.log("Id dobivene serije = " + currentURL.split("?id=")[1])
	// session = await fetch("/getSESSION")
	session = await fetch("/getSESSION")
    console.log(session)
    idSerije = currentURL.split("?id=")[1]
    detaljiSerije(idSerije)
});

async function detaljiSerije(idSerije) {
	let parametri = { method: "POST" };
    // let odgovor = await fetch("/dajDetaljeFavoritSerije?id=" + idSerije, parametri);
    let odgovor = await fetch("/dajDetaljeFavoritSerije?id=" + idSerije, parametri);
    if (odgovor.status == 200) {
		let podaci = await odgovor.text();
		sezone = JSON.parse(podaci);
        console.log(sezone)
		if(sezone == undefined || sezone == null || sezone.length == 0){
			poruka.innerHTML = "Serija nema sezone"
		}else{
			prikaziSeriju(sezone);
		}
	}else{
		poruka.innerHTML = "Greška kod dohvata detalja favorita"
	}
}

function prikaziSeriju(sezone) {
	let glavna = document.getElementById("sadrzaj");
	let tablica = "<table border=1>";
	tablica +=
			"<tr>"+
				"<th>TMDB id serije</th>" +
				"<th>ID sezone</th>" +
				"<th>Naslov</th>" +
				"<th>Broj sezone</th>" +
				"<th>Broj epizoda u sezoni</th>" +
				"<th>Opis</th>" +
				"<th>Poster</th>" +
				"<th>Ocjena sezone</th>" +
			"</tr>";
	for(let i = 0; i < sezone.length; i++){
		tablica += "<tr>";
		//TMDB id serije
		tablica += "<td>" + sezone[i].serija_tmdb_id + "</td>";
		//ID sezone
		tablica += "<td>" + sezone[i].sezona_id + "</td>";
		//Naslov
		tablica += "<td>" + sezone[i].naziv + "</td>";
		//Broj sezone
		tablica += "<td>" + sezone[i].broj_sezone + "</td>";
		//Broj epizoda u sezoni
		tablica += "<td>" + sezone[i].broj_epizoda_u_sezoni + "</td>";
		//Opis
		tablica += "<td>" + sezone[i].opis  + "</td>";
		//Poster
		tablica +=
			"<td><img src='https://image.tmdb.org/t/p/w600_and_h900_bestv2/" +
			sezone[i].slika +
			"' width='100' alt='slika_" +
			sezone[i].naziv +
			"'/></td>";
		//Ocjena serije
		tablica += "<td>" + sezone[i].ocjena_sezone + "</td>";
		tablica += "</tr>";
	}
	tablica += "</table>";
	glavna.innerHTML = tablica;
}
