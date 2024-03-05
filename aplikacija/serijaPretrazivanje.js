const portRest = 12000;
const url = "http://localhost:" + portRest + "/api";
// const portRest = 12490;
// const url = "http://spider.foi.hr:" + portRest + "/api";

class SerijaPretrazivanje {
	dohvatiSerije = async function (stranica, kljucnaRijec = "") {
		let putanja = url + "/tmdb/serije?stranica=" + stranica + "&trazi=" + kljucnaRijec;
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		//console.log(serije);
		return serije;
	}

	dohvatiDetaljeSerije = async function (id) {
		let putanja = url + "/tmdb/serija?id=" + id;
		console.log(putanja);
		let odgovor = await fetch(putanja);
		let podaci = await odgovor.text();
		let serije = JSON.parse(podaci);
		//console.log(serije);
		return serije;
	}
}

module.exports = SerijaPretrazivanje;
