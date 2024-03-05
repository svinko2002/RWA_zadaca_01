const TMDBklijent = require("./klijentTMDB.js");

class RestTMDB {
	constructor(api_kljuc) {
		this.tmdbKlijent = new TMDBklijent(api_kljuc);
	}

	getSerije(zahtjev, odgovor) {
		odgovor.type("application/json");
		let stranica = zahtjev.query.stranica;
		let trazi = zahtjev.query.trazi;

		if (stranica == null || trazi == null) {
			odgovor.status("417");
			odgovor.send({ opis: "neocekivani podaci" });
			return;
		}

		this.tmdbKlijent
			.pretraziSerijePoNazivu(trazi, stranica)
			.then((serije) => {
				odgovor.send(serije);
			})
			.catch((opis) => {
				odgovor.json(opis);
			});
	}

	getSerija(zahtjev, odgovor) {
		odgovor.type("application/json");
		let id = zahtjev.query.id;

		if (id == null) {
			odgovor.status("417");
			odgovor.send({ opis: "neocekivani podaci" });
			return;
		}

		this.tmdbKlijent
			.dohvatiSeriju(id)
			.then((serija) => {
				odgovor.send(serija);
			})
			.catch((opis) => {
				odgovor.json(opis);
			});
	}
}

module.exports = RestTMDB;
